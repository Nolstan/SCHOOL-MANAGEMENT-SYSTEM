const express = require('express');
const router = express.Router();
const moduleController = require('../controllers/moduleController');

router.post('/', moduleController.createModule);
router.get('/', moduleController.getModules);

module.exports = router;
