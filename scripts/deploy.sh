#!/bin/bash

# BetaDrop Deployment Script
# This script performs a fresh installation on the target VPS via SSH.

# Load credentials from .env
if [ -f .env ]; then
    # Use allexport to correctly export all variables, including those with spaces/quotes
    set -a
    source .env
    set +a
else
    echo "Error: .env file not found. Please ensure DEPLOY_DOMAIN, DEPLOY_SSH_USER, and DEPLOY_SSH_PASS are set."
    exit 1
fi

DOMAIN=$DEPLOY_DOMAIN
USER=$DEPLOY_SSH_USER
PASS=$DEPLOY_SSH_PASS
REMOTE_PATH="/home/$USER/htdocs/$DOMAIN"

echo "🚀 Starting deployment to $DOMAIN..."

# 1. Create a clean archive of the current project
echo "📦 Archiving project files..."
ZIP_FILE="betadrop_deploy.zip"
zip -r $ZIP_FILE . -x "node_modules/*" ".next/*" ".git/*" "storage/*" "*.zip" "mysql_data/*" ".env.local"

# 2. Upload to server
echo "📤 Uploading to server (you may be asked for your password)..."
scp -o StrictHostKeyChecking=no $ZIP_FILE $USER@$DOMAIN:~/

# 3. Remote execution
echo "🛠️ Performing remote installation tasks (you may be asked for your password)..."
ssh -o StrictHostKeyChecking=no $USER@$DOMAIN << EOF
    # Create project directory
    mkdir -p $REMOTE_PATH
    
    # Move and unzip
    mv ~/$ZIP_FILE $REMOTE_PATH/
    cd $REMOTE_PATH
    unzip -o $ZIP_FILE
    rm $ZIP_FILE

    # Ensure Node.js and PM2 are available (adjust paths if necessary for cPanel)
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
    sed -i "s|DATABASE_URL=.*|DATABASE_URL=mysql://betadrop:3asJGfsQtl5Y0416Z06T@localhost:3306/betadrop|g" .env
    sed -i "s|NEXT_PUBLIC_APP_URL=.*|NEXT_PUBLIC_APP_URL=https://betadrop.app|g" .env
    
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

    # Initialize database
    echo "🗄️ Initializing database..."
    mysql -u betadrop -p'3asJGfsQtl5Y0416Z06T' betadrop < scripts/init-db.sql || echo "⚠️  DB Init skipped (tables might already exist)"

    # Build the project
    echo "🏗️ Building Next.js application..."
    npm run build

    # Create storage directory
    mkdir -p storage/ios storage/android

    # Start application in background (Standard way without PM2)
    echo "🔄 Starting application on port 3001..."
    
    # Kill any existing process matching our project path
    pkill -f "$REMOTE_PATH/server.js" || true
    pkill -f "node server.js" || true
    
    # Run server using nohup with explicit PORT
    # Use PORT=3001 before the command to ensure it's picked up
    # We also use 'next start' if server.js is not needed, but sticking to server.js if it exists
    if [ -f "server.js" ]; then
        nohup env PORT=3001 node server.js > app.log 2>&1 &
    else
        nohup env PORT=3001 npm start > app.log 2>&1 &
    fi
    
    echo "🚀 Server is running in the background on port 3001. Check 'app.log' for activity."
EOF

# 4. Cleanup local zip
rm $ZIP_FILE

echo "✅ Deployment complete! Visit: https://$DOMAIN"
echo "⚠️  NOTE: Don't forget to SSH in and update the database credentials in $REMOTE_PATH/.env"
