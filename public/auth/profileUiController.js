/**
 * Epic Think AI - Profile UI Controller & Settings Manager
 * 
 * Production-grade controller for:
 * 1. Sidebar user profile button & account popup menu
 * 2. Multi-tab Settings dialog (Profile, Account, Personalization, Appearance, AI, Apps, Security, Usage, Danger Zone)
 * 3. Real avatar photo upload, live crop/preview, and removal
 * 4. Debounced username availability validation
 * 5. Dynamic profile completion gauge
 * 6. Multi-step onboarding experience for new users
 * 7. Real-time profile state synchronization across tabs & devices
 * 8. GDPR account deletion with strict confirmation
 */

import { UserService, renderAvatarHtml } from './userService.js';
import { PluginService } from './pluginService.js';

let initialized = false;
let currentProfile = null;
let currentFirebaseUser = null;
let usernameCheckTimer = null;
let configCallbacks = {
  onSignOut: null,
  showToast: null
};

// DOM helper
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

/**
 * Calculate profile completion percentage based on essential fields
 */
export function calculateProfileCompletion(profile) {
  if (!profile) return { percentage: 0, items: [] };

  const checks = [
    { label: 'Name', done: Boolean(profile.firstName && profile.lastName), weight: 25 },
    { label: 'Username', done: Boolean(profile.username && profile.username.length >= 3), weight: 25 },
    { label: 'Profile Photo', done: Boolean(profile.profilePhotoUrl), weight: 20 },
    { label: 'Bio', done: Boolean(profile.bio && profile.bio.trim().length > 5), weight: 10 },
    { label: 'AI Custom Instructions', done: Boolean(profile.personalization?.customInstructions || profile.personalization?.aboutUser), weight: 10 },
    { label: 'Preferences', done: Boolean(profile.preferences?.responseStyle), weight: 10 }
  ];

  let percentage = 0;
  for (const c of checks) {
    if (c.done) percentage += c.weight;
  }
  return { percentage: Math.min(100, percentage), checks };
}

