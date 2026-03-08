require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const classRoutes = require('./routes/classRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const activityRoutes = require('./routes/activityRoutes');
const guardianRoutes = require('./routes/guardianRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const moduleRoutes = require('./routes/moduleRoutes');
const aiRoutes = require('./routes/aiRoutes');
const whatsappService = require('./services/whatsappService');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:5001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/guardians', guardianRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/modules', moduleRoutes);

// Health Check
app.get('/health', (req, res) => res.json({ status: 'OK' }));

// Database Connection and Server Start
console.log('Connecting to MongoDB...');
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(` Server running on http://localhost:${PORT}`);

        // Initialize WhatsApp AFTER server is up
        console.log('Initializing WhatsApp service in background...');
        whatsappService.initializeWhatsApp();
    });
}).catch(err => {
    console.error('CRITICAL: Failed to start server:', err);
});
