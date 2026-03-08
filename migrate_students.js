const mongoose = require('mongoose');
require('dotenv').config();
const Student = require('./models/Student');
const Module = require('./models/Module');
const connectDB = require('./config/db');

async function migrate() {
    await connectDB();
    try {
        // Find the first available class name from modules
        const firstModule = await Module.findOne();
        const defaultClass = firstModule ? firstModule.className : 'General';

        console.log(`Migrating students to default class: "${defaultClass}"`);

        const result = await Student.updateMany(
            { $or: [{ className: { $exists: false } }, { className: "undefined" }, { className: "" }] },
            { $set: { className: defaultClass } }
        );

        console.log(`Updated ${result.modifiedCount} students.`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

migrate();
