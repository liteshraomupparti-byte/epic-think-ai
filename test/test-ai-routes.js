/**
 * Test Epic Think AI Multi-Provider Routes (Public & Studio endpoints)
 */

async function run() {
  console.log('Testing /api/ai/providers...');
  const provRes = await fetch('http://localhost:3001/api/ai/providers');
  const provData = await provRes.json();
  console.log('Providers Status:', JSON.stringify(provData, null, 2));

  console.log('\nTesting /api/ai/models...');
  const modelsRes = await fetch('http://localhost:3001/api/ai/models');
  const modelsData = await modelsRes.json();
  console.log('Models Count:', modelsData.count);
  console.log('Presets:', JSON.stringify(modelsData.presets, null, 2));

  console.log('\nTesting /api/ai/health...');
  const healthRes = await fetch('http://localhost:3001/api/ai/health');
  const healthData = await healthRes.json();
  console.log('Health:', JSON.stringify(healthData, null, 2));

  console.log('\nTesting /api/ai/image...');
  const imgRes = await fetch('http://localhost:3001/api/ai/image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: 'Futuristic quantum computer in neon laboratory', style: 'cyberpunk', aspectRatio: '16:9' })
  });
  const imgData = await imgRes.json();
  console.log('Image Generation Result:', JSON.stringify(imgData, null, 2));

  console.log('\nTesting /api/ai/video...');
  const vidRes = await fetch('http://localhost:3001/api/ai/video', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: 'Drone flying through emerald canyon with cascading waterfalls', durationSeconds: 5, style: 'cinematic' })
  });
  const vidData = await vidRes.json();
  console.log('Video Storyboard Result:', JSON.stringify(vidData, null, 2));
}

run().catch(err => console.error('Error running test:', err));
