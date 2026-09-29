/**
 * Epic Think AI - 4-Tier Permission Manager
 * 
 * Enforces risk classification:
 * - READ: Safe, read-only data access (Auto-approved)
 * - WRITE: Non-destructive local modifications & drafts (Auto-approved, logged)
 * - EXTERNAL_ACTION: Public messages, emails, merges (Requires User Confirmation)
 * - DESTRUCTIVE: Permanent data loss, deletions (Requires Explicit Confirmation)
 */

export const RiskTiers = {
  READ: 'READ',
  WRITE: 'WRITE',
  EXTERNAL_ACTION: 'EXTERNAL_ACTION',
  DESTRUCTIVE: 'DESTRUCTIVE'
};

export class PermissionManager {
  /**
   * Determine whether a tool requires human-in-the-loop confirmation
   */
  static requiresConfirmation(tool) {
    if (!tool) return false;
    if (typeof tool.requiresConfirmation === 'boolean') {
      return tool.requiresConfirmation;
    }
    return tool.permissionTier === RiskTiers.EXTERNAL_ACTION || tool.permissionTier === RiskTiers.DESTRUCTIVE;
  }

  /**
   * Validate that an execution request meets all permission prerequisites
   */
  static validateExecutionRequest({ uid, plugin, tool, lifecycleState }) {
    if (!uid) {
      return { allowed: false, reason: 'Unauthorized: Missing authenticated Firebase UID.' };
    }

    if (!plugin) {
      return { allowed: false, reason: 'Plugin not found.' };
    }

    if (!tool) {
      return { allowed: false, reason: 'Tool not found in plugin registry.' };
    }

    // Only ENABLED plugins can execute tools
    if (lifecycleState !== 'ENABLED') {
      return {
        allowed: false,
        reason: `Plugin "${plugin.name}" is currently ${lifecycleState || 'DISABLED'}. Enable it in the Plugin Store to use this tool.`
      };
    }

    return {
      allowed: true,
      riskTier: tool.permissionTier || RiskTiers.READ,
      requiresConfirmation: PermissionManager.requiresConfirmation(tool)
    };
  }

  /**
   * Format human-readable permission explanation for the Plugin Store UI
   */
  static describeToolPermission(tool) {
    switch (tool.permissionTier) {
      case RiskTiers.READ:
        return 'Read data from service (search, view, list)';
      case RiskTiers.WRITE:
        return 'Create drafts and stage modifications';
      case RiskTiers.EXTERNAL_ACTION:
        return 'Send messages or interact with external recipients (Requires your confirmation)';
      case RiskTiers.DESTRUCTIVE:
        return 'Delete or permanently modify data (Requires your explicit confirmation)';
      default:
        return 'Execute service tool';
    }
  }
}
