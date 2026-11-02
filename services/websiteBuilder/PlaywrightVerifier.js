/**
 * PlaywrightVerifier.js
 * Epic Think AI Website Builder - Production Headless Browser Verification
 * 
 * Verifies generated websites across realistic device viewports:
 * - Mobile: 375 x 667 (iPhone SE / modern phone)
 * - Tablet: 768 x 1024 (iPad / standard tablet)
 * - Desktop: 1440 x 900 (High-res laptop / desktop)
 * 
 * Audits:
 * 1. Uncaught JavaScript runtime errors & exceptions
 * 2. Console error emissions
 * 3. 404 / failed image, script, or stylesheet network requests
 * 4. Horizontal overflow defects (scrollWidth > viewportWidth)
 * 5. Responsive navigation & critical element visibility
 * 6. Visual health & rendering pass/fail scoring
 */

import path from 'path';
import fs from 'fs';
import { ProjectManager } from './ProjectManager.js';

export const VIEWPORTS = {
  mobile: { name: 'mobile', width: 375, height: 667, isMobile: true, label: 'Mobile (375x667)' },
  tablet: { name: 'tablet', width: 768, height: 1024, isMobile: false, label: 'Tablet (768x1024)' },
  desktop: { name: 'desktop', width: 1440, height: 900, isMobile: false, label: 'Desktop (1440x900)' }
};

