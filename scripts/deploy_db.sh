#!/bin/bash

# BetaDrop Database Migration Deployment Script
# This script uploads the new migration scripts and runs them on the server.

# Determine project root and load .env
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

if [ -f "$PROJECT_ROOT/.env" ]; then
    set -a
    source "$PROJECT_ROOT/.env"
    set +a
else
    echo "Error: .env file not found."
    exit 1
fi

DOMAIN=$DEPLOY_DOMAIN
USER=$DEPLOY_SSH_USER
REMOTE_PATH="/home/$USER/htdocs/$DOMAIN"

echo "🚀 Deploying database migration to $DOMAIN..."

# 1. Upload scripts
echo "📤 Uploading migration scripts..."
scp -o StrictHostKeyChecking=no "$PROJECT_ROOT/scripts/migrate-db.js" "$PROJECT_ROOT/scripts/full-setup.sql" $USER@$DOMAIN:$REMOTE_PATH/scripts/

# 2. Upload updated package.json (in case dependencies changed, though mysql2 should be there)
# scp -o StrictHostKeyChecking=no "$PROJECT_ROOT/package.json" $USER@$DOMAIN:$REMOTE_PATH/

# 3. Remote execution
echo "🛠️ Running migration on server..."
ssh -o StrictHostKeyChecking=no $USER@$DOMAIN << EOF
    cd $REMOTE_PATH
    
    # Ensure dependencies are installed (just in case)
    # npm install mysql2 dotenv
    
    # Run migration
    # We use the existing .env on the server which deploy.sh created.
    # We run with --yes to skip prompt
    
    echo "Running migrate-db.js..."
    node scripts/migrate-db.js --yes
    
EOF

echo "✅ Database deployment complete!"
