const fetch = require('node-fetch'); // Needs node-fetch if Node < 18, but recent Node has native fetch

const INGESTION_KEY = process.env.INGESTION_KEY; // MUST be set in your terminal env

if (!INGESTION_KEY) {
  console.error('Error: Please set INGESTION_KEY environment variable before running this test.');
  console.log('Example: $env:INGESTION_KEY="your-secret-key"; node scripts/test-ingestion.js');
  process.exit(1);
}

const FUNCTION_URL = 'http://127.0.0.1:54321/functions/v1/ingest-scholarship';

async function testIngestion() {
  const payload = {
    source_id: 'test-scraper-v1',
    payload: {
      title: 'Engineering Scholarship 2026',
      url: 'https://example.com/scholarship',
      amount: '$5000'
    }
  };

  try {
    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${INGESTION_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log('Response:', response.status, data);
  } catch (error) {
    console.error('Error:', error.message);
    console.log('Note: This test requires local Supabase to be running via "supabase start"');
  }
}

testIngestion();
