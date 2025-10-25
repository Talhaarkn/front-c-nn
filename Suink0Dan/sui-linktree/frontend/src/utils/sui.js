import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { NETWORK, PACKAGE_ID, REGISTRY_ID } from '../config/constants';

export const suiClient = new SuiClient({
  url: `https://fullnode.${NETWORK}.sui.io:443`,
});

/**
 * Fetch profile by object ID
 */
export async function getProfileById(profileId) {
  try {
    const object = await suiClient.getObject({
      id: profileId,
      options: {
        showContent: true,
        showOwner: true,
      },
    });

    if (!object.data) {
      throw new Error('Profile not found');
    }

    return parseProfileData(object.data);
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
}

/**
 * Fetch profile by name using registry
 */
export async function getProfileByName(name) {
  try {
    // Query dynamic field from registry
    const dynamicField = await suiClient.getDynamicFieldObject({
      parentId: REGISTRY_ID,
      name: {
        type: '0x1::string::String',
        value: name,
      },
    });

    if (!dynamicField.data) {
      throw new Error('Profile not found');
    }

    const profileId = dynamicField.data.content.fields.value;
    return getProfileById(profileId);
  } catch (error) {
    console.error('Error fetching profile by name:', error);
    throw error;
  }
}

/**
 * Parse profile data from Sui object
 */
function parseProfileData(data) {
  const fields = data.content.fields;
  
  return {
    id: data.objectId,
    owner: fields.owner,
    name: fields.name,
    avatarUrl: fields.avatar_url,
    bio: fields.bio,
    links: fields.links || [],
    theme: fields.theme,
    backgroundColor: fields.background_color,
    textColor: fields.text_color,
    createdAt: fields.created_at,
    updatedAt: fields.updated_at,
  };
}

/**
 * Create transaction for new profile
 */
export function createProfileTransaction({
  name,
  avatarUrl,
  bio,
  theme,
  backgroundColor,
  textColor,
}) {
  const tx = new Transaction();
  
  tx.moveCall({
    target: `${PACKAGE_ID}::profile::create_profile`,
    arguments: [
      tx.object(REGISTRY_ID),
      tx.pure.string(name),
      tx.pure.string(avatarUrl),
      tx.pure.string(bio),
      tx.pure.string(theme),
      tx.pure.string(backgroundColor),
      tx.pure.string(textColor),
    ],
  });

  return tx;
}

/**
 * Create transaction to update profile
 */
export function updateProfileTransaction({
  profileId,
  avatarUrl,
  bio,
  theme,
  backgroundColor,
  textColor,
}) {
  const tx = new Transaction();
  
  tx.moveCall({
    target: `${PACKAGE_ID}::profile::update_profile`,
    arguments: [
      tx.object(profileId),
      tx.pure.string(avatarUrl),
      tx.pure.string(bio),
      tx.pure.string(theme),
      tx.pure.string(backgroundColor),
      tx.pure.string(textColor),
    ],
  });

  return tx;
}

/**
 * Create transaction to add link
 */
export function addLinkTransaction({ profileId, label, url, icon }) {
  const tx = new Transaction();
  
  tx.moveCall({
    target: `${PACKAGE_ID}::profile::add_link`,
    arguments: [
      tx.object(profileId),
      tx.pure.string(label),
      tx.pure.string(url),
      tx.pure.string(icon),
    ],
  });

  return tx;
}

/**
 * Create transaction to remove link
 */
export function removeLinkTransaction({ profileId, index }) {
  const tx = new Transaction();
  
  tx.moveCall({
    target: `${PACKAGE_ID}::profile::remove_link`,
    arguments: [
      tx.object(profileId),
      tx.pure.u64(index),
    ],
  });

  return tx;
}

/**
 * Create transaction to update link
 */
export function updateLinkTransaction({ profileId, index, label, url, icon }) {
  const tx = new Transaction();
  
  tx.moveCall({
    target: `${PACKAGE_ID}::profile::update_link`,
    arguments: [
      tx.object(profileId),
      tx.pure.u64(index),
      tx.pure.string(label),
      tx.pure.string(url),
      tx.pure.string(icon),
    ],
  });

  return tx;
}

/**
 * Get all profiles owned by an address
 */
export async function getProfilesByOwner(ownerAddress) {
  try {
    const objects = await suiClient.getOwnedObjects({
      owner: ownerAddress,
      filter: {
        StructType: `${PACKAGE_ID}::profile::LinkTreeProfile`,
      },
      options: {
        showContent: true,
      },
    });

    return objects.data.map((obj) => parseProfileData(obj.data));
  } catch (error) {
    console.error('Error fetching profiles by owner:', error);
    return [];
  }
}

