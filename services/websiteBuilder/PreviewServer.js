/**
 * Epic Think AI - Live Preview Server & Visual Selection Bridge
 * 
 * Features:
 * 1. Project serving with dynamic asset resolution
 * 2. Automatic script injection:
 *    - Live Reload WebSocket client (instant hot reload on file changes)
 *    - Visual Inspector & Element Selection Engine (postMessage bridge)
 *    - Error boundary reporter (intercepts console.error & unhandled runtime errors)
 * 3. File system watcher for hot reloading
 * 4. Multi-device viewport emulation support (Desktop, Tablet, Mobile)
 */

import fs from 'fs';
import path from 'path';
import mime from 'mime-types';
import { WebSocketServer } from 'ws';
import { ProjectManager } from './ProjectManager.js';

// Connected preview WebSocket clients: Map<projectId, Set<ws>>
const previewClients = new Map();
// File watchers: Map<projectId, FSWatcher>
const projectWatchers = new Map();

/**
 * Visual Selection and Live Reload client injection script
 */
const INJECTED_PREVIEW_SCRIPT = `
<!-- ========================================================================== -->
<!-- Epic Think AI - Live Preview & Visual Selector Bridge                        -->
<!-- ========================================================================== -->
<script id="epic-think-preview-bridge">
(function() {
  console.log('[Epic Think Preview] Live Bridge Initialized.');

  let isSelectionMode = true;
  let hoveredElement = null;
  let selectedElement = null;

  // Highlight Box Overlay
  const highlightOverlay = document.createElement('div');
  highlightOverlay.id = 'epic-preview-hover-box';
  highlightOverlay.style.position = 'fixed';
  highlightOverlay.style.pointerEvents = 'none';
  highlightOverlay.style.zIndex = '999999';
  highlightOverlay.style.border = '2px solid #c5a059';
  highlightOverlay.style.borderRadius = '4px';
  highlightOverlay.style.boxShadow = '0 0 14px rgba(197, 160, 89, 0.45)';
  highlightOverlay.style.display = 'none';
  highlightOverlay.style.transition = 'all 0.08s ease-out';

  const badgeTag = document.createElement('div');
  badgeTag.style.position = 'absolute';
  badgeTag.style.top = '-24px';
  badgeTag.style.left = '0';
  badgeTag.style.background = '#c5a059';
  badgeTag.style.color = '#0a0a0c';
  badgeTag.style.padding = '2px 8px';
  badgeTag.style.fontSize = '11px';
  badgeTag.style.fontWeight = '700';
  badgeTag.style.fontFamily = 'Inter, sans-serif';
  badgeTag.style.borderRadius = '3px';
  badgeTag.style.whiteSpace = 'nowrap';
  highlightOverlay.appendChild(badgeTag);

  document.addEventListener('DOMContentLoaded', () => {
    document.body.appendChild(highlightOverlay);
  });
  if (document.body) {
    document.body.appendChild(highlightOverlay);
  }

  function getUniqueSelector(el) {
    if (!el || el.nodeType !== 1) return '';
    if (el.id) return '#' + el.id;
    if (el.getAttribute('data-component')) {
      return '[data-component="' + el.getAttribute('data-component') + '"]';
    }
    let path = [];
    while (el && el.nodeType === 1 && el.tagName.toLowerCase() !== 'html') {
      let selector = el.tagName.toLowerCase();
      if (el.className && typeof el.className === 'string') {
        const firstClass = el.className.trim().split(/\\s+/)[0];
        if (firstClass) selector += '.' + firstClass;
      }
      path.unshift(selector);
      el = el.parentElement;
    }
    return path.join(' > ');
  }

  function getElementDetails(el) {
    if (!el) return null;
    const computed = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    
    return {
      tagName: el.tagName.toLowerCase(),
      selector: getUniqueSelector(el),
      componentName: el.getAttribute('data-component') || el.closest('[data-component]')?.getAttribute('data-component') || el.tagName.toLowerCase(),
      sourceFile: el.getAttribute('data-source-file') || el.closest('[data-source-file]')?.getAttribute('data-source-file') || 'index.html',
      sourceId: el.getAttribute('data-source-id') || el.id || '',
      innerText: (el.innerText || '').slice(0, 100),
      rect: {
        x: Math.round(rect.x),
        y: Math.round(rect.y),
        width: Math.round(rect.width),
        height: Math.round(rect.height)
      },
      styles: {
        color: computed.color,
        backgroundColor: computed.backgroundColor,
        fontSize: computed.fontSize,
        fontWeight: computed.fontWeight,
        fontFamily: computed.fontFamily,
        padding: computed.padding,
        margin: computed.margin,
        borderRadius: computed.borderRadius,
        border: computed.border,
        display: computed.display,
        lineHeight: computed.lineHeight,
        textAlign: computed.textAlign
      }
    };
  }

  // Hover highlighting
  document.addEventListener('mouseover', (e) => {
    if (!isSelectionMode) return;
    const target = e.target;
    if (target === highlightOverlay || highlightOverlay.contains(target)) return;

    hoveredElement = target;
    const rect = target.getBoundingClientRect();
    highlightOverlay.style.top = rect.top + 'px';
    highlightOverlay.style.left = rect.left + 'px';
    highlightOverlay.style.width = rect.width + 'px';
    highlightOverlay.style.height = rect.height + 'px';
    highlightOverlay.style.display = 'block';

    const comp = target.getAttribute('data-component') || target.tagName.toLowerCase();
    badgeTag.innerText = comp + (target.id ? '#' + target.id : '');
  }, true);

  document.addEventListener('mouseout', (e) => {
    if (!isSelectionMode) return;
    if (e.relatedTarget === null) {
      highlightOverlay.style.display = 'none';
    }
  }, true);

  // Click Selection Interception
  document.addEventListener('click', (e) => {
    if (!isSelectionMode) return;
    e.preventDefault();
    e.stopPropagation();

    selectedElement = e.target;
    const details = getElementDetails(selectedElement);
    
    // Notify parent frame
    window.parent.postMessage({
      type: 'EPIC_PREVIEW_ELEMENT_SELECTED',
      payload: details
    }, '*');
  }, true);

  // Parent Message Listener (Styles, Selection Mode, Text Edits, Component Highlighting)
  window.addEventListener('message', (event) => {
    const data = event.data;
    if (!data || !data.type) return;

    if (data.type === 'EPIC_SET_SELECTION_MODE') {
      isSelectionMode = !!(data.payload ? data.payload.enabled : data.enabled);
      if (!isSelectionMode) {
        highlightOverlay.style.display = 'none';
      }
    } else if (data.type === 'EPIC_LIVE_APPLY_STYLE' && selectedElement) {
      const payload = data.payload || data;
      const { property, value } = payload;
      if (property && value !== undefined) {
        selectedElement.style[property] = value;
        const rect = selectedElement.getBoundingClientRect();
        highlightOverlay.style.top = rect.top + 'px';
        highlightOverlay.style.left = rect.left + 'px';
        highlightOverlay.style.width = rect.width + 'px';
        highlightOverlay.style.height = rect.height + 'px';
      }
    } else if (data.type === 'EPIC_LIVE_APPLY_TEXT' && selectedElement) {
      const payload = data.payload || data;
      const newText = payload.text !== undefined ? payload.text : payload;
      selectedElement.innerText = newText;
    } else if (data.type === 'EPIC_HIGHLIGHT_SELECTOR') {
      const selector = data.payload?.selector || data.selector;
      if (selector) {
        const target = document.querySelector(selector);
        if (target) {
          selectedElement = target;
          const details = getElementDetails(target);
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          const rect = target.getBoundingClientRect();
          highlightOverlay.style.top = rect.top + 'px';
          highlightOverlay.style.left = rect.left + 'px';
          highlightOverlay.style.width = rect.width + 'px';
          highlightOverlay.style.height = rect.height + 'px';
          highlightOverlay.style.display = 'block';
          const comp = target.getAttribute('data-component') || target.tagName.toLowerCase();
          badgeTag.innerText = comp + (target.id ? '#' + target.id : '');
          window.parent.postMessage({
            type: 'EPIC_PREVIEW_ELEMENT_SELECTED',
            payload: details,
            element: details
          }, '*');
        }
      }
    }
  });

  // Intercept and report runtime errors to parent
  window.addEventListener('error', (event) => {
    window.parent.postMessage({
      type: 'EPIC_PREVIEW_ERROR',
      payload: {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      }
    }, '*');
  });

  // WebSocket Live Reload Bridge
  try {
    const isServerless = location.hostname.endsWith('vercel.app') || location.hostname.includes('vercel');
    if (!isServerless) {
      const wsProto = location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = wsProto + '//' + location.host + '/ws/preview/' + location.pathname.split('/')[2];
      const reloadSocket = new WebSocket(wsUrl);

      reloadSocket.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'reload') {
            console.log('[Epic Think Preview] Hot reload triggered by file update.');
            location.reload();
          }
        } catch (_) {}
      };
      reloadSocket.onerror = () => {};
    }
  } catch (_) {}
})();
</script>
`;

