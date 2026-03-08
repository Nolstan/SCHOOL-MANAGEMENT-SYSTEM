const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    eventDate: { type: Date, required: true },
    category: { type: String, enum: ['announcement', 'event', 'exam', 'achievement', 'sports'] },
    cost: { type: Number, default: 0 },
    targetClass: { type: String, required: true },
    contactInfo: { type: String, required: true },
    location: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Activity', ActivitySchema);
