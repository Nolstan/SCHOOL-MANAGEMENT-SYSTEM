const Attendance = require('../models/Attendance');
const Module = require('../models/Module');
const Student = require('../models/Student');
const Guardian = require('../models/Guardian');
const whatsappService = require('../services/whatsappService');

exports.markAttendance = async (req, res) => {
    try {
        const { studentId, status, moduleId } = req.body;
        const attendance = new Attendance({
            studentId,
            status,
            moduleId,
            teacherId: req.user ? req.user._id : null
        });
        await attendance.save();

        if (status === 'present' || status === 'absent') {
            const student = await Student.findById(studentId);
            const module = await Module.findById(moduleId);

            if (student && student.parentPhone) {
                const dateStr = new Date().toLocaleDateString();
                const subject = module ? module.subjectName : 'class';
                const actionText = status === 'present' ? 'attended' : 'did not attend';

                const finalMessage = `Hello, ${student.firstName} ${student.lastName} ${actionText} ${subject} class today on ${dateStr}.`;

                await whatsappService.sendMessage(student.parentPhone, finalMessage);
            }
        }

        res.status(201).json(attendance);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAttendanceByClass = async (req, res) => {
    console.log('GET /api/attendance/class:', req.params.classId);
    try {
        // Find attendance records for this class (via modules linked to this class)
        const attendance = await Attendance.find().populate({
            path: 'moduleId',
            match: { className: req.params.classId }
        }).populate('studentId');

        // Filter out those where moduleId match failed
        const filtered = attendance.filter(a => a.moduleId !== null);
        res.json(filtered);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
