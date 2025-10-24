#!/bin/bash

# Sui LinkTree Deployment Script
# This script deploys the Move contract and builds the frontend

set -e

echo "🚀 Sui LinkTree Deployment Script"
echo "=================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if sui CLI is installed
if ! command -v sui &> /dev/null; then
    echo -e "${RED}❌ Error: sui CLI not found. Please install it first.${NC}"
    echo "Visit: https://docs.sui.io/guides/developer/getting-started/sui-install"
    exit 1
fi

echo -e "${GREEN}✅ sui CLI found${NC}"

# Check if site-builder is installed
if ! command -v site-builder &> /dev/null; then
    echo -e "${YELLOW}⚠️  Warning: site-builder not found. You'll need it for Walrus deployment.${NC}"
    echo "Install from: https://docs.wal.app/walrus-sites/tutorial-install.html"
fi

# Step 1: Deploy Move Contract
echo ""
echo "📦 Step 1: Deploying Move Contract..."
echo "======================================"

cd move

# Build the package
echo "Building Move package..."
sui move build

# Publish the package
echo "Publishing to Sui testnet..."
DEPLOY_OUTPUT=$(sui client publish --gas-budget 100000000 --json)

# Extract package ID and registry ID
PACKAGE_ID=$(echo $DEPLOY_OUTPUT | jq -r '.objectChanges[] | select(.type == "published") | .packageId')
REGISTRY_ID=$(echo $DEPLOY_OUTPUT | jq -r '.objectChanges[] | select(.objectType | contains("ProfileRegistry")) | .objectId')

echo -e "${GREEN}✅ Contract deployed!${NC}"
echo "Package ID: $PACKAGE_ID"
echo "Registry ID: $REGISTRY_ID"

# Save IDs to file
echo "PACKAGE_ID=$PACKAGE_ID" > ../deploy-info.txt
echo "REGISTRY_ID=$REGISTRY_ID" >> ../deploy-info.txt

cd ..

# Step 2: Update Frontend Configuration
echo ""
echo "⚙️  Step 2: Updating Frontend Configuration..."
echo "=============================================="

# Update constants.js with deployed contract IDs
sed -i.bak "s/export const PACKAGE_ID = '0x...';/export const PACKAGE_ID = '$PACKAGE_ID';/" frontend/src/config/constants.js
sed -i.bak "s/export const REGISTRY_ID = '0x...';/export const REGISTRY_ID = '$REGISTRY_ID';/" frontend/src/config/constants.js

echo -e "${GREEN}✅ Frontend configuration updated${NC}"

# Step 3: Build Frontend
echo ""
echo "🏗️  Step 3: Building Frontend..."
echo "================================"

cd frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Build the project
echo "Building React app..."
npm run build

echo -e "${GREEN}✅ Frontend built successfully${NC}"

cd ..

# Step 4: Deploy to Walrus Sites
echo ""
echo "🌊 Step 4: Deploying to Walrus Sites..."
echo "========================================"

if command -v site-builder &> /dev/null; then
    cd frontend
    
    echo "Publishing to Walrus..."
    WALRUS_OUTPUT=$(site-builder deploy ./dist --epochs 10)
    
    # Extract site ID and B36
    SITE_ID=$(echo "$WALRUS_OUTPUT" | grep -oP 'Object ID: \K[0-9a-fx]+' || echo "")
    B36_ID=$(echo "$WALRUS_OUTPUT" | grep -oP 'B36: \K[a-z0-9]+' || echo "")
    
    if [ -n "$SITE_ID" ]; then
        echo -e "${GREEN}✅ Deployed to Walrus Sites!${NC}"
        echo "Site Object ID: $SITE_ID"
        echo "B36 URL: https://${B36_ID}.trwal.app/"
        
        # Save to deploy-info.txt
        echo "SITE_ID=$SITE_ID" >> ../deploy-info.txt
        echo "B36_ID=$B36_ID" >> ../deploy-info.txt
        echo "SITE_URL=https://${B36_ID}.trwal.app/" >> ../deploy-info.txt
    fi
    
    cd ..
else
    echo -e "${YELLOW}⚠️  site-builder not found. Skipping Walrus deployment.${NC}"
    echo "You can deploy manually with: cd frontend && site-builder deploy ./dist --epochs 10"
fi

# Summary
echo ""
echo "======================================"
echo "🎉 Deployment Summary"
echo "======================================"
echo "Package ID: $PACKAGE_ID"
echo "Registry ID: $REGISTRY_ID"
if [ -n "$B36_ID" ]; then
    echo "Site URL: https://${B36_ID}.trwal.app/"
fi
echo ""
echo "All deployment info saved to: deploy-info.txt"
echo ""
echo -e "${GREEN}✅ Deployment completed!${NC}"
echo ""
echo "Next steps:"
echo "1. Test your application at the Site URL"
echo "2. Register a SuiNS domain: https://testnet.suins.io/"
echo "3. Point your SuiNS domain to Site Object ID: $SITE_ID"
echo ""

