/**
 * Epic Think AI - Base OAuth Provider Adapter
 * 
 * Abstract base class for provider-specific OAuth flows.
 */

export class BaseOAuthAdapter {
  constructor(config = {}) {
    this.providerId = config.providerId || 'generic';
    this.clientId = config.clientId || '';
    this.clientSecret = config.clientSecret || '';
    this.scopes = config.scopes || [];
  }

  isConfigured() {
    return Boolean(this.clientId && this.clientSecret);
  }

  /**
   * Build the provider's authorization URL
   * 
   * @param {object} params
   * @param {string} params.state - Cryptographically signed state token
   * @param {string} params.redirectUri - Callback URL
   * @param {string} [params.codeChallenge] - PKCE challenge string
   */
  getAuthorizationUrl({ state, redirectUri, codeChallenge }) {
    throw new Error('getAuthorizationUrl must be implemented by adapter.');
  }

  /**
   * Exchange authorization code for access & refresh tokens
   */
  async exchangeCode({ code, redirectUri, codeVerifier }) {
    throw new Error('exchangeCode must be implemented by adapter.');
  }

  /**
   * Refresh an expired access token using refresh_token
   */
  async refreshToken(refreshToken) {
    throw new Error('refreshToken must be implemented by adapter.');
  }

  /**
   * Fetch authenticated user identity from provider API
   */
  async getUserProfile(accessToken) {
    return { id: 'unknown', username: 'unknown' };
  }

  /**
   * Revoke token on provider side upon disconnection
   */
  async revokeToken(accessToken) {
    return true;
  }
}
