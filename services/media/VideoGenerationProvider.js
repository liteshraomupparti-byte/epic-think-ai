/**
 * Epic Think AI - Video Generation Provider System
 * 
 * Capabilities:
 * - Text-to-Video and Image-to-Video
 * - Duration & Aspect Ratio control (16:9, 9:16, 1:1)
 * - Pollinations Video Models (Veo 3.1 Fast, Wan 2.2, Seedance, Pruna)
 * - Provider-neutral Job Lifecycle (QUEUED → SUBMITTED → PROCESSING → COMPLETED)
 * - Clear setup state when unconfigured (never faking completion)
 */

import { GenerationJobService, JOB_STATUSES } from './GenerationJobService.js';
import { UsageMeter, ESTIMATED_COSTS_INR } from './UsageMeter.js';
import { SafeLogger } from '../../plugins/core/SafeLogger.js';

export class VideoProvider {
  constructor(name, id) {
    this.name = name;
    this.id = id;
  }

  async generateVideo(params) {
    throw new Error('generateVideo() must be implemented');
  }

  getCapabilities() {
    throw new Error('getCapabilities() must be implemented');
  }
}

export class PollinationsVideoProvider extends VideoProvider {
  static BASE_URL = 'https://gen.pollinations.ai/image';
  static CATALOG_URL = 'https://gen.pollinations.ai/video/models';

  static VERIFIED_MODELS = [
    {
      id: 'google/veo-3.1-fast',
      name: 'Google Veo 3.1 Fast',
      aliases: ['veo', 'veo-720p', 'video'],
      publisher: 'Google',
      durations: [4, 6, 8],
      resolutions: ['720p', '1080p'],
      supportsImageToVideo: true,
      hasAudio: true,
      estimatedCostInr: 28.0
    },
    {
      id: 'alibaba/wan-2.2-fast',
      name: 'Alibaba Wan 2.2 Fast',
      aliases: ['wan-fast', 'wan2.2'],
      publisher: 'Alibaba',
      durations: [5],
      resolutions: ['480p'],
      supportsImageToVideo: true,
      hasAudio: false,
      estimatedCostInr: 4.50
    },
    {
      id: 'prunaai/p-video',
      name: 'Pruna p-video',
      aliases: ['pruna-video', 'p-video'],
      publisher: 'Pruna',
      durations: [2, 4, 5, 10],
      resolutions: ['720p', '1080p'],
      supportsImageToVideo: true,
      hasAudio: false,
      estimatedCostInr: 9.0
    },
    {
      id: 'bytedance/seedance-2.0',
      name: 'ByteDance Seedance 2.0',
      aliases: ['seedance-2', 'seedance-2.0'],
      publisher: 'ByteDance',
      durations: [4, 5, 10, 15],
      resolutions: ['720p'],
      supportsImageToVideo: true,
      hasAudio: true,
      estimatedCostInr: 16.0
    }
  ];

  constructor() {
    super('Pollinations Video', 'pollinations_video');
  }

  static hasApiKey() {
    const key = process.env.POLLINATIONS_API_KEY;
    return Boolean(key && key.trim().length > 0);
  }

  getCapabilities() {
    const configured = PollinationsVideoProvider.hasApiKey();
    return {
      provider: this.name,
      id: this.id,
      isConfigured: configured,
      requiresKey: true,
      models: PollinationsVideoProvider.VERIFIED_MODELS,
      supportedDurations: [4, 5, 6, 8, 10, 15],
      supportedAspectRatios: ['16:9', '9:16', '1:1'],
      supportedResolutions: ['480p', '720p', '1080p'],
      setupInstructions: configured ? null : 'Configure POLLINATIONS_API_KEY in server environment to enable live video rendering.'
    };
  }

