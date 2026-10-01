/**
 * Epic Think AI - Website Builder Project Manager
 * 
 * Manages project workspaces, file systems, and Git-backed versioning:
 * - Directory isolation under builder_projects/<projectId>
 * - Git repository initialization for zero-loss checkpointing
 * - Atomic multi-file writes and recursive tree enumeration
 * - Full Undo / Redo / History / Diff recovery
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECTS_ROOT = process.env.VERCEL 
  ? path.join(os.tmpdir(), 'builder_projects')
  : path.resolve(__dirname, '../../builder_projects');

// Ensure root projects directory exists safely
try {
  if (!fs.existsSync(PROJECTS_ROOT)) {
    fs.mkdirSync(PROJECTS_ROOT, { recursive: true });
  }
} catch (err) {
  console.warn('[PROJECT_MANAGER] Non-fatal root init note:', err.message);
}

export class ProjectManager {
  static getProjectsRoot() {
    return PROJECTS_ROOT;
  }

  static getProjectDir(projectId) {
    if (!projectId || /[^a-zA-Z0-9_\-]/.test(projectId)) {
      throw new Error(`Invalid project ID format: "${projectId}"`);
    }
    return path.join(PROJECTS_ROOT, projectId);
  }

  static getProjectPath(projectId) {
    return this.getProjectDir(projectId);
  }

  /**
   * Create and initialize a new website project
   */
  static async createProject(idOrOptions, maybeOptions = {}) {
    let opts = {};
    if (typeof idOrOptions === 'string') {
      opts = { id: idOrOptions, ...maybeOptions };
    } else {
      opts = idOrOptions || {};
    }

    const { id, name, description, framework = 'html_modern', designSystem = 'luxury_gold', preset, uid = 'anonymous', ownerUid } = opts;
    const finalDesignSystem = designSystem || preset || 'luxury_gold';
    const projectId = (id || `proj_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`).toLowerCase();
    const projectDir = this.getProjectDir(projectId);

    if (fs.existsSync(projectDir)) {
      // If already exists, return updated metadata instead of throwing
      const existing = await this.getProject(projectId);
      if (existing) {
        return await this.updateProject(projectId, {
          name: name || existing.name,
          description: description || existing.description,
          framework: framework || existing.framework,
          designSystem: finalDesignSystem,
          updatedAt: Date.now()
        });
      }
    }

    fs.mkdirSync(projectDir, { recursive: true });
    fs.mkdirSync(path.join(projectDir, 'assets'), { recursive: true });
    fs.mkdirSync(path.join(projectDir, 'css'), { recursive: true });
    fs.mkdirSync(path.join(projectDir, 'js'), { recursive: true });
    fs.mkdirSync(path.join(projectDir, 'components'), { recursive: true });

    const metadata = {
      id: projectId,
      name: name || 'Untitled Website',
      description: description || 'Created with Epic Think AI Website Builder',
      framework,
      designSystem,
      uid,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: 1,
      lastCheckpoint: 'Initial Project Creation',
      routes: ['/'],
      previewUrl: `/preview/${projectId}/index.html`
    };

    fs.writeFileSync(path.join(projectDir, 'project.json'), JSON.stringify(metadata, null, 2), 'utf8');

    // Initialize local Git repo for real atomic versioning
    try {
      await execAsync('git init', { cwd: projectDir });
      await execAsync('git config user.name "Epic Think AI Builder"', { cwd: projectDir });
      await execAsync('git config user.email "builder@epicthink.ai"', { cwd: projectDir });
    } catch (err) {
      console.warn(`[PROJECT_MANAGER] Git init warning for ${projectId}:`, err.message);
    }

    if (opts.autoGenerate !== false) {
      await this.ensureProjectFiles(projectId, opts);
    }

    return metadata;
  }

  /**
   * Ensure project has complete working files (index.html, styles, scripts)
   */
  static async ensureProjectFiles(projectId, options = {}) {
    const projectDir = this.getProjectDir(projectId);
    const indexPath = path.join(projectDir, 'index.html');

    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir, { recursive: true });
    }

    if (!fs.existsSync(indexPath)) {
      try {
        const { CodeGenerator } = await import('./CodeGenerator.js');
        const isDevika = /devika/i.test(projectId);
        const title = options.name || (isDevika ? 'Devika Collections' : projectId.replace(/_/g, ' '));
        const preset = options.preset || (isDevika ? 'luxury_gold' : 'luxury_gold');
        const prompt = options.prompt || (isDevika
          ? 'Create a premium luxury fashion ecommerce website called Devika Collections'
          : `Create a modern luxury website for ${title}`);

        const genResult = await CodeGenerator.generateProject({
          projectId,
          prompt,
          preset
        });

        for (const f of genResult.files) {
          const full = path.join(projectDir, f.path);
          fs.mkdirSync(path.dirname(full), { recursive: true });
          fs.writeFileSync(full, f.content, 'utf8');
        }

        try {
          await execAsync('git add .', { cwd: projectDir });
          await execAsync('git commit -m "Auto-generated website initialization"', { cwd: projectDir });
        } catch (_) {}
      } catch (err) {
        console.warn(`[PROJECT_MANAGER] ensureProjectFiles fallback for ${projectId}:`, err.message);
      }
    }
    return true;
  }

  /**
   * List all projects
   */
  static async listProjects(filterUid = null) {
    const entries = fs.readdirSync(PROJECTS_ROOT, { withFileTypes: true });
    const projects = [];

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const metaPath = path.join(PROJECTS_ROOT, entry.name, 'project.json');
        if (fs.existsSync(metaPath)) {
          try {
            const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
            if (!filterUid || meta.uid === filterUid || filterUid === 'all') {
              projects.push(meta);
            }
          } catch (_) {}
        }
      }
    }

    return projects.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  }

  /**
   * Get single project metadata
   */
  static async getProject(projectId) {
    const projectDir = this.getProjectDir(projectId);
    const metaPath = path.join(projectDir, 'project.json');
    if (!fs.existsSync(metaPath)) {
      return null;
    }
    return JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  }

  /**
   * Update project metadata
   */
  static async updateProject(projectId, updates = {}) {
    const meta = await this.getProject(projectId);
    if (!meta) throw new Error(`Project not found: ${projectId}`);

    const updated = {
      ...meta,
      ...updates,
      updatedAt: Date.now()
    };

    const projectDir = this.getProjectDir(projectId);
    fs.writeFileSync(path.join(projectDir, 'project.json'), JSON.stringify(updated, null, 2), 'utf8');
    return updated;
  }

  /**
   * Save / overwrite a file in the project
   */
  static async saveFile(projectId, relativePath, content) {
    const projectDir = this.getProjectDir(projectId);
    const cleanRelPath = relativePath.replace(/^[\/\\]+/, '').replace(/\.\.[\/\\]/g, '');
    const fullPath = path.join(projectDir, cleanRelPath);

    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content, 'utf8');

    await this.updateProject(projectId, { updatedAt: Date.now() });

    return {
      success: true,
      path: cleanRelPath,
      size: Buffer.byteLength(content, 'utf8')
    };
  }

  /**
   * Read file content
   */
  static async readFile(projectId, relativePath) {
    const projectDir = this.getProjectDir(projectId);
    const cleanRelPath = relativePath.replace(/^[\/\\]+/, '').replace(/\.\.[\/\\]/g, '');
    const fullPath = path.join(projectDir, cleanRelPath);

    if (!fs.existsSync(fullPath)) {
      if (cleanRelPath === 'index.html' || cleanRelPath.startsWith('css/') || cleanRelPath.startsWith('js/')) {
        await this.ensureProjectFiles(projectId);
        if (fs.existsSync(fullPath)) {
          return fs.readFileSync(fullPath, 'utf8');
        }
      }
      throw new Error(`File not found: ${cleanRelPath} in project ${projectId}`);
    }

    return fs.readFileSync(fullPath, 'utf8');
  }

  /**
   * Delete a file
   */
  static async deleteFile(projectId, relativePath) {
    const projectDir = this.getProjectDir(projectId);
    const cleanRelPath = relativePath.replace(/^[\/\\]+/, '').replace(/\.\.[\/\\]/g, '');
    const fullPath = path.join(projectDir, cleanRelPath);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
    return { success: true };
  }

  /**
   * Enumerate all project files recursively
   */
  static async getFiles(projectId) {
    const projectDir = this.getProjectDir(projectId);
    const results = [];

    function scan(dir, relPrefix = '') {
      const items = fs.readdirSync(dir, { withFileTypes: true });
      for (const item of items) {
        if (item.name === '.git' || item.name === 'node_modules') continue;
        const itemRel = relPrefix ? `${relPrefix}/${item.name}` : item.name;
        const itemFull = path.join(dir, item.name);

        if (item.isDirectory()) {
          results.push({
            name: item.name,
            path: itemRel,
            type: 'directory'
          });
          scan(itemFull, itemRel);
        } else {
          const stats = fs.statSync(itemFull);
          results.push({
            name: item.name,
            path: itemRel,
            relativePath: itemRel,
            type: 'file',
            size: stats.size,
            updatedAt: stats.mtimeMs
          });
        }
      }
    }

    if (fs.existsSync(projectDir)) {
      scan(projectDir);
    }

    return results;
  }

  static async writeFile(projectId, relativePath, content) {
    return this.saveFile(projectId, relativePath, content);
  }

  static async listFiles(projectId) {
    return this.getFiles(projectId);
  }

  /**
   * Create Git Checkpoint / Snapshot
   */
  static async createCheckpoint(projectId, message = 'Update website') {
    const projectDir = this.getProjectDir(projectId);
    try {
      await execAsync('git add .', { cwd: projectDir });
      const { stdout } = await execAsync(`git commit -m "${message.replace(/"/g, '\\"')}"`, { cwd: projectDir });
      
      const { stdout: hashOut } = await execAsync('git rev-parse HEAD', { cwd: projectDir });
      const commitHash = hashOut.trim();

      await this.updateProject(projectId, {
        lastCheckpoint: message,
        lastCommitHash: commitHash
      });

      return { success: true, commitHash, message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  /**
   * Get version history (Git log)
   */
  static async getHistory(projectId) {
    const projectDir = this.getProjectDir(projectId);
    try {
      const { stdout } = await execAsync('git log --pretty=format:"%H|%s|%an|%ad" --date=iso -n 25', { cwd: projectDir });
      const lines = stdout.trim().split('\n').filter(Boolean);
      return lines.map((line, idx) => {
        const [hash, msg, author, date] = line.split('|');
        return {
          versionNumber: lines.length - idx,
          hash,
          message: msg,
          author,
          date,
          timestamp: new Date(date).getTime()
        };
      });
    } catch (_) {
      return [];
    }
  }

  /**
   * Undo to previous commit
   */
  static async undo(projectId) {
    const projectDir = this.getProjectDir(projectId);
    try {
      await execAsync('git reset --hard HEAD~1', { cwd: projectDir });
      await this.updateProject(projectId, { lastCheckpoint: 'Undid last change' });
      return { success: true, message: 'Reverted to previous checkpoint' };
    } catch (err) {
      return { success: false, error: 'Cannot undo further: ' + err.message };
    }
  }

  /**
   * Restore specific checkpoint
   */
  static async restoreCheckpoint(projectId, commitHash) {
    const projectDir = this.getProjectDir(projectId);
    try {
      await execAsync(`git checkout ${commitHash} -- .`, { cwd: projectDir });
      await execAsync(`git commit -m "Restored checkpoint ${commitHash.slice(0, 7)}"`, { cwd: projectDir });
      await this.updateProject(projectId, { lastCheckpoint: `Restored ${commitHash.slice(0, 7)}` });
      return { success: true, message: `Restored to commit ${commitHash.slice(0, 7)}` };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  /**
   * Get Git Diff between current working tree and HEAD (or specific commit)
   */
  static async getDiff(projectId, targetHash = 'HEAD') {
    const projectDir = this.getProjectDir(projectId);
    try {
      const { stdout } = await execAsync(`git diff ${targetHash}`, { cwd: projectDir });
      return { success: true, diff: stdout };
    } catch (err) {
      return { success: false, diff: '', error: err.message };
    }
  }

  /**
   * Delete complete project
   */
  static async deleteProject(projectId) {
    const projectDir = this.getProjectDir(projectId);
    if (fs.existsSync(projectDir)) {
      fs.rmSync(projectDir, { recursive: true, force: true });
    }
    return { success: true, projectId };
  }
}
