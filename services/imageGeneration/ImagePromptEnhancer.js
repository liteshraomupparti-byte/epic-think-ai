/**
 * Epic Think AI - Intelligent Image Prompt Enhancer
 * 
 * Transforms raw user prompts into rich, visually descriptive scene prompts
 * while strictly preserving the user's intent.
 * 
 * Reasons along 12 visual dimensions:
 * 1. Subject (anatomy, focal details, posture, micro-expressions)
 * 2. Environment (setting, geography, weather, architectural era)
 * 3. Composition (framing, rule of thirds, golden ratio, camera angle)
 * 4. Lighting (direction, quality, color temperature, key/fill/rim ratio)
 * 5. Camera & Lens (focal length, sensor type, aperture, shutter speed feel)
 * 6. Materials & Textures (micro-surface details, reflectance, tactile elements)
 * 7. Depth of Field (bokeh, focal plane isolation, background falloff)
 * 8. Color Palette (harmonies, grading, saturation, tonal contrast)
 * 9. Atmosphere (mood, volumetric particles, haze, ambient presence)
 * 10. Artistic Style (photorealism, cinematography, fine art, couture)
 * 11. Realism (physics adherence, optical aberrations, natural imperfections)
 * 12. Detail Level (fine micro-geometry without cliché buzzword spam)
 */

import { AIEngine } from '../../ai/index.js';

export class ImagePromptEnhancer {
  /**
   * Enhance a user prompt for image generation
   * @param {Object} options
   * @param {string} options.prompt - Original user prompt
   * @param {string} [options.style='photorealistic'] - Target art style
   * @param {string} [options.aspectRatio='1:1'] - Aspect ratio
   * @param {string} [options.targetModel='FLUX_2_PRO'] - Target model identifier
   * @returns {Promise<{ enhancedPrompt: string, originalPrompt: string, dimensionsReasoned: string[] }>}
   */
  static async enhance({ prompt, style = 'photorealistic', aspectRatio = '1:1', targetModel = 'FLUX_2_PRO' }) {
    if (!prompt || typeof prompt !== 'string') {
      return { enhancedPrompt: prompt || '', originalPrompt: prompt || '', dimensionsReasoned: [] };
    }

    const trimmed = prompt.trim();
    if (trimmed.length > 500) {
      // Prompt is already very detailed; preserve it directly
      return { enhancedPrompt: trimmed, originalPrompt: trimmed, dimensionsReasoned: ['full_user_specification'] };
    }

    const systemPrompt = `You are a world-class prompt engineer specializing in state-of-the-art diffusion models (including Flux.2 and Next-Gen Photorealism).
Your objective: Expand user concepts into vivid, photorealistic or stylistically cohesive scene descriptions while faithfully preserving the user's core intent.

CRITICAL RULES:
1. NEVER output buzzwords like "4k", "8k", "masterpiece", "trending on artstation", "award winning", or "hyperrealistic".
2. Describe visual reality with concrete sensory, optical, and physical language:
   - Subject & Action: Specific anatomy, posture, texture, and expression.
   - Environment & Architecture: Spatial context, background depth, tangible elements.
   - Framing & Composition: Precise camera distance (wide, medium, macro, eye-level), framing geometry, perspective.
   - Lighting & Optics: Direction (golden hour, soft directional studio, volumetric backlight), diffusion, specular highlights.
   - Camera & Lens: e.g. 50mm f/1.4, 85mm portrait prime, 24mm architectural lens, natural depth of field and organic bokeh.
   - Materials & Textures: Concrete, silk, brushed aluminum, glass reflections, skin pores, atmospheric dust.
   - Color Grading & Atmosphere: Harmonious chromatic palette, color temperature, atmospheric density.
3. Keep the enhanced description coherent, cohesive, and within 60 to 120 words.
4. Output ONLY the optimized generation prompt. No conversational filler, no quotation marks, no markdown headers.`;

    const userInstruction = `User Concept: "${trimmed}"
Artistic Style: ${style}
Aspect Ratio: ${aspectRatio}
Target Generative Architecture: ${targetModel}

Synthesize the final visual prompt now:`;

    try {
      const generated = await AIEngine.generate({
        prompt: userInstruction,
        systemPrompt,
        modelPreset: 'Epic Think Fast'
      });

      let content = (generated?.content || '').trim();
      // Strip any accidental markdown formatting or conversational prefix
      content = content.replace(/^["']|["']$/g, '');
      content = content.replace(/^(Prompt:|Visual Prompt:|Optimized Prompt:)\s*/i, '');

      if (!content || content.length < 20) {
        return {
          enhancedPrompt: `${trimmed}, ${style} style, natural cinematic lighting, rich realistic textures, detailed composition`,
          originalPrompt: trimmed,
          dimensionsReasoned: ['fallback_simple_expansion']
        };
      }

      return {
        enhancedPrompt: content,
        originalPrompt: trimmed,
        dimensionsReasoned: [
          'subject', 'environment', 'composition', 'lighting',
          'camera_lens', 'materials_textures', 'depth_of_field',
          'color', 'atmosphere', 'artistic_style', 'realism', 'detail_level'
        ]
      };
    } catch (err) {
      console.warn('[ImagePromptEnhancer] Prompt expansion error, using fallback:', err.message);
      return {
        enhancedPrompt: `${trimmed}, ${style} aesthetic, cinematic lighting, rich environmental depth, refined composition`,
        originalPrompt: trimmed,
        dimensionsReasoned: ['graceful_fallback']
      };
    }
  }
}
