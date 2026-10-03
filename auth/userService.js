/**
 * Epic Think AI - Client User Profile & Account Management Service
 * 
 * Manages:
 * 1. Persistent user profile state with local memory cache
 * 2. Authenticated REST calls to /api/user/* endpoints
 * 3. Real avatar photo uploads with validation & preview
 * 4. Deterministic initial-based avatar generation with persistent hues
 * 5. Real-time WebSocket profile sync across open tabs & devices
 * 6. Debounced username availability checks
 */

let cachedProfile = null;
const listeners = new Set();

/**
 * Safely retrieve authentication token without breaking non-browser environments
 */
async function getAuthToken() {
  if (typeof window !== 'undefined') {
    try {
      const auth = await import('./authService.js');
      if (auth && typeof auth.getIdToken === 'function') {
        return await auth.getIdToken();
      }
    } catch (_) {}
  }
  return null;
}

/**
 * Generate a deterministic HSL color palette based on user identity
 */
export function getDeterministicAvatarStyle(identifier = 'user') {
  let hash = 0;
  const str = String(identifier || 'user');
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  const hue2 = (hue + 40) % 360;
  return {
    background: `linear-gradient(135deg, hsl(${hue}, 65%, 42%), hsl(${hue2}, 75%, 32%))`,
    color: '#ffffff',
    border: `1px solid hsl(${hue}, 70%, 60%, 0.35)`
  };
}

/**
 * Render standard circular avatar HTML for any given size (32, 40, 48, 64, 96, 128)
 */
export function renderAvatarHtml(profile, size = 36, customClass = '') {
  const safeSize = parseInt(size, 10) || 36;
  const name = profile?.displayName || `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim() || 'User';
  const photoUrl = profile?.profilePhotoUrl;

  if (photoUrl) {
    return `<div class="avatar-circle-wrapper ${customClass}" style="width:${safeSize}px;height:${safeSize}px;min-width:${safeSize}px;min-height:${safeSize}px;border-radius:50%;overflow:hidden;position:relative;display:inline-flex;align-items:center;justify-content:center;box-shadow:0 1px 3px rgba(0,0,0,0.25);">
      <img src="${photoUrl}" alt="${name.replace(/"/g, '&quot;')}" style="width:100%;height:100%;object-fit:cover;display:block;" onerror="this.parentElement.innerHTML='${computeInitials(profile)}'"/>
    </div>`;
  }

  const initials = computeInitials(profile);
  const style = getDeterministicAvatarStyle(profile?.firebaseUid || profile?.username || name);
  const fontSize = Math.max(10, Math.round(safeSize * 0.4));

  return `<div class="avatar-circle-wrapper avatar-initials ${customClass}" style="width:${safeSize}px;height:${safeSize}px;min-width:${safeSize}px;min-height:${safeSize}px;border-radius:50%;background:${style.background};color:${style.color};border:${style.border};font-size:${fontSize}px;font-weight:600;display:inline-flex;align-items:center;justify-content:center;text-transform:uppercase;user-select:none;box-shadow:0 1px 3px rgba(0,0,0,0.25);">
    ${initials}
  </div>`;
}

/**
 * Compute initials from profile
 */
export function computeInitials(profile) {
  if (profile?.firstName && profile?.lastName) {
    return `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase();
  }
  if (profile?.firstName) {
    return profile.firstName.slice(0, 2).toUpperCase();
  }
  if (profile?.displayName) {
    const parts = profile.displayName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }
  if (profile?.email) {
    return profile.email.slice(0, 2).toUpperCase();
  }
  return 'ET';
}

/**
 * Broadcast profile state change to local subscribers
 */
function notifySubscribers(profile) {
  for (const listener of listeners) {
    try {
      listener(profile);
    } catch (e) {
      console.warn('[UserService:Notify]', e);
    }
  }
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    window.dispatchEvent(new CustomEvent('epic_profile_changed', { detail: profile }));
  }
}

