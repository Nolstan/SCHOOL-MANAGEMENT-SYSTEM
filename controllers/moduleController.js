const Module = require('../models/Module');

exports.createModule = async (req, res) => {
    console.log('POST /api/modules:', req.body);
    try {
        const module = new Module(req.body);
        await module.save();
        console.log('Module saved:', module._id);
        res.status(201).json(module);
    } catch (error) {
        console.error('Error in createModule:', error.message);
        res.status(400).json({ error: error.message });
    }
};

exports.getModules = async (req, res) => {
    try {
        const modules = await Module.find().populate('teacherId');
        console.log(`GET /api/modules: Found ${modules.length} modules`);
        res.json(modules);
    } catch (error) {
        console.error('Error in getModules:', error.message);
        res.status(500).json({ error: error.message });
    }
};
