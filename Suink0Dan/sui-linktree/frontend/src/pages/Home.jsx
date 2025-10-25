import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import { getProfilesByOwner } from '../utils/sui';
import EnokiLoginButton from '../components/EnokiLoginButton';

export default function Home() {
  const navigate = useNavigate();
  const currentAccount = useCurrentAccount();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadProfiles = async () => {
    if (!currentAccount?.address) return;
    
    setLoading(true);
    try {
      const userProfiles = await getProfilesByOwner(currentAccount.address);
      setProfiles(userProfiles);
    } catch (error) {
      console.error('Error loading profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentAccount) {
      loadProfiles();
    }
  }, [currentAccount]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="absolute top-4 right-4 flex items-center gap-4">
        {currentAccount && (
          <div className="card px-4 py-2">
            <p className="text-xs text-gray-400 truncate max-w-[200px]">
              {currentAccount.address.slice(0, 6)}...{currentAccount.address.slice(-4)}
            </p>
          </div>
        )}
        <ConnectButton />
      </div>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center space-y-8 mb-12">
        <div className="space-y-4 animate-float">
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Sui LinkTree
          </h1>
          <p className="text-xl md:text-2xl text-gray-300">
            Your On-Chain Link Hub on Sui Blockchain
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {currentAccount ? (
            <>
              <button
                onClick={() => navigate('/create')}
                className="btn btn-primary text-lg px-8 py-4"
              >
                Create Profile
              </button>
              {profiles.length > 0 && (
                <button
                  onClick={() => navigate(`/profile/${profiles[0].id}`)}
                  className="btn btn-secondary text-lg px-8 py-4"
                >
                  View My Profile
                </button>
              )}
            </>
          ) : (
            <div className="card p-8 max-w-md w-full">
              <p className="text-lg mb-6 text-center">Connect your wallet to get started</p>
              
              {/* zkLogin Button */}
              <div className="flex justify-center mb-6">
                <EnokiLoginButton />
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-gray-400">
                    OR
                  </span>
                </div>
              </div>

              {/* Regular Wallet Connect */}
              <div className="flex justify-center">
                <ConnectButton />
              </div>
              <p className="text-sm text-gray-400 mt-4 text-center">
                Use Sui Wallet, Slush, or any other Sui-compatible wallet
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mt-16">
        <div className="card p-8 text-center space-y-4">
          <div className="text-5xl">🔗</div>
          <h3 className="text-2xl font-bold">On-Chain Links</h3>
          <p className="text-gray-300">
            Store all your links directly on the Sui blockchain
          </p>
        </div>

        <div className="card p-8 text-center space-y-4">
          <div className="text-5xl">🎨</div>
          <h3 className="text-2xl font-bold">Customizable</h3>
          <p className="text-gray-300">
            Personalize your profile with themes and colors
          </p>
        </div>

        <div className="card p-8 text-center space-y-4">
          <div className="text-5xl">🚀</div>
          <h3 className="text-2xl font-bold">Walrus Sites</h3>
          <p className="text-gray-300">
            Deployed on decentralized Walrus storage
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 text-center text-gray-400">
        <p>Built with Sui, Walrus Sites, and zkLogin</p>
        <p className="text-sm mt-2">Powered by Mysten Labs</p>
      </footer>
    </div>
  );
}

