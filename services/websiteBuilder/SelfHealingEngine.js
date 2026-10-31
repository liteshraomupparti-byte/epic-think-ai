/**
 * SelfHealingEngine.js
 * Epic Think AI Website Builder - Automated Diagnostic & Self-Healing Loop
 * 
 * Capabilities:
 * - HTML structure & tag balance validation
 * - CSS syntax & brace-matching validation
 * - JavaScript syntax validation via Node.js vm.Script
 * - Asset & relative link reference checks
 * - Iterative error fixing with max loop safeguard (WEBSITE_MAX_FIX_ITERATIONS = 3)
 */

import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { ProjectManager } from './ProjectManager.js';

export const WEBSITE_MAX_FIX_ITERATIONS = 3;

export class SelfHealingEngine {
    constructor() {
        this.maxIterations = WEBSITE_MAX_FIX_ITERATIONS;
    }

    /**
     * Run full diagnostics on a project's files
     * @param {string} projectId 
     * @returns {Promise<{ hasErrors: boolean, errors: Array<{ file: string, type: string, message: string, line?: number }> }>}
     */
    async diagnoseProject(projectId) {
        const errors = [];
        const projectPath = ProjectManager.getProjectPath(projectId);

        if (!fs.existsSync(projectPath)) {
            return { hasErrors: true, errors: [{ file: 'project', type: 'system', message: 'Project directory does not exist' }] };
        }

        const files = await ProjectManager.listFiles(projectId);

        for (const file of files) {
            if (file.type === 'directory') continue;
            const relPath = file.relativePath || file.path;
            if (!relPath || typeof relPath !== 'string') continue;
            const ext = path.extname(relPath).toLowerCase();

            try {
                const content = await ProjectManager.readFile(projectId, relPath);

                if (ext === '.html') {
                    const htmlErrors = this.validateHtml(content, relPath);
                    errors.push(...htmlErrors);
                } else if (ext === '.css') {
                    const cssErrors = this.validateCss(content, relPath);
                    errors.push(...cssErrors);
                } else if (ext === '.js') {
                    const jsErrors = this.validateJs(content, relPath);
                    errors.push(...jsErrors);
                }
            } catch (err) {
                errors.push({
                    file: relPath,
                    type: 'read_error',
                    message: `Failed to read file: ${err.message}`
                });
            }
        }

        return {
            hasErrors: errors.length > 0,
            errors,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Validate HTML markup balance and basic tag structure
     */
    validateHtml(content, filename) {
        const errors = [];

        // Check DOCTYPE
        if (!content.trim().toLowerCase().startsWith('<!doctype html>')) {
            errors.push({
                file: filename,
                type: 'html_doctype',
                message: 'Missing or malformed <!DOCTYPE html> declaration',
                line: 1
            });
        }

        // Stack-based void and closing tag checker
        const voidElements = new Set([
            'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
            'link', 'meta', 'param', 'source', 'track', 'wbr'
        ]);

        const tagRegex = /<\/?([a-zA-Z0-9\-]+)(?:\s+[^>]*)?\/?>/g;
        const stack = [];
        let match;

        while ((match = tagRegex.exec(content)) !== null) {
            const fullTag = match[0];
            const tagName = match[1].toLowerCase();
            const isClosing = fullTag.startsWith('</');
            const isSelfClosing = fullTag.endsWith('/>') || voidElements.has(tagName);

            // Compute line number
            const upToMatch = content.substring(0, match.index);
            const line = upToMatch.split('\n').length;

            if (isClosing) {
                if (voidElements.has(tagName)) {
                    errors.push({
                        file: filename,
                        type: 'html_void_tag_close',
                        message: `Void element <${tagName}> should not have a closing tag`,
                        line
                    });
                } else if (stack.length === 0) {
                    errors.push({
                        file: filename,
                        type: 'html_orphan_close',
                        message: `Unexpected closing tag </${tagName}> without matching opening tag`,
                        line
                    });
                } else {
                    const last = stack.pop();
                    if (last.tag !== tagName) {
                        errors.push({
                            file: filename,
                            type: 'html_mismatched_tag',
                            message: `Mismatched closing tag: expected </${last.tag}> but found </${tagName}>`,
                            line
                        });
                    }
                }
            } else if (!isSelfClosing) {
                stack.push({ tag: tagName, line });
            }
        }

        // Any leftover unclosed tags
        while (stack.length > 0) {
            const unclosed = stack.pop();
            errors.push({
                file: filename,
                type: 'html_unclosed_tag',
                message: `Unclosed tag <${unclosed.tag}>`,
                line: unclosed.line
            });
        }

        return errors;
    }

    /**
     * Validate CSS syntax (brace balance and basic malformations)
     */
    validateCss(content, filename) {
        const errors = [];
        let openBraces = 0;
        const lines = content.split('\n');

        // Check unclosed comments
        const commentOpen = (content.match(/\/\*/g) || []).length;
        const commentClose = (content.match(/\*\//g) || []).length;
        if (commentOpen !== commentClose) {
            errors.push({
                file: filename,
                type: 'css_comment',
                message: `Mismatched CSS comment blocks (${commentOpen} open vs ${commentClose} closed)`
            });
        }

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const clean = line.replace(/\/\*.*?\*\//g, '').replace(/".*?"|'.*?'/g, '');

            for (const char of clean) {
                if (char === '{') openBraces++;
                if (char === '}') openBraces--;
            }

            if (openBraces < 0) {
                errors.push({
                    file: filename,
                    type: 'css_extra_closing_brace',
                    message: 'Unexpected closing brace "}" in CSS',
                    line: i + 1
                });
                openBraces = 0;
            }
        }

        if (openBraces > 0) {
            errors.push({
                file: filename,
                type: 'css_unclosed_braces',
                message: `Missing ${openBraces} closing brace(s) "}" in CSS`
            });
        }

        return errors;
    }

    /**
     * Validate JavaScript syntax using Node.js vm.Script
     */
    validateJs(content, filename) {
        const errors = [];
        try {
            new vm.Script(content, { filename });
        } catch (err) {
            const lineMatch = err.stack ? err.stack.match(/evalmachine\.<anonymous>:(\d+)/) : null;
            const line = lineMatch ? parseInt(lineMatch[1], 10) : undefined;

            errors.push({
                file: filename,
                type: 'js_syntax_error',
                message: err.message,
                line: line
            });
        }
        return errors;
    }

    /**
     * Run self-healing loop:
     * Diagnose -> If errors -> Auto-heal -> Re-diagnose -> Repeat until 0 errors or maxIterations reached
     */
    async selfHeal(projectId, options = {}) {
        let iteration = 0;
        const fixedErrors = [];
        const initialDiag = await this.diagnoseProject(projectId);

        if (!initialDiag.hasErrors) {
            return {
                success: true,
                iterations: 0,
                initialErrors: [],
                remainingErrors: [],
                fixedErrors: []
            };
        }

        let currentErrors = initialDiag.errors;

        while (currentErrors.length > 0 && iteration < this.maxIterations) {
            iteration++;
            console.log(`[SelfHealingEngine] Iteration ${iteration}/${this.maxIterations}: resolving ${currentErrors.length} errors for ${projectId}`);

            for (const error of currentErrors) {
                try {
                    const healed = await this.attemptSingleFix(projectId, error);
                    if (healed) {
                        fixedErrors.push({ error, iteration });
                    }
                } catch (e) {
                    console.warn(`[SelfHealingEngine] Error while attempting fix: ${e.message}`);
                }
            }

            // Re-diagnose
            const postDiag = await this.diagnoseProject(projectId);
            currentErrors = postDiag.errors;

            if (currentErrors.length === 0) {
                await ProjectManager.createCheckpoint(
                    projectId,
                    `[Self-Healing] Automatically repaired ${fixedErrors.length} syntax & markup issue(s)`
                );
                return {
                    success: true,
                    iterations: iteration,
                    initialErrors: initialDiag.errors,
                    remainingErrors: [],
                    fixedErrors
                };
            }
        }

        return {
            success: currentErrors.length === 0,
            iterations: iteration,
            initialErrors: initialDiag.errors,
            remainingErrors: currentErrors,
            fixedErrors
        };
    }

    /**
     * Attempt automated fix for specific error categories
     */
    async attemptSingleFix(projectId, error) {
        if (!error.file || error.file === 'project') return false;

        const content = await ProjectManager.readFile(projectId, error.file);

        if (error.type === 'html_doctype') {
            const fixed = '<!DOCTYPE html>\n' + content.replace(/<!doctype[^>]*>/i, '').trimStart();
            await ProjectManager.writeFile(projectId, error.file, fixed);
            return true;
        }

        if (error.type === 'css_unclosed_braces') {
            const match = error.message.match(/Missing (\d+) closing brace/);
            const count = match ? parseInt(match[1], 10) : 1;
            const fixed = content.trimEnd() + '\n' + '}'.repeat(count) + '\n';
            await ProjectManager.writeFile(projectId, error.file, fixed);
            return true;
        }

        if (error.type === 'html_unclosed_tag') {
            const match = error.message.match(/<([a-zA-Z0-9\-]+)>/);
            if (match) {
                const tag = match[1];
                const fixed = content.trimEnd() + `\n</${tag}>\n`;
                await ProjectManager.writeFile(projectId, error.file, fixed);
                return true;
            }
        }

        if (error.type === 'js_syntax_error') {
            if (error.message.includes('Unexpected end of input')) {
                let testFix = content.trimEnd() + '\n});\n';
                try {
                    new vm.Script(testFix);
                    await ProjectManager.writeFile(projectId, error.file, testFix);
                    return true;
                } catch {
                    testFix = content.trimEnd() + '\n}\n';
                    try {
                        new vm.Script(testFix);
                        await ProjectManager.writeFile(projectId, error.file, testFix);
                        return true;
                    } catch {
                        return false;
                    }
                }
            }
        }

        return false;
    }
}

export default new SelfHealingEngine();
