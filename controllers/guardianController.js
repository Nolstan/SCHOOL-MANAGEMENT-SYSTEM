const Guardian = require('../models/Guardian');

exports.createGuardian = async (req, res) => {
    try {
        const guardian = new Guardian(req.body);
        await guardian.save();
        res.status(201).json(guardian);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getGuardians = async (req, res) => {
    try {
        const guardians = await Guardian.find().populate('students');
        res.json(guardians);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateGuardian = async (req, res) => {
    try {
        const guardian = await Guardian.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(guardian);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
