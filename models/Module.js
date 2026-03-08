const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema({
    subjectName: { type: String, required: true },
    className: { type: String, required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Module', ModuleSchema);
