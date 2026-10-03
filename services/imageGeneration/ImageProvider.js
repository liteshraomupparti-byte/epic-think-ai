/**
 * Epic Think AI - Base Image Provider Interface
 * 
 * Defines standard contract for all image generation and editing providers:
 * - generateImage(params)
 * - editImage(params)
 * - getCapabilities()
 * - getModelInfo(modelId)
 */

export class ImageProvider {
  /**
   * @param {string} name - Display name of provider
   * @param {string} id - Canonical provider ID
   */
  constructor(name, id) {
    this.name = name;
    this.id = id;
  }

  /**
   * Generate an image from prompt and specification
   * @param {Object} params
   * @returns {Promise<Object>}
   */
  async generateImage(params) {
    throw new Error(`generateImage() is not implemented by ${this.constructor.name}`);
  }

  /**
   * Edit or transform an existing image using reference image and instructions
   * @param {Object} params
   * @returns {Promise<Object>}
   */
  async editImage(params) {
    throw new Error(`editImage() is not implemented by ${this.constructor.name}`);
  }

  /**
   * Returns provider capabilities (supported models, resolutions, aspect ratios)
   * @returns {Object}
   */
  getCapabilities() {
    throw new Error(`getCapabilities() is not implemented by ${this.constructor.name}`);
  }

  /**
   * Returns metadata for a specific model ID
   * @param {string} modelId
   * @returns {Object|null}
   */
  getModelInfo(modelId) {
    throw new Error(`getModelInfo() is not implemented by ${this.constructor.name}`);
  }
}
