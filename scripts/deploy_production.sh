#!/bin/bash

# BetaDrop Production Deployment Script
# This script performs a fresh installation on the target VPS via SSH.
# It uses .env for configuration.

# Determine project root and load .env
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"
ENV_FILE="$PROJECT_ROOT/.env"

if [ -f "$ENV_FILE" ]; then
    set -a
    source "$ENV_FILE"
    set +a
else
    echo "Error: .env file not found. Please ensure it exists."
    exit 1
fi

DOMAIN=$DEPLOY_DOMAIN
USER=$DEPLOY_SSH_USER
PASS=$DEPLOY_SSH_PASS
REMOTE_PATH="/home/$USER/htdocs/$DOMAIN"

if [ -z "$DOMAIN" ] || [ -z "$USER" ]; then
    echo "Error: DEPLOY_DOMAIN or DEPLOY_SSH_USER not set in .env"
    exit 1
fi

echo "🚀 Starting PRODUCTION deployment to $DOMAIN..."

# 1. Create a clean archive of the current project
echo "📦 Archiving project files from $PROJECT_ROOT..."
TAR_FILE="betadrop_production_deploy.tar.gz"
# Change to project root to ensure correct paths in tar
cd "$PROJECT_ROOT"
# Use tar instead of zip. Exclude defaults + ensure .env is included
tar -czf "$TAR_FILE" --exclude="node_modules" --exclude=".next" --exclude=".git" --exclude="storage" --exclude="*.zip" --exclude="*.tar.gz" --exclude="mysql_data" --exclude=".env.local" --exclude=".env.production" .
mv "$TAR_FILE" "$SCRIPT_DIR/"
TAR_PATH="$SCRIPT_DIR/$TAR_FILE"

# 2. Upload to server
echo "📤 Uploading to server (you may be asked for your password)..."
scp -o StrictHostKeyChecking=no "$TAR_PATH" $USER@$DOMAIN:~/

# 3. Remote execution
echo "🛠️ Performing remote installation tasks..."
ssh -o StrictHostKeyChecking=no $USER@$DOMAIN << EOF
    # Create project directory
    mkdir -p $REMOTE_PATH
    
    # Move and extract
    mv ~/$TAR_FILE $REMOTE_PATH/
    cd $REMOTE_PATH
    
    # Clean up old scripts
    rm -rf scripts
    
    tar -xzf $TAR_FILE
    rm $TAR_FILE

    # Ensure Node.js and PM2 are available
    export PATH=\$PATH:/usr/local/bin:/usr/bin
    
    # Install dependencies
    echo "📥 Installing dependencies (including dev deps for build)..."
    npm install

    # Setup .env
    echo "📝 Configuring .env on server..."
    if [ ! -f .env ]; then
        cp .env.example .env
    fi
    
    # Update/Inject production credentials
    sed -i "s|DATABASE_URL=.*|DATABASE_URL=mysql://$PROD_DB_USER:$PROD_DB_PASS@localhost:3306/$PROD_DB_NAME|g" .env
    sed -i "s|PROD_DB_NAME=.*|PROD_DB_NAME=$PROD_DB_NAME|g" .env
    sed -i "s|PROD_DB_USER=.*|PROD_DB_USER=$PROD_DB_USER|g" .env
    sed -i "s|PROD_DB_PASS=.*|PROD_DB_PASS=$PROD_DB_PASS|g" .env

    # Attempt to fix authentication plugin ensuring compatibility
    # This addresses "Unknown authentication plugin 'sha256_password'" errors
    echo "🔧 Updating MySQL user authentication method..."
    mysql -u $PROD_DB_USER -p"$PROD_DB_PASS" -e "ALTER USER '$PROD_DB_USER'@'localhost' IDENTIFIED WITH mysql_native_password BY '$PROD_DB_PASS';" $PROD_DB_NAME || echo "⚠️  Could not update auth plugin (might need root)"
    
    sed -i "s|NEXT_PUBLIC_APP_URL=.*|NEXT_PUBLIC_APP_URL=https://$DOMAIN|g" .env
    
    # SMTP Configuration
    sed -i "s|SMTP_HOST=.*|SMTP_HOST=\"smtp.gmail.com\"|g" .env
    sed -i "s|SMTP_PORT=.*|SMTP_PORT=\"587\"|g" .env
    sed -i "s|SMTP_SECURE=.*|SMTP_SECURE=\"false\"|g" .env
    sed -i "s|SMTP_USER=.*|SMTP_USER=\"alerts@imobiledesigns.com\"|g" .env
    sed -i "s|SMTP_PASS=.*|SMTP_PASS=\"ctxdlzlstzrvdema\"|g" .env
    sed -i "s|SMTP_FROM=.*|SMTP_FROM=\"BetaDrop <alerts@imobiledesigns.com>\"|g" .env
    
    # Only set JWT_SECRET if not already set or if it's the dev one
    if grep -q "JWT_SECRET=dev-secret-key" .env || ! grep -q "JWT_SECRET=" .env; then
        sed -i "s|JWT_SECRET=.*|JWT_SECRET=\$(openssl rand -base64 32)|g" .env
    fi
    
    # Ensure PORT is set
    if ! grep -q "PORT=3001" .env; then
        echo "PORT=3001" >> .env
    fi
    
    # Set WebAuthn RP_ID for passkeys
    if grep -q "WEBAUTHN_RP_ID=" .env; then
        sed -i "s|WEBAUTHN_RP_ID=.*|WEBAUTHN_RP_ID=$DOMAIN|g" .env
    else
        echo "WEBAUTHN_RP_ID=$DOMAIN" >> .env
    fi

    # Sync Database Schema
    # echo "🗄️ Syncing database schema..."
    # npx prisma db push --accept-data-loss



    # Build the project
    echo "🏗️ Building Next.js application..."
    npm run build

    # Create storage directory
    mkdir -p storage/ios storage/android

    # Start application in background
    echo "🔄 Starting application on port 3001..."
    
    # Kill any existing process matching our project path
    pkill -f "\$REMOTE_PATH/server.js" || true
    pkill -f "node server.js" || true
    
    # Run server
    if [ -f "server.js" ]; then
        nohup env PORT=3001 node server.js > app.log 2>&1 &
    else
        nohup env PORT=3001 npm start > app.log 2>&1 &
    fi
    
    echo "🚀 Server is running in the background on port 3001. Check 'app.log' for activity."
EOF

# 4. Cleanup local tar
rm "$TAR_PATH"

echo "✅ Production Deployment complete! Visit: https://$DOMAIN"
