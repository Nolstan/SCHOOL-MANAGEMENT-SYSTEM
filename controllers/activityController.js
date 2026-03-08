const Activity = require('../models/Activity');

exports.createActivity = async (req, res) => {
    try {
        const activity = new Activity(req.body);
        await activity.save();
        res.status(201).json(activity);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllActivities = async (req, res) => {
    try {
        const activities = await Activity.find().sort({ eventDate: -1 });
        res.json(activities);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