export const ProfileUI = {
  /**
   * Initialize UI listeners and bind elements
   */
  init(callbacks = {}) {
    if (initialized) return;
    configCallbacks = { ...configCallbacks, ...callbacks };

    this.bindSidebarProfile();
    this.bindSettingsModal();
    this.bindOnboardingModal();
    this.bindDeleteAccountModal();

    // Listen to profile updates (local or via WebSocket)
    UserService.subscribe((profile) => {
      currentProfile = profile;
      this.renderProfileUI(profile);
    });

    initialized = true;
  },

  /**
   * Handle user login
   */
  async onUserAuthenticated(firebaseUser, profile = null) {
    currentFirebaseUser = firebaseUser;
    currentProfile = profile || (await UserService.fetchProfile(true));
    this.renderProfileUI(currentProfile);

    // If onboarding not completed, launch onboarding modal
    if (currentProfile && currentProfile.onboardingCompleted !== true) {
      this.openOnboarding(currentProfile);
    }
  },

  /**
   * Handle user sign out
   */
  onUserSignedOut() {
    currentFirebaseUser = null;
    currentProfile = null;
    this.closeDropdown();
    this.closeSettings();
    this.closeOnboarding();
  },

  /**
   * Render updated profile in sidebar, dropdown, and settings
   */
  renderProfileUI(profile) {
    const user = currentFirebaseUser;
    const p = profile || {};

    const displayName = p.displayName || `${p.firstName || ''} ${p.lastName || ''}`.trim() || user?.displayName || 'Epic Thinker';
    const email = p.email || user?.email || 'Authenticated User';
    const username = p.username ? `@${p.username}` : '@thinker';

    // 1. Sidebar Profile Button
    const avatarEl = $('#userAvatar');
    const nameEl = $('#userNameLabel');
    const handleEl = $('#userHandleLabel');

    if (avatarEl) {
      avatarEl.innerHTML = renderAvatarHtml(p, 34);
    }
    if (nameEl) nameEl.textContent = displayName;
    if (handleEl) handleEl.textContent = username;


    // 3. Settings Header & Profile Fields
    const settingsAvatarEl = $('#settingsAvatarPreview');
    const completionFill = $('#settingsCompletionFill');
    const completionText = $('#settingsCompletionText');

    if (settingsAvatarEl) {
      settingsAvatarEl.innerHTML = renderAvatarHtml(p, 76) + `
        <div class="avatar-preview-overlay">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
            <circle cx="12" cy="13" r="4"></circle>
          </svg>
          <span style="font-size:9.5px;margin-top:2px;font-weight:600;letter-spacing:0.4px;">CHANGE</span>
        </div>`;
    }

    const completion = calculateProfileCompletion(p);
    if (completionFill) completionFill.style.width = `${completion.percentage}%`;
    if (completionText) completionText.textContent = `${completion.percentage}% Complete`;

    // Populate Settings Form Fields
    const fFirst = $('#settingsFirstName');
    const fLast = $('#settingsLastName');
    const fDisplay = $('#settingsDisplayName');
    const fUsername = $('#settingsUsername');
    const fBio = $('#settingsBio');
    const fEmail = $('#settingsAccountEmail');
    const fCreated = $('#settingsAccountCreated');
    const fProvider = $('#settingsAccountProvider');

    if (fFirst && document.activeElement !== fFirst) fFirst.value = p.firstName || '';
    if (fLast && document.activeElement !== fLast) fLast.value = p.lastName || '';
    if (fDisplay && document.activeElement !== fDisplay) fDisplay.value = p.displayName || '';
    if (fUsername && document.activeElement !== fUsername) fUsername.value = p.username || '';
    if (fBio && document.activeElement !== fBio) fBio.value = p.bio || '';
    if (fEmail) fEmail.value = email;
    if (fCreated) {
      const date = p.createdAt ? new Date(p.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recently';
      fCreated.value = date;
    }
    if (fProvider) {
      const prov = user?.providerData?.[0]?.providerId === 'google.com' ? 'Google Account' : 'Email & Password';
      fProvider.value = prov;
    }

    // Populate Personalization Form Fields
    const pCustom = $('#settingsCustomInstructions');
    const pAbout = $('#settingsAboutUser');
    const pStyle = $('#settingsResponseStyle');
    const pLang = $('#settingsLanguage');
    const pTz = $('#settingsTimezone');

    if (pCustom && document.activeElement !== pCustom) pCustom.value = p.personalization?.customInstructions || '';
    if (pAbout && document.activeElement !== pAbout) pAbout.value = p.personalization?.aboutUser || '';
    if (pStyle) pStyle.value = p.personalization?.responsePreferences || p.preferences?.responseStyle || 'professional';
    if (pLang) pLang.value = p.preferredLanguage || 'en';
    if (pTz) pTz.value = p.timezone || 'Asia/Kolkata';

    // Populate Preferences
    const prefTheme = $('#settingsThemeSelect');
    const prefModel = $('#settingsDefaultModelSelect');
    const prefLanding = $('#settingsDefaultLandingSelect');
    const prefCompact = $('#settingsCompactToggle');
    const prefAnim = $('#settingsAnimationsToggle');
    const prefMotion = $('#settingsReducedMotionToggle');

    if (prefTheme) prefTheme.value = p.preferences?.theme || 'dark';
    if (prefModel) prefModel.value = p.preferences?.defaultModelMode || 'auto';
    if (prefLanding) prefLanding.value = p.preferences?.defaultLandingPage || 'chat';
    if (prefCompact) prefCompact.checked = Boolean(p.preferences?.compactMode);
    if (prefAnim) prefAnim.checked = p.preferences?.showAnimations !== false;
    if (prefMotion) prefMotion.checked = Boolean(p.preferences?.reducedMotion);

    // Toggle Avatar Remove button visibility in Settings
    const removeBtn = $('#settingsRemoveAvatarBtn');
    if (removeBtn) {
      removeBtn.style.display = p.profilePhotoUrl ? 'inline-flex' : 'none';
    }
  },

  /**
   * Bind Sidebar Profile Button to directly open the Settings Modal (ChatGPT / Claude pattern)
   */
  bindSidebarProfile() {
    const btn = $('#userSettingsBtn');
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openSettings('profile');
      });
    }
  },

  closeDropdown() {
    // Dropdown replaced with direct settings dialog
  },

  /**
   * Bind Settings Dialog
   */
  bindSettingsModal() {
    const modal = $('#settingsModal');
    const closeBtn = $('#closeSettingsBtn');
    const closeFooterBtn = $('#closeSettingsFooterBtn');

    if (closeBtn) closeBtn.addEventListener('click', () => this.closeSettings());
    if (closeFooterBtn) closeFooterBtn.addEventListener('click', () => this.closeSettings());

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeSettings();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal?.classList.contains('open')) {
        this.closeSettings();
      }
    });

    // Navigation tab switching
    $$('.settings-nav-tab').forEach((tabBtn) => {
      tabBtn.addEventListener('click', () => {
        const targetTab = tabBtn.getAttribute('data-tab');
        this.switchSettingsTab(targetTab);
      });
    });

    // 1. Profile Tab Save
    const saveProfileBtn = $('#saveProfileBtn');
    if (saveProfileBtn) {
      saveProfileBtn.addEventListener('click', async () => {
        const firstName = $('#settingsFirstName')?.value.trim();
        const lastName = $('#settingsLastName')?.value.trim();
        const displayName = $('#settingsDisplayName')?.value.trim();
        const username = $('#settingsUsername')?.value.trim().toLowerCase();
        const bio = $('#settingsBio')?.value.trim();

        if (!firstName) {
          if (configCallbacks.showToast) configCallbacks.showToast('Please enter your first name.');
          return;
        }

        try {
          saveProfileBtn.disabled = true;
          saveProfileBtn.textContent = 'Saving...';

          await UserService.updateProfile({
            firstName,
            lastName,
            displayName,
            username,
            bio
          });

          saveProfileBtn.textContent = 'Saved ✓';
          if (configCallbacks.showToast) configCallbacks.showToast('Profile updated successfully.');
          setTimeout(() => {
            saveProfileBtn.textContent = 'Save Changes';
            saveProfileBtn.disabled = false;
          }, 1800);
        } catch (err) {
          saveProfileBtn.disabled = false;
          saveProfileBtn.textContent = 'Save Changes';
          if (configCallbacks.showToast) configCallbacks.showToast(err.message || 'Failed to update profile.');
        }
      });
    }

    // 2. Debounced Username Validation in Settings
    const usernameInput = $('#settingsUsername');
    const usernameStatus = $('#settingsUsernameStatus');
    const usernameMsg = $('#settingsUsernameMsg');

    if (usernameInput) {
      usernameInput.addEventListener('input', () => {
        const val = usernameInput.value.trim().toLowerCase();
        if (usernameStatus) usernameStatus.innerHTML = '';
        if (usernameMsg) {
          usernameMsg.textContent = '';
          usernameMsg.className = '';
        }

        if (usernameCheckTimer) clearTimeout(usernameCheckTimer);

        if (!val || val === currentProfile?.username) return;

        usernameCheckTimer = setTimeout(async () => {
          if (usernameStatus) usernameStatus.innerHTML = '<span style="font-size:12px;opacity:0.6;">⏳</span>';
          const res = await UserService.checkUsername(val);
          if (res.available) {
            if (usernameStatus) usernameStatus.innerHTML = '<span style="color:#10b981;font-weight:bold;">✓</span>';
            if (usernameMsg) {
              usernameMsg.textContent = '✓ Username is available';
              usernameMsg.style.color = '#10b981';
            }
          } else {
            if (usernameStatus) usernameStatus.innerHTML = '<span style="color:#ef4444;font-weight:bold;">✕</span>';
            if (usernameMsg) {
              usernameMsg.textContent = `✕ ${res.reason || 'Username already taken'}`;
              usernameMsg.style.color = '#ef4444';
            }
          }
        }, 350);
      });
    }

    // 3. Avatar Upload in Settings
    const uploadBtn = $('#settingsUploadAvatarBtn');
    const fileInput = $('#settingsAvatarFileInput');
    const removeAvatarBtn = $('#settingsRemoveAvatarBtn');
    const previewCircle = $('#settingsAvatarPreview');

    const handleAvatarUpload = async (file) => {
      if (!file) return;

      if (!file.type || !file.type.startsWith('image/')) {
        const ext = file.name ? file.name.split('.').pop().toLowerCase() : '';
        if (!['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) {
          if (configCallbacks.showToast) configCallbacks.showToast('Please select a valid image file (JPG, PNG, WEBP).');
          return;
        }
      }

      if (file.size > 5 * 1024 * 1024) {
        if (configCallbacks.showToast) configCallbacks.showToast('Image exceeds 5MB size limit. Please select a smaller photo.');
        return;
      }

      // Optimistic instant preview on client
      let optimizedDataUrl = null;
      try {
        const { optimizeImageFile } = await import('./userService.js');
        if (typeof optimizeImageFile === 'function') {
          optimizedDataUrl = await optimizeImageFile(file);
        }
      } catch (optErr) {
        console.warn('[Avatar:ClientOptimize]', optErr);
      }

      if (optimizedDataUrl && previewCircle) {
        const tempProfile = { ...(currentProfile || {}), profilePhotoUrl: optimizedDataUrl };
        previewCircle.innerHTML = renderAvatarHtml(tempProfile, 76) + `
          <div class="avatar-preview-overlay">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
            <span style="font-size:9.5px;margin-top:2px;font-weight:600;letter-spacing:0.4px;">CHANGE</span>
          </div>`;
        const sidebarAvatar = $('#userAvatar');
        if (sidebarAvatar) sidebarAvatar.innerHTML = renderAvatarHtml(tempProfile, 34);
      }

      try {
        if (uploadBtn) {
          uploadBtn.disabled = true;
          uploadBtn.innerHTML = '<span style="display:inline-block;animation:spin 1s linear infinite;margin-right:6px;">⏳</span> Uploading...';
        }
        await UserService.uploadAvatar(file, optimizedDataUrl);
        if (configCallbacks.showToast) configCallbacks.showToast('Profile photo updated successfully.');
        if (removeAvatarBtn) removeAvatarBtn.style.display = 'inline-flex';
      } catch (err) {
        console.error('[AvatarUploadError]', err);
        // If upload had error and no local photo was saved, re-render current profile
        if (!UserService.getProfile()?.profilePhotoUrl) {
          this.renderProfileUI(currentProfile);
        }
        if (configCallbacks.showToast) configCallbacks.showToast(err.message || 'Avatar upload failed.');
      } finally {
        if (uploadBtn) {
          uploadBtn.disabled = false;
          uploadBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            Change Photo`;
        }
        if (fileInput) fileInput.value = '';
      }
    };

    if (previewCircle && fileInput) {
      previewCircle.addEventListener('click', () => fileInput.click());

      previewCircle.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        previewCircle.classList.add('drag-over');
      });

      previewCircle.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        previewCircle.classList.remove('drag-over');
      });

      previewCircle.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        previewCircle.classList.remove('drag-over');
        if (e.dataTransfer?.files?.length > 0) {
          handleAvatarUpload(e.dataTransfer.files[0]);
        }
      });
    }

    if (uploadBtn && fileInput) {
      uploadBtn.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', () => {
        if (!fileInput.files || fileInput.files.length === 0) return;
        handleAvatarUpload(fileInput.files[0]);
      });
    }

    if (removeAvatarBtn) {
      removeAvatarBtn.addEventListener('click', async () => {
        try {
          removeAvatarBtn.disabled = true;
          removeAvatarBtn.textContent = 'Removing...';
          await UserService.deleteAvatar();
          removeAvatarBtn.style.display = 'none';
          if (configCallbacks.showToast) configCallbacks.showToast('Profile photo removed.');
        } catch (err) {
          if (configCallbacks.showToast) configCallbacks.showToast(err.message || 'Failed to remove photo.');
        } finally {
          removeAvatarBtn.disabled = false;
          removeAvatarBtn.textContent = 'Remove Photo';
        }
      });
    }

    // 4. Personalization Tab Save
    const savePersonalizationBtn = $('#savePersonalizationBtn');
    if (savePersonalizationBtn) {
      savePersonalizationBtn.addEventListener('click', async () => {
        const customInstructions = $('#settingsCustomInstructions')?.value.trim();
        const aboutUser = $('#settingsAboutUser')?.value.trim();
        const responsePreferences = $('#settingsResponseStyle')?.value;
        const preferredLanguage = $('#settingsLanguage')?.value;
        const timezone = $('#settingsTimezone')?.value;

        try {
          savePersonalizationBtn.disabled = true;
          savePersonalizationBtn.textContent = 'Saving...';

          await UserService.updatePersonalization({
            customInstructions,
            aboutUser,
            responsePreferences
          });

          await UserService.updateProfile({
            preferredLanguage,
            timezone
          });

          savePersonalizationBtn.textContent = 'Saved ✓';
          if (configCallbacks.showToast) configCallbacks.showToast('Personalization preferences saved.');
          setTimeout(() => {
            savePersonalizationBtn.textContent = 'Save Personalization';
            savePersonalizationBtn.disabled = false;
          }, 1800);
        } catch (err) {
          savePersonalizationBtn.disabled = false;
          savePersonalizationBtn.textContent = 'Save Personalization';
          if (configCallbacks.showToast) configCallbacks.showToast(err.message || 'Failed to save personalization.');
        }
      });
    }

    // 5. Appearance Tab Save
    const saveAppearanceBtn = $('#saveAppearanceBtn');
    if (saveAppearanceBtn) {
      saveAppearanceBtn.addEventListener('click', async () => {
        const theme = $('#settingsThemeSelect')?.value || 'dark';
        const compactMode = Boolean($('#settingsCompactToggle')?.checked);
        const showAnimations = Boolean($('#settingsAnimationsToggle')?.checked);
        const reducedMotion = Boolean($('#settingsReducedMotionToggle')?.checked);

        try {
          saveAppearanceBtn.disabled = true;
          saveAppearanceBtn.textContent = 'Saving...';

          await UserService.updatePreferences({
            theme,
            compactMode,
            showAnimations,
            reducedMotion
          });

          // Apply theme directly
          if (theme === 'light') {
            document.body.classList.add('light-theme');
          } else if (theme === 'dark') {
            document.body.classList.remove('light-theme');
          }

          saveAppearanceBtn.textContent = 'Saved ✓';
          if (configCallbacks.showToast) configCallbacks.showToast('Appearance settings saved.');
          setTimeout(() => {
            saveAppearanceBtn.textContent = 'Save Appearance';
            saveAppearanceBtn.disabled = false;
          }, 1800);
        } catch (err) {
          saveAppearanceBtn.disabled = false;
          saveAppearanceBtn.textContent = 'Save Appearance';
          if (configCallbacks.showToast) configCallbacks.showToast(err.message || 'Failed to save appearance.');
        }
      });
    }

    // 6. AI Experience Tab Save
    const saveAiBtn = $('#saveAiBtn');
    if (saveAiBtn) {
      saveAiBtn.addEventListener('click', async () => {
        const defaultModelMode = $('#settingsDefaultModelSelect')?.value || 'auto';
        const defaultLandingPage = $('#settingsDefaultLandingSelect')?.value || 'chat';

        try {
          saveAiBtn.disabled = true;
          saveAiBtn.textContent = 'Saving...';

          await UserService.updatePreferences({
            defaultModelMode,
            defaultLandingPage
          });

          saveAiBtn.textContent = 'Saved ✓';
          if (configCallbacks.showToast) configCallbacks.showToast('AI preferences saved.');
          setTimeout(() => {
            saveAiBtn.textContent = 'Save AI Preferences';
            saveAiBtn.disabled = false;
          }, 1800);
        } catch (err) {
          saveAiBtn.disabled = false;
          saveAiBtn.textContent = 'Save AI Preferences';
          if (configCallbacks.showToast) configCallbacks.showToast(err.message || 'Failed to save preferences.');
        }
      });
    }

    // 7. Security Tab (Logout all sessions)
    const logoutAllBtn = $('#settingsLogoutAllSessionsBtn');
    if (logoutAllBtn) {
      logoutAllBtn.addEventListener('click', async () => {
        try {
          logoutAllBtn.disabled = true;
          await UserService.logoutAllSessions();
          if (configCallbacks.showToast) configCallbacks.showToast('Signed out of all other sessions.');
        } catch (err) {
          if (configCallbacks.showToast) configCallbacks.showToast(err.message || 'Failed to sign out sessions.');
        } finally {
          logoutAllBtn.disabled = false;
        }
      });
    }

    // 8. Danger Zone Delete Account Modal Trigger
    const openDeleteBtn = $('#settingsDeleteAccountBtn');
    if (openDeleteBtn) {
      openDeleteBtn.addEventListener('click', () => {
        this.openDeleteAccountModal();
      });
    }
  },

  openSettings(tab = 'profile') {
    const modal = $('#settingsModal');
    if (modal) {
      modal.classList.add('open');
      this.switchSettingsTab(tab);
    }
  },

  closeSettings() {
    const modal = $('#settingsModal');
    if (modal) modal.classList.remove('open');
  },

  switchSettingsTab(targetTab) {
    const validTabs = ['profile', 'account', 'personalization', 'appearance', 'ai-settings', 'connected-apps', 'security', 'usage', 'danger'];
    const activeTab = validTabs.includes(targetTab) ? targetTab : 'profile';

    // Update active nav button
    $$('.settings-nav-tab').forEach((b) => {
      b.classList.toggle('active', b.getAttribute('data-tab') === activeTab);
    });

    // Update active content panel
    $$('.settings-panel').forEach((p) => {
      p.classList.toggle('active', p.getAttribute('data-tab') === activeTab);
    });

    // Refresh dynamic data for specific tabs
    if (activeTab === 'usage') {
      this.loadUsageTab();
    } else if (activeTab === 'security') {
      this.loadSecurityTab();
    } else if (activeTab === 'connected-apps') {
      this.loadConnectedAppsTab();
    }
  },

  async loadUsageTab() {
    const stats = await UserService.fetchUsage();
    if (!stats) return;
    const chatsEl = $('#usageChatsCount');
    const msgsEl = $('#usageMessagesCount');
    const memberEl = $('#usageMemberSince');

    if (chatsEl) chatsEl.textContent = stats.totalChats || 0;
    if (msgsEl) msgsEl.textContent = stats.totalMessages || 0;
    if (memberEl && stats.createdAt) {
      memberEl.textContent = new Date(stats.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    }
  },

  async loadSecurityTab() {
    const sessions = await UserService.fetchSessions();
    const container = $('#securitySessionsList');
    if (!container) return;

    if (!sessions || sessions.length === 0) {
      container.innerHTML = '<div style="font-size:13px;color:var(--text-muted);padding:8px 0;">This is your only active session.</div>';
      return;
    }

    container.innerHTML = sessions.map((s) => `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:var(--bg-card);border:1px solid var(--border-light);border-radius:10px;margin-bottom:8px;">
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="width:34px;height:34px;border-radius:8px;background:var(--bg-subtle);display:flex;align-items:center;justify-content:center;font-size:16px;">💻</div>
          <div>
            <div style="font-size:13.5px;font-weight:600;color:var(--text-main);">${s.device || 'Active Device'}</div>
            <div style="font-size:11.5px;color:var(--text-muted);">${s.isCurrent ? 'Current Session • Active Now' : 'Signed In Session'}</div>
          </div>
        </div>
        ${s.isCurrent ? '<span style="font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:rgba(16,185,129,0.15);color:#10b981;">Online</span>' : ''}
      </div>
    `).join('');
  },

  async loadConnectedAppsTab() {
    const listEl = $('#connectedAppsList');
    if (!listEl) return;

    let plugins = [];
    try {
      plugins = await PluginService.getPlugins();
    } catch (_) {
      plugins = [];
    }

    const apps = [
      { id: 'google', name: 'Google (Gmail, Drive, Calendar)', icon: '🌐', connected: plugins.some(p => ['gmail','google-drive','google-calendar'].includes(p.id) && (p.state === 'CONNECTED' || p.state === 'ENABLED')) },
      { id: 'github', name: 'GitHub', icon: '🐙', connected: plugins.some(p => p.id === 'github' && (p.state === 'CONNECTED' || p.state === 'ENABLED')) },
      { id: 'notion', name: 'Notion', icon: '📝', connected: plugins.some(p => p.id === 'notion' && (p.state === 'CONNECTED' || p.state === 'ENABLED')) },
      { id: 'discord', name: 'Discord', icon: '💬', connected: plugins.some(p => p.id === 'discord' && (p.state === 'CONNECTED' || p.state === 'ENABLED')) },
      { id: 'telegram', name: 'Telegram', icon: '✈️', connected: plugins.some(p => p.id === 'telegram' && (p.state === 'CONNECTED' || p.state === 'ENABLED')) },
      { id: 'whatsapp', name: 'WhatsApp', icon: '📱', connected: plugins.some(p => p.id === 'whatsapp' && (p.state === 'CONNECTED' || p.state === 'ENABLED')) }
    ];

    listEl.innerHTML = apps.map((app) => `
      <div class="connected-app-card">
        <div style="display:flex;align-items:center;gap:12px;">
          <span style="font-size:20px;">${app.icon}</span>
          <div>
            <div style="font-size:13.5px;font-weight:600;color:var(--text-main);">${app.name}</div>
            <div style="font-size:11.5px;color:var(--text-muted);">${app.connected ? 'Securely connected to Epic Think AI' : 'Not connected'}</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:10px;">
          <span class="connected-app-status ${app.connected ? 'connected' : 'disconnected'}">
            ${app.connected ? '● Connected' : '○ Not Connected'}
          </span>
          <button type="button" class="secondary-btn" style="padding:6px 12px;font-size:12px;" onclick="document.querySelector('#settingsModal').classList.remove('open');document.querySelector('#pluginStoreModal').classList.add('open');">
            ${app.connected ? 'Manage' : 'Connect'}
          </button>
        </div>
      </div>
    `).join('');
  },

  /**
   * Bind Onboarding Wizard (Steps 1 to 5)
   */
  bindOnboardingModal() {
    const modal = $('#onboardingModal');
    if (!modal) return;

    let currentStep = 1;

    const setStep = (step) => {
      currentStep = step;
      $$('.onboarding-step').forEach((s, idx) => {
        s.style.display = (idx + 1 === step) ? 'flex' : 'none';
      });
      $$('.onboarding-dot').forEach((d, idx) => {
        if (idx + 1 === step) {
          d.style.background = 'var(--accent)';
          d.style.transform = 'scale(1.25)';
        } else if (idx + 1 < step) {
          d.style.background = '#10b981';
          d.style.transform = 'scale(1)';
        } else {
          d.style.background = 'rgba(255,255,255,0.2)';
          d.style.transform = 'scale(1)';
        }
      });
    };

    // Step 1 -> 2
    $('#onboardingNextBtn1')?.addEventListener('click', () => setStep(2));

    // Step 2 Back & Continue
    $('#onboardingBackBtn2')?.addEventListener('click', () => setStep(1));
    $('#onboardingNextBtn2')?.addEventListener('click', async () => {
      const first = $('#onboardingFirstName')?.value.trim();
      const last = $('#onboardingLastName')?.value.trim();
      if (!first) {
        if (configCallbacks.showToast) configCallbacks.showToast('Please enter your first name.');
        return;
      }
      try {
        await UserService.updateProfile({ firstName: first, lastName: last });
      } catch (_) {}
      setStep(3);
    });

    // Step 3 Back & Continue (Username)
    $('#onboardingBackBtn3')?.addEventListener('click', () => setStep(2));
    const uInput = $('#onboardingUsername');
    const uStatus = $('#onboardingUsernameStatus');
    const uMsg = $('#onboardingUsernameMsg');

    if (uInput) {
      uInput.addEventListener('input', () => {
        const val = uInput.value.trim().toLowerCase();
        if (usernameCheckTimer) clearTimeout(usernameCheckTimer);
        if (uStatus) uStatus.innerHTML = '';
        if (uMsg) uMsg.textContent = '';

        if (!val) return;

        usernameCheckTimer = setTimeout(async () => {
          if (uStatus) uStatus.innerHTML = '⏳';
          const res = await UserService.checkUsername(val);
          if (res.available) {
            if (uStatus) uStatus.innerHTML = '<span style="color:#10b981;">✓</span>';
            if (uMsg) {
              uMsg.textContent = '✓ Available';
              uMsg.style.color = '#10b981';
            }
          } else {
            if (uStatus) uStatus.innerHTML = '<span style="color:#ef4444;">✕</span>';
            if (uMsg) {
              uMsg.textContent = `✕ ${res.reason || 'Taken'}`;
              uMsg.style.color = '#ef4444';
            }
          }
        }, 350);
      });
    }

    $('#onboardingNextBtn3')?.addEventListener('click', async () => {
      const u = uInput?.value.trim().toLowerCase();
      if (u) {
        try {
          await UserService.updateProfile({ username: u });
        } catch (e) {
          if (configCallbacks.showToast) configCallbacks.showToast(e.message);
          return;
        }
      }
      setStep(4);
    });

    // Step 4 Avatar Upload
    $('#onboardingBackBtn4')?.addEventListener('click', () => setStep(3));
    const obAvatarInput = $('#onboardingAvatarFileInput');
    const obUploadBtn = $('#onboardingUploadAvatarBtn');
    const obRemoveBtn = $('#onboardingRemoveAvatarBtn');

    if (obUploadBtn && obAvatarInput) {
      obUploadBtn.addEventListener('click', () => obAvatarInput.click());
      obAvatarInput.addEventListener('change', async () => {
        if (!obAvatarInput.files || obAvatarInput.files.length === 0) return;
        const file = obAvatarInput.files[0];
        try {
          obUploadBtn.disabled = true;
          obUploadBtn.textContent = 'Uploading...';

          let optimizedDataUrl = null;
          try {
            const { optimizeImageFile } = await import('./userService.js');
            if (typeof optimizeImageFile === 'function') {
              optimizedDataUrl = await optimizeImageFile(file);
            }
          } catch (_) {}

          const preview = $('#onboardingAvatarPreview');
          if (preview && optimizedDataUrl) {
            preview.innerHTML = renderAvatarHtml({ ...(currentProfile || {}), profilePhotoUrl: optimizedDataUrl }, 96);
          }

          const res = await UserService.uploadAvatar(file, optimizedDataUrl);
          if (preview) preview.innerHTML = renderAvatarHtml(res.profile, 96);
          if (obRemoveBtn) obRemoveBtn.style.display = 'inline-flex';
          if (configCallbacks.showToast) configCallbacks.showToast('Profile photo updated.');
        } catch (e) {
          if (configCallbacks.showToast) configCallbacks.showToast(e.message || 'Avatar upload failed.');
        } finally {
          obUploadBtn.disabled = false;
          obUploadBtn.textContent = 'Change Photo';
          obAvatarInput.value = '';
        }
      });
    }

    if (obRemoveBtn) {
      obRemoveBtn.addEventListener('click', async () => {
        try {
          obRemoveBtn.disabled = true;
          await UserService.deleteAvatar();
          const preview = $('#onboardingAvatarPreview');
          if (preview) preview.innerHTML = renderAvatarHtml(UserService.getProfile(), 96);
          obRemoveBtn.style.display = 'none';
        } catch (_) {} finally {
          obRemoveBtn.disabled = false;
        }
      });
    }

    $('#onboardingNextBtn4')?.addEventListener('click', () => setStep(5));

    // Step 5 Finish
    $('#onboardingBackBtn5')?.addEventListener('click', () => setStep(4));
    $('#onboardingFinishBtn')?.addEventListener('click', async () => {
      const about = $('#onboardingAboutUser')?.value.trim();
      const style = $('#onboardingResponseStyle')?.value;

      try {
        await UserService.updatePersonalization({
          aboutUser: about || '',
          responsePreferences: style || 'professional'
        });
        await UserService.updateProfile({
          onboardingCompleted: true
        });
        this.closeOnboarding();
        if (configCallbacks.showToast) {
          configCallbacks.showToast('Workspace personalized! Welcome to Epic Think AI.');
        }
      } catch (err) {
        if (configCallbacks.showToast) configCallbacks.showToast(err.message);
      }
    });

    // Skip for now
    $('#skipOnboardingBtn')?.addEventListener('click', async () => {
      try {
        await UserService.updateProfile({ onboardingCompleted: true });
      } catch (_) {}
      this.closeOnboarding();
      if (configCallbacks.showToast) configCallbacks.showToast('Welcome to Epic Think AI!');
    });
  },

  openOnboarding(profile) {
    const modal = $('#onboardingModal');
    if (!modal) return;

    // Prefill fields
    const fFirst = $('#onboardingFirstName');
    const fLast = $('#onboardingLastName');
    const fUser = $('#onboardingUsername');
    const preview = $('#onboardingAvatarPreview');

    if (fFirst) fFirst.value = profile?.firstName || '';
    if (fLast) fLast.value = profile?.lastName || '';
    if (fUser) fUser.value = profile?.username || '';
    if (preview) preview.innerHTML = renderAvatarHtml(profile, 96);

    modal.style.display = 'flex';
  },

  closeOnboarding() {
    const modal = $('#onboardingModal');
    if (modal) modal.style.display = 'none';
  },

  /**
   * Bind Account Deletion Modal
   */
  bindDeleteAccountModal() {
    const modal = $('#deleteAccountModal');
    const input = $('#deleteConfirmInput');
    const confirmBtn = $('#confirmDeleteAccountBtn');
    const cancelBtn = $('#cancelDeleteAccountBtn');

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        if (modal) modal.style.display = 'none';
      });
    }

    if (input && confirmBtn) {
      input.addEventListener('input', () => {
        const matches = input.value.trim() === 'DELETE';
        confirmBtn.disabled = !matches;
        confirmBtn.style.opacity = matches ? '1' : '0.5';
      });

      confirmBtn.addEventListener('click', async () => {
        if (input.value.trim() !== 'DELETE') return;
        try {
          confirmBtn.disabled = true;
          confirmBtn.textContent = 'Deleting Account...';
          await UserService.deleteAccount();
          if (modal) modal.style.display = 'none';
          if (configCallbacks.showToast) configCallbacks.showToast('Account permanently deleted.');
          setTimeout(() => {
            if (typeof configCallbacks.onSignOut === 'function') {
              configCallbacks.onSignOut();
            }
          }, 1000);
        } catch (err) {
          confirmBtn.disabled = false;
          confirmBtn.textContent = 'Permanently Delete Account';
          if (configCallbacks.showToast) configCallbacks.showToast(err.message || 'Deletion failed.');
        }
      });
    }
  },

  openDeleteAccountModal() {
    const modal = $('#deleteAccountModal');
    const input = $('#deleteConfirmInput');
    const confirmBtn = $('#confirmDeleteAccountBtn');
    if (input) input.value = '';
    if (confirmBtn) {
      confirmBtn.disabled = true;
      confirmBtn.style.opacity = '0.5';
      confirmBtn.textContent = 'Permanently Delete Account';
    }
    if (modal) modal.style.display = 'flex';
  }
};
