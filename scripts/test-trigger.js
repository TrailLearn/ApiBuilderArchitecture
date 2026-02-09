const fetch = require('node-fetch');

const INGESTION_KEY = process.env.INGESTION_KEY;
const FUNCTION_URL = 'http://127.0.0.1:54321/functions/v1/ingest-scholarship';

if (!INGESTION_KEY) {
  console.error('Error: Set INGESTION_KEY env var');
  process.exit(1);
}

async function testTrigger() {
  const uniqueUrl = `https://example.com/scholarship-${Date.now()}`; // Unique URL to avoid dedupe logic
  
  const payload = {
    source_id: 'test-trigger',
    payload: {
      title: 'Trigger Test Scholarship',
      url: uniqueUrl,
      amount: '$1000',
      description: 'Automated test description'
    }
  };

  try {
    console.log('1. Sending data to Ingestion API...');
    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${INGESTION_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log('API Response:', response.status, data);

    if (response.status === 201) {
      console.log('2. Success! Check Supabase Dashboard > Table Editor > scholarships');
      console.log(`   Look for title: "Trigger Test Scholarship" and url: ${uniqueUrl}`);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testTrigger();
