# Sui LinkTree - Quick Start Guide

Get your Sui LinkTree up and running in 15 minutes! ⚡

## Prerequisites

Install these tools first:

1. **Sui CLI**
   ```bash
   # Windows (PowerShell)
   iwr https://sui.io/install.ps1 -useb | iex
   
   # macOS/Linux
   curl https://sui.io/install.sh | sh
   ```

2. **Node.js** (v18+)
   - Download from https://nodejs.org/

3. **Walrus CLI** & **Site Builder**
   - Follow: https://docs.wal.app/usage/setup.html

## Step 1: Setup Sui Wallet (2 mins)

```bash
# Initialize Sui client
sui client

# Create new address
sui client new-address ed25519

# Get testnet tokens
sui client faucet

# Or visit Discord: #testnet-faucet
# https://discord.com/channels/916379725201563759/971488439931392130
```

## Step 2: Clone & Install (2 mins)

```bash
# Clone repository
git clone <repository-url>
cd sui-linktree

# Install frontend dependencies
cd frontend
npm install
cd ..
```

## Step 3: Deploy with One Command (5 mins)

### Linux/macOS
```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

### Windows (PowerShell)
```powershell
.\scripts\deploy.ps1
```

The script will:
- ✅ Deploy Move contract to Sui
- ✅ Build React frontend
- ✅ Deploy to Walrus Sites
- ✅ Generate `deploy-info.txt` with all URLs

## Step 4: Get Your URL (1 min)

After deployment, you'll see:

```
Site URL: https://YOUR_B36.trwal.app/
```

Open this URL in your browser!

## Step 5: Create Your Profile (2 mins)

1. Click "Connect Wallet"
2. Choose your wallet provider
3. Click "Create Profile"
4. Fill in your details:
   - Username (unique)
   - Avatar URL
   - Bio
   - Choose theme
5. Submit transaction
6. Done! 🎉

## Step 6: Add Links (2 mins)

1. Go to "Edit Profile"
2. Add your links:
   - Label: "My Website"
   - URL: "https://example.com"
   - Icon: 🌐
3. Save changes
4. View your profile!

## Step 7: Get a Cool Domain (Optional, 5 mins)

1. Visit https://testnet.suins.io/
2. Register a `.sui` name (e.g., "myname")
3. Point it to your Site Object ID:

```bash
# Copy Site Object ID from deploy-info.txt
# Then run:
sui client call \
  --package 0xd22b24490e0bae52676651b4f56660a5ff8022a2576e0089f79b3c88d44e08f0 \
  --module suins \
  --function set_target_address \
  --args <SUINS_NAME_ID> <SITE_OBJECT_ID> \
  --gas-budget 10000000
```

4. Access at: `https://myname.trwal.app/`

## Manual Deployment (Alternative)

If you prefer manual steps:

### 1. Deploy Contract
```bash
cd move
sui move build
sui client publish --gas-budget 100000000
# Save Package ID and Registry ID
```

### 2. Update Config
Edit `frontend/src/config/constants.js`:
```javascript
export const PACKAGE_ID = '0xYOUR_PACKAGE_ID';
export const REGISTRY_ID = '0xYOUR_REGISTRY_ID';
```

### 3. Build Frontend
```bash
cd frontend
npm run build
```

### 4. Deploy to Walrus
```bash
site-builder deploy ./dist --epochs 10
# Save B36 URL
```

## Troubleshooting

### "sui: command not found"
- Restart terminal after installing Sui CLI
- Or add to PATH manually

### "Insufficient gas"
- Get more testnet SUI from faucet
- Discord: #testnet-faucet

### "Transaction failed"
- Check wallet connection
- Verify you're on testnet
- Try again after 1 minute

### "Site not loading"
- Wait 1-2 minutes after deployment
- Clear browser cache
- Try incognito mode

### "Package not found"
- Verify PACKAGE_ID in constants.js
- Redeploy the Move contract

## Testing Checklist

- [ ] Contract deployed successfully
- [ ] Frontend built without errors
- [ ] Site accessible via B36 URL
- [ ] Can connect wallet
- [ ] Can create profile
- [ ] Can add links
- [ ] Can edit profile
- [ ] Links open correctly
- [ ] Theme changes work
- [ ] Profile displays properly

## Next Steps

- 🎨 Customize your theme and colors
- 🔗 Add all your important links
- 🏷️ Register a SuiNS domain
- 📱 Share your profile link
- 🚀 Explore zkLogin and sponsored transactions

## Need Help?

- 📚 Read full [README.md](./README.md)
- 📖 Check [DOCUMENTATION.md](./DOCUMENTATION.md)
- 💬 Ask on [Sui Discord](https://discord.gg/sui)
- 🐛 Report issues on GitHub

## Useful Links

- Sui Docs: https://docs.sui.io/
- Walrus Docs: https://docs.wal.app/
- SuiNS Testnet: https://testnet.suins.io/
- Sui Explorer: https://suiscan.xyz/testnet
- Walrus Explorer: https://walruscan.com/testnet

---

**Congratulations! You now have your own on-chain LinkTree! 🎉**

Share it with the world:
```
Check out my on-chain profile: https://YOUR_B36.trwal.app/
Built on @SuiNetwork with @Walrus_Storage 🔗
```

---

*Built with ❤️ on Sui Blockchain*

