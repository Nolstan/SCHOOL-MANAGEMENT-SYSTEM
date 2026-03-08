const mongoose = require('mongoose');
require('dotenv').config();
const Student = require('./models/Student');
const connectDB = require('./config/db');

async function debugData() {
    await connectDB();
    try {
        const students = await Student.find();
        console.log('--- Current Students in DB ---');
        students.forEach(s => {
            console.log(`Name: ${s.firstName} ${s.lastName}, ClassName: "${s.className}", ID: ${s._id}`);
        });
        console.log('------------------------------');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

debugData();
