const Task = require('../models/task');

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({user: req.user.id});
        res.status(200).json(tasks);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

exports.createTask = async (req, res) => {
    try {
        const {title, description} = req.body;
        const task = await Task.create({title, description, user: req.user.id});
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task || task.user.toString() !== req.user.id) {
            return res.status(404).json({error: 'Task not found or not authorized'});
        }

        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.completed = req.body.completed !== undefined ? req.body.completed : task.completed;

        await task.save();
        res.status(200).json(task);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task || task.user.toString() !== req.user.id) {
            return res.status(404).json({ error: 'Task not found or not authorized' });
        }

        await task.deleteOne(); // Используем deleteOne() вместо remove()
        res.status(200).json({ message: 'Task removed' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

