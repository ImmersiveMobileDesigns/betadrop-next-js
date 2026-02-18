#!/bin/bash

# Configuration
USER="betadrop"
HOST="betadrop.app"
REMOTE_DIR="/home/betadrop/htdocs/betadrop.app"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting deployment process for $HOST...${NC}"

# 1. SSH Key Setup
# This handles the "ask for the ssh password do that type add" request by setting up passwordless auth
echo -e "${YELLOW}Checking SSH connection...${NC}"


# Check if we can connect without password
if ssh -q -o BatchMode=yes -o ConnectTimeout=5 $USER@$HOST exit 2>/dev/null; then
    echo -e "${GREEN}SSH connection verified.${NC}"
else
    echo -e "${YELLOW}SSH connection requires password setup or agent configuration.${NC}"
    
    # Check for SSH Agent and add keys (Handling 'type add' request)
    if [ -z "$SSH_AUTH_SOCK" ]; then
        eval "$(ssh-agent -s)" > /dev/null
    fi
    ssh-add ~/.ssh/id_rsa 2>/dev/null || ssh-add ~/.ssh/id_ed25519 2>/dev/null
    
    # Re-check connection after adding to agent
    if ssh -q -o BatchMode=yes -o ConnectTimeout=5 $USER@$HOST exit 2>/dev/null; then
        echo -e "${GREEN}SSH key added to agent. Connection verified.${NC}"
    else
        echo -e "${YELLOW}Attempting to copy SSH key to server to enable passwordless login...${NC}"

    
    # Check if we have an SSH key, if not generate one
    if [ ! -f ~/.ssh/id_rsa.pub ] && [ ! -f ~/.ssh/id_ed25519.pub ]; then
        echo -e "${YELLOW}No SSH key found. Generating a new ed25519 key...${NC}"
        ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519 -N ""
    fi
    
    # Use ssh-copy-id to copy the key to the server
    # This acts as the "do that type add" step, prompting for password once
    echo -e "${YELLOW}Please enter your SSH password one last time to install the key:${NC}"
    if command -v ssh-copy-id &> /dev/null; then
        ssh-copy-id $USER@$HOST
    else
        # Fallback if ssh-copy-id is not available (e.g., some Windows git bash envs)
        cat ~/.ssh/id_ed25519.pub | ssh $USER@$HOST "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
    fi

    # Verify connection again
    if ssh -q -o BatchMode=yes -o ConnectTimeout=5 $USER@$HOST exit 2>/dev/null; then
        echo -e "${GREEN}SSH key setup successful! Future deployments won't ask for a password.${NC}"
    else
        echo -e "${RED}SSH key setup failed. You may need to manually configure SSH keys.${NC}"
        # Proceeding anyway, user might just type password for rsync
    fi
fi
fi

# 2. Build the Application
echo -e "${YELLOW}Building the application...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed! Aborting deployment.${NC}"
    exit 1
fi

# 3. Deploy to Server
echo -e "${YELLOW}Deploying files to $REMOTE_DIR...${NC}"

# Deploy using rsync if available, otherwise fallback to tar+ssh
if command -v rsync &> /dev/null; then
    # Sync the 'out' directory content to the remote folder
    # Using -avz for archive mode, verbose, compression
    # --delete ensures the remote folder mirrors the local build (removes old files)
    rsync -avz --delete out/ $USER@$HOST:$REMOTE_DIR/
else
    echo -e "${YELLOW}rsync not found. Falling back to tar+ssh deployment...${NC}"
    # Create a compressed tarball of the 'out' directory and stream it to the remote server to extract
    tar -czf - -C out . | ssh $USER@$HOST "mkdir -p $REMOTE_DIR && tar -xzf - -C $REMOTE_DIR"
fi

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Deployment successfully completed!${NC}"
    echo -e "${GREEN}Site should be live at https://$HOST${NC}"
else
    echo -e "${RED}Deployment failed during file transfer.${NC}"
    exit 1
fi
