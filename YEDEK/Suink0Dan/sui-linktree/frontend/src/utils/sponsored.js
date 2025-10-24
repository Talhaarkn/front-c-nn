import { EnokiClient } from '@mysten/enoki';
import { ENOKI_PRIVATE_KEY, NETWORK } from '../config/constants';

// Initialize Enoki client for sponsored transactions
const enokiClient = new EnokiClient({
  apiKey: ENOKI_PRIVATE_KEY,
});

/**
 * Execute a sponsored transaction
 * @param {Transaction} transaction - The transaction to sponsor
 * @param {string} senderAddress - The address of the sender
 * @returns {Promise<object>} Transaction result
 */
export async function executeSponsoredTransaction(transaction, senderAddress) {
  try {
    // Serialize the transaction
    const transactionBytes = await transaction.build({
      client: enokiClient,
    });

    // Request sponsorship from Enoki
    const sponsoredTx = await enokiClient.createSponsoredTransaction({
      network: NETWORK,
      transactionBytes: Buffer.from(transactionBytes).toString('base64'),
      sender: senderAddress,
    });

    // Execute the sponsored transaction
    const result = await enokiClient.executeSponsoredTransaction({
      digest: sponsoredTx.digest,
    });

    return result;
  } catch (error) {
    console.error('Error executing sponsored transaction:', error);
    throw error;
  }
}

/**
 * Check if sponsored transactions are available
 */
export function isSponsoredTransactionAvailable() {
  return !!ENOKI_PRIVATE_KEY;
}

/**
 * Get sponsorship status
 */
export async function getSponsorshipStatus() {
  try {
    const status = await enokiClient.getSponsorshipStatus({
      network: NETWORK,
    });

    return {
      available: status.available,
      remaining: status.remaining,
      limit: status.limit,
    };
  } catch (error) {
    console.error('Error getting sponsorship status:', error);
    return {
      available: false,
      remaining: 0,
      limit: 0,
    };
  }
}

/**
 * Wrapper for transaction execution with sponsorship fallback
 */
export async function executeTransaction({
  transaction,
  senderAddress,
  signAndExecute,
  useSponsorship = true,
}) {
  // Try sponsored transaction first if enabled
  if (useSponsorship && isSponsoredTransactionAvailable()) {
    try {
      return await executeSponsoredTransaction(transaction, senderAddress);
    } catch (error) {
      console.warn('Sponsored transaction failed, falling back to regular:', error);
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

