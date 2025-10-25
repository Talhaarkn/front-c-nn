# Sui LinkTree Deployment Script (PowerShell)
# This script deploys the Move contract and builds the frontend

$ErrorActionPreference = "Stop"

Write-Host "🚀 Sui LinkTree Deployment Script" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# Check if sui CLI is installed
if (-not (Get-Command sui -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Error: sui CLI not found. Please install it first." -ForegroundColor Red
    Write-Host "Visit: https://docs.sui.io/guides/developer/getting-started/sui-install"
    exit 1
}

Write-Host "✅ sui CLI found" -ForegroundColor Green

# Check if site-builder is installed
if (-not (Get-Command site-builder -ErrorAction SilentlyContinue)) {
    Write-Host "⚠️  Warning: site-builder not found. You'll need it for Walrus deployment." -ForegroundColor Yellow
    Write-Host "Install from: https://docs.wal.app/walrus-sites/tutorial-install.html"
}

# Step 1: Deploy Move Contract
Write-Host ""
Write-Host "📦 Step 1: Deploying Move Contract..." -ForegroundColor Cyan
Write-Host "======================================"

Set-Location move

# Build the package
Write-Host "Building Move package..."
sui move build

# Publish the package
Write-Host "Publishing to Sui testnet..."
$deployOutput = sui client publish --gas-budget 100000000 --json | ConvertFrom-Json

# Extract package ID and registry ID
$packageId = ($deployOutput.objectChanges | Where-Object { $_.type -eq "published" }).packageId
$registryId = ($deployOutput.objectChanges | Where-Object { $_.objectType -like "*ProfileRegistry*" }).objectId

Write-Host "✅ Contract deployed!" -ForegroundColor Green
Write-Host "Package ID: $packageId"
Write-Host "Registry ID: $registryId"

# Save IDs to file
@"
PACKAGE_ID=$packageId
REGISTRY_ID=$registryId
"@ | Out-File -FilePath ../deploy-info.txt -Encoding utf8

Set-Location ..

# Step 2: Update Frontend Configuration
Write-Host ""
Write-Host "⚙️  Step 2: Updating Frontend Configuration..." -ForegroundColor Cyan
Write-Host "=============================================="

# Update constants.js with deployed contract IDs
$constantsPath = "frontend/src/config/constants.js"
$constantsContent = Get-Content $constantsPath -Raw
$constantsContent = $constantsContent -replace "export const PACKAGE_ID = '0x...';", "export const PACKAGE_ID = '$packageId';"
$constantsContent = $constantsContent -replace "export const REGISTRY_ID = '0x...';", "export const REGISTRY_ID = '$registryId';"
$constantsContent | Set-Content $constantsPath -Encoding utf8

Write-Host "✅ Frontend configuration updated" -ForegroundColor Green

# Step 3: Build Frontend
Write-Host ""
Write-Host "🏗️  Step 3: Building Frontend..." -ForegroundColor Cyan
Write-Host "================================"

Set-Location frontend

# Install dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..."
    npm install
}

# Build the project
Write-Host "Building React app..."
npm run build

Write-Host "✅ Frontend built successfully" -ForegroundColor Green

Set-Location ..

# Step 4: Deploy to Walrus Sites
Write-Host ""
Write-Host "🌊 Step 4: Deploying to Walrus Sites..." -ForegroundColor Cyan
Write-Host "========================================"

if (Get-Command site-builder -ErrorAction SilentlyContinue) {
    Set-Location frontend
    
    Write-Host "Publishing to Walrus..."
    $walrusOutput = site-builder deploy ./dist --epochs 10
    
    # Extract site ID and B36
    if ($walrusOutput -match "Object ID: ([0-9a-fx]+)") {
        $siteId = $Matches[1]
    }
    if ($walrusOutput -match "B36: ([a-z0-9]+)") {
        $b36Id = $Matches[1]
    }
    
    if ($siteId) {
        Write-Host "✅ Deployed to Walrus Sites!" -ForegroundColor Green
        Write-Host "Site Object ID: $siteId"
        Write-Host "B36 URL: https://$b36Id.trwal.app/"
        
        # Save to deploy-info.txt
        @"

SITE_ID=$siteId
B36_ID=$b36Id
SITE_URL=https://$b36Id.trwal.app/
"@ | Add-Content -Path ../deploy-info.txt -Encoding utf8
    }
    
    Set-Location ..
}
else {
    Write-Host "⚠️  site-builder not found. Skipping Walrus deployment." -ForegroundColor Yellow
    Write-Host "You can deploy manually with: cd frontend; site-builder deploy ./dist --epochs 10"
}

# Summary
Write-Host ""
Write-Host "======================================"
Write-Host "🎉 Deployment Summary" -ForegroundColor Green
Write-Host "======================================"
Write-Host "Package ID: $packageId"
Write-Host "Registry ID: $registryId"
if ($b36Id) {
    Write-Host "Site URL: https://$b36Id.trwal.app/"
}
Write-Host ""
Write-Host "All deployment info saved to: deploy-info.txt"
Write-Host ""
Write-Host "✅ Deployment completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Test your application at the Site URL"
Write-Host "2. Register a SuiNS domain: https://testnet.suins.io/"
Write-Host "3. Point your SuiNS domain to Site Object ID: $siteId"
Write-Host ""

