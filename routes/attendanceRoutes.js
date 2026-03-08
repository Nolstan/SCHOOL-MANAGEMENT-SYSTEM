const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.post('/mark', attendanceController.markAttendance);
router.get('/:classId', attendanceController.getAttendanceByClass);

module.exports = router;
