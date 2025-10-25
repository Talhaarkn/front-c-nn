import { useState, useEffect } from 'react';
import { getSponsorshipStatus, isSponsoredTransactionAvailable } from '../utils/sponsored';

export default function SponsoredTxInfo() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    if (!isSponsoredTransactionAvailable()) {
      setLoading(false);
      return;
    }

    try {
      const sponsorStatus = await getSponsorshipStatus();
      setStatus(sponsorStatus);
    } catch (error) {
      console.error('Error loading sponsorship status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !status) {
    return null;
  }

  if (!status.available) {
    return (
      <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-3 text-sm">
        <p className="text-yellow-200">
          ⚠️ Sponsored transactions are currently unavailable. You'll need to pay gas fees.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-3 text-sm">
      <p className="text-green-200 flex items-center gap-2">
        <span>✅</span>
        <span>
          Gas fees sponsored! Create profiles and add links for free.
        </span>
      </p>
      {status.remaining !== undefined && (
        <p className="text-green-300/70 text-xs mt-1">
          {status.remaining} of {status.limit} sponsored transactions remaining
        </p>
      )}
    </div>
  );
}

