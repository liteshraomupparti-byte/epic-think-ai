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

        // Safety snapshot prior to attempting healing
        let safetyCheckpoint = null;
        try {
            safetyCheckpoint = await ProjectManager.createCheckpoint(
                projectId,
                `[Self-Healing] Pre-repair safety snapshot (${initialDiag.errors.length} issue(s) detected)`
            );
        } catch (_) {}

        let currentErrors = initialDiag.errors;

        while (currentErrors.length > 0 && iteration < this.maxIterations) {
            iteration++;
            console.log(`[SelfHealingEngine] Iteration ${iteration}/${this.maxIterations}: resolving ${currentErrors.length} errors for ${projectId}`);

            for (const error of currentErrors) {
                try {
                    // 1. Try deterministic heuristic fix first
                    let healed = await this.attemptSingleFix(projectId, error);
                    let method = 'heuristic';

                    // 2. If heuristic failed, attempt AI repair
                    if (!healed) {
                        healed = await this.attemptAiRepair(projectId, error, options.modelPreset);
                        if (healed) method = 'ai_agent';
                    }

                    if (healed) {
                        fixedErrors.push({ error, iteration, method });
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
                    `[Self-Healing] Automatically repaired ${fixedErrors.length} syntax & markup issue(s) across ${iteration} iteration(s)`
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

        // Preserve previous working checkpoint if healing was unsuccessful after max iterations
        if (currentErrors.length > 0 && options.rollbackOnFailure !== false && safetyCheckpoint && safetyCheckpoint.success) {
            console.warn(`[SelfHealingEngine] Self-healing could not resolve all errors after ${iteration} iterations. Rolling back to pre-repair snapshot.`);
            try {
                await ProjectManager.undo(projectId);
            } catch (_) {}
            return {
                success: false,
                rolledBack: true,
                iterations: iteration,
                initialErrors: initialDiag.errors,
                remainingErrors: currentErrors,
                fixedErrors
            };
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

        let content = '';
        try {
            content = await ProjectManager.readFile(projectId, error.file);
        } catch (_) {
            return false;
        }

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

    /**
     * AI-Powered Self-Repair using Epic Think Coding Model Router
     * Feeds the error context, file name, line, and code to AIEngine
     */
    async attemptAiRepair(projectId, error, modelPreset = 'Epic Think 4o') {
        if (!error.file || error.file === 'project') return false;

        let content = '';
        try {
            content = await ProjectManager.readFile(projectId, error.file);
        } catch (_) {
            return false;
        }

        const ext = path.extname(error.file).toLowerCase();
        const systemPrompt = `You are Epic Think AI, an autonomous software diagnostic and self-healing agent.
A syntax or runtime error occurred in a project file.
Your job is to repair the code so it is 100% syntactically and functionally valid.
Maintain all existing structure and functionality, only fixing the bug/error.

Respond ONLY with a JSON object:
{
  "fixedCode": "the complete repaired source code of the file",
  "explanation": "concise description of the fix"
}`;

        const prompt = `File: ${error.file}
Error Type: ${error.type}
Error Message: ${error.message}
Error Line: ${error.line || 'unknown'}

Source Code to Repair:
${content}`;

        try {
            const { AIEngine } = await import('../../ai/index.js');
            const res = await AIEngine.generate({
                prompt,
                systemPrompt,
                modelPreset: modelPreset || 'Epic Think 4o'
            });

            // Extract JSON from LLM response
            let fixedCode = null;
            if (res && res.content) {
                let text = res.content.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
                const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
                if (jsonMatch) text = jsonMatch[1].trim();
                const start = text.indexOf('{');
                const end = text.lastIndexOf('}');
                if (start !== -1 && end !== -1 && end > start) {
                    try {
                        const parsed = JSON.parse(text.substring(start, end + 1));
                        fixedCode = parsed.fixedCode;
                    } catch (_) {}
                }
            }

            if (!fixedCode || typeof fixedCode !== 'string') {
                return false;
            }

            // Verify that the proposed fix actually resolves the error before writing to disk
            if (ext === '.js') {
                const testErrors = this.validateJs(fixedCode, error.file);
                if (testErrors.length > 0) {
                    console.warn(`[SelfHealingEngine] AI repair proposed code with ${testErrors.length} syntax error(s). Rejecting.`);
                    return false;
                }
            } else if (ext === '.css') {
                const testErrors = this.validateCss(fixedCode, error.file);
                if (testErrors.length > 0) {
                    console.warn(`[SelfHealingEngine] AI repair proposed CSS with ${testErrors.length} error(s). Rejecting.`);
                    return false;
                }
            } else if (ext === '.html') {
                const testErrors = this.validateHtml(fixedCode, error.file);
                if (testErrors.length > 0 && testErrors.some(e => e.type === error.type)) {
                    console.warn(`[SelfHealingEngine] AI repair failed to clear ${error.type}. Rejecting.`);
                    return false;
                }
            }

            await ProjectManager.writeFile(projectId, error.file, fixedCode);
            return true;
        } catch (err) {
            console.warn(`[SelfHealingEngine] AI repair attempt failed: ${err.message}`);
            return false;
        }
    }

    /**
     * Run full verification suite on a project, providing phase-5 completion criteria
     * @param {string} projectId
     * @returns {Promise<{ verified: boolean, buildResult: string, previewAvailable: boolean, filesChecked: number, tests: Array<{ name: string, passed: boolean, details?: string }>, limitations: Array<string> }>}
     */
    async verifyProject(projectId) {
        const tests = [];
        const limitations = [];
        const files = await ProjectManager.listFiles(projectId);
        const fileNames = files.map(f => f.relativePath || f.path);

        // 1. Core file existence
        const hasIndex = fileNames.includes('index.html');
        tests.push({
            name: 'Core File Existence (index.html)',
            passed: hasIndex,
            details: hasIndex ? 'Found index.html' : 'Missing index.html'
        });

        const hasStyles = fileNames.some(f => f.endsWith('.css'));
        tests.push({
            name: 'Styling Assets (.css)',
            passed: hasStyles,
            details: hasStyles ? 'Found CSS stylesheet' : 'No CSS files found'
        });

        // 2. Syntax diagnostics
        const diag = await this.diagnoseProject(projectId);
        tests.push({
            name: 'Static Code Diagnostics & Syntax Verification',
            passed: !diag.hasErrors,
            details: diag.hasErrors ? `${diag.errors.length} error(s) detected` : 'All files passed syntax and markup validation'
        });

        // 3. Asset & Link Integrity
        let brokenLinks = 0;
        if (hasIndex) {
            try {
                const indexContent = await ProjectManager.readFile(projectId, 'index.html');
                const srcMatches = [...indexContent.matchAll(/(?:src|href)=["']([^"':#]+)["']/g)];
                for (const match of srcMatches) {
                    const ref = match[1];
                    if (ref.startsWith('http') || ref.startsWith('//') || ref.startsWith('data:')) continue;
                    const cleanRef = ref.split('?')[0].split('#')[0];
                    if (cleanRef && !fileNames.includes(cleanRef)) {
                        brokenLinks++;
                    }
                }
            } catch (_) {}
        }

        tests.push({
            name: 'Local Asset & Link Integrity',
            passed: brokenLinks === 0,
            details: brokenLinks === 0 ? 'All local asset references exist' : `${brokenLinks} unresolved local reference(s)`
        });

        const allPassed = tests.every(t => t.passed);

        return {
            verified: allPassed,
            buildResult: allPassed ? 'SUCCESS' : 'FAILURE',
            previewAvailable: hasIndex,
            previewUrl: `/preview/${projectId}/index.html`,
            filesChecked: files.length,
            tests,
            limitations: limitations.length > 0 ? limitations : ['Preview runs client-side inside sandboxed iframe without backend PHP/Node execution']
        };
    }
}

export default new SelfHealingEngine();
