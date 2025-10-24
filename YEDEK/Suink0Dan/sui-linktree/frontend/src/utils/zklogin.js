import { EnokiClient } from '@mysten/enoki';
import { ENOKI_PUBLIC_KEY } from '../config/constants';

// Initialize Enoki client for zkLogin
const enokiClient = new EnokiClient({
  apiKey: ENOKI_PUBLIC_KEY,
});

/**
 * Get zkLogin providers
 */
export const ZKLOGIN_PROVIDERS = {
  GOOGLE: 'google',
  FACEBOOK: 'facebook',
  TWITCH: 'twitch',
};

/**
 * Initialize zkLogin flow
 */
export async function initZkLogin(provider = ZKLOGIN_PROVIDERS.GOOGLE) {
  try {
    const authUrl = await enokiClient.createAuthorizationURL({
      provider,
      clientId: ENOKI_PUBLIC_KEY,
      redirectUrl: `${window.location.origin}/auth/callback`,
      network: 'testnet',
    });

    return authUrl;
  } catch (error) {
    console.error('Error initializing zkLogin:', error);
    throw error;
  }
}

/**
 * Handle zkLogin callback
 */
export async function handleZkLoginCallback(code) {
  try {
    const zkProof = await enokiClient.getZkLoginProof({
      code,
      network: 'testnet',
    });

    return zkProof;
  } catch (error) {
    console.error('Error handling zkLogin callback:', error);
    throw error;
  }
}

/**
 * Get zkLogin address
 */
export async function getZkLoginAddress(jwt) {
  try {
    const address = await enokiClient.getAddress({
      jwt,
      network: 'testnet',
    });

    return address;
  } catch (error) {
    console.error('Error getting zkLogin address:', error);
    throw error;
  }
}

/**
 * Store zkLogin session
 */
export function storeZkLoginSession(session) {
  localStorage.setItem('zklogin_session', JSON.stringify(session));
}

/**
 * Get zkLogin session
 */
export function getZkLoginSession() {
  const session = localStorage.getItem('zklogin_session');
  return session ? JSON.parse(session) : null;
}

/**
 * Clear zkLogin session
 */
export function clearZkLoginSession() {
  localStorage.removeItem('zklogin_session');
}

/**
 * Check if user is logged in with zkLogin
 */
export function isZkLoginActive() {
  const session = getZkLoginSession();
  if (!session) return false;

  // Check if session is expired
  const expiryTime = session.expiryTime || 0;
  return Date.now() < expiryTime;
}

