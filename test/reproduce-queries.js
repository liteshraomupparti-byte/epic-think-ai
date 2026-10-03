import dotenv from 'dotenv';
dotenv.config();
import { WebSearchClient } from '../plugins/providers/web-search/WebSearchClient.js';

async function testQuery(name, query, location) {
  console.log(`\n========================================`);
  console.log(`TEST: ${name} ("${query}") [location: ${location || 'auto'}]`);
  console.log(`========================================`);
  try {
    const res = await WebSearchClient.search({ query, location, maxResults: 6 });
    console.log(`Source: ${res.source}`);
    console.log(`Location: ${res.location}`);
    console.log(`Places count: ${res.places ? res.places.length : 0}`);
    if (res.places && res.places.length > 0) {
      console.log('Sample place 1:', JSON.stringify(res.places[0], null, 2));
    }
    console.log(`Results count: ${res.results ? res.results.length : 0}`);
    if (res.results && res.results.length > 0) {
      console.log('Sample result 1:', JSON.stringify(res.results[0], null, 2));
    }
    console.log(`Images count: ${res.images ? res.images.length : 0}`);
    if (res.images && res.images.length > 0) {
      console.log('Sample image 1:', JSON.stringify(res.images[0], null, 2));
    }
  } catch (err) {
    console.error(`Error searching:`, err);
  }
}

async function run() {
  await testQuery('A. Sports Shops', 'sports shops near me', 'Hyderabad, Telangana, India');
  await testQuery('B. Picnic Spots', 'picnic spots near me', 'Hyderabad, Telangana, India');
  await testQuery('C. Hostels', 'hostels near me', 'Hyderabad, Telangana, India');
}

run();
