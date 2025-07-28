const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testLogging() {
  try {
    console.log('🧪 Testing logging system...\n');

    // Step 1: Test the logs test endpoint
    console.log('1. Testing logs test endpoint...');
    const testResponse = await axios.get(`${BASE_URL}/logs/test`, {
      headers: {
        'Authorization': 'Bearer test-token'
      }
    });
    console.log('✅ Test log created:', testResponse.data);
    console.log('');

    // Step 2: Get all logs
    console.log('2. Getting all logs...');
    const logsResponse = await axios.get(`${BASE_URL}/logs`, {
      headers: {
        'Authorization': 'Bearer test-token'
      }
    });
    console.log(`✅ Found ${logsResponse.data.length} logs`);
    console.log('');

    // Step 3: Test creating a partner (this should create a log)
    console.log('3. Testing partner creation with logging...');
    const partnerData = {
      fullName: 'Test Partner',
      nickname: 'test-partner',
      number: '123456789',
      partnerRole: 'owner',
      pistechRole: 'developer'
    };

    const partnerResponse = await axios.post(`${BASE_URL}/partners`, partnerData, {
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Partner created:', partnerResponse.data);
    console.log('');

    // Step 4: Check logs again to see if the partner creation was logged
    console.log('4. Checking logs after partner creation...');
    const logsAfterResponse = await axios.get(`${BASE_URL}/logs`, {
      headers: {
        'Authorization': 'Bearer test-token'
      }
    });
    console.log(`✅ Found ${logsAfterResponse.data.length} logs after partner creation`);
    
    // Show the latest logs
    const latestLogs = logsAfterResponse.data.slice(0, 3);
    console.log('Latest logs:');
    latestLogs.forEach((log, index) => {
      console.log(`  ${index + 1}. ${log.action} ${log.entityType} ${log.entityId} by user ${log.userId}`);
    });

    console.log('\n🎉 Logging system test completed successfully!');

  } catch (error) {
    console.error('❌ Error testing logging system:', error.response?.data || error.message);
  }
}

// Run the test
testLogging(); 