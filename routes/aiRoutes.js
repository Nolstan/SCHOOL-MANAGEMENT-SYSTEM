const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/tutor', aiController.askTutor);
router.post('/analyze', aiController.analyzeData);

module.exports = router;
