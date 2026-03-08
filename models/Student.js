const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    className: { type: String },
    parentPhone: { type: String, required: true },
    parentName: { type: String, required: true },
    gender: { type: String, enum: ['M', 'F'] },
    feeBalance: { type: Number, default: 0 },
    attendance: [{
        date: { type: Date, default: Date.now },
        status: { type: String, enum: ['present', 'absent', 'late'] }
    }],
    grades: [{
        subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
        score: { type: Number, required: true },
        term: { type: String },
        category: { type: String, enum: ['test', 'exam'] },
        comment: { type: String }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);
