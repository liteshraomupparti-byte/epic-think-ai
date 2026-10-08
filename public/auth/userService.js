/**
 * Epic Think AI - Client User Profile & Account Management Service
 * 
 * Manages:
 * 1. Persistent user profile state with local memory cache
 * 2. Authenticated REST calls to /api/user/* endpoints with dynamic API base resolution
 * 3. Real avatar photo uploads with client-side optimization, validation & instant preview
 * 4. Deterministic initial-based avatar generation with persistent hues
 * 5. Real-time WebSocket profile sync across open tabs & devices
 * 6. Debounced username availability checks
 */

let cachedProfile = null;
const listeners = new Set();

/**
 * Determine API Base URL across local dev, hosted, and live-server environments
 */
export const getApiBase = () => {
  if (typeof window !== 'undefined') {
    if (window.location.protocol === 'file:' || !window.location.hostname) {
      return 'http://localhost:3001';
    }
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') return '';
    if (window.location.port === '3001') return '';
  }
  return 'http://localhost:3001';
};

/**
 * Safely resolve avatar URLs to ensure absolute origin resolution across ports
 */
export function resolveAvatarUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://')
  ) {
    return trimmed;
  }
  if (trimmed.startsWith('/')) {
    const base = getApiBase();
    return base ? `${base}${trimmed}` : trimmed;
  }
  return trimmed;
}

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
 * Render standard circular avatar HTML for any given size (30, 32, 34, 40, 48, 64, 76, 96, 128)
 */
