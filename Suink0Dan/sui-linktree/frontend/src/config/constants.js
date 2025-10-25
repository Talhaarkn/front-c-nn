// Network Configuration
export const NETWORK = 'testnet';

// Enoki Configuration
export const ENOKI_PUBLIC_KEY = 'enoki_public_6e46f0c830405ece028b6c6d7a938b73';
export const ENOKI_PRIVATE_KEY = 'enoki_private_8a522594a3f9138837481d121ccf6c13';

// Google OAuth Configuration
export const GOOGLE_CLIENT_ID = '665551195395-qu5pu13dkt5lj3oh0g12u28tks711p3o.apps.googleusercontent.com';

// Contract Configuration (Updated after deployment)
export const PACKAGE_ID = '0x0a8ae4e5ea4a0ff3f652d30c9cac259fa7a53a6e66bde4fa5836b86f024fc408';
export const REGISTRY_ID = '0xd07b21bf0d78189c70a4b2157f4da15022960f327ae89290c6b0219cfd435566';

// Walrus Configuration
export const WALRUS_PUBLISHER_URL = 'https://publisher.walrus-testnet.walrus.space';
export const WALRUS_AGGREGATOR_URL = 'https://aggregator.walrus-testnet.walrus.space';

// SuiNS Configuration
export const SUINS_CONTRACT_ADDRESS = '0xd22b24490e0bae52676651b4f56660a5ff8022a2576e0089f79b3c88d44e08f0';

// Theme Options
export const THEMES = [
  { value: 'dark', label: 'Dark', gradient: 'from-gray-900 to-gray-800' },
  { value: 'light', label: 'Light', gradient: 'from-gray-100 to-white' },
  { value: 'gradient', label: 'Gradient', gradient: 'from-purple-500 via-pink-500 to-red-500' },
  { value: 'ocean', label: 'Ocean', gradient: 'from-blue-600 via-cyan-500 to-teal-400' },
  { value: 'sunset', label: 'Sunset', gradient: 'from-orange-500 via-red-500 to-pink-500' },
  { value: 'forest', label: 'Forest', gradient: 'from-green-600 via-emerald-500 to-teal-500' },
];

// API Endpoints
export const API_ENDPOINTS = {
  suiRpc: `https://fullnode.${NETWORK}.sui.io:443`,
};

