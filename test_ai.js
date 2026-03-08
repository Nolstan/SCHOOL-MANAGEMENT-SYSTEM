const aiService = require('./services/aiService');
require('dotenv').config();

async function test() {
    try {
        console.log('Testing AI Service...');
        const response = await aiService.generateAIResponse('hie', 'You are a helpful tutor.');
        console.log('Response:', response);
    } catch (error) {
        console.error('Test Failed:');
        console.error(error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

test();
