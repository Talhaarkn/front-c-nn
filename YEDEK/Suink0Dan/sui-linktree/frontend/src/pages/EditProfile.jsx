import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import {
  getProfileById,
  updateProfileTransaction,
  addLinkTransaction,
  removeLinkTransaction,
  updateLinkTransaction,
} from '../utils/sui';
import { executeTransaction } from '../utils/sponsored';
import { THEMES } from '../config/constants';

export default function EditProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    avatarUrl: '',
    bio: '',
    theme: 'gradient',
    backgroundColor: '#6366f1',
    textColor: '#ffffff',
  });

  const [newLink, setNewLink] = useState({
    label: '',
    url: '',
    icon: '',
  });

  const [editingLink, setEditingLink] = useState(null);

  useEffect(() => {
    loadProfile();
  }, [id]);

  const loadProfile = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await getProfileById(id);
      setProfile(data);
      setFormData({
        avatarUrl: data.avatarUrl,
        bio: data.bio,
        theme: data.theme,
        backgroundColor: data.backgroundColor,
        textColor: data.textColor,
      });
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Profile not found');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    if (!currentAccount || currentAccount.address !== profile.owner) {
      setError('You are not the owner of this profile');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const tx = updateProfileTransaction({
        profileId: id,
        ...formData,
      });

      await executeTransaction({
        transaction: tx,
        senderAddress: currentAccount.address,
        signAndExecute,
        useSponsorship: true,
      });

      alert('Profile updated successfully!');
      await loadProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAddLink = async (e) => {
    e.preventDefault();

    if (!newLink.label || !newLink.url) {
      setError('Please fill in label and URL');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const tx = addLinkTransaction({
        profileId: id,
        ...newLink,
      });

      await executeTransaction({
        transaction: tx,
        senderAddress: currentAccount.address,
        signAndExecute,
        useSponsorship: true,
      });

      setNewLink({ label: '', url: '', icon: '' });
      alert('Link added successfully!');
      await loadProfile();
    } catch (error) {
      console.error('Error adding link:', error);
      setError(error.message || 'Failed to add link');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveLink = async (index) => {
    if (!confirm('Are you sure you want to remove this link?')) return;

    setSaving(true);
    setError('');

    try {
      const tx = removeLinkTransaction({
        profileId: id,
        index,
      });

      await executeTransaction({
        transaction: tx,
        senderAddress: currentAccount.address,
        signAndExecute,
        useSponsorship: true,
      });

      alert('Link removed successfully!');
      await loadProfile();
    } catch (error) {
      console.error('Error removing link:', error);
      setError(error.message || 'Failed to remove link');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateLink = async (index) => {
    if (!editingLink) return;

    setSaving(true);
    setError('');

    try {
      const tx = updateLinkTransaction({
        profileId: id,
        index,
        ...editingLink,
      });

      await executeTransaction({
        transaction: tx,
        senderAddress: currentAccount.address,
        signAndExecute,
        useSponsorship: true,
      });

      setEditingLink(null);
      alert('Link updated successfully!');
      await loadProfile();
    } catch (error) {
      console.error('Error updating link:', error);
      setError(error.message || 'Failed to update link');
    } finally {
      setSaving(false);
    }
  };

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

  if (!profile || (currentAccount && currentAccount.address !== profile.owner)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-300 mb-6">
            You don't have permission to edit this profile
          </p>
          <button onClick={() => navigate(`/profile/${id}`)} className="btn btn-primary">
            View Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => navigate(`/profile/${id}`)} className="btn btn-secondary">
            ← Back to Profile
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Profile Settings */}
          <div className="card p-8">
            <h2 className="text-3xl font-bold mb-6">Profile Settings</h2>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Avatar URL</label>
                <input
                  type="url"
                  name="avatarUrl"
                  value={formData.avatarUrl}
                  onChange={handleChange}
                  className="input"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

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
                  <label className="block text-sm font-medium mb-2">Text Color</label>
                  <input
                    type="color"
                    name="textColor"
                    value={formData.textColor}
                    onChange={handleChange}
                    className="w-full h-12 rounded-xl cursor-pointer"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary w-full"
              >
                {saving ? 'Saving...' : 'Update Profile'}
              </button>
            </form>
          </div>

          {/* Links Management */}
          <div className="space-y-8">
            {/* Add New Link */}
            <div className="card p-8">
              <h2 className="text-3xl font-bold mb-6">Add New Link</h2>

              <form onSubmit={handleAddLink} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Label *</label>
                  <input
                    type="text"
                    value={newLink.label}
                    onChange={(e) =>
                      setNewLink({ ...newLink, label: e.target.value })
                    }
                    className="input"
                    placeholder="My Website"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">URL *</label>
                  <input
                    type="url"
                    value={newLink.url}
                    onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                    className="input"
                    placeholder="https://example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Icon (emoji)
                  </label>
                  <input
                    type="text"
                    value={newLink.icon}
                    onChange={(e) =>
                      setNewLink({ ...newLink, icon: e.target.value })
                    }
                    className="input"
                    placeholder="🌐"
                    maxLength={2}
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary w-full"
                >
                  {saving ? 'Adding...' : 'Add Link'}
                </button>
              </form>
            </div>

            {/* Existing Links */}
            <div className="card p-8">
              <h2 className="text-3xl font-bold mb-6">
                Your Links ({profile.links.length})
              </h2>

              <div className="space-y-4">
                {profile.links.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No links yet</p>
                ) : (
                  profile.links.map((link, index) => (
                    <div key={index} className="bg-white/5 rounded-xl p-4">
                      {editingLink && editingLink.index === index ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={editingLink.label}
                            onChange={(e) =>
                              setEditingLink({ ...editingLink, label: e.target.value })
                            }
                            className="input"
                            placeholder="Label"
                          />
                          <input
                            type="url"
                            value={editingLink.url}
                            onChange={(e) =>
                              setEditingLink({ ...editingLink, url: e.target.value })
                            }
                            className="input"
                            placeholder="URL"
                          />
                          <input
                            type="text"
                            value={editingLink.icon}
                            onChange={(e) =>
                              setEditingLink({ ...editingLink, icon: e.target.value })
                            }
                            className="input"
                            placeholder="Icon"
                            maxLength={2}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdateLink(index)}
                              disabled={saving}
                              className="btn btn-primary flex-1"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingLink(null)}
                              className="btn btn-secondary flex-1"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {link.icon && (
                              <span className="text-2xl">{link.icon}</span>
                            )}
                            <div>
                              <p className="font-medium">{link.label}</p>
                              <p className="text-sm text-gray-400 truncate">
                                {link.url}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                setEditingLink({ ...link, index })
                              }
                              className="text-blue-400 hover:text-blue-300 px-3 py-1"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleRemoveLink(index)}
                              disabled={saving}
                              className="text-red-400 hover:text-red-300 px-3 py-1"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="card p-4 bg-red-500/20 border-red-500 mt-4">
            <p className="text-red-200">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

