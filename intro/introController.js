/**
 * EPIC THINK AI — 3D Intro & Public Routing Controller
 * 
 * Powered solely by the integrated NEW 3D Intro inside AI Agent HPS:
 * - Three.js interactive 3D deep space constellation particle field
 * - Ambient interstellar lighting (indigo/sky/purple radial glows)
 * - Animated Chroma Title Epic Think (gradient flow + neon bloom)
 * - Anamorphic laser light horizon with pulsing star flare
 * - High-density 1,400+ particle sparkles canvas (tsparticles)
 * - Feature pills: Deep Cognitive Logic, Instant Execution, Autonomous Decision Engine
 * - Shimmering multi-color Get Started button
 * - Clean Skip Intro option
 * - Smooth 0.55s internal transition to existing Firebase Login (#authOverlay -> /login)
 * - 0.4s fast-path for returning authenticated users directly to workspace (#appView -> /app/chat)
 * - Zero background WebGL / canvas load after intro unmounts (comprehensive disposal)
 */

let reactIntroUnmountFn = null;
let introCompleted = false;
let callbacks = {
  onShowLogin: null,
  onShowApp: null,
  getCurrentUser: null,
  showToast: null
};

export const IntroController = {
  /**
   * Initialize intro controls and routing bindings
   */
  init(cbs = {}) {
    callbacks = { ...callbacks, ...cbs };

    // Intro is compulsory before showing login system — Escape key skip omitted
  },

  /**
   * Check if user prefers to skip intro
   * Intro is compulsory before showing the login system
   */
  shouldSkipIntro() {
    return false;
  },

  /**
   * Play the NEW 3D Intro
   * @param {boolean} force - Force replay even if seen before
   */
  async playIntro(force = false) {
    introCompleted = false;
    const container = document.getElementById('epicIntroContainer');
    const mountEl = document.getElementById('epicThinkIntroMount');
    const authOverlay = document.getElementById('authOverlay');
    const loadingScreen = document.getElementById('authLoadingScreen');

    if (!container || !mountEl) return;

    // Hide any auth overlays or loading screens during intro
    if (authOverlay) authOverlay.style.display = 'none';
    if (loadingScreen) loadingScreen.classList.add('hidden');

    container.classList.remove('hidden');
    container.style.display = 'flex';
    container.style.opacity = '1';

    // The 3D Intro is compulsory and always active (prefers-reduced-motion bypassed per user mandate)
    mountEl.style.display = 'block';
    mountEl.style.opacity = '1';

    try {
      const introMod = await import('/intro/epic-think-intro.bundle.js');
      if (introMod && typeof introMod.mountEpicThinkIntro === 'function') {
        introMod.mountEpicThinkIntro(mountEl, {
          onComplete: () => {
            this.transitionToLogin();
          },
          showSkipButton: false,
          autoAdvanceDelay: 0
        });
        reactIntroUnmountFn = introMod.unmountEpicThinkIntro;
      }
    } catch (err) {
      console.error('[IntroController] Error mounting 3D intro bundle:', err);
      this.transitionToLogin();
    }
  },

  /**
   * Skip the 3D Intro immediately
   */
  skipIntro() {
    if (typeof callbacks.getCurrentUser === 'function') {
      const user = callbacks.getCurrentUser();
      if (user && user.uid) {
        this.handleAuthenticatedReturningUser(user);
        return;
      }
    }
    this.transitionToLogin();
  },

  /**
   * Smoothly transition from 3D Intro to Login Screen
   */
  transitionToLogin() {
    if (introCompleted) return;
    introCompleted = true;

    sessionStorage.setItem('epic_intro_seen', 'true');

    // Unmount React and dispose Three.js / WebGL / Canvas resources
    if (reactIntroUnmountFn) {
      try { reactIntroUnmountFn(); } catch (e) { console.warn('[IntroController] Unmount warn:', e); }
      reactIntroUnmountFn = null;
    }

    const mountEl = document.getElementById('epicThinkIntroMount');
    if (mountEl) {
      // Clean any lingering canvas or WebGL contexts
      const canvases = mountEl.querySelectorAll('canvas');
      canvases.forEach(c => {
        try {
          const gl = c.getContext('webgl') || c.getContext('webgl2');
          if (gl) {
            const loseExt = gl.getExtension('WEBGL_lose_context');
            if (loseExt) loseExt.loseContext();
          }
        } catch (_) {}
      });
      mountEl.style.display = 'none';
      mountEl.innerHTML = '';
    }

    const container = document.getElementById('epicIntroContainer');
    const authOverlay = document.getElementById('authOverlay');

    if (authOverlay) {
      authOverlay.style.display = 'flex';
      authOverlay.style.opacity = '0';
      authOverlay.style.transition = 'opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1)';
      // Trigger reflow
      void authOverlay.offsetHeight;
      authOverlay.style.opacity = '1';
    }

    if (container) {
      container.style.transition = 'opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1)';
      container.style.opacity = '0';
      setTimeout(() => {
        container.classList.add('hidden');
        container.style.display = 'none';
      }, 580);
    }

    // Update URL to /login if on root (same origin internal route)
    if (window.location.pathname === '/' || window.location.pathname === '') {
      try {
        window.history.pushState({ page: 'login' }, 'Epic Think AI — Login', '/login');
      } catch (_) {}
    }

    if (typeof callbacks.onShowLogin === 'function') {
      callbacks.onShowLogin();
    }
  },

  /**
   * Fast-path for returning authenticated users (bypasses intro & login directly to workspace /app/chat)
   */
  handleAuthenticatedReturningUser(user) {
    if (!user || !user.uid) {
      console.warn('[IntroController] Gated: handleAuthenticatedReturningUser requires valid user');
      this.transitionToLogin();
      return;
    }
    introCompleted = true;
    sessionStorage.setItem('epic_intro_seen', 'true');

    if (reactIntroUnmountFn) {
      try { reactIntroUnmountFn(); } catch (_) {}
      reactIntroUnmountFn = null;
    }
    const mountEl = document.getElementById('epicThinkIntroMount');
    if (mountEl) {
      const canvases = mountEl.querySelectorAll('canvas');
      canvases.forEach(c => {
        try {
          const gl = c.getContext('webgl') || c.getContext('webgl2');
          if (gl) {
            const loseExt = gl.getExtension('WEBGL_lose_context');
            if (loseExt) loseExt.loseContext();
          }
        } catch (_) {}
      });
      mountEl.style.display = 'none';
      mountEl.innerHTML = '';
    }

    const container = document.getElementById('epicIntroContainer');
    const authOverlay = document.getElementById('authOverlay');
    const loadingScreen = document.getElementById('authLoadingScreen');
    const appView = document.getElementById('appView');

    // Instantly hide intro container without wasting GPU cycles
    if (container) {
      container.classList.add('hidden');
      container.style.display = 'none';
    }

    if (authOverlay) {
      authOverlay.style.display = 'none';
    }

    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
    }

    if (appView) {
      appView.style.display = 'flex';
      appView.style.opacity = '0';
      appView.style.transition = 'opacity 0.4s ease-out';
      void appView.offsetHeight;
      appView.style.opacity = '1';
    }

    // Update URL to /app/chat if on root, /login, /signup, or /app
    if (window.location.pathname === '/' || window.location.pathname === '/login' || window.location.pathname === '/signup' || window.location.pathname === '/app') {
      try {
        window.history.replaceState({ page: 'chat' }, 'Epic Think AI — Chat', '/app/chat');
      } catch (_) {}
    }

    if (typeof callbacks.onShowApp === 'function') {
      callbacks.onShowApp(user);
    }
  }
};
