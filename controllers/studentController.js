const Student = require('../models/Student');

exports.createStudent = async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllStudents = async (req, res) => {
    console.log('GET /api/students query:', req.query);
    try {
        const query = {};
        if (req.query.className && req.query.className !== 'undefined' && req.query.className !== '') {
            query.className = req.query.className;
        }
        const students = await Student.find(query).populate('classId');
        console.log(`Found ${students.length} students for query:`, query);
        res.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate('classId');
        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteStudent = async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.json({ message: 'Student deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Attendance & Grades
exports.addAttendance = async (req, res) => {
    try {
        const { date, status } = req.body;
        const student = await Student.findById(req.params.id);
        student.attendance.push({ date, status });
        await student.save();
        res.json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addGrade = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        student.grades.push(req.body);
        await student.save();

        // Send Notification
        const message = `
*School Management Notification*
Student: ${student.firstName} ${student.lastName}
Subject Score: ${req.body.score}%
Teacher Comment: ${req.body.comment || 'N/A'}
Status: ${req.body.score >= 50 ? 'Pass' : 'Needs Improvement'}
        `;
        await whatsappService.sendMessage(student.parentPhone, message);

        res.json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