export function renderAvatarHtml(profile, size = 36, customClass = '') {
  const safeSize = parseInt(size, 10) || 36;
  const name = profile?.displayName || `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim() || 'User';
  const rawPhoto = profile?.profilePhotoUrl;
  const photoUrl = resolveAvatarUrl(rawPhoto);
  const initials = computeInitials(profile);
  const style = getDeterministicAvatarStyle(profile?.firebaseUid || profile?.username || name);
  const fontSize = Math.max(10, Math.round(safeSize * 0.4));

  if (photoUrl) {
    return `<div class="avatar-circle-wrapper ${customClass}" style="width:${safeSize}px;height:${safeSize}px;min-width:${safeSize}px;min-height:${safeSize}px;border-radius:50%;overflow:hidden;position:relative;display:inline-flex;align-items:center;justify-content:center;box-shadow:0 1px 3px rgba(0,0,0,0.25);background:${style.background};">
      <img src="${photoUrl}" alt="${name.replace(/"/g, '&quot;')}" style="width:100%;height:100%;object-fit:cover;display:block;position:relative;z-index:1;" onerror="this.style.display='none';if(this.nextElementSibling)this.nextElementSibling.style.display='flex';"/>
      <span class="avatar-fallback-initials" style="display:none;width:100%;height:100%;color:${style.color};font-size:${fontSize}px;font-weight:600;align-items:center;justify-content:center;text-transform:uppercase;user-select:none;position:absolute;top:0;left:0;z-index:0;">${initials}</span>
    </div>`;
  }

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
 * Client-side high-fidelity square crop & downscale helper
 */
export async function optimizeImageFile(file, maxDimension = 512, quality = 0.9) {
  return new Promise((resolve, reject) => {
    if (!file || typeof FileReader === 'undefined') {
      return resolve(null);
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = () => {
      const dataUrl = reader.result;
      if (typeof Image === 'undefined' || typeof document === 'undefined') {
        return resolve(dataUrl);
      }
      const img = new Image();
      img.onerror = () => resolve(dataUrl);
      img.onload = () => {
        try {
          const width = img.naturalWidth || img.width;
          const height = img.naturalHeight || img.height;
          const minSide = Math.min(width, height);
          const startX = (width - minSide) / 2;
          const startY = (height - minSide) / 2;
          const targetSize = Math.min(maxDimension, minSide);

          const canvas = document.createElement('canvas');
          canvas.width = targetSize;
          canvas.height = targetSize;
          const ctx = canvas.getContext('2d');
          if (!ctx) return resolve(dataUrl);

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, startX, startY, minSide, minSide, 0, 0, targetSize, targetSize);

          try {
            const webpData = canvas.toDataURL('image/webp', quality);
            if (webpData && webpData.startsWith('data:image/webp')) {
              return resolve(webpData);
            }
          } catch (_) {}

          const jpegData = canvas.toDataURL('image/jpeg', quality);
          resolve(jpegData || dataUrl);
        } catch (_) {
          resolve(dataUrl);
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
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
      const res = await fetch(`${getApiBase()}/api/user/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error(`Profile request returned HTTP ${res.status}`);
      }

      const json = await res.json();
      if (json.success && (json.data || json.profile)) {
        cachedProfile = json.data || json.profile;
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

    const res = await fetch(`${getApiBase()}/api/user/profile`, {
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

    cachedProfile = json.data || json.profile;
    notifySubscribers(cachedProfile);
    return cachedProfile;
  },

  /**
   * Upload and save a new profile avatar photo
   */
  async uploadAvatar(file, customDataUrl = null) {
    const token = await getAuthToken();
    if (!token) throw new Error('Authentication required.');

    // Prepare optimized square-cropped data URL if not provided
    let dataUrl = customDataUrl;
    if (!dataUrl && typeof window !== 'undefined' && file instanceof File) {
      try {
        dataUrl = await optimizeImageFile(file);
      } catch (e) {
        console.warn('[Avatar:Optimize]', e);
      }
    }

    const formData = new FormData();
    formData.append('avatar', file);
    if (dataUrl) {
      formData.append('avatarDataUrl', dataUrl);
    }

    let res;
    let json;
    try {
      res = await fetch(`${getApiBase()}/api/user/profile/avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      json = await res.json();
    } catch (networkErr) {
      console.warn('[Avatar:Upload Network Error]', networkErr);
      // Offline / network fallback: persist optimized dataUrl locally so user never loses their avatar
      if (dataUrl) {
        if (!cachedProfile) cachedProfile = {};
        cachedProfile.profilePhotoUrl = dataUrl;
        notifySubscribers(cachedProfile);
        try {
          const uid = cachedProfile.firebaseUid || 'user';
          localStorage.setItem(`eta_cached_avatar_${uid}`, dataUrl);
        } catch (_) {}
        return {
          success: true,
          profile: cachedProfile,
          profilePhotoUrl: dataUrl,
          offlineSaved: true
        };
      }
      throw new Error('Network connection error. Failed to reach server.');
    }

    if (!res.ok || !json.success) {
      throw new Error(json.error?.message || 'Failed to upload avatar photo.');
    }

    cachedProfile = json.data?.profile || json.profile;
    if (cachedProfile && dataUrl) {
      try {
        const uid = cachedProfile.firebaseUid || 'user';
        localStorage.setItem(`eta_cached_avatar_${uid}`, dataUrl);
      } catch (_) {}
    }

    notifySubscribers(cachedProfile);
    return json.data || json;
  },

  /**
   * Remove current profile photo
   */
  async deleteAvatar() {
    const token = await getAuthToken();
    if (!token) throw new Error('Authentication required.');

    let res;
    let json;
    try {
      res = await fetch(`${getApiBase()}/api/user/profile/avatar`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      json = await res.json();
    } catch (networkErr) {
      console.warn('[Avatar:Delete Network Error]', networkErr);
    }

    if (cachedProfile) {
      cachedProfile.profilePhotoUrl = null;
      try {
        const uid = cachedProfile.firebaseUid || 'user';
        localStorage.removeItem(`eta_cached_avatar_${uid}`);
      } catch (_) {}
    }

    if (json && json.success) {
      cachedProfile = json.data || json.profile || cachedProfile;
    }

    notifySubscribers(cachedProfile);
    return cachedProfile;
  },

  /**
   * Update UI and engine preferences
   */
  async updatePreferences(preferences) {
    const token = await getAuthToken();
    if (!token) throw new Error('Authentication required.');

    const res = await fetch(`${getApiBase()}/api/user/preferences`, {
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

    const res = await fetch(`${getApiBase()}/api/user/personalization`, {
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

    const res = await fetch(`${getApiBase()}/api/user/username/check`, {
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

    const res = await fetch(`${getApiBase()}/api/user/usage`, {
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

    const res = await fetch(`${getApiBase()}/api/user/sessions`, {
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

    const res = await fetch(`${getApiBase()}/api/user/logout-all`, {
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

    const res = await fetch(`${getApiBase()}/api/user/account`, {
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
