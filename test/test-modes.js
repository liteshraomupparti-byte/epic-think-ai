import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3001';

async function testModes() {
  console.log('Testing Search & Reasoning Modes with SerpAPI...');

  // 1. Web search mode test
  const searchRes = await fetch(`${BASE_URL}/api/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: 'What are the top coffee roasting techniques?' }],
      webSearch: true,
      modelPreset: 'Epic Think 4o'
    })
  });
  const searchData = await searchRes.json();
  console.log('Search Mode Success:', searchData.success);
  console.log('Search Mode Length:', searchData.response?.length);
  console.log('Search Mode Finish Reason:', searchData.finishReason);

  // 2. Reasoning mode test
  const reasonRes = await fetch(`${BASE_URL}/api/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: 'A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost? Explain step by step.' }],
      reasoning: true,
      modelPreset: 'Epic Think o1'
    })
  });
  const reasonData = await reasonRes.json();
  console.log('Reasoning Mode Success:', reasonData.success);
  console.log('Reasoning Mode Length:', reasonData.response?.length);
  console.log('Reasoning Mode Thoughts present:', Boolean(reasonData.thoughts));
  console.log('Reasoning Mode Finish Reason:', reasonData.finishReason);

  // 3. Diagnostics test
  const diagRes = await fetch(`${BASE_URL}/api/ai/diagnostics`);
  const diagData = await diagRes.json();
  console.log('Diagnostics count:', diagData.count);
  console.log('Recent diagnostic item:', diagData.diagnostics?.[0]);

  if (searchData.success && reasonData.success && diagData.success) {
    console.log('\nALL MODES VERIFIED SUCCESSFULLY!');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

testModes().catch(e => {
  console.error(e);
  process.exit(1);
});
