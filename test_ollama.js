const axios = require('axios');

const OLLAMA_URL = 'http://127.0.0.1:11434/api/generate';

async function test() {
    try {
        console.log('Testing Ollama API...');
        const response = await axios.post(OLLAMA_URL, {
            model: 'llama3.1:latest',
            prompt: 'hie',
            system: 'You are a helpful school tutor. Explain concepts simply for students using clear and encouraging language.',
            stream: false
        });
        console.log('Success!', response.data.response);
    } catch (error) {
        console.error('Error Status:', error.response ? error.response.status : 'N/A');
        console.error('Error Data:', error.response ? error.response.data : 'N/A');
        console.error('Error Message:', error.message);
    }
}

test();