  /**
   * Submit and process video job
   */
  async submitVideoJob({ uid, prompt, imageUrl = null, model = 'google/veo-3.1-fast', duration = 4, aspectRatio = '16:9', resolution = '720p' }) {
    const configured = PollinationsVideoProvider.hasApiKey();

    // 1. Budget & Concurrency Pre-check
    const matchedModel = PollinationsVideoProvider.VERIFIED_MODELS.find(m => m.id === model || m.aliases.includes(model)) || PollinationsVideoProvider.VERIFIED_MODELS[0];
    const estimatedCost = configured ? (matchedModel.estimatedCostInr || 10) : 0;

    const budgetCheck = UsageMeter.checkBudget(uid, 'video', estimatedCost);
    if (!budgetCheck.allowed) {
      const err = new Error(budgetCheck.reason);
      err.code = 'BUDGET_EXCEEDED';
      throw err;
    }

    // 2. Concurrency check (max 2 active jobs per user)
    const activeJobs = GenerationJobService.listUserJobs(uid).filter(
      j => j.status === JOB_STATUSES.QUEUED || j.status === JOB_STATUSES.PROCESSING || j.status === JOB_STATUSES.SUBMITTED
    );
    if (activeJobs.length >= 2) {
      const err = new Error('Maximum 2 concurrent video jobs allowed. Please wait for previous jobs to complete.');
      err.code = 'CONCURRENCY_LIMIT';
      throw err;
    }

    // 3. Create persistent job record
    const job = GenerationJobService.createJob({
      uid,
      type: 'video',
      prompt,
      provider: this.id,
      model: matchedModel.id,
      params: { duration, aspectRatio, resolution, hasImageUrl: !!imageUrl }
    });

    // 4. If unconfigured: Return explicit SETUP_REQUIRED with structured storyboard (never fake success!)
    if (!configured) {
      GenerationJobService.updateJob(job.jobId, {
        status: JOB_STATUSES.FAILED,
        error: 'Video provider credentials missing. Please set POLLINATIONS_API_KEY in your environment to generate video files.',
        result: {
          setupRequired: true,
          providerStatus: 'UNCONFIGURED',
          message: 'Video provider is not configured. Add POLLINATIONS_API_KEY in .env or Settings.',
          suggestedStoryboard: [
            {
              scene: 1,
              timeframe: '0s - 2s',
              cameraMotion: 'Establishing Wide Dolly',
              description: `Initial frame: ${prompt}`
            },
            {
              scene: 2,
              timeframe: `2s - ${duration}s`,
              cameraMotion: 'Dynamic Subject Track',
              description: `Action sequence resolving: ${prompt}`
            }
          ]
        }
      });

      return GenerationJobService.getJob(job.jobId);
    }

    // 5. If configured: Transition to SUBMITTED and run async generation worker
    GenerationJobService.updateJob(job.jobId, { status: JOB_STATUSES.SUBMITTED, progress: 10 });

    // Execute in background so the HTTP response returns immediately (prevents Vercel serverless timeouts)
    this._executeVideoGeneration(job.jobId, {
      uid,
      prompt,
      imageUrl,
      model: matchedModel.id,
      duration,
      aspectRatio,
      resolution,
      estimatedCost
    }).catch(err => {
      SafeLogger.error('[PollinationsVideoProvider] Background job error', { jobId: job.jobId, error: err.message });
      GenerationJobService.updateJob(job.jobId, {
        status: JOB_STATUSES.FAILED,
        error: err.message
      });
    });

    return GenerationJobService.getJob(job.jobId);
  }

  /**
   * Background generation worker
   */
  async _executeVideoGeneration(jobId, { uid, prompt, imageUrl, model, duration, aspectRatio, resolution, estimatedCost }) {
    GenerationJobService.updateJob(jobId, { status: JOB_STATUSES.PROCESSING, progress: 30 });

    const apiKey = (process.env.POLLINATIONS_API_KEY || '').trim();
    const params = new URLSearchParams();
    params.set('model', model);
    params.set('duration', String(duration));
    params.set('aspect_ratio', aspectRatio);
    if (imageUrl) params.set('image', imageUrl);

    const targetUrl = `${PollinationsVideoProvider.BASE_URL}/${encodeURIComponent(prompt)}?${params.toString()}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000); // 90s worker timeout

    try {
      const res = await fetch(targetUrl, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'video/mp4, application/json, */*'
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Provider returned HTTP ${res.status}: ${errText.slice(0, 150)}`);
      }

      GenerationJobService.updateJob(jobId, { progress: 85 });

      const contentType = res.headers.get('content-type') || '';
      let videoUrl = null;

      if (contentType.includes('application/json')) {
        const data = await res.json();
        videoUrl = data.url || data.video_url || (Array.isArray(data) && data[0]?.url);
      } else if (contentType.includes('video/') || contentType.includes('application/octet-stream')) {
        // Direct video stream received
        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.length > 5000) {
          videoUrl = `data:video/mp4;base64,${buf.toString('base64')}`;
        }
      }

      if (!videoUrl) {
        throw new Error('Provider succeeded but returned no valid video URL or stream.');
      }

      // Record successful usage
      await UsageMeter.recordUsage({
        uid,
        type: 'video',
        provider: 'pollinations_video',
        model,
        costInr: estimatedCost,
        metadata: { duration, aspectRatio, resolution }
      });

      GenerationJobService.updateJob(jobId, {
        status: JOB_STATUSES.COMPLETED,
        progress: 100,
        result: {
          videoUrl,
          duration: `${duration}s`,
          aspectRatio,
          resolution,
          model,
          provider: 'Pollinations Video'
        }
      });
    } catch (err) {
      GenerationJobService.updateJob(jobId, {
        status: JOB_STATUSES.FAILED,
        error: err.message
      });
    }
  }
}
