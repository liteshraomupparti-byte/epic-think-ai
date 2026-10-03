/**
 * Epic Think AI - End-to-End Image Studio Test Suite
 * Tests all 5 required prompts against the new target architecture
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initAIEngine } from '../ai/index.js';
import { ImageStudioService } from '../services/imageGeneration/ImageStudioService.js';
import { getImageDimensions } from '../services/imageGeneration/imageUtils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.join(__dirname, 'output_images');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const TEST_PROMPTS = [
  {
    id: 1,
    prompt: 'Photorealistic eagle flying over mountains.',
    model: 'AUTO',
    quality: 'HIGH',
    aspectRatio: '16:9',
    style: 'photorealistic'
  },
  {
    id: 2,
    prompt: 'Luxury black-and-gold perfume advertisement.',
    model: 'FLUX_2_PRO',
    quality: 'HIGH',
    aspectRatio: '1:1',
    style: 'luxury commercial photography'
  },
  {
    id: 3,
    prompt: 'Realistic Indian wedding scene.',
    model: 'AUTO',
    quality: 'HIGH',
    aspectRatio: '16:9',
    style: 'cinematic photorealistic'
  },
  {
    id: 4,
    prompt: 'Futuristic cyberpunk city at night.',
    model: 'FLUX_2_MAX',
    quality: 'ULTRA',
    aspectRatio: '16:9',
    style: 'cyberpunk cinematic'
  },
  {
    id: 5,
    prompt: 'Product photography of a premium smartphone.',
    model: 'AUTO',
    quality: 'HIGH',
    aspectRatio: '1:1',
    style: 'studio commercial'
  }
];

async function runTestSuite() {
  console.log('================================================================');
  console.log('EPIC THINK AI IMAGE STUDIO - END-TO-END VERIFICATION TEST SUITE');
  console.log('================================================================\n');

  console.log('Initializing Multi-Provider AI Engine...');
  await initAIEngine();
  console.log('AI Engine ready.\n');

  const results = [];

  for (const item of TEST_PROMPTS) {
    console.log(`\n----------------------------------------------------------------`);
    console.log(`[TEST ${item.id}/5] Testing prompt: "${item.prompt}"`);
    console.log(`Model Target: ${item.model} | Quality: ${item.quality} | Ratio: ${item.aspectRatio}`);

    const t0 = Date.now();
    try {
      const res = await ImageStudioService.generateImage({
        prompt: item.prompt,
        model: item.model,
        quality: item.quality,
        aspectRatio: item.aspectRatio,
        style: item.style,
        enhance: true
      });

      const totalTime = Date.now() - t0;

      if (!res.success) {
        console.error(`❌ Test ${item.id} FAILED:`, res.error);
        results.push({
          id: item.id,
          prompt: item.prompt,
          success: false,
          error: res.error,
          durationMs: totalTime
        });
        continue;
      }

      // Verify returned base64 dataUri
      const base64Data = res.imageUrl.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      const verifiedDims = getImageDimensions(buffer);

      // Save image to disk for inspection
      const filename = `test_${item.id}_${item.model.toLowerCase()}_${Date.now()}.jpg`;
      const filePath = path.join(outputDir, filename);
      fs.writeFileSync(filePath, buffer);

      // Verify no secret API key exposure
      const serialized = JSON.stringify(res);
      const apiKeyExposed = serialized.includes(process.env.POLLINATIONS_API_KEY || '___NO_KEY___') && !!process.env.POLLINATIONS_API_KEY;

      const record = {
        id: item.id,
        prompt: item.prompt,
        success: true,
        requestedModel: res.requestedModel,
        actualModelUsed: res.actualModelUsed,
        requestedResolution: res.requestedResolution,
        returnedResolution: res.actualResolution,
        verifiedDimensions: `${verifiedDims?.width}x${verifiedDims?.height}`,
        durationMs: res.durationMs,
        fileSizeBytes: buffer.length,
        isBroken: buffer.length < 500,
        apiKeyExposed,
        watermarked: res.watermarked,
        watermarkNote: res.watermarkNote,
        enhancedPromptSnippet: (res.enhancedPrompt || '').slice(0, 100) + '...',
        savedFile: filePath
      };

      console.log(`✅ Success!`);
      console.log(`   - Actual Model:       ${record.actualModelUsed}`);
      console.log(`   - Requested Res:      ${record.requestedResolution}`);
      console.log(`   - Returned Res:       ${record.returnedResolution}`);
      console.log(`   - Verified Pixels:    ${record.verifiedDimensions}`);
      console.log(`   - Duration:           ${record.durationMs} ms`);
      console.log(`   - File Size:          ${(record.fileSizeBytes / 1024).toFixed(1)} KB`);
      console.log(`   - No Broken Image:    ${!record.isBroken}`);
      console.log(`   - No Key Exposure:    ${!record.apiKeyExposed}`);
      console.log(`   - Enhanced Prompt:    ${record.enhancedPromptSnippet}`);
      console.log(`   - Saved To:           ${record.savedFile}`);

      results.push(record);
    } catch (err) {
      console.error(`❌ Test ${item.id} EXCEPTION:`, err.message);
      results.push({
        id: item.id,
        prompt: item.prompt,
        success: false,
        error: err.message,
        durationMs: Date.now() - t0
      });
    }
  }

  console.log('\n================================================================');
  console.log('FINAL TEST SUITE SUMMARY:');
  console.log('================================================================');
  console.table(results.map(r => ({
    ID: r.id,
    Prompt: r.prompt.slice(0, 25) + '...',
    Model: r.actualModelUsed || 'FAIL',
    ReqRes: r.requestedResolution || '-',
    RetRes: r.returnedResolution || '-',
    TimeSec: r.durationMs ? (r.durationMs / 1000).toFixed(1) + 's' : '-',
    SizeKB: r.fileSizeBytes ? (r.fileSizeBytes / 1024).toFixed(1) + ' KB' : '-',
    Valid: !r.isBroken,
    SafeKey: !r.apiKeyExposed
  })));

  fs.writeFileSync(path.join(outputDir, 'test_results.json'), JSON.stringify(results, null, 2));
}

runTestSuite().catch(console.error);
