import { useCurrentAccount, useConnectWallet, useWallets, useDisconnectWallet } from '@mysten/dapp-kit';
import { isEnokiWallet } from '@mysten/enoki';

export default function EnokiLoginButton() {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: connectWallet } = useConnectWallet();
  const { mutateAsync: disconnectWallet } = useDisconnectWallet();
  const wallets = useWallets();

  const isConnectedViaGoogleZkLogin = () => {
    if (!currentAccount) return false;
    
    const enokiWallets = wallets.filter(isEnokiWallet);
    const googleWallet = enokiWallets.find((wallet) => 
      wallet.provider === 'google' || wallet.name?.includes('Google')
    );
    
    return !!googleWallet && currentAccount.address !== undefined;
  };

  const handleGoogleLogin = async () => {
    try {
      if (currentAccount) {
        await disconnectWallet();
        console.log('Disconnected existing wallet');
      }

      // Find Enoki Google wallet
      const enokiWallets = wallets.filter(isEnokiWallet);
      const googleWallet = enokiWallets.find((wallet) => 
        wallet.provider === 'google' || wallet.name?.includes('Google')
      );

      if (!googleWallet) {
        alert('Google zkLogin wallet not found. Make sure Enoki is configured properly.');
        return;
      }

      // Connect with Google zkLogin
      await connectWallet({ wallet: googleWallet });
      console.log('Google zkLogin successful!');
    } catch (error) {
      console.error('Google zkLogin failed:', error);
      alert('Login failed: ' + error.message);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
      console.log('Wallet disconnected');
    } catch (error) {
      console.error('Disconnect failed:', error);
    }
  };

  // If connected via Google zkLogin, show connected status
  if (currentAccount && isConnectedViaGoogleZkLogin()) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-green-400">✓ Connected via Google zkLogin</span>
        <button
          onClick={handleDisconnect}
          className="btn btn-secondary text-sm px-4 py-2"
        >
          Disconnect
        </button>
      </div>
    );
  }

  // If connected via another wallet, show warning
  if (currentAccount && !isConnectedViaGoogleZkLogin()) {
    return (
      <div className="flex flex-col gap-2">
        <span className="text-sm text-yellow-400">⚠️ Connected with another wallet</span>
        <div className="flex gap-2">
          <button
            onClick={handleGoogleLogin}
            className="btn btn-primary text-sm px-4 py-2"
          >
            Sign in with Google zkLogin
          </button>
          <button
            onClick={handleDisconnect}
            className="btn btn-secondary text-sm px-4 py-2"
          >
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  // Not connected, show Google login button
  return (
    <button
      onClick={handleGoogleLogin}
      className="btn btn-primary px-6 py-3 text-lg"
    >
      🔐 Sign in with Google zkLogin
    </button>
  );
}

