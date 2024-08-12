const User = require('../models/user');

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password').populate('tasks');
        if (!user) return res.status(404).json({error: 'User not found'});
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};
