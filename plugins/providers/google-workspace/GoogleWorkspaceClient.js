/**
 * Epic Think AI - Unified Google Workspace API Client
 * 
 * Reusable client for Gmail, Google Calendar, and Google Drive.
 */

export class GoogleWorkspaceClient {
  constructor(accessToken) {
    if (!accessToken) {
      throw new Error('GoogleWorkspaceClient requires an authenticated access token.');
    }
    this.accessToken = accessToken;
  }

  async _request(url, options = {}) {
    const headers = {
      'Authorization': `Bearer ${this.accessToken}`,
      'Accept': 'application/json',
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
      throw new Error(`Google API Error [${response.status}]: ${errBody.error?.message || errBody.message || response.statusText}`);
    }

    if (response.status === 204) return null;
    return await response.json();
  }

  // =========================================================================
  // GMAIL METHODS
  // =========================================================================

  async searchEmails({ query = '', maxResults = 5 }) {
    const limit = Math.min(Math.max(1, Number(maxResults) || 5), 20);
    const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}&maxResults=${limit}`;
    const data = await this._request(url);
    const messages = data.messages || [];

    const summaries = [];
    for (const msg of messages.slice(0, limit)) {
      try {
        const detail = await this.readEmail({ messageId: msg.id, format: 'metadata' });
        summaries.push(detail);
      } catch (_) {
        summaries.push({ id: msg.id, threadId: msg.threadId });
      }
    }

    return {
      resultCount: summaries.length,
      messages: summaries
    };
  }

  async readEmail({ messageId, format = 'full' }) {
    const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=${format}`;
    const data = await this._request(url);

    const headers = data.payload?.headers || [];
    const getHeader = (name) => headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || '';

    let snippet = data.snippet || '';
    let body = snippet;

    // Extract body if available
    if (data.payload?.body?.data) {
      body = Buffer.from(data.payload.body.data, 'base64').toString('utf8');
    }

