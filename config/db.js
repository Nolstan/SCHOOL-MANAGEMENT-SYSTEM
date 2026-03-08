require('dotenv').config();
const mongoose = require('mongoose');
const connectionString = process.env.MONGO_URI || process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(connectionString);
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
