const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    eventDate: { type: Date, default: Date.now },
    category: { type: String, enum: ['announcement', 'event', 'exam', 'achievement'] }
}, { timestamps: true });

module.exports = mongoose.model('Activity', ActivitySchema);
