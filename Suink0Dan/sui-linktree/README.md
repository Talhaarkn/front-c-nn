# Sui LinkTree 🔗

<div align="center">

![Sui LinkTree](https://img.shields.io/badge/Sui-LinkTree-blue?style=for-the-badge)
![Walrus Sites](https://img.shields.io/badge/Walrus-Sites-purple?style=for-the-badge)
![zkLogin](https://img.shields.io/badge/zkLogin-Enabled-green?style=for-the-badge)

**On-Chain LinkTree on Sui Blockchain with Walrus Sites**

A decentralized link aggregator platform built on Sui blockchain, deployed on Walrus Sites with zkLogin authentication and sponsored transactions.

[Demo](#demo) • [Features](#features) • [Installation](#installation) • [Usage](#usage) • [Architecture](#architecture)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Deployment](#deployment)
- [Usage Guide](#usage-guide)
- [Smart Contract](#smart-contract)
- [Frontend](#frontend)
- [Walrus Sites](#walrus-sites)
- [SuiNS Integration](#suins-integration)
- [zkLogin](#zklogin)
- [Sponsored Transactions](#sponsored-transactions)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**Sui LinkTree** is a decentralized alternative to traditional link aggregator services like Linktree. It leverages the power of the Sui blockchain to store profile data on-chain and uses Walrus Sites for decentralized frontend hosting.

### What makes it special?

- **On-Chain Storage**: All profile data, links, and settings are stored directly on the Sui blockchain
- **Decentralized Hosting**: Frontend is deployed on Walrus Sites, ensuring censorship-resistant access
- **zkLogin Support**: Users can authenticate using their Google, Facebook, or Twitch accounts
- **Sponsored Transactions**: Gasless transactions for better user experience using Enoki
- **SuiNS Integration**: Use readable domain names instead of object IDs
- **Fully Customizable**: Themes, colors, avatars, and unlimited links

---

## ✨ Features

### Core Features
- ✅ **Create Profile**: Set up your personalized on-chain profile
- ✅ **Custom Links**: Add unlimited links with labels and emojis
- ✅ **Theme Customization**: Choose from multiple themes and custom colors
- ✅ **Avatar Support**: Display your profile picture
- ✅ **Bio Section**: Add a short description about yourself

### Advanced Features
- ✅ **zkLogin Authentication**: Login with OAuth providers (Google, Facebook, Twitch)
- ✅ **Sponsored Transactions**: Gasless transactions using Enoki
- ✅ **SuiNS Domains**: Use readable .sui domains
- ✅ **Walrus Sites Deployment**: Decentralized frontend hosting
- ✅ **Real-time Updates**: Changes reflected instantly on-chain
- ✅ **Mobile Responsive**: Works perfectly on all devices

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User Interface                       │
│                    (React + Vite + Tailwind)                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                     Mysten dApp Kit                          │
│              (Wallet Connection + Transactions)              │
└────────────┬───────────────────────┬────────────────────────┘
             │                       │
             ▼                       ▼
┌────────────────────┐    ┌─────────────────────────┐
│   zkLogin (Enoki)  │    │  Sponsored Transactions │
│  Google/Facebook   │    │        (Enoki)          │
└────────────────────┘    └─────────────────────────┘
             │                       │
             └───────────┬───────────┘
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Sui Blockchain                            │
│           (Move Smart Contract + Profile Storage)            │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                     Walrus Sites                             │
│              (Decentralized Frontend Hosting)                │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                        SuiNS                                 │
│              (Readable Domain Names: .sui)                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Blockchain
- **Sui Blockchain**: Layer-1 blockchain with high throughput
- **Move Language**: Smart contract programming language

### Frontend
- **React**: UI framework
- **Vite**: Build tool
- **Tailwind CSS**: Styling
- **React Router**: Navigation
- **@mysten/dapp-kit**: Sui wallet integration
- **@tanstack/react-query**: Data fetching

### Infrastructure
- **Walrus Sites**: Decentralized frontend hosting
- **Walrus Storage**: Decentralized blob storage
- **SuiNS**: Domain name service

### Authentication & Sponsorship
- **Enoki**: zkLogin and sponsored transactions
- **zkLogin**: OAuth-based authentication

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

1. **Sui CLI** (v1.0.0+)
   ```bash
   # Install using cargo
   cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui
   
   # Or use the installer
   # Windows (PowerShell)
   iwr https://sui.io/install.ps1 -useb | iex
   
   # macOS/Linux
   curl https://sui.io/install.sh | sh
   ```

2. **Node.js** (v18+)
   ```bash
   # Download from https://nodejs.org/
   # Or use nvm
   nvm install 18
   nvm use 18
   ```

3. **Walrus CLI**
   ```bash
   # Download from https://docs.wal.app/usage/setup.html
   # Follow the installation guide for your OS
   ```

4. **Walrus Site Builder**
   ```bash
   # Download from https://docs.wal.app/walrus-sites/tutorial-install.html
   # Follow the installation guide
   ```

### Verify Installation

```bash
# Check Sui CLI
sui --version

# Check Node.js
node --version

# Check Walrus CLI
walrus --version

# Check Site Builder
site-builder --version
```

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd sui-linktree
```

### 2. Configure Sui Wallet

```bash
# Initialize Sui client
sui client

# Create a new wallet or import existing
sui client new-address ed25519

# Get testnet tokens
# Visit: https://discord.com/channels/916379725201563759/971488439931392130
# Or use: sui client faucet
```

### 3. Configure Walrus

```bash
# Create Walrus config directory
mkdir -p $HOME/.config/walrus

# Initialize Walrus configuration
# Follow: https://docs.wal.app/usage/setup.html
```

### 4. Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

## 📤 Deployment

### Automated Deployment (Recommended)

We provide deployment scripts for both Unix and Windows systems:

#### Linux/macOS
```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

#### Windows (PowerShell)
```powershell
.\scripts\deploy.ps1
```

The deployment script will:
1. ✅ Deploy the Move smart contract to Sui testnet
2. ✅ Update frontend configuration with contract addresses
3. ✅ Build the React frontend
4. ✅ Deploy to Walrus Sites
5. ✅ Generate `deploy-info.txt` with all important addresses

### Manual Deployment

If you prefer to deploy manually:

#### 1. Deploy Smart Contract

```bash
cd move

# Build the Move package
sui move build

# Publish to Sui testnet
sui client publish --gas-budget 100000000

# Save the Package ID and Registry Object ID
```

#### 2. Update Frontend Configuration

Edit `frontend/src/config/constants.js`:

```javascript
export const PACKAGE_ID = 'YOUR_PACKAGE_ID';
export const REGISTRY_ID = 'YOUR_REGISTRY_OBJECT_ID';
```

#### 3. Build Frontend

```bash
cd frontend
npm run build
```

#### 4. Deploy to Walrus Sites

```bash
cd frontend
site-builder deploy ./dist --epochs 10
```

Save the output:
- **Site Object ID**: For SuiNS configuration
- **B36 URL**: Direct access URL (`https://<b36>.trwal.app/`)

---

## 📖 Usage Guide

### Creating Your Profile

1. **Connect Wallet**
   - Visit the deployed site
   - Click "Connect Wallet"
   - Choose your wallet provider (Sui Wallet, Suiet, etc.)
   - Or use zkLogin with Google/Facebook/Twitch

2. **Create Profile**
   - Click "Create Profile"
   - Enter your username (unique, on-chain)
   - Add avatar URL
   - Write your bio
   - Choose theme and colors
   - Submit transaction

3. **Add Links**
   - Navigate to "Edit Profile"
   - Add link label (e.g., "My Website")
   - Enter URL
   - Optional: Add emoji icon
   - Save changes

### Viewing Profiles

```
# By Object ID
https://<b36>.trwal.app/profile/0x...

# By SuiNS Domain (after setup)
https://yourname.trwal.app/
```

### Editing Your Profile

1. Go to your profile page
2. Click "Edit Profile"
3. Update profile settings or manage links
4. Changes are saved on-chain immediately

---

## 🔧 Smart Contract

### LinkTreeProfile Structure

```move
public struct LinkTreeProfile has key, store {
    id: UID,
    owner: address,
    name: String,
    avatar_url: String,
    bio: String,
    links: vector<Link>,
    theme: String,
    background_color: String,
    text_color: String,
    created_at: u64,
    updated_at: u64,
}

public struct Link has store, copy, drop {
    label: String,
    url: String,
    icon: String,
}
```

### Main Functions

- `create_profile()`: Create a new profile
- `update_profile()`: Update profile information
- `add_link()`: Add a new link
- `remove_link()`: Remove a link by index
- `update_link()`: Update an existing link
- `get_profile_by_name()`: Retrieve profile using registry

### Testing Smart Contract

```bash
cd move
sui move test
```

---

## 💻 Frontend

### Development Mode

```bash
cd frontend
npm run dev
```

Access at: `http://localhost:3000`

### Build for Production

```bash
npm run build
```

Output: `dist/` directory

### Project Structure

```
frontend/
├── src/
│   ├── components/        # Reusable components
│   ├── pages/            # Page components
│   │   ├── Home.jsx
│   │   ├── CreateProfile.jsx
│   │   ├── Profile.jsx
│   │   └── EditProfile.jsx
│   ├── utils/            # Utility functions
│   │   ├── sui.js        # Sui blockchain utilities
│   │   ├── zklogin.js    # zkLogin integration
│   │   └── sponsored.js  # Sponsored transactions
│   ├── config/           # Configuration
│   │   └── constants.js
│   ├── App.jsx
│   └── main.jsx
├── ws-resources.json     # Walrus Sites config
└── package.json
```

---

## 🌊 Walrus Sites

### Configuration

Walrus Sites configuration is located in `.walrus/sites-config.yaml`:

```yaml
default_context: testnet

contexts:
  testnet:
    portal: trwal.app
    package: 0xf99aee9f21493e1590e7e5a9aea6f343a1f381031a04a732724871fc294be799
    # ... other settings
```

### Publishing Updates

```bash
cd frontend
site-builder deploy ./dist --epochs 10
```

### Accessing Your Site

- **B36 URL**: `https://<b36>.trwal.app/`
- **SuiNS URL**: `https://<name>.trwal.app/` (after SuiNS setup)

### Resources Configuration

Edit `frontend/ws-resources.json`:

```json
{
  "site_name": "Sui LinkTree",
  "description": "On-Chain LinkTree on Sui Blockchain",
  "routes": {
    "/": "/index.html",
    "/*": "/index.html"
  }
}
```

---

## 🏷️ SuiNS Integration

### Register a SuiNS Domain

1. Visit [SuiNS Testnet](https://testnet.suins.io/)
2. Search for your desired name
3. Register (costs SUI tokens)
4. Save your SuiNS Name ID

### Point Domain to Your Site

```bash
# Using Sui CLI
sui client call \
  --package 0xd22b24490e0bae52676651b4f56660a5ff8022a2576e0089f79b3c88d44e08f0 \
  --module suins \
  --function set_target_address \
  --args <SUINS_NAME_ID> <YOUR_SITE_OBJECT_ID> \
  --gas-budget 10000000
```

### Accessing via SuiNS

After configuration, your site will be accessible at:
```
https://yourname.trwal.app/
```

---

## 🔐 zkLogin

### Supported Providers

- ✅ Google
- ✅ Facebook
- ✅ Twitch

### Configuration

Update `frontend/src/config/constants.js`:

```javascript
export const ENOKI_PUBLIC_KEY = 'enoki_public_6e46f0c830405ece028b6c6d7a938b73';
```

### Usage Flow

1. User clicks "Login with Google"
2. Redirected to OAuth provider
3. After authentication, receives zkProof
4. zkProof used for transaction signing
5. No seed phrase needed!

### Implementation

Check `frontend/src/utils/zklogin.js` for implementation details.

---

## 💰 Sponsored Transactions

### Configuration

Update `frontend/src/config/constants.js`:

```javascript
export const ENOKI_PRIVATE_KEY = 'enoki_private_8a522594a3f9138837481d121ccf6c13';
```

### How It Works

1. User initiates transaction
2. Frontend requests sponsorship from Enoki
3. Enoki pays gas fees
4. Transaction executed without user paying gas
5. Better UX for new users!

### Implementation

Check `frontend/src/utils/sponsored.js` for implementation details.

---

## 📁 Project Structure

```
sui-linktree/
├── move/                          # Sui Move smart contract
│   ├── sources/
│   │   └── linktree.move         # Main contract
│   ├── Move.toml                 # Move configuration
│   └── tests/                    # Contract tests
├── frontend/                      # React frontend
│   ├── src/
│   │   ├── components/           # React components
│   │   ├── pages/                # Page components
│   │   ├── utils/                # Utilities
│   │   └── config/               # Configuration
│   ├── public/                   # Static assets
│   ├── ws-resources.json         # Walrus Sites config
│   └── package.json              # Dependencies
├── scripts/                       # Deployment scripts
│   ├── deploy.sh                 # Unix deployment
│   └── deploy.ps1                # Windows deployment
├── .walrus/                       # Walrus configuration
│   └── sites-config.yaml
├── README.md                      # This file
├── DOCUMENTATION.md               # Detailed docs
└── deploy-info.txt               # Deployment info (generated)
```

---

## 🧪 Testing

### Test Smart Contract

```bash
cd move
sui move test
```

### Test Frontend Locally

```bash
cd frontend
npm run dev
```

### Test on Testnet

1. Deploy contract to testnet
2. Update frontend config
3. Build and test locally
4. Deploy to Walrus Sites

---

## 🐛 Troubleshooting

### Common Issues

1. **"Insufficient gas"**
   - Solution: Get testnet SUI from faucet
   - Discord: #testnet-faucet channel

2. **"Package not found"**
   - Solution: Update PACKAGE_ID in constants.js
   - Redeploy the Move contract

3. **"Site not accessible"**
   - Solution: Wait a few minutes after deployment
   - Check Walrus Sites status

4. **"Transaction failed"**
   - Solution: Check wallet connection
   - Verify you have enough SUI for gas

### Getting Help

- [Sui Documentation](https://docs.sui.io/)
- [Walrus Sites Docs](https://docs.wal.app/)
- [Sui Discord](https://discord.gg/sui)
- [Mysten Labs GitHub](https://github.com/MystenLabs)

---

## 🎥 Demo Video

> Create a 3-5 minute demo video showing:
> - Creating a profile
> - Adding links
> - Customizing theme
> - Viewing the profile
> - Walrus Sites deployment
> - SuiNS integration

---

## 📚 Resources

### Official Documentation
- [Sui Documentation](https://docs.sui.io/)
- [Move Language Book](https://move-book.com/)
- [Walrus Sites](https://docs.wal.app/)
- [Mysten dApp Kit](https://sdk.mystenlabs.com/dapp-kit)
- [SuiNS Documentation](https://docs.suins.io/)
- [Enoki Documentation](https://docs.enoki.mystenlabs.com/)

### Examples & References
- [Flatland Example](https://github.com/MystenLabs/example-walrus-sites/tree/main/flatland)
- [Example Walrus Sites](https://github.com/MystenLabs/example-walrus-sites)
- [Sui Examples](https://github.com/MystenLabs/sui/tree/main/examples)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Workflow

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Team

Created for the Sui LinkTree Hackathon

- Blockchain: Sui Network
- Storage: Walrus Sites
- Authentication: zkLogin (Enoki)
- Sponsorship: Enoki

---

## 🙏 Acknowledgments

- Mysten Labs for Sui, Walrus, and Enoki
- The Sui community for support and resources
- Flatland example for inspiration

---

## 📞 Contact

For questions or support:
- GitHub Issues: [Create an issue]
- Discord: Join #sui-linktree channel
- Email: [Your email]

---

<div align="center">

**Built with ❤️ on Sui Blockchain**

[Website](#) • [Documentation](./DOCUMENTATION.md) • [Demo Video](#)

</div>

