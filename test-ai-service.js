// Test file for AI Service functionality
// This can be run in Node.js environment to test the AI service

const aiService = require('./services/ai.ts');

async function testAIService() {
  console.log('Testing AI Service...\n');

  // Test 1: Configuration
  console.log('1. Testing Configuration...');
  try {
    const config = {
      apiKey: 'test-plantnet-key',
      endpoint: 'https://my.plantnet.org/api/v2/identify/all',
      model: 'plant-disease-v1',
      service: 'plantnet',
      enableRealTime: false,
      openaiApiKey: 'test-openai-key'
    };
    
    await aiService.initialize(config);
    console.log('✅ Configuration successful');
  } catch (error) {
    console.log('❌ Configuration failed:', error.message);
  }

  // Test 2: Load Configuration
  console.log('\n2. Testing Load Configuration...');
  try {
    const loadedConfig = await aiService.loadConfig();
    if (loadedConfig) {
      console.log('✅ Configuration loaded successfully');
      console.log('   - PlantNet API Key:', loadedConfig.apiKey ? 'Configured' : 'Not configured');
      console.log('   - OpenAI API Key:', loadedConfig.openaiApiKey ? 'Configured' : 'Not configured');
    } else {
      console.log('❌ No configuration found');
    }
  } catch (error) {
    console.log('❌ Load configuration failed:', error.message);
  }

  // Test 3: Conversation History
  console.log('\n3. Testing Conversation History...');
  try {
    const history = aiService.getConversationHistory();
    console.log('✅ Conversation history initialized');
    console.log('   - Messages count:', history.length);
    console.log('   - System message present:', history.some(msg => msg.role === 'system'));
  } catch (error) {
    console.log('❌ Conversation history failed:', error.message);
  }

  // Test 4: Clear Conversation
  console.log('\n4. Testing Clear Conversation...');
  try {
    aiService.clearConversationHistory();
    const history = aiService.getConversationHistory();
    console.log('✅ Conversation cleared successfully');
    console.log('   - Messages count after clear:', history.length);
  } catch (error) {
    console.log('❌ Clear conversation failed:', error.message);
  }

  // Test 5: Supported Models
  console.log('\n5. Testing Supported Models...');
  try {
    const models = aiService.getSupportedModels();
    console.log('✅ Supported models retrieved');
    console.log('   - Models:', models.join(', '));
  } catch (error) {
    console.log('❌ Get supported models failed:', error.message);
  }

  console.log('\n🎉 AI Service test completed!');
  console.log('\nNote: This test only verifies the service structure.');
  console.log('Real API calls require valid API keys and internet connection.');
}

// Run the test
testAIService().catch(console.error); 