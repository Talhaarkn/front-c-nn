import { Routes, Route } from 'react-router-dom';
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getFullnodeUrl } from '@mysten/sui/client';
import Home from './pages/Home';
import CreateProfile from './pages/CreateProfile';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import AuthCallback from './pages/AuthCallback';
import '@mysten/dapp-kit/dist/index.css';

const queryClient = new QueryClient();

const networks = {
  testnet: { url: getFullnodeUrl('testnet') },
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork="testnet">
        <WalletProvider autoConnect>
          <div className="min-h-screen">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create" element={<CreateProfile />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/edit/:id" element={<EditProfile />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
            </Routes>
          </div>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}

export default App;