    return {
      id: data.id,
      threadId: data.threadId,
      subject: getHeader('Subject') || '(No Subject)',
      from: getHeader('From'),
      to: getHeader('To'),
      date: getHeader('Date'),
      snippet,
      body: body.slice(0, 4000) // Cap to prevent context blowup
    };
  }

  async createDraft({ to, recipient, email, subject, title, body, message, content }) {
    const toAddress = to || recipient || email || '';
    const emailSubject = subject || title || '(No Subject)';
    const emailBody = body || message || content || '';

    const emailLines = [
      `To: ${toAddress}`,
      `Subject: ${emailSubject}`,
      'Content-Type: text/plain; charset=utf-8',
      '',
      emailBody
    ];
    const rawEmail = Buffer.from(emailLines.join('\r\n')).toString('base64url');

    const data = await this._request('https://gmail.googleapis.com/gmail/v1/users/me/drafts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: { raw: rawEmail } })
    });

    return {
      draftId: data.id,
      messageId: data.message?.id,
      status: 'draft_created',
      to: toAddress,
      subject: emailSubject
    };
  }

  async sendEmail({ to, recipient, email, subject, title, body, message, content }) {
    const toAddress = to || recipient || email || '';
    const emailSubject = subject || title || '(No Subject)';
    const emailBody = body || message || content || '';

    if (!toAddress) {
      throw new Error('Recipient email address ("to") is required.');
    }

    const emailLines = [
      `To: ${toAddress}`,
      `Subject: ${emailSubject}`,
      'Content-Type: text/plain; charset=utf-8',
      '',
      emailBody
    ];
    const rawEmail = Buffer.from(emailLines.join('\r\n')).toString('base64url');

    const data = await this._request('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw: rawEmail })
    });

    return {
      messageId: data.id,
      threadId: data.threadId,
      status: 'sent',
      to: toAddress,
      subject: emailSubject
    };
  }

  // =========================================================================
  // GOOGLE CALENDAR METHODS
  // =========================================================================

  async listEvents({ timeMin, timeMax, maxResults = 10 }) {
    const now = new Date();
    const min = timeMin || now.toISOString();
    const limit = Math.min(Math.max(1, Number(maxResults) || 10), 50);

    let url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?singleEvents=true&orderBy=startTime&timeMin=${encodeURIComponent(min)}&maxResults=${limit}`;
    if (timeMax) {
      url += `&timeMax=${encodeURIComponent(timeMax)}`;
    }

    const data = await this._request(url);
    return (data.items || []).map(event => ({
      id: event.id,
      summary: event.summary || '(Untitled Event)',
      description: event.description || '',
      start: event.start?.dateTime || event.start?.date,
      end: event.end?.dateTime || event.end?.date,
      location: event.location || '',
      htmlLink: event.htmlLink,
      attendees: (event.attendees || []).map(a => a.email)
    }));
  }

  async findFreeSlots({ date, durationMinutes = 30 }) {
    const targetDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 9, 0, 0);
    const endOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 18, 0, 0);

    const events = await this.listEvents({
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      maxResults: 50
    });

    return {
      date: startOfDay.toISOString().split('T')[0],
      workingHours: '09:00 - 18:00',
      durationMinutes,
      conflictsCount: events.length,
      scheduledEvents: events.map(e => ({ summary: e.summary, start: e.start, end: e.end }))
    };
  }

  async createEvent({ summary, description = '', start, end, attendees = [] }) {
    const payload = {
      summary,
      description,
      start: { dateTime: new Date(start).toISOString() },
      end: { dateTime: new Date(end).toISOString() },
      attendees: attendees.map(email => ({ email }))
    };

    const data = await this._request('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    return {
      id: data.id,
      summary: data.summary,
      status: data.status,
      start: data.start?.dateTime,
      end: data.end?.dateTime,
      htmlLink: data.htmlLink
    };
  }

  // =========================================================================
  // GOOGLE DRIVE METHODS
  // =========================================================================

  async searchFiles({ query = '', pageSize = 10 }) {
    const limit = Math.min(Math.max(1, Number(pageSize) || 10), 30);
    let q = `trashed = false`;
    if (query) {
      const escaped = query.replace(/'/g, "\\'");
      q += ` and (name contains '${escaped}' or fullText contains '${escaped}')`;
    }

    const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&pageSize=${limit}&fields=files(id,name,mimeType,size,modifiedTime,webViewLink)`;
    const data = await this._request(url);

    return (data.files || []).map(f => ({
      id: f.id,
      name: f.name,
      mimeType: f.mimeType,
      size: f.size ? `${Math.round(f.size / 1024)} KB` : 'N/A',
      modifiedTime: f.modifiedTime,
      link: f.webViewLink
    }));
  }

  async readFile({ fileId }) {
    const metaUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,mimeType,size`;
    const metadata = await this._request(metaUrl);

    // If text or json, fetch raw content
    if (metadata.mimeType.includes('text') || metadata.mimeType.includes('json') || metadata.mimeType.includes('javascript')) {
      const contentRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
        headers: { 'Authorization': `Bearer ${this.accessToken}` }
      });
      const text = await contentRes.text();
      return {
        ...metadata,
        content: text.slice(0, 10000)
      };
    }

    return {
      ...metadata,
      content: `[Binary or Google Workspace Document: ${metadata.mimeType}]`
    };
  }

  async listFolders({ pageSize = 10 }) {
    const limit = Math.min(Math.max(1, Number(pageSize) || 10), 30);
    const q = `mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
    const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&pageSize=${limit}&fields=files(id,name,modifiedTime,webViewLink)`;
    const data = await this._request(url);

    return (data.files || []).map(f => ({
      id: f.id,
      name: f.name,
      link: f.webViewLink
    }));
  }

  async uploadFile({ name, content = '', folderId = null }) {
    const metadata = {
      name,
      mimeType: 'text/plain',
      ...(folderId ? { parents: [folderId] } : {})
    };

    const boundary = '-------314159265358979323846';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: text/plain\r\n\r\n' +
      content +
      closeDelimiter;

    const data = await this._request('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/related; boundary=${boundary}`
      },
      body: multipartRequestBody
    });

    return {
      id: data.id,
      name: data.name,
      mimeType: data.mimeType,
      status: 'uploaded'
    };
  }

  // =========================================================================
  // GOOGLE SHEETS & DOCS METHODS
  // =========================================================================

  async createSpreadsheet({ title = 'Untitled Spreadsheet' }) {
    const data = await this._request('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        properties: { title }
      })
    });

    return {
      spreadsheetId: data.spreadsheetId,
      title: data.properties?.title,
      spreadsheetUrl: data.spreadsheetUrl
    };
  }

  async readSpreadsheet({ spreadsheetId, range = 'Sheet1!A1:Z100' }) {
    if (!spreadsheetId) {
      throw new Error('spreadsheetId is required to read spreadsheet.');
    }
    const cleanRange = range.includes('!') ? range : `Sheet1!${range}`;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(cleanRange)}`;
    const data = await this._request(url);

    return {
      spreadsheetId,
      range: data.range,
      rowCount: (data.values || []).length,
      values: data.values || []
    };
  }

  async appendSpreadsheetRows({ spreadsheetId, range = 'Sheet1!A1', values = [] }) {
    if (!spreadsheetId) {
      throw new Error('spreadsheetId is required to append spreadsheet rows.');
    }
    const cleanRange = range.includes('!') ? range : `Sheet1!${range}`;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(cleanRange)}:append?valueInputOption=USER_ENTERED`;
    
    const formattedValues = Array.isArray(values[0]) ? values : [values];

    const data = await this._request(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        values: formattedValues
      })
    });

    return {
      spreadsheetId,
      updatedRange: data.updates?.updatedRange,
      updatedRows: data.updates?.updatedRows,
      status: 'appended'
    };
  }

  async createDocument({ title = 'Untitled Document' }) {
    const data = await this._request('https://docs.googleapis.com/v1/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });

    return {
      documentId: data.documentId,
      title: data.title
    };
  }

  async readDocument({ documentId }) {
    if (!documentId) {
      throw new Error('documentId is required to read Google Doc.');
    }
    const url = `https://docs.googleapis.com/v1/documents/${documentId}`;
    const data = await this._request(url);

    // Extract text content from document body
    let fullText = '';
    const content = data.body?.content || [];
    for (const elem of content) {
      if (elem.paragraph?.elements) {
        for (const pElem of elem.paragraph.elements) {
          if (pElem.textRun?.content) {
            fullText += pElem.textRun.content;
          }
        }
      }
    }

    return {
      documentId,
      title: data.title,
      text: fullText.slice(0, 10000)
    };
  }

  async appendDocumentText({ documentId, text }) {
    if (!documentId) throw new Error('documentId is required');
    const doc = await this._request(`https://docs.googleapis.com/v1/documents/${documentId}`);
    const endIndex = doc.body?.content?.slice(-1)[0]?.endIndex || 1;
    const targetIndex = Math.max(1, endIndex - 1);

    const data = await this._request(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: [
          {
            insertText: {
              location: { index: targetIndex },
              text: `\n${text}`
            }
          }
        ]
      })
    });

    return {
      documentId,
      status: 'appended',
      replies: data.replies
    };
  }

  // =========================================================================
  // GOOGLE SLIDES / PPT PRESENTATIONS METHODS (HIGH-SPEED BATCH ENGINE)
  // =========================================================================

  /**
   * Create a full multi-slide presentation / pitch deck in a single high-speed batch
   * 
   * @param {object} options
   * @param {string} options.title - Presentation title
   * @param {Array<object>} options.slides - Array of slide objects: [{ title, subtitle, bullets, notes }]
   */
  async createPresentation({ title = 'New Pitch Deck', slides = [] }) {
    // 1. Create the blank presentation
    const created = await this._request('https://slides.googleapis.com/v1/presentations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });

    const presentationId = created.presentationId;
    const presentationUrl = `https://docs.google.com/presentation/d/${presentationId}/edit`;

    // 2. If slides are provided, construct high-speed batchUpdate
    if (Array.isArray(slides) && slides.length > 0) {
      const requests = [];

      slides.forEach((slide, idx) => {
        const slideId = `slide_gen_${Date.now()}_${idx}`;
        const titleBoxId = `title_box_${Date.now()}_${idx}`;
        const bodyBoxId = `body_box_${Date.now()}_${idx}`;

        // Create blank slide
        requests.push({
          createSlide: {
            objectId: slideId,
            insertionIndex: idx + 1,
            slideLayoutReference: {
              predefinedLayout: 'BLANK'
            }
          }
        });

        // Add Header / Title text box
        const slideTitle = slide.title || `Slide ${idx + 1}`;
        requests.push({
          createShape: {
            objectId: titleBoxId,
            shapeType: 'TEXT_BOX',
            elementProperties: {
              pageObjectId: slideId,
              size: { width: { magnitude: 620, unit: 'PT' }, height: { magnitude: 50, unit: 'PT' } },
              transform: { scaleX: 1, scaleY: 1, translateX: 50, translateY: 35, unit: 'PT' }
            }
          }
        });
        requests.push({
          insertText: {
            objectId: titleBoxId,
            text: slideTitle
          }
        });

        // Add Body / Bullets text box
        let bodyText = '';
        if (Array.isArray(slide.bullets)) {
          bodyText = slide.bullets.map(b => `•  ${b}`).join('\n');
        } else if (slide.body || slide.content) {
          bodyText = String(slide.body || slide.content);
        } else if (slide.subtitle) {
          bodyText = String(slide.subtitle);
        }

        if (bodyText) {
          requests.push({
            createShape: {
              objectId: bodyBoxId,
              shapeType: 'TEXT_BOX',
              elementProperties: {
                pageObjectId: slideId,
                size: { width: { magnitude: 620, unit: 'PT' }, height: { magnitude: 280, unit: 'PT' } },
                transform: { scaleX: 1, scaleY: 1, translateX: 50, translateY: 95, unit: 'PT' }
              }
            }
          });
          requests.push({
            insertText: {
              objectId: bodyBoxId,
              text: bodyText
            }
          });
        }
      });

      if (requests.length > 0) {
        await this._request(`https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requests })
        });
      }
    }

    return {
      presentationId,
      title,
      presentationUrl,
      slidesCount: (slides.length || 0) + 1,
      status: 'created'
    };
  }

  /**
   * Add a single slide with title & content to an existing presentation
   */
  async addSlide({ presentationId, title = 'New Slide', bullets = [], content = '' }) {
    if (!presentationId) throw new Error('presentationId is required to add slide.');

    const uniqueId = `slide_${Date.now()}`;
    const titleBoxId = `title_${uniqueId}`;
    const bodyBoxId = `body_${uniqueId}`;

    const requests = [
      {
        createSlide: {
          objectId: uniqueId,
          slideLayoutReference: { predefinedLayout: 'BLANK' }
        }
      },
      {
        createShape: {
          objectId: titleBoxId,
          shapeType: 'TEXT_BOX',
          elementProperties: {
            pageObjectId: uniqueId,
            size: { width: { magnitude: 620, unit: 'PT' }, height: { magnitude: 50, unit: 'PT' } },
            transform: { scaleX: 1, scaleY: 1, translateX: 50, translateY: 35, unit: 'PT' }
          }
        }
      },
      {
        insertText: {
          objectId: titleBoxId,
          text: title
        }
      }
    ];

    const bodyText = Array.isArray(bullets) && bullets.length > 0 
      ? bullets.map(b => `•  ${b}`).join('\n')
      : (content || '');

    if (bodyText) {
      requests.push({
        createShape: {
          objectId: bodyBoxId,
          shapeType: 'TEXT_BOX',
          elementProperties: {
            pageObjectId: uniqueId,
            size: { width: { magnitude: 620, unit: 'PT' }, height: { magnitude: 280, unit: 'PT' } },
            transform: { scaleX: 1, scaleY: 1, translateX: 50, translateY: 95, unit: 'PT' }
          }
        }
      });
      requests.push({
        insertText: {
          objectId: bodyBoxId,
          text: bodyText
        }
      });
    }

    const data = await this._request(`https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requests })
    });

    return {
      presentationId,
      slideId: uniqueId,
      title,
      status: 'slide_added',
      presentationUrl: `https://docs.google.com/presentation/d/${presentationId}/edit`
    };
  }

  /**
   * Read all slides, text runs, and structure of a Google Slides presentation
   */
  async readPresentation({ presentationId }) {
    if (!presentationId) throw new Error('presentationId is required to read presentation.');

    const data = await this._request(`https://slides.googleapis.com/v1/presentations/${presentationId}`);
    const slides = (data.slides || []).map((slide, index) => {
      let slideText = [];
      const pageElements = slide.pageElements || [];

      for (const el of pageElements) {
        if (el.shape?.text?.textElements) {
          for (const te of el.shape.text.textElements) {
            if (te.textRun?.content) {
              const cleaned = te.textRun.content.trim();
              if (cleaned) slideText.push(cleaned);
            }
          }
        }
      }

      return {
        index: index + 1,
        objectId: slide.objectId,
        text: slideText.join(' | ')
      };
    });

    return {
      presentationId: data.presentationId,
      title: data.title,
      slidesCount: slides.length,
      presentationUrl: `https://docs.google.com/presentation/d/${presentationId}/edit`,
      slides
    };
  }
}
