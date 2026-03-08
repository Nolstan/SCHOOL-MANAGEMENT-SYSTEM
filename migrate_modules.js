const mongoose = require('mongoose');
require('dotenv').config();
const Module = require('./models/Module');
const connectDB = require('./config/db');

async function migrateModules() {
    await connectDB();
    try {
        const modules = await Module.find();
        console.log(`Checking ${modules.length} modules...`);

        for (let m of modules) {
            // Standardize: std 3 -> Std 3, form 4 -> Form 4
            let newName = m.className.trim();
            if (newName.toLowerCase().startsWith('std')) {
                newName = 'Std ' + newName.replace(/[^0-9]/g, '');
            } else if (newName.toLowerCase().startsWith('form')) {
                newName = 'Form ' + newName.replace(/[^0-9]/g, '');
            }

            if (newName !== m.className) {
                console.log(`Updating "${m.className}" to "${newName}"`);
                await Module.findByIdAndUpdate(m._id, { className: newName });
            }
        }

        console.log('Module migration complete.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

migrateModules();
