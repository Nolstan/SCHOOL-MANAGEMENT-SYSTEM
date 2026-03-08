const Class = require('../models/Class');

exports.createClass = async (req, res) => {
    try {
        const newClass = new Class(req.body);
        await newClass.save();
        res.status(201).json(newClass);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllClasses = async (req, res) => {
    try {
        const classes = await Class.find().populate('teacherId').populate('subjectIds');
        res.json(classes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