export class PreviewServer {
  /**
   * Register a preview WebSocket client
   */
  static registerWsClient(projectId, ws) {
    if (!previewClients.has(projectId)) {
      previewClients.set(projectId, new Set());
    }
    previewClients.get(projectId).add(ws);

    // Watch project directory if not already watching
    this.ensureWatcher(projectId);

    ws.on('close', () => {
      const clients = previewClients.get(projectId);
      if (clients) {
        clients.delete(ws);
        if (clients.size === 0) {
          previewClients.delete(projectId);
          this.stopWatcher(projectId);
        }
      }
    });
  }

  /**
   * Ensure directory watcher is running for project
   */
  static ensureWatcher(projectId) {
    if (projectWatchers.has(projectId)) return;

    try {
      const projectDir = ProjectManager.getProjectDir(projectId);
      if (!fs.existsSync(projectDir)) return;

      let debounceTimer = null;
      const watcher = fs.watch(projectDir, { recursive: true }, (eventType, filename) => {
        if (!filename || filename.includes('.git') || filename.endsWith('.tmp')) return;

        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          this.broadcastReload(projectId);
        }, 150);
      });

      projectWatchers.set(projectId, watcher);
    } catch (err) {
      console.warn(`[PREVIEW_SERVER] Could not watch project ${projectId}:`, err.message);
    }
  }

  /**
   * Stop watcher
   */
  static stopWatcher(projectId) {
    const watcher = projectWatchers.get(projectId);
    if (watcher) {
      try { watcher.close(); } catch (_) {}
      projectWatchers.delete(projectId);
    }
  }

  /**
   * Broadcast reload to all preview clients
   */
  static broadcastReload(projectId) {
    const clients = previewClients.get(projectId);
    if (!clients || clients.size === 0) return;

    const payload = JSON.stringify({ type: 'reload', timestamp: Date.now() });
    for (const ws of clients) {
      if (ws.readyState === 1) { // OPEN
        ws.send(payload);
      }
    }
  }

  /**
   * Notify project change alias
   */
  static notifyProjectChange(projectId, change = {}) {
    this.broadcastReload(projectId);
  }

  /**
   * Express Middleware creator to serve /preview/:projectId/*
   */
  static createExpressHandler() {
    return async (req, res, next) => {
      const parts = req.path.split('/').filter(Boolean);
      if (parts.length === 0) {
        return res.status(404).send('Project ID required in URL path');
      }
      req.params = req.params || {};
      req.params.projectId = parts[0];
      req.params[0] = parts.slice(1).join('/') || 'index.html';
      return await PreviewServer.handlePreviewRequest(req, res, next);
    };
  }

  /**
   * Express Middleware to serve project preview files
   */
  static async handlePreviewRequest(req, res, next) {
    const projectId = req.params.projectId;
    let subPath = req.params[0] || 'index.html';
    if (!subPath || subPath === '/') subPath = 'index.html';

    try {
      const projectDir = ProjectManager.getProjectDir(projectId);
      const cleanSubPath = subPath.replace(/^[\/\\]+/, '').replace(/\.\.[\/\\]/g, '');
      const fullPath = path.join(projectDir, cleanSubPath);

      if (!fs.existsSync(fullPath)) {
        // Auto-heal missing index.html or project
        if (cleanSubPath === 'index.html' || !path.extname(cleanSubPath)) {
          await ProjectManager.ensureProjectFiles(projectId);
          if (fs.existsSync(fullPath)) {
            return this.serveHtmlWithBridge(fullPath, res);
          }
          const indexPath = path.join(projectDir, 'index.html');
          if (fs.existsSync(indexPath)) {
            return this.serveHtmlWithBridge(indexPath, res);
          }
        }
        return res.status(404).send(`<h3>404 Not Found</h3><p>File <code>${cleanSubPath}</code> not found in project <code>${projectId}</code>.</p>`);
      }

      // Check if HTML file (needs injection)
      if (fullPath.endsWith('.html')) {
        return this.serveHtmlWithBridge(fullPath, res);
      }

      // Static assets (CSS, JS, Images, Fonts)
      const mimeType = mime.lookup(fullPath) || 'application/octet-stream';
      res.setHeader('Content-Type', mimeType);
      fs.createReadStream(fullPath).pipe(res);
    } catch (err) {
      res.status(500).send(`Server error: ${err.message}`);
    }
  }

  /**
   * Read HTML and inject selection & live reload bridge
   */
  static serveHtmlWithBridge(htmlPath, res) {
    try {
      let content = fs.readFileSync(htmlPath, 'utf8');

      // Inject bridge script before </body> or </head>
      if (content.includes('</body>')) {
        content = content.replace('</body>', `${INJECTED_PREVIEW_SCRIPT}\n</body>`);
      } else if (content.includes('</html>')) {
        content = content.replace('</html>', `${INJECTED_PREVIEW_SCRIPT}\n</html>`);
      } else {
        content += INJECTED_PREVIEW_SCRIPT;
      }

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.send(content);
    } catch (err) {
      res.status(500).send(`Error rendering preview: ${err.message}`);
    }
  }

  /**
   * Attach Preview WebSocket listener to HTTP server
   */
  static attachWebSocket(httpServer) {
    const previewWss = new WebSocketServer({ noServer: true });

    httpServer.on('upgrade', (req, socket, head) => {
      try {
        const pathname = req.url ? new URL(req.url, 'http://localhost').pathname : '';
        if (pathname.startsWith('/ws/preview/')) {
          const parts = pathname.split('/').filter(Boolean);
          const projectId = parts[2];
          if (projectId) {
            previewWss.handleUpgrade(req, socket, head, (ws) => {
              PreviewServer.registerWsClient(projectId, ws);
            });
          }
        }
      } catch (err) {
        console.warn('[PREVIEW_WS_UPGRADE_ERROR]', err.message);
      }
    });

    console.log('[WEBSOCKET] Live Preview WebSocket handler attached for "/ws/preview/:projectId"');
  }
}
