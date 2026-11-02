/**
 * CheckpointManager.js
 * Epic Think AI Website Builder - Safe Checkpointing & Rollback Engine
 * 
 * Creates immutable, restorable snapshots of project files before risky operations,
 * automated self-healing loops, or destructive agent modifications.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { ProjectManager } from './ProjectManager.js';

export class CheckpointManager {
  /**
   * Get the checkpoints directory for a specific project
   */
  static getCheckpointsDir(projectId) {
    const projectDir = ProjectManager.getProjectPath(projectId);
    const cpDir = path.join(projectDir, '.checkpoints');
    if (!fs.existsSync(cpDir)) {
      fs.mkdirSync(cpDir, { recursive: true });
    }
    return cpDir;
  }

  /**
   * Create a checkpoint snapshot of all project files
   * @param {string} projectId 
   * @param {string} label 
   * @param {object} [metadata]
   * @returns {Promise<{ checkpointId: string, label: string, timestamp: string, fileCount: number }>}
   */
  static async createCheckpoint(projectId, label = 'manual-checkpoint', metadata = {}) {
    const projectDir = ProjectManager.getProjectPath(projectId);
    if (!fs.existsSync(projectDir)) {
      throw new Error(`Project directory does not exist: ${projectId}`);
    }

    const files = await ProjectManager.listFiles(projectId);
    const snapshotFiles = {};
    let totalBytes = 0;

    for (const file of files) {
      if (file.type === 'directory') continue;
      const relPath = file.relativePath || file.path;
      if (!relPath || relPath.startsWith('.checkpoints') || relPath.startsWith('.git')) continue;

      try {
        const content = await ProjectManager.readFile(projectId, relPath);
        const hash = crypto.createHash('sha256').update(content).digest('hex').slice(0, 12);
        snapshotFiles[relPath] = {
          content,
          hash,
          size: Buffer.byteLength(content, 'utf8')
        };
        totalBytes += snapshotFiles[relPath].size;
      } catch (err) {
        console.warn(`[CHECKPOINT] Could not snapshot file ${relPath}:`, err.message);
      }
    }

    const checkpointId = `cp_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const manifest = {
      checkpointId,
      projectId,
      label,
      timestamp: new Date().toISOString(),
      fileCount: Object.keys(snapshotFiles).length,
      totalBytes,
      metadata,
      files: snapshotFiles
    };

    const cpDir = this.getCheckpointsDir(projectId);
    const cpFilePath = path.join(cpDir, `${checkpointId}.json`);
    fs.writeFileSync(cpFilePath, JSON.stringify(manifest, null, 2), 'utf8');

    return {
      checkpointId,
      label,
      timestamp: manifest.timestamp,
      fileCount: manifest.fileCount,
      totalBytes
    };
  }

  /**
   * Restore a project to a specific checkpoint
   * @param {string} projectId 
   * @param {string} checkpointId 
   * @returns {Promise<{ restored: boolean, checkpointId: string, restoredFilesCount: number }>}
   */
  static async restoreCheckpoint(projectId, checkpointId) {
    const cpDir = this.getCheckpointsDir(projectId);
    const cpFilePath = path.join(cpDir, `${checkpointId}.json`);

    if (!fs.existsSync(cpFilePath)) {
      throw new Error(`Checkpoint ${checkpointId} not found for project ${projectId}`);
    }

    const manifest = JSON.parse(fs.readFileSync(cpFilePath, 'utf8'));
    const files = manifest.files || {};
    let restoredCount = 0;

    for (const [relPath, fileData] of Object.entries(files)) {
      await ProjectManager.writeFile(projectId, relPath, fileData.content);
      restoredCount++;
    }

    return {
      restored: true,
      checkpointId,
      label: manifest.label,
      timestamp: manifest.timestamp,
      restoredFilesCount: restoredCount
    };
  }

  /**
   * List all checkpoints for a project
   */
  static listCheckpoints(projectId) {
    try {
      const cpDir = this.getCheckpointsDir(projectId);
      if (!fs.existsSync(cpDir)) return [];

      const entries = fs.readdirSync(cpDir)
        .filter(f => f.endsWith('.json'))
        .map(f => {
          try {
            const raw = fs.readFileSync(path.join(cpDir, f), 'utf8');
            const data = JSON.parse(raw);
            return {
              checkpointId: data.checkpointId,
              label: data.label,
              timestamp: data.timestamp,
              fileCount: data.fileCount,
              totalBytes: data.totalBytes
            };
          } catch {
            return null;
          }
        })
        .filter(Boolean)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      return entries;
    } catch {
      return [];
    }
  }

  /**
   * Delete a checkpoint
   */
  static deleteCheckpoint(projectId, checkpointId) {
    const cpDir = this.getCheckpointsDir(projectId);
    const cpFilePath = path.join(cpDir, `${checkpointId}.json`);
    if (fs.existsSync(cpFilePath)) {
      fs.unlinkSync(cpFilePath);
      return true;
    }
    return false;
  }
}
