/**
 * Epic Think AI - Base Plugin Abstract Contract
 * 
 * All provider plugins must extend BasePlugin.
 * Enforces declarative manifests, strict tool schemas, and lifecycle hooks.
 */

export class BasePlugin {
  constructor(manifest = {}) {
    if (this.constructor === BasePlugin) {
      throw new Error('BasePlugin is an abstract class and cannot be instantiated directly.');
    }

    this.manifest = manifest;
    this.validateManifest();
    this.tools = new Map();
  }

  /**
   * Validate that the plugin manifest adheres to strict requirements
   */
  validateManifest() {
    const required = ['id', 'name', 'version', 'category', 'authType'];
    for (const field of required) {
      if (!this.manifest[field]) {
        throw new Error(`Plugin manifest error: Missing required property "${field}".`);
      }
    }

    const validAuthTypes = ['oauth2', 'api_key', 'bot_token', 'none'];
    if (!validAuthTypes.includes(this.manifest.authType)) {
      throw new Error(`Invalid authType "${this.manifest.authType}". Expected one of: ${validAuthTypes.join(', ')}`);
    }

    const validCategories = ['productivity', 'developer', 'communication', 'search', 'utility'];
    if (!validCategories.includes(this.manifest.category)) {
      throw new Error(`Invalid category "${this.manifest.category}". Expected one of: ${validCategories.join(', ')}`);
    }
  }

  get id() {
    return this.manifest.id;
  }

  get name() {
    return this.manifest.name;
  }

  get version() {
    return this.manifest.version;
  }

  get category() {
    return this.manifest.category;
  }

  get authType() {
    return this.manifest.authType;
  }

  get description() {
    return this.manifest.description || '';
  }

  get icon() {
    return this.manifest.icon || '';
  }

  /**
   * Register a tool definition adhering to JSON Schema standards
   */
  registerTool(toolDef) {
    if (!toolDef || !toolDef.name || !toolDef.description || !toolDef.handler) {
      throw new Error(`Invalid tool definition for plugin ${this.id}: must have name, description, and handler.`);
    }

    const validTiers = ['READ', 'WRITE', 'EXTERNAL_ACTION', 'DESTRUCTIVE'];
    if (!validTiers.includes(toolDef.permissionTier)) {
      throw new Error(`Tool "${toolDef.name}" has invalid permissionTier "${toolDef.permissionTier}". Expected one of: ${validTiers.join(', ')}`);
    }

    this.tools.set(toolDef.name, {
      name: toolDef.name,
      pluginId: this.id,
      description: toolDef.description,
      parameters: toolDef.parameters || { type: 'object', properties: {} },
      permissionTier: toolDef.permissionTier,
      requiresConfirmation: toolDef.requiresConfirmation ?? (toolDef.permissionTier === 'EXTERNAL_ACTION' || toolDef.permissionTier === 'DESTRUCTIVE'),
      handler: toolDef.handler
    });
  }

  getTools() {
    return Array.from(this.tools.values());
  }

  getTool(toolName) {
    return this.tools.get(toolName) || null;
  }

  // Lifecycle Hooks (Can be overridden by providers)
  async onInit() {}
  async onInstall(uid) {}
  async onUninstall(uid) {}
  async onEnable(uid) {}
  async onDisable(uid) {}
  async onDisconnect(uid) {}
  async healthCheck(uid) {
    return { healthy: true, status: 'ready' };
  }
}
