import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { getProfileById } from '../utils/sui';
import { THEMES } from '../config/constants';

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentAccount = useCurrentAccount();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProfile();
  }, [id]);

  const loadProfile = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await getProfileById(id);
      setProfile(data);
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Profile not found');
    } finally {
      setLoading(false);
    }
  };

  const isOwner = currentAccount && profile && currentAccount.address === profile.owner;

  const theme = THEMES.find((t) => t.value === profile?.theme) || THEMES[0];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Profile Not Found</h2>
          <p className="text-gray-300 mb-6">{error || 'This profile does not exist'}</p>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-4 py-12"
      style={{
        background: `linear-gradient(135deg, ${profile.backgroundColor}, ${profile.backgroundColor}dd)`,
      }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate('/')}
            className="btn btn-secondary"
            style={{ color: profile.textColor }}
          >
            ← Back
          </button>
          {isOwner && (
            <button
              onClick={() => navigate(`/edit/${id}`)}
              className="btn btn-primary"
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* Profile Card */}
        <div className="card p-8 mb-8 text-center">
          {/* Avatar */}
          {profile.avatarUrl && (
            <div className="mb-6">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white/20"
              />
            </div>
          )}

          {/* Name */}
          <h1 className="text-4xl font-bold mb-2" style={{ color: profile.textColor }}>
            {profile.name}
          </h1>

          {/* Bio */}
          {profile.bio && (
            <p className="text-lg mb-4" style={{ color: profile.textColor, opacity: 0.9 }}>
              {profile.bio}
            </p>
          )}

          {/* Profile Info */}
          <div className="text-sm" style={{ color: profile.textColor, opacity: 0.7 }}>
            <p>Theme: {theme.label}</p>
            <p className="mt-1">Links: {profile.links.length}</p>
          </div>
        </div>

        {/* Links */}
        <div className="space-y-4">
          {profile.links.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-gray-400">No links added yet</p>
              {isOwner && (
                <button
                  onClick={() => navigate(`/edit/${id}`)}
                  className="btn btn-primary mt-4"
                >
                  Add Links
                </button>
              )}
            </div>
          ) : (
            profile.links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-card block"
                style={{
                  backgroundColor: `${profile.backgroundColor}cc`,
                  borderColor: `${profile.textColor}33`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {link.icon && <span className="text-2xl">{link.icon}</span>}
                    <span
                      className="text-lg font-medium"
                      style={{ color: profile.textColor }}
                    >
                      {link.label}
                    </span>
                  </div>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke={profile.textColor}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </a>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm" style={{ color: profile.textColor, opacity: 0.6 }}>
          <p>Powered by Sui LinkTree</p>
          <p className="mt-1">On-Chain • Decentralized • Immutable</p>
        </div>
      </div>
    </div>
  );
}

