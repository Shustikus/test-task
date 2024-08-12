const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.create({username, password});
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.status(201).json({token});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

exports.login = async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({error: 'Invalid credentials'});
        }
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.status(200).json({token});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};
