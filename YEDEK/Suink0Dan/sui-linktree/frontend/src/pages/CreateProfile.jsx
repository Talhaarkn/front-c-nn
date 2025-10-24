import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { createProfileTransaction } from '../utils/sui';
import { executeTransaction } from '../utils/sponsored';
import { THEMES } from '../config/constants';

export default function CreateProfile() {
  const navigate = useNavigate();
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  const [formData, setFormData] = useState({
    name: '',
    avatarUrl: '',
    bio: '',
    theme: 'gradient',
    backgroundColor: '#6366f1',
    textColor: '#ffffff',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentAccount) {
      setError('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create transaction
      const tx = createProfileTransaction(formData);

      // Execute with sponsorship if available
      const result = await executeTransaction({
        transaction: tx,
        senderAddress: currentAccount.address,
        signAndExecute,
        useSponsorship: true,
      });

      console.log('Profile created:', result);

      // Navigate to profile page
      // Extract profile ID from transaction result
      const profileId = result.effects?.created?.[0]?.reference?.objectId;
      if (profileId) {
        navigate(`/profile/${profileId}`);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      setError(error.message || 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  if (!currentAccount) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Wallet Not Connected</h2>
          <p className="text-gray-300 mb-6">
            Please connect your wallet to create a profile
          </p>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 py-12">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="btn btn-secondary mb-6"
        >
          ← Back
        </button>

        <div className="card p-8">
          <h1 className="text-4xl font-bold mb-2">Create Your Profile</h1>
          <p className="text-gray-300 mb-8">
            Set up your on-chain LinkTree profile
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Username *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input"
                placeholder="your-username"
                required
                pattern="[a-zA-Z0-9_-]+"
                title="Only letters, numbers, underscores and hyphens"
              />
              <p className="text-sm text-gray-400 mt-1">
                This will be your unique profile name
              </p>
            </div>

            {/* Avatar URL */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Avatar URL
              </label>
              <input
                type="url"
                name="avatarUrl"
                value={formData.avatarUrl}
                onChange={handleChange}
                className="input"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="input min-h-[100px]"
                placeholder="Tell us about yourself..."
                maxLength={200}
              />
              <p className="text-sm text-gray-400 mt-1">
                {formData.bio.length}/200 characters
              </p>
            </div>

            {/* Theme */}
            <div>
              <label className="block text-sm font-medium mb-2">Theme</label>
              <select
                name="theme"
                value={formData.theme}
                onChange={handleChange}
                className="input"
              >
                {THEMES.map((theme) => (
                  <option key={theme.value} value={theme.value}>
                    {theme.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Background Color
                </label>
                <input
                  type="color"
                  name="backgroundColor"
                  value={formData.backgroundColor}
                  onChange={handleChange}
                  className="w-full h-12 rounded-xl cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Text Color
                </label>
                <input
                  type="color"
                  name="textColor"
                  value={formData.textColor}
                  onChange={handleChange}
                  className="w-full h-12 rounded-xl cursor-pointer"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500 rounded-xl p-4">
                <p className="text-red-200">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full text-lg"
            >
              {loading ? 'Creating...' : 'Create Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

