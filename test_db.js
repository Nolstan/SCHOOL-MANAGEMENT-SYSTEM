const mongoose = require('mongoose');
require('dotenv').config();
const Module = require('./models/Module');
const connectDB = require('./config/db');

async function test() {
    await connectDB();
    try {
        console.log('Connecting to database...');
        const testModule = new Module({
            subjectName: 'Persistence Test ' + Date.now(),
            className: 'Diagnostic'
        });
        await testModule.save();
        console.log('Successfully saved module to DB:', testModule);
        const find = await Module.find({ className: 'Diagnostic' });
        console.log('Modules found in DB:', find.length);
        process.exit(0);
    } catch (e) {
        console.error('Error in DB test:', e);
        process.exit(1);
    }
}

test();
