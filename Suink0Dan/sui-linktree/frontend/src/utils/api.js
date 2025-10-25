const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

// Simple API call helper
export async function makeApiCall(endpoint, data) {
  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  return response.json();
}

// Profile operations - Sponsored Transactions
export async function createProfileAPI(sender, packageId, name, avatarUrl, bio, theme, backgroundColor, textColor) {
  return makeApiCall('/api/create-profile', {
    sender,
    packageId,
    name,
    avatarUrl,
    bio,
    theme,
    backgroundColor,
    textColor,
  });
}

export async function updateProfileAPI(sender, packageId, profileId, avatarUrl, bio, theme, backgroundColor, textColor) {
  return makeApiCall('/api/update-profile', {
    sender,
    packageId,
    profileId,
    avatarUrl,
    bio,
    theme,
    backgroundColor,
    textColor,
  });
}

export async function addLinkAPI(sender, packageId, profileId, label, url) {
  return makeApiCall('/api/add-link', {
    sender,
    packageId,
    profileId,
    label,
    url,
  });
}

export async function removeLinkAPI(sender, packageId, profileId, linkIndex) {
  return makeApiCall('/api/remove-link', {
    sender,
    packageId,
    profileId,
    linkIndex,
  });
}

export async function executeTransactionAPI(digest, signature) {
  return makeApiCall('/api/execute-transaction', { digest, signature });
}

