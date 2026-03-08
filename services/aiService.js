const axios = require('axios');

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434/api/generate';

exports.generateAIResponse = async (prompt, systemPrompt = '') => {
    try {
        const response = await axios.post(OLLAMA_URL, {
            model: 'llama3.1:latest',
            prompt: prompt,
            system: systemPrompt,
            stream: false
        });
        return response.data.response;
    } catch (error) {
        console.error('Ollama Error:', error.message);
        if (error.code === 'ECONNREFUSED') {
            throw new Error('Local AI server (Ollama) is not running on port 11434.');
        }
        throw new Error('AI service error: ' + error.message);
    }
};