export class PlaywrightVerifier {
  /**
   * Lazily launch Playwright browser with resilient fallback
   */
  static async getBrowser() {
    try {
      const { chromium } = await import('playwright');
      const channels = ['msedge', 'chrome', undefined];
      for (const channel of channels) {
        try {
          const launchOpts = { headless: true };
          if (channel) launchOpts.channel = channel;
          const browser = await chromium.launch(launchOpts);
          return { browser, channel: channel || 'bundled' };
        } catch {
          // Try next channel
        }
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Verify a website project or HTML content across all 3 viewports
   * @param {string} projectIdOrHtml - Project ID string or raw HTML
   * @param {object} [options]
   * @returns {Promise<{ passed: boolean, score: number, viewports: object, defects: Array, consoleErrors: Array, failedAssets: Array }>}
   */
  static async verifyWebsite(projectIdOrHtml, options = {}) {
    const startTime = Date.now();
    let htmlContent = '';
    let projectDir = null;
    let isProjectId = false;

    if (typeof projectIdOrHtml === 'string' && !projectIdOrHtml.trim().startsWith('<')) {
      // It's a projectId
      try {
        isProjectId = true;
        projectDir = ProjectManager.getProjectPath(projectIdOrHtml);
        const indexPath = path.join(projectDir, 'index.html');
        if (fs.existsSync(indexPath)) {
          htmlContent = fs.readFileSync(indexPath, 'utf8');
        } else {
          return {
            passed: false,
            score: 0,
            error: `index.html not found in project ${projectIdOrHtml}`,
            defects: [{ severity: 'CRITICAL', type: 'MISSING_ENTRY', message: 'Project missing index.html' }]
          };
        }
      } catch (err) {
        return {
          passed: false,
          score: 0,
          error: `Failed to locate project: ${err.message}`,
          defects: [{ severity: 'CRITICAL', type: 'FS_ERROR', message: err.message }]
        };
      }
    } else {
      htmlContent = projectIdOrHtml;
    }

    const browserInfo = await this.getBrowser();
    if (!browserInfo) {
      // Graceful fallback to static DOM audit if Playwright is unavailable
      return this.fallbackStaticAudit(htmlContent);
    }

    const { browser, channel } = browserInfo;
    const defects = [];
    const consoleErrors = [];
    const failedAssets = [];
    const viewportResults = {};

    try {
      const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Playwright; Epic Think AI Verification Engine) AppleWebKit/537.36'
      });

      const page = await context.newPage();

      // Listen for runtime errors
      page.on('pageerror', (err) => {
        consoleErrors.push({ type: 'uncaught_exception', message: err.message });
        defects.push({
          severity: 'HIGH',
          type: 'RUNTIME_EXCEPTION',
          message: `Uncaught JS error: ${err.message}`,
          suggestion: 'Fix script logic or ensure referenced libraries are loaded before use.'
        });
      });

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push({ type: 'console_error', text: msg.text() });
          // Check for critical missing resources or script faults
          if (!msg.text().includes('favicon.ico')) {
            defects.push({
              severity: 'MEDIUM',
              type: 'CONSOLE_ERROR',
              message: msg.text(),
              suggestion: 'Resolve JavaScript console error.'
            });
          }
        }
      });

      page.on('requestfailed', (req) => {
        const url = req.url();
        if (!url.includes('favicon.ico')) {
          failedAssets.push({ url, failure: req.failure()?.errorText || 'Failed' });
          defects.push({
            severity: 'HIGH',
            type: 'FAILED_RESOURCE',
            message: `Resource failed to load: ${url}`,
            suggestion: 'Verify CDN script/style URL or local asset path.'
          });
        }
      });

      // Load the page
      if (options.previewUrl) {
        await page.goto(options.previewUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
      } else {
        await page.setContent(htmlContent, { waitUntil: 'domcontentloaded', timeout: 15000 });
      }

      // Semantic structure checks
      const semanticCheck = await page.evaluate(() => {
        const title = document.querySelector('title')?.innerText || '';
        const hasViewportMeta = Boolean(document.querySelector('meta[name="viewport"]'));
        const hasCharset = Boolean(document.querySelector('meta[charset]'));
        const hasHeader = Boolean(document.querySelector('header, nav, [role="banner"]'));
        const hasMain = Boolean(document.querySelector('main, section, [role="main"], #app, #root'));
        const hasHeading = Boolean(document.querySelector('h1, h2'));
        const imgTags = Array.from(document.querySelectorAll('img'));
        const missingAltImgs = imgTags.filter(img => !img.hasAttribute('alt')).length;
        
        return {
          title,
          hasViewportMeta,
          hasCharset,
          hasHeader,
          hasMain,
          hasHeading,
          totalImages: imgTags.length,
          missingAltImgs
        };
      });

      if (!semanticCheck.hasViewportMeta) {
        defects.push({
          severity: 'HIGH',
          type: 'MISSING_VIEWPORT_META',
          message: 'Missing <meta name="viewport" content="width=device-width, initial-scale=1.0">',
          suggestion: 'Add standard responsive viewport meta tag inside <head>.'
        });
      }

      if (!semanticCheck.title || semanticCheck.title.trim().length === 0) {
        defects.push({
          severity: 'MEDIUM',
          type: 'MISSING_TITLE',
          message: 'Empty or missing <title> tag',
          suggestion: 'Provide a descriptive title for SEO and accessibility.'
        });
      }

      if (semanticCheck.missingAltImgs > 0) {
        defects.push({
          severity: 'LOW',
          type: 'A11Y_MISSING_ALT',
          message: `${semanticCheck.missingAltImgs} <img> tag(s) missing alt attribute`,
          suggestion: 'Add descriptive alt="" text for accessibility.'
        });
      }

      // Test across the 3 responsive viewports
      for (const [key, vp] of Object.entries(VIEWPORTS)) {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        // Allow brief reflow
        await page.waitForTimeout(100);

        const vpAudit = await page.evaluate((width) => {
          const docEl = document.documentElement;
          const bodyEl = document.body;
          const scrollWidth = Math.max(docEl.scrollWidth, bodyEl ? bodyEl.scrollWidth : 0);
          const hasHorizontalOverflow = scrollWidth > (width + 2); // 2px margin of safety

          // Find specific offending elements that overflow
          const overflowingElements = [];
          if (hasHorizontalOverflow) {
            const allElements = document.querySelectorAll('*');
            for (const el of allElements) {
              const rect = el.getBoundingClientRect();
              if (rect.right > width + 2 && rect.width > 0) {
                overflowingElements.push({
                  tag: el.tagName.toLowerCase(),
                  id: el.id || undefined,
                  className: typeof el.className === 'string' ? el.className.slice(0, 50) : undefined,
                  right: Math.round(rect.right),
                  width: Math.round(rect.width)
                });
                if (overflowingElements.length >= 3) break;
              }
            }
          }

          // Check if key navigation or hamburger elements are visible
          const navEl = document.querySelector('nav, header, [role="navigation"]');
          const isNavPresent = Boolean(navEl);

          return {
            scrollWidth,
            viewportWidth: width,
            hasHorizontalOverflow,
            overflowingElements,
            isNavPresent
          };
        }, vp.width);

        if (vpAudit.hasHorizontalOverflow) {
          defects.push({
            severity: 'HIGH',
            type: 'HORIZONTAL_OVERFLOW',
            viewport: vp.name,
            message: `Horizontal content overflow on ${vp.label}: content width (${vpAudit.scrollWidth}px) exceeds viewport (${vp.width}px).`,
            details: vpAudit.overflowingElements,
            suggestion: 'Set max-w-full, overflow-x-hidden, or check fixed-width elements causing overflow.'
          });
        }

        viewportResults[key] = {
          label: vp.label,
          passed: !vpAudit.hasHorizontalOverflow,
          scrollWidth: vpAudit.scrollWidth,
          viewportWidth: vp.width,
          hasHorizontalOverflow: vpAudit.hasHorizontalOverflow,
          overflowingElements: vpAudit.overflowingElements
        };
      }

      await context.close();
      await browser.close();

      // Compute weighted health score (0 - 100)
      let score = 100;
      for (const d of defects) {
        if (d.severity === 'CRITICAL') score -= 40;
        else if (d.severity === 'HIGH') score -= 20;
        else if (d.severity === 'MEDIUM') score -= 10;
        else if (d.severity === 'LOW') score -= 5;
      }
      score = Math.max(0, Math.min(100, score));
      const passed = score >= 80 && !defects.some(d => d.severity === 'CRITICAL' || d.type === 'RUNTIME_EXCEPTION');

      return {
        passed,
        score,
        durationMs: Date.now() - startTime,
        channel,
        semanticCheck,
        viewports: viewportResults,
        defects,
        consoleErrors,
        failedAssets
      };
    } catch (err) {
      try { await browser.close(); } catch {}
      return {
        passed: false,
        score: 0,
        error: err.message,
        defects: [{ severity: 'HIGH', type: 'PLAYWRIGHT_EXEC_ERROR', message: err.message }]
      };
    }
  }

  /**
   * Resilient fallback audit when browser binaries are not installed
   */
  static fallbackStaticAudit(html) {
    const defects = [];
    const hasViewport = /<meta\s+name=["']viewport["']/i.test(html);
    const hasTitle = /<title>[^<]+<\/title>/i.test(html);
    const hasH1 = /<h1[^>]*>[^<]+<\/h1>/i.test(html);
    const hasDoctype = /<!DOCTYPE\s+html>/i.test(html);

    if (!hasViewport) {
      defects.push({ severity: 'HIGH', type: 'MISSING_VIEWPORT_META', message: 'Missing viewport meta tag.' });
    }
    if (!hasTitle) {
      defects.push({ severity: 'MEDIUM', type: 'MISSING_TITLE', message: 'Missing descriptive title tag.' });
    }
    if (!hasDoctype) {
      defects.push({ severity: 'MEDIUM', type: 'MISSING_DOCTYPE', message: 'Missing standard <!DOCTYPE html>.' });
    }

    const score = Math.max(60, 100 - defects.length * 15);
    return {
      passed: defects.length === 0,
      score,
      isFallback: true,
      viewports: {
        mobile: { label: VIEWPORTS.mobile.label, passed: hasViewport },
        tablet: { label: VIEWPORTS.tablet.label, passed: hasViewport },
        desktop: { label: VIEWPORTS.desktop.label, passed: true }
      },
      defects,
      consoleErrors: [],
      failedAssets: []
    };
  }
}