export const UserService = {
  /**
   * Subscribe to profile state changes
   */
  subscribe(callback) {
    if (typeof callback === 'function') {
      listeners.add(callback);
      if (cachedProfile) callback(cachedProfile);
    }
    return () => listeners.delete(callback);
  },

  /**
   * Get currently cached user profile
   */
  getProfile() {
    return cachedProfile;
  },

  /**
   * Set cached user profile manually
   */
  setProfile(profile) {
    cachedProfile = profile;
    notifySubscribers(cachedProfile);
  },

  /**
   * Clear cached user profile on signout
   */
  clearCache() {
    cachedProfile = null;
    notifySubscribers(null);
  },

  /**
   * Fetch canonical profile from backend
   */
  async fetchProfile(forceRefresh = false) {
    if (cachedProfile && !forceRefresh) {
      return cachedProfile;
    }

    const token = await getAuthToken();
    if (!token) return null;

    try {
      const res = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error(`Profile request returned HTTP ${res.status}`);
      }

      const json = await res.json();
      if (json.success && json.data) {
        cachedProfile = json.data;
        notifySubscribers(cachedProfile);
        return cachedProfile;
      }
      return null;
    } catch (err) {
      console.warn('[UserService:Fetch]', err.message);
      return cachedProfile;
    }
  },

  /**
   * Update profile fields (firstName, lastName, displayName, username, bio, etc.)
   */
  async updateProfile(fields) {
    const token = await getAuthToken();
    if (!token) throw new Error('Authentication required.');

    const res = await fetch('/api/user/profile', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(fields)
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error?.message || 'Failed to update profile.');
    }

    cachedProfile = json.data;
    notifySubscribers(cachedProfile);
    return cachedProfile;
  },

  /**
   * Upload and save a new profile avatar photo
   */
  async uploadAvatar(file) {
    const token = await getAuthToken();
    if (!token) throw new Error('Authentication required.');

    const formData = new FormData();
    formData.append('avatar', file);

    const res = await fetch('/api/user/profile/avatar', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error?.message || 'Failed to upload avatar photo.');
    }

    cachedProfile = json.data.profile;
    notifySubscribers(cachedProfile);
    return json.data;
  },

  /**
   * Remove current profile photo
   */
  async deleteAvatar() {
    const token = await getAuthToken();
    if (!token) throw new Error('Authentication required.');

    const res = await fetch('/api/user/profile/avatar', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error?.message || 'Failed to remove avatar photo.');
    }

    cachedProfile = json.data;
    notifySubscribers(cachedProfile);
    return cachedProfile;
  },

  /**
   * Update UI and engine preferences
   */
  async updatePreferences(preferences) {
    const token = await getAuthToken();
    if (!token) throw new Error('Authentication required.');

    const res = await fetch('/api/user/preferences', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(preferences)
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error?.message || 'Failed to update preferences.');
    }

    if (cachedProfile) {
      cachedProfile.preferences = { ...(cachedProfile.preferences || {}), ...json.data };
      notifySubscribers(cachedProfile);
    }
    return json.data;
  },

  /**
   * Update AI personalization instructions
   */
  async updatePersonalization(personalization) {
    const token = await getAuthToken();
    if (!token) throw new Error('Authentication required.');

    const res = await fetch('/api/user/personalization', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(personalization)
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error?.message || 'Failed to update personalization.');
    }

    if (cachedProfile) {
      cachedProfile.personalization = { ...(cachedProfile.personalization || {}), ...json.data };
      notifySubscribers(cachedProfile);
    }
    return json.data;
  },

  /**
   * Check username availability
   */
  async checkUsername(username) {
    const token = await getAuthToken();
    if (!token) return { available: false, reason: 'Not authenticated' };

    const res = await fetch('/api/user/username/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ username })
    });

    const json = await res.json();
    return json.data || { available: false, reason: 'Check failed' };
  },

  /**
   * Fetch live MongoDB usage statistics
   */
  async fetchUsage() {
    const token = await getAuthToken();
    if (!token) return null;

    const res = await fetch('/api/user/usage', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const json = await res.json();
    return json.data || null;
  },

  /**
   * Fetch active session device metadata
   */
  async fetchSessions() {
    const token = await getAuthToken();
    if (!token) return [];

    const res = await fetch('/api/user/sessions', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const json = await res.json();
    return json.data?.sessions || [];
  },

  /**
   * Sign out all other active sessions
   */
  async logoutAllSessions() {
    const token = await getAuthToken();
    if (!token) throw new Error('Authentication required.');

    const res = await fetch('/api/user/logout-all', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const json = await res.json();
    return json.success;
  },

  /**
   * Delete account and all user data
   */
  async deleteAccount() {
    const token = await getAuthToken();
    if (!token) throw new Error('Authentication required.');

    const res = await fetch('/api/user/account', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ confirmation: 'DELETE' })
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error?.message || 'Failed to delete account.');
    }
    cachedProfile = null;
    return json;
  },

  /**
   * Receive real-time profile sync event from WebSocket
   */
  handleRealtimeSync(event) {
    if (event.type === 'profile_updated' && event.profile) {
      cachedProfile = event.profile;
      notifySubscribers(cachedProfile);
    }
  }
};
