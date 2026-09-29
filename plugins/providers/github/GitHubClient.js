/**
 * Epic Think AI - Official GitHub REST API Client Wrapper
 * 
 * Executes authenticated API requests scoped to a user's GitHub access token.
 */

export class GitHubClient {
  constructor(accessToken) {
    if (!accessToken) {
      throw new Error('GitHubClient requires an authenticated access token.');
    }
    this.accessToken = accessToken;
    this.baseUrl = 'https://api.github.com';
  }

  async _request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.accessToken}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Epic-Think-AI/1.0.0',
      ...(options.headers || {})
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      let errBody;
      try {
        errBody = await response.json();
      } catch (_) {
        errBody = { message: response.statusText };
      }
      throw new Error(`GitHub API Error [${response.status}]: ${errBody.message || response.statusText}`);
    }

    if (response.status === 204) return null;
    return await response.json();
  }

  /**
   * Search repositories
   */
  async searchRepositories({ query, sort = 'stars', per_page = 5 }) {
    const cleanQuery = encodeURIComponent(query);
    const limit = Math.min(Math.max(1, Number(per_page) || 5), 20);
    const endpoint = `/search/repositories?q=${cleanQuery}&sort=${sort}&per_page=${limit}`;

    const data = await this._request(endpoint);
    return {
      total_count: data.total_count,
      items: (data.items || []).map(repo => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        owner: repo.owner?.login,
        description: repo.description,
        html_url: repo.html_url,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        updated_at: repo.updated_at
      }))
    };
  }

  /**
   * Read code file contents
   */
  async readCodeFile({ owner, repo, path: filePath, ref }) {
    const cleanPath = filePath.replace(/^\//, '');
    let endpoint = `/repos/${owner}/${repo}/contents/${cleanPath}`;
    if (ref) {
      endpoint += `?ref=${encodeURIComponent(ref)}`;
    }

    const data = await this._request(endpoint);

    if (Array.isArray(data)) {
      return {
        type: 'directory',
        path: cleanPath,
        files: data.map(item => ({ name: item.name, path: item.path, type: item.type }))
      };
    }

    let decodedContent = '';
    if (data.encoding === 'base64' && data.content) {
      decodedContent = Buffer.from(data.content, 'base64').toString('utf8');
    }

    return {
      name: data.name,
      path: data.path,
      sha: data.sha,
      size: data.size,
      html_url: data.html_url,
      content: decodedContent
    };
  }

  /**
   * List pull requests
   */
  async listPullRequests({ owner, repo, state = 'open', per_page = 5 }) {
    const limit = Math.min(Math.max(1, Number(per_page) || 5), 20);
    const endpoint = `/repos/${owner}/${repo}/pulls?state=${state}&per_page=${limit}`;

    const data = await this._request(endpoint);
    return (data || []).map(pr => ({
      id: pr.id,
      number: pr.number,
      title: pr.title,
      state: pr.state,
      user: pr.user?.login,
      html_url: pr.html_url,
      created_at: pr.created_at,
      head_branch: pr.head?.ref,
      base_branch: pr.base?.ref
    }));
  }

  /**
   * Create an issue
   */
  async createIssue({ owner, repo, title, body = '', labels = [] }) {
    const endpoint = `/repos/${owner}/${repo}/issues`;

    const payload = {
      title,
      body,
      labels: Array.isArray(labels) ? labels : []
    };

    const data = await this._request(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    return {
      id: data.id,
      number: data.number,
      title: data.title,
      state: data.state,
      html_url: data.html_url,
      created_at: data.created_at,
      user: data.user?.login
    };
  }
}
