# Sui LinkTree - Technical Documentation

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Smart Contract Details](#smart-contract-details)
3. [Frontend Implementation](#frontend-implementation)
4. [Walrus Sites Integration](#walrus-sites-integration)
5. [zkLogin Implementation](#zklogin-implementation)
6. [Sponsored Transactions](#sponsored-transactions)
7. [SuiNS Integration](#suins-integration)
8. [API Reference](#api-reference)
9. [Deployment Guide](#deployment-guide)
10. [Security Considerations](#security-considerations)

---

## Architecture Overview

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Application                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   React UI   │  │ dApp Kit     │  │ React Router │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────┬───────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Integration Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   zkLogin    │  │  Sponsored   │  │   Sui SDK    │     │
│  │   (Enoki)    │  │  Tx (Enoki)  │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────┬───────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Sui Blockchain                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Move Smart Contract (LinkTree Module)        │  │
│  │  • ProfileRegistry (Shared Object)                   │  │
│  │  • LinkTreeProfile (Shared Object per user)          │  │
│  │  • Dynamic Fields for name resolution                │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────┬───────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Walrus Sites                             │
│  • Decentralized blob storage                                │
│  • Content-addressed files                                   │
│  • Portal-based access (trwal.app)                           │
└─────────────┬───────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│                        SuiNS                                 │
│  • Domain name resolution (.sui)                             │
│  • Maps name → Site Object ID                                │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

#### Creating a Profile

```
User → Connect Wallet → Fill Form → Create Transaction
  ↓
Frontend creates TransactionBlock
  ↓
Check for Sponsorship Available
  ↓
If Available: Enoki sponsors → Execute
If Not: User signs → Execute
  ↓
Transaction sent to Sui Network
  ↓
Move Contract: create_profile()
  ↓
Creates LinkTreeProfile Object
Registers name in ProfileRegistry
  ↓
Emits ProfileCreated Event
  ↓
Frontend receives transaction result
  ↓
Navigate to Profile Page
```

#### Viewing a Profile

```
User visits URL with profile ID or name
  ↓
Frontend extracts identifier
  ↓
If Object ID: Call getObject() RPC
If Name: Query ProfileRegistry → get Object ID → Call getObject()
  ↓
Parse profile data from on-chain object
  ↓
Render profile with links, theme, etc.
```

---

## Smart Contract Details

### Module Structure

```move
module linktree::profile {
    // Imports
    use std::string::{String};
    use sui::table::{Self, Table};
    use sui::event;

    // Structs
    struct Link has store, copy, drop { ... }
    struct LinkTreeProfile has key, store { ... }
    struct ProfileRegistry has key { ... }

    // Events
    struct ProfileCreated has copy, drop { ... }
    struct ProfileUpdated has copy, drop { ... }
    struct LinkAdded has copy, drop { ... }

    // Functions
    public entry fun create_profile(...) { ... }
    public entry fun update_profile(...) { ... }
    public entry fun add_link(...) { ... }
    public entry fun remove_link(...) { ... }
    public entry fun update_link(...) { ... }
    
    // View functions
    public fun get_profile_by_name(...): address { ... }
    public fun name_exists(...): bool { ... }
    // Getters...
}
```

### Object Structures

#### LinkTreeProfile

```move
public struct LinkTreeProfile has key, store {
    id: UID,                    // Unique object ID
    owner: address,             // Profile owner's address
    name: String,               // Unique username
    avatar_url: String,         // Avatar image URL
    bio: String,                // Short biography
    links: vector<Link>,        // List of links
    theme: String,              // Theme identifier
    background_color: String,   // Hex color
    text_color: String,         // Hex color
    created_at: u64,            // Epoch timestamp
    updated_at: u64,            // Epoch timestamp
}
```

#### ProfileRegistry

```move
public struct ProfileRegistry has key {
    id: UID,
    names: Table<String, address>,  // Maps username → profile object address
}
```

The `ProfileRegistry` is a **shared object** created during contract initialization. It maintains a global mapping of usernames to profile object addresses, enabling:

1. **Name Uniqueness**: Ensures no duplicate usernames
2. **Name Resolution**: Look up profiles by username
3. **Discovery**: Query all registered names

#### Link

```move
public struct Link has store, copy, drop {
    label: String,   // Display text
    url: String,     // Target URL
    icon: String,    // Emoji or icon identifier
}
```

### Function Specifications

#### create_profile

```move
public entry fun create_profile(
    registry: &mut ProfileRegistry,
    name: String,
    avatar_url: String,
    bio: String,
    theme: String,
    background_color: String,
    text_color: String,
    ctx: &mut TxContext
)
```

**Purpose**: Creates a new LinkTree profile

**Logic**:
1. Validates name is unique in registry
2. Creates new `LinkTreeProfile` object
3. Registers name in `ProfileRegistry`
4. Emits `ProfileCreated` event
5. Shares the profile object

**Errors**:
- `ENameAlreadyExists` (1): Username already taken

**Gas Estimate**: ~0.01 SUI

#### update_profile

```move
public entry fun update_profile(
    profile: &mut LinkTreeProfile,
    avatar_url: String,
    bio: String,
    theme: String,
    background_color: String,
    text_color: String,
    ctx: &mut TxContext
)
```

**Purpose**: Updates profile information

**Access Control**: Only profile owner can update

**Logic**:
1. Verifies caller is profile owner
2. Updates fields
3. Updates `updated_at` timestamp
4. Emits `ProfileUpdated` event

**Errors**:
- `ENotOwner` (2): Caller is not the profile owner

**Gas Estimate**: ~0.005 SUI

#### add_link

```move
public entry fun add_link(
    profile: &mut LinkTreeProfile,
    label: String,
    url: String,
    icon: String,
    ctx: &mut TxContext
)
```

**Purpose**: Adds a new link to the profile

**Access Control**: Only profile owner

**Logic**:
1. Verifies ownership
2. Creates new `Link` struct
3. Appends to `links` vector
4. Updates timestamp
5. Emits `LinkAdded` event

**Gas Estimate**: ~0.005 SUI

#### remove_link

```move
public entry fun remove_link(
    profile: &mut LinkTreeProfile,
    index: u64,
    ctx: &mut TxContext
)
```

**Purpose**: Removes a link by index

**Access Control**: Only profile owner

**Logic**:
1. Verifies ownership
2. Validates index is valid
3. Removes link from vector
4. Updates timestamp
5. Emits `ProfileUpdated` event

**Errors**:
- `EInvalidLinkIndex` (0): Index out of bounds

**Gas Estimate**: ~0.005 SUI

#### update_link

```move
public entry fun update_link(
    profile: &mut LinkTreeProfile,
    index: u64,
    label: String,
    url: String,
    icon: String,
    ctx: &mut TxContext
)
```

**Purpose**: Updates an existing link

**Access Control**: Only profile owner

**Logic**:
1. Verifies ownership
2. Validates index
3. Updates link fields in place
4. Updates timestamp
5. Emits event

**Gas Estimate**: ~0.005 SUI

### View Functions

These functions don't modify state and can be called for free via RPC:

```move
// Get profile address by username
public fun get_profile_by_name(registry: &ProfileRegistry, name: String): address

// Check if username exists
public fun name_exists(registry: &ProfileRegistry, name: String): bool

// Getters
public fun get_owner(profile: &LinkTreeProfile): address
public fun get_name(profile: &LinkTreeProfile): String
public fun get_avatar_url(profile: &LinkTreeProfile): String
public fun get_bio(profile: &LinkTreeProfile): String
public fun get_theme(profile: &LinkTreeProfile): String
public fun get_background_color(profile: &LinkTreeProfile): String
public fun get_text_color(profile: &LinkTreeProfile): String
public fun get_links_count(profile: &LinkTreeProfile): u64
```

### Events

All events are emitted for indexing and monitoring:

```move
public struct ProfileCreated has copy, drop {
    profile_id: address,
    owner: address,
    name: String,
}

public struct ProfileUpdated has copy, drop {
    profile_id: address,
    owner: address,
}

public struct LinkAdded has copy, drop {
    profile_id: address,
    label: String,
    url: String,
}
```

### Security Features

1. **Access Control**: All mutations require owner verification
2. **Name Uniqueness**: Registry prevents duplicate usernames
3. **Input Validation**: Type safety via Move
4. **Shared Objects**: Profiles are shared, not owned, for public accessibility
5. **Immutable History**: All changes are on-chain and auditable

---

## Frontend Implementation

### Core Technologies

- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first styling
- **React Router v6**: Client-side routing
- **@mysten/dapp-kit**: Sui wallet integration
- **@mysten/sui**: Sui TypeScript SDK
- **@tanstack/react-query**: Server state management

### Application Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Route components
│   ├── Home.jsx
│   ├── CreateProfile.jsx
│   ├── Profile.jsx
│   └── EditProfile.jsx
├── utils/              # Utility modules
│   ├── sui.js
│   ├── zklogin.js
│   └── sponsored.js
├── config/
│   └── constants.js
├── App.jsx
├── main.jsx
└── index.css
```

### Key Utilities

#### sui.js - Blockchain Interaction

```javascript
// Fetch profile by ID
export async function getProfileById(profileId)

// Fetch profile by name
export async function getProfileByName(name)

// Transaction builders
export function createProfileTransaction(data)
export function updateProfileTransaction(data)
export function addLinkTransaction(data)
export function removeLinkTransaction(data)
export function updateLinkTransaction(data)

// Query helpers
export async function getProfilesByOwner(ownerAddress)
```

#### zklogin.js - Authentication

```javascript
// Initialize OAuth flow
export async function initZkLogin(provider)

// Handle callback
export async function handleZkLoginCallback(code)

// Get address from JWT
export async function getZkLoginAddress(jwt)

// Session management
export function storeZkLoginSession(session)
export function getZkLoginSession()
export function clearZkLoginSession()
export function isZkLoginActive()
```

#### sponsored.js - Gasless Transactions

```javascript
// Execute sponsored transaction
export async function executeSponsoredTransaction(transaction, senderAddress)

// Check availability
export function isSponsoredTransactionAvailable()

// Get sponsorship status
export async function getSponsorshipStatus()

// Smart wrapper with fallback
export async function executeTransaction({
  transaction,
  senderAddress,
  signAndExecute,
  useSponsorship
})
```

### Wallet Integration

Using `@mysten/dapp-kit`:

```jsx
import { WalletProvider, ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';

// App setup
<WalletProvider autoConnect>
  <YourApp />
</WalletProvider>

// In components
const currentAccount = useCurrentAccount();
const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
```

### RPC Queries

```javascript
import { useSuiClientQuery } from '@mysten/dapp-kit';

// Get object
const { data, isLoading } = useSuiClientQuery('getObject', {
  id: profileId,
  options: { showContent: true }
});

// Get owned objects
const { data } = useSuiClientQuery('getOwnedObjects', {
  owner: address,
  filter: { StructType: `${PACKAGE_ID}::profile::LinkTreeProfile` }
});
```

### State Management

Using React Query for server state:

```jsx
const { data: profile, isLoading, error, refetch } = useQuery({
  queryKey: ['profile', profileId],
  queryFn: () => getProfileById(profileId),
});
```

### Styling System

Tailwind CSS with custom utilities:

```css
/* Custom button styles */
.btn {
  @apply px-6 py-3 rounded-xl font-medium transition-all;
}

.btn-primary {
  @apply bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700;
}

/* Card style */
.card {
  @apply bg-white/10 backdrop-blur-md rounded-2xl border border-white/20;
}

/* Link card with hover effect */
.link-card {
  @apply bg-white/10 rounded-xl p-4 hover:bg-white/20 hover:scale-105 transition-all;
}
```

### Routing

```jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/create" element={<CreateProfile />} />
  <Route path="/profile/:id" element={<Profile />} />
  <Route path="/edit/:id" element={<EditProfile />} />
</Routes>
```

### Error Handling

```javascript
try {
  const result = await signAndExecute({ transaction });
  // Success handling
} catch (error) {
  if (error.message.includes('Insufficient gas')) {
    setError('Not enough SUI for gas fees');
  } else if (error.message.includes('User rejected')) {
    setError('Transaction cancelled');
  } else {
    setError('Transaction failed: ' + error.message);
  }
}
```

---

## Walrus Sites Integration

### Overview

Walrus Sites is a decentralized hosting solution that stores website files as blobs on the Walrus network and serves them through portals.

### Configuration Files

#### ws-resources.json

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

**Purpose**: 
- Defines site metadata
- Configures routing (SPA mode with catch-all)

#### sites-config.yaml

```yaml
contexts:
  testnet:
    portal: trwal.app
    package: 0xf99aee9f21493e1590e7e5a9aea6f343a1f381031a04a732724871fc294be799
    staking_object: 0xbe46180321c30aab2f8b3501e24048377287fa708018a5b7c2792b35fe339ee3
    general:
       wallet_env: testnet
       walrus_context: testnet
       walrus_package: 0xd84704c17fc870b8764832c535aa6b11f21a95cd6f5bb38a9b07d2cf42220c66

default_context: testnet
```

**Purpose**:
- Configures Walrus network settings
- Specifies portal and packages
- Sets default network context

### Deployment Process

1. **Build Frontend**
   ```bash
   npm run build  # Creates dist/ directory
   ```

2. **Publish to Walrus**
   ```bash
   site-builder deploy ./dist --epochs 10
   ```

3. **Site Builder Actions**:
   - Uploads all files in `dist/` as blobs to Walrus
   - Creates a Site object on Sui blockchain
   - Returns Site Object ID and B36 identifier

4. **Accessing the Site**:
   - B36: `https://<b36>.trwal.app/`
   - SuiNS: `https://<name>.trwal.app/` (after setup)

### How It Works

```
┌─────────────────┐
│   User Request  │
│  (Browser)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Walrus Portal  │
│  (trwal.app)    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│  Sui Blockchain             │
│  Query Site Object          │
│  Get Blob IDs and Routes    │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────┐
│  Walrus Network │
│  Fetch Blobs    │
│  Reconstruct    │
│  Files          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Serve Content  │
│  to User        │
└─────────────────┘
```

### Content Addressing

Each file uploaded to Walrus receives:
- **Blob ID**: Content-addressed identifier
- **Epoch**: Expiration time (extendable)

The Site object on Sui stores:
- Blob IDs for each file
- Routing information
- Metadata

### Advantages

1. **Decentralization**: No single point of failure
2. **Censorship Resistance**: Content is distributed
3. **Immutability**: Files are content-addressed
4. **Cost Efficiency**: Pay once for storage epochs
5. **Performance**: CDN-like distribution

### Updating Your Site

```bash
# Build new version
npm run build

# Deploy update (reuses or creates new site object)
site-builder deploy ./dist --epochs 10
```

Site Builder will:
- Upload changed files as new blobs
- Update or create new Site object
- Preserve unchanged files (efficient)

### SPA Routing

For React Router to work, we need catch-all routing:

```json
{
  "routes": {
    "/": "/index.html",
    "/*": "/index.html"
  }
}
```

This ensures all paths serve `index.html`, allowing React Router to handle routing client-side.

---

## zkLogin Implementation

### Overview

zkLogin enables users to authenticate using OAuth providers (Google, Facebook, Twitch) without managing seed phrases.

### Architecture

```
User → OAuth Provider → JWT Token → zkProof → Sui Address
```

### Enoki Integration

We use Mysten's Enoki service for zkLogin:

```javascript
import { EnokiClient } from '@mysten/enoki/client';

const enokiClient = new EnokiClient({
  apiKey: ENOKI_PUBLIC_KEY,
});
```

### Flow Implementation

#### 1. Initiate Login

```javascript
export async function initZkLogin(provider = 'google') {
  const authUrl = await enokiClient.createAuthorizationURL({
    provider,
    clientId: ENOKI_PUBLIC_KEY,
    redirectUrl: `${window.location.origin}/auth/callback`,
    network: 'testnet',
  });
  
  // Redirect user to OAuth provider
  window.location.href = authUrl;
}
```

#### 2. Handle Callback

```javascript
export async function handleZkLoginCallback(code) {
  const zkProof = await enokiClient.getZkLoginProof({
    code,
    network: 'testnet',
  });
  
  return zkProof;
}
```

#### 3. Get Sui Address

```javascript
export async function getZkLoginAddress(jwt) {
  const address = await enokiClient.getAddress({
    jwt,
    network: 'testnet',
  });
  
  return address;
}
```

#### 4. Sign Transactions

```javascript
// The zkProof can be used to sign transactions
const signature = await enokiClient.signTransaction({
  transaction: txBytes,
  zkProof,
});
```

### Session Management

```javascript
// Store session
export function storeZkLoginSession(session) {
  localStorage.setItem('zklogin_session', JSON.stringify({
    jwt: session.jwt,
    zkProof: session.zkProof,
    address: session.address,
    expiryTime: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
  }));
}

// Retrieve session
export function getZkLoginSession() {
  const session = localStorage.getItem('zklogin_session');
  return session ? JSON.parse(session) : null;
}

// Check if valid
export function isZkLoginActive() {
  const session = getZkLoginSession();
  if (!session) return false;
  return Date.now() < session.expiryTime;
}
```

### UI Integration

```jsx
function LoginButton() {
  const handleLogin = async () => {
    try {
      const authUrl = await initZkLogin('google');
      // User will be redirected
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <button onClick={handleLogin}>
      Login with Google
    </button>
  );
}
```

### Benefits

1. **No Seed Phrases**: Users don't need to manage private keys
2. **Familiar UX**: Standard OAuth login flow
3. **Multi-Provider**: Support for multiple OAuth providers
4. **Recovery**: As long as user has access to OAuth account
5. **Onboarding**: Easier for non-crypto users

### Security Considerations

- JWT tokens are short-lived
- zkProofs are cryptographically sound
- Enoki handles key derivation securely
- Session expiry prevents unauthorized access

---

## Sponsored Transactions

### Overview

Sponsored transactions allow the application to pay gas fees on behalf of users, improving onboarding and UX.

### Enoki Integration

```javascript
import { EnokiClient } from '@mysten/enoki/client';

const enokiClient = new EnokiClient({
  apiKey: ENOKI_PRIVATE_KEY, // Private key for sponsorship
});
```

### Implementation

#### Execute Sponsored Transaction

```javascript
export async function executeSponsoredTransaction(transaction, senderAddress) {
  // Serialize transaction
  const transactionBytes = await transaction.build({
    client: enokiClient,
  });

  // Request sponsorship
  const sponsoredTx = await enokiClient.createSponsoredTransaction({
    network: 'testnet',
    transactionBytes: Buffer.from(transactionBytes).toString('base64'),
    sender: senderAddress,
  });

  // Execute
  const result = await enokiClient.executeSponsoredTransaction({
    digest: sponsoredTx.digest,
  });

  return result;
}
```

#### Smart Wrapper with Fallback

```javascript
export async function executeTransaction({
  transaction,
  senderAddress,
  signAndExecute,
  useSponsorship = true,
}) {
  // Try sponsored transaction first
  if (useSponsorship && isSponsoredTransactionAvailable()) {
    try {
      return await executeSponsoredTransaction(transaction, senderAddress);
    } catch (error) {
      console.warn('Sponsorship failed, falling back to user payment');
    }
  }

  // Fallback to regular transaction
  return await signAndExecute({
    transaction,
    options: {
      showEffects: true,
      showObjectChanges: true,
    },
  });
}
```

### Usage in Components

```jsx
const handleCreateProfile = async () => {
  const tx = createProfileTransaction(formData);
  
  const result = await executeTransaction({
    transaction: tx,
    senderAddress: currentAccount.address,
    signAndExecute,
    useSponsorship: true, // Enable sponsorship
  });
};
```

### Sponsorship Status

```javascript
export async function getSponsorshipStatus() {
  const status = await enokiClient.getSponsorshipStatus({
    network: 'testnet',
  });

  return {
    available: status.available,
    remaining: status.remaining,
    limit: status.limit,
  };
}
```

### Cost Management

- Enoki provides a quota of sponsored transactions
- Monitor usage via `getSponsorshipStatus()`
- Implement fallback to user-paid transactions
- Consider rate limiting for production

### Benefits

1. **Frictionless Onboarding**: New users don't need SUI tokens
2. **Better UX**: No gas fee prompts
3. **Flexible**: Can choose which transactions to sponsor
4. **Fallback**: Gracefully degrade to regular transactions

---

## SuiNS Integration

### Overview

SuiNS (Sui Name Service) provides human-readable names for blockchain addresses and objects.

### Registration Process

1. Visit [SuiNS Testnet](https://testnet.suins.io/)
2. Search for desired name (e.g., "mylinktree")
3. Purchase (requires SUI testnet tokens)
4. Receive SuiNS Name NFT

### Pointing to Your Site

After deploying to Walrus Sites, point your SuiNS domain:

```bash
sui client call \
  --package 0xd22b24490e0bae52676651b4f56660a5ff8022a2576e0089f79b3c88d44e08f0 \
  --module suins \
  --function set_target_address \
  --args <YOUR_SUINS_NAME_ID> <YOUR_SITE_OBJECT_ID> \
  --gas-budget 10000000
```

### Resolution Flow

```
User visits: https://mylinktree.trwal.app
         ↓
Portal queries SuiNS contract
         ↓
Resolves "mylinktree" → Site Object ID
         ↓
Loads site from Walrus using object ID
         ↓
Serves content to user
```

### SDK Integration

```javascript
import { SuiNSClient } from '@mysten/suins';

const suinsClient = new SuiNSClient({
  network: 'testnet',
});

// Resolve name to object
const objectId = await suinsClient.resolveName('mylinktree');

// Get name for object
const name = await suinsClient.getName(objectId);
```

### Benefits

1. **Memorable URLs**: `myname.trwal.app` instead of B36
2. **Branding**: Custom domain for your profile
3. **Portability**: Update underlying object without changing name
4. **Discovery**: Users can search by name

---

## API Reference

### Sui RPC Endpoints

```
Testnet: https://fullnode.testnet.sui.io:443
Mainnet: https://fullnode.mainnet.sui.io:443
```

### Common RPC Calls

#### Get Object

```javascript
const result = await suiClient.getObject({
  id: '0x...',
  options: {
    showContent: true,
    showOwner: true,
    showType: true,
  },
});
```

#### Get Owned Objects

```javascript
const result = await suiClient.getOwnedObjects({
  owner: '0x...',
  filter: {
    StructType: `${PACKAGE_ID}::profile::LinkTreeProfile`,
  },
  options: {
    showContent: true,
  },
});
```

#### Get Dynamic Field

```javascript
const result = await suiClient.getDynamicFieldObject({
  parentId: REGISTRY_ID,
  name: {
    type: '0x1::string::String',
    value: 'username',
  },
});
```

#### Execute Transaction

```javascript
const result = await suiClient.signAndExecuteTransaction({
  transaction: txBytes,
  signature,
});
```

---

## Deployment Guide

### Prerequisites Checklist

- [ ] Sui CLI installed and configured
- [ ] Sui wallet with testnet SUI
- [ ] Walrus CLI installed
- [ ] Site Builder installed
- [ ] Node.js 18+ and npm
- [ ] Git (optional)

### Step-by-Step Deployment

#### 1. Deploy Smart Contract

```bash
cd move
sui move build
sui client publish --gas-budget 100000000
```

Save:
- Package ID
- Registry Object ID

#### 2. Update Frontend Config

Edit `frontend/src/config/constants.js`:

```javascript
export const PACKAGE_ID = '0xYOUR_PACKAGE_ID';
export const REGISTRY_ID = '0xYOUR_REGISTRY_ID';
```

#### 3. Build Frontend

```bash
cd frontend
npm install
npm run build
```

#### 4. Deploy to Walrus Sites

```bash
site-builder deploy ./dist --epochs 10
```

Save:
- Site Object ID
- B36 URL

#### 5. Register SuiNS (Optional)

1. Visit https://testnet.suins.io/
2. Register your domain
3. Point to Site Object ID

#### 6. Test

Visit your B36 URL or SuiNS domain and test all features.

### Automated Deployment

Use provided scripts:

**Linux/macOS:**
```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

**Windows:**
```powershell
.\scripts\deploy.ps1
```

### Updating After Changes

#### Smart Contract Update

```bash
cd move
sui client publish --gas-budget 100000000
# Update PACKAGE_ID in frontend
# Redeploy frontend
```

#### Frontend Only Update

```bash
cd frontend
npm run build
site-builder deploy ./dist --epochs 10
```

---

## Security Considerations

### Smart Contract Security

1. **Access Control**: All mutations verify ownership
2. **Input Validation**: Type safety via Move
3. **Shared Objects**: Profiles are publicly accessible but owner-controlled
4. **Event Emission**: All changes are auditable
5. **No Reentrancy**: Move's design prevents reentrancy attacks

### Frontend Security

1. **API Key Management**:
   - Public Enoki key is safe for client-side
   - Private key should be server-side only (for production)
   - Currently using client-side for demo purposes

2. **Input Sanitization**:
   - Validate URLs before rendering
   - Escape user-generated content
   - Limit string lengths

3. **XSS Prevention**:
   - React's JSX escapes by default
   - Don't use `dangerouslySetInnerHTML`

4. **Wallet Security**:
   - Use `@mysten/dapp-kit` standard practices
   - Never request unnecessary permissions
   - Clear communication about transactions

### Best Practices

1. **Environment Variables**:
   ```bash
   # .env (never commit!)
   VITE_ENOKI_PUBLIC_KEY=your_public_key
   VITE_ENOKI_PRIVATE_KEY=your_private_key  # Server-side only!
   ```

2. **Rate Limiting**:
   - Implement on sponsored transactions
   - Prevent abuse of gas sponsorship

3. **Content Moderation**:
   - Consider implementing reporting
   - Monitor for malicious content

4. **Regular Updates**:
   - Keep dependencies updated
   - Monitor security advisories

### Audit Recommendations

Before mainnet:
- [ ] Smart contract audit
- [ ] Frontend security review
- [ ] Penetration testing
- [ ] Gas optimization audit

---

## Troubleshooting

### Common Issues

1. **Transaction Fails with "Insufficient Gas"**
   - Get testnet SUI from faucet
   - Increase gas budget

2. **"Package not found"**
   - Verify PACKAGE_ID is correct
   - Check you're on correct network

3. **Site not loading**
   - Wait 1-2 minutes after deployment
   - Check Walrus Sites status
   - Verify epochs haven't expired

4. **zkLogin fails**
   - Check Enoki API key
   - Verify network matches
   - Check console for errors

5. **Sponsored transaction rejected**
   - Check sponsorship quota
   - Verify Enoki private key
   - Fall back to regular transaction

### Debug Mode

Enable debug logging:

```javascript
// In constants.js
export const DEBUG = true;

// In your code
if (DEBUG) {
  console.log('Transaction:', tx);
  console.log('Result:', result);
}
```

### Support Resources

- [Sui Discord](https://discord.gg/sui)
- [Walrus Docs](https://docs.wal.app/)
- [Mysten Labs GitHub](https://github.com/MystenLabs)

---

## Performance Optimization

### Frontend

1. **Code Splitting**:
   ```javascript
   const Profile = lazy(() => import('./pages/Profile'));
   ```

2. **Query Optimization**:
   ```javascript
   const { data } = useQuery({
     queryKey: ['profile', id],
     queryFn: () => getProfileById(id),
     staleTime: 5 * 60 * 1000, // 5 minutes
   });
   ```

3. **Asset Optimization**:
   - Compress images
   - Minify CSS/JS
   - Use CDN for fonts

### Smart Contract

1. **Gas Optimization**:
   - Minimize storage writes
   - Use efficient data structures
   - Batch operations when possible

2. **Object Design**:
   - Keep objects reasonably sized
   - Use dynamic fields for large collections

### Walrus Sites

1. **Caching**:
   - Files are cached by blob ID
   - Unchanged files aren't re-uploaded

2. **Epoch Management**:
   - Extend epochs before expiration
   - Monitor epoch status

---

## Conclusion

This documentation covers all technical aspects of the Sui LinkTree application. For additional support or questions, please refer to the main README or create an issue on GitHub.

**Happy building on Sui! 🚀**

