const express = require('express');
const router = express.Router();
const guardianController = require('../controllers/guardianController');

router.post('/', guardianController.createGuardian);
router.get('/', guardianController.getGuardians);
router.put('/:id', guardianController.updateGuardian);

module.exports = router;
