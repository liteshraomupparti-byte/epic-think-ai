/**
 * Epic Think AI - Official Notion REST API Client Wrapper
 */

export class NotionClient {
  constructor(accessToken) {
    if (!accessToken) {
      throw new Error('NotionClient requires an authenticated access token.');
    }
    this.accessToken = accessToken;
    this.baseUrl = 'https://api.notion.com/v1';
  }

  async _request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.accessToken}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
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
      throw new Error(`Notion API Error [${response.status}]: ${errBody.message || response.statusText}`);
    }

    return await response.json();
  }

  async searchPages({ query = '', pageSize = 10 }) {
    const limit = Math.min(Math.max(1, Number(pageSize) || 10), 30);
    const body = {
      query,
      page_size: limit
    };

    const data = await this._request('/search', {
      method: 'POST',
      body: JSON.stringify(body)
    });

    return (data.results || []).map(item => {
      let title = '(Untitled)';
      if (item.properties?.title?.title?.[0]?.plain_text) {
        title = item.properties.title.title[0].plain_text;
      } else if (item.properties?.Name?.title?.[0]?.plain_text) {
        title = item.properties.Name.title[0].plain_text;
      }

      return {
        id: item.id,
        object: item.object, // 'page' or 'database'
        title,
        url: item.url,
        created_time: item.created_time,
        last_edited_time: item.last_edited_time
      };
    });
  }

  async readContent({ pageId, maxBlocks = 20 }) {
    const cleanId = pageId.replace(/-/g, '');
    const data = await this._request(`/blocks/${cleanId}/children?page_size=${maxBlocks}`);

    const blocks = (data.results || []).map(b => {
      const type = b.type;
      const richText = b[type]?.rich_text || [];
      const plainText = richText.map(t => t.plain_text).join('');

      return {
        id: b.id,
        type: b.type,
        text: plainText
      };
    });

    const fullText = blocks.map(b => b.text).filter(Boolean).join('\n\n');

    return {
      blockCount: blocks.length,
      blocks,
      content: fullText.slice(0, 10000)
    };
  }

  async queryDatabase({ databaseId, pageSize = 10, filter = null }) {
    const cleanId = databaseId.replace(/-/g, '');
    const limit = Math.min(Math.max(1, Number(pageSize) || 10), 50);

    const body = {
      page_size: limit,
      ...(filter ? { filter } : {})
    };

    const data = await this._request(`/databases/${cleanId}/query`, {
      method: 'POST',
      body: JSON.stringify(body)
    });

    return (data.results || []).map(page => ({
      id: page.id,
      url: page.url,
      properties: page.properties
    }));
  }

  async createPage({ parentId, title, content = '', isDatabaseParent = false }) {
    const cleanParentId = parentId.replace(/-/g, '');

    const parent = isDatabaseParent
      ? { database_id: cleanParentId }
      : { page_id: cleanParentId };

    const properties = isDatabaseParent
      ? {
        Name: {
          title: [{ text: { content: title } }]
        }
      }
      : {
        title: {
          title: [{ text: { content: title } }]
        }
      };

    const children = content ? [
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: content.slice(0, 2000) } }]
        }
      }
    ] : [];

    const data = await this._request('/pages', {
      method: 'POST',
      body: JSON.stringify({
        parent,
        properties,
        children
      })
    });

    return {
      id: data.id,
      url: data.url,
      title,
      status: 'created'
    };
  }
}
