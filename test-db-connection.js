require('dotenv').config();
const connectDB = require('./config/db');

async function testConnection() {
    console.log('Starting connection test...');
    try {
        await connectDB();
        console.log('Connection test passed!');
        process.exit(0);
    } catch (err) {
        console.error('Connection test failed:', err);
        process.exit(1);
    }
}

testConnection();
