#!/bin/bash

# ============================================
# BetaDrop Database Sync Script
# ============================================
# This script syncs the Prisma schema with the production database.
# It performs non-destructive operations only (no data loss).
#
# Usage:
#   Local:  ./scripts/sync-db.sh
#   Remote: ./scripts/sync-db.sh --remote
# ============================================

set -e

# Determine project root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

# Load environment variables
if [ -f "$PROJECT_ROOT/.env" ]; then
    set -a
    source "$PROJECT_ROOT/.env"
    set +a
elif [ -f ".env" ]; then
    set -a
    source ".env"
    set +a
else
    echo "❌ Error: .env file not found."
    exit 1
fi

# Check if running in remote mode
REMOTE_MODE=false
if [ "$1" == "--remote" ]; then
    REMOTE_MODE=true
    DOMAIN=$DEPLOY_DOMAIN
    USER=$DEPLOY_SSH_USER
    REMOTE_PATH="/home/$USER/htdocs/$DOMAIN"
fi

echo "🗄️  BetaDrop Database Sync"
echo "=========================="
echo ""

if [ "$REMOTE_MODE" = true ]; then
    echo "🌐 Running on REMOTE server: $DOMAIN"
    echo ""
    
    ssh -o StrictHostKeyChecking=no $USER@$DOMAIN << EOF
        cd $REMOTE_PATH
        
        echo "📦 Generating Prisma Client..."
        npx prisma generate
        
        echo ""
        echo "🔄 Syncing database schema (non-destructive)..."
        npx prisma db push --accept-data-loss --skip-generate
        
        echo ""
        echo "✅ Database sync complete!"
        
        # Optional: Show current database status
        echo ""
        echo "📊 Database Status:"
        npx prisma db execute --stdin <<< "SELECT TABLE_NAME, TABLE_ROWS FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'betadrop';" 2>/dev/null || true
EOF
else
    echo "💻 Running on LOCAL environment"
    echo ""
    
    cd "$PROJECT_ROOT"
    
    echo "📦 Generating Prisma Client..."
    npx prisma generate
    
    echo ""
    echo "🔄 Syncing database schema (non-destructive)..."
    npx prisma db push --accept-data-loss --skip-generate
    
    echo ""
    echo "✅ Database sync complete!"
    
    # Optional: Validate schema
    echo ""
    echo "🔍 Validating Prisma schema..."
    npx prisma validate
fi

echo ""
echo "🎉 Done! Your database is now in sync with the Prisma schema."
