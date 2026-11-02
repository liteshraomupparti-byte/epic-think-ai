/**
 * ComfyUIClient.js
 * Epic Think AI - External ComfyUI GPU Inference Client
 * 
 * Interacts with an external ComfyUI server running on dedicated GPU infrastructure
 * (e.g. RunPod, Modal, or local RTX workstation) without overloading Vercel serverless functions.
 */

export class ComfyUIClient {
  constructor(serverUrl = null) {
    this.serverUrl = serverUrl || process.env.COMFYUI_API_URL || 'http://127.0.0.1:8188';
  }

  /**
   * Check if external ComfyUI GPU worker is online
   */
  async checkHealth() {
    try {
      const res = await fetch(`${this.serverUrl}/system_stats`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const stats = await res.json();
        return { online: true, serverUrl: this.serverUrl, stats };
      }
      return { online: false, error: `HTTP ${res.status}` };
    } catch (err) {
      return { online: false, error: err.message };
    }
  }

  /**
   * Queue a generation workflow prompt
   */
  async queuePrompt(workflowPrompt, clientId = 'epic_think_client') {
    const res = await fetch(`${this.serverUrl}/prompt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: workflowPrompt,
        client_id: clientId
      }),
      signal: AbortSignal.timeout(10000)
    });

    if (!res.ok) {
      throw new Error(`ComfyUI queue failed with status ${res.status}: ${await res.text()}`);
    }

    const data = await res.json();
    return {
      promptId: data.prompt_id,
      number: data.number
    };
  }

  /**
   * Retrieve execution history and outputs for a prompt ID
   */
  async getHistory(promptId) {
    const res = await fetch(`${this.serverUrl}/history/${promptId}`, {
      signal: AbortSignal.timeout(5000)
    });
    if (!res.ok) return null;
    const history = await res.json();
    return history[promptId] || null;
  }

  /**
   * Interrupt and cancel current generation job on the GPU worker
   */
  async interrupt() {
    try {
      const res = await fetch(`${this.serverUrl}/interrupt`, { method: 'POST' });
      return res.ok;
    } catch {
      return false;
    }
  }

  /**
   * Standard SDXL Image Generation Workflow
   */
  async generateImage({ prompt, negativePrompt = 'low quality, blurry, deformed', width = 1024, height = 1024, steps = 25, seed = null }) {
    const health = await this.checkHealth();
    if (!health.online) {
      throw new Error(`External ComfyUI GPU worker is currently unreachable at ${this.serverUrl}. (${health.error})`);
    }

    const actualSeed = seed || Math.floor(Math.random() * 1000000000);
    // Standard ComfyUI node graph
    const workflow = {
      "3": {
        "class_type": "KSampler",
        "inputs": {
          "cfg": 7,
          "denoise": 1,
          "latent_image": ["5", 0],
          "model": ["4", 0],
          "negative": ["7", 0],
          "positive": ["6", 0],
          "sampler_name": "euler_ancestral",
          "scheduler": "normal",
          "seed": actualSeed,
          "steps": steps
        }
      },
      "4": {
        "class_type": "CheckpointLoaderSimple",
        "inputs": { "ckpt_name": "sd_xl_base_1.0.safetensors" }
      },
      "5": {
        "class_type": "EmptyLatentImage",
        "inputs": { "batch_size": 1, "height": height, "width": width }
      },
      "6": {
        "class_type": "CLIPTextEncode",
        "inputs": { "clip": ["4", 1], "text": prompt }
      },
      "7": {
        "class_type": "CLIPTextEncode",
        "inputs": { "clip": ["4", 1], "text": negativePrompt }
      },
      "8": {
        "class_type": "VAEDecode",
        "inputs": { "samples": ["3", 0], "vae": ["4", 2] }
      },
      "9": {
        "class_type": "SaveImage",
        "inputs": { "filename_prefix": "EpicThink_ComfyUI", "images": ["8", 0] }
      }
    };

    const queued = await this.queuePrompt(workflow);
    return {
      promptId: queued.promptId,
      status: 'QUEUED',
      serverUrl: this.serverUrl,
      seed: actualSeed
    };
  }
}
