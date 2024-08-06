const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const Task = require('../models/task');

// Add user tasks
router.post('/add', auth, async (req, res) => {
    try {
        const { task, status, date, priority } = req.body;

        if (!task || !date) {
            return res.status(400).send({ error: 'Task and date are required fields.' });
        }

        const newTask = new Task({
            task,
            status,
            date,
            priority,
            user: req.user._id
        });

        await newTask.save();
        res.status(201).send(newTask);
    } catch (error) {
        res.status(500).send({ error: 'Failed to add task.' });
    }
});
// Get user tasks
router.get('/get', auth, async (req, res) => {
    try {
        const userId = req.user._id;

        const tasks = await Task.find({ user: userId });
        res.status(200).send(tasks);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch tasks.' });
    }
});
// Update user tasks
router.put('/update', auth, async (req, res) => {
    try {
        const { _id, task, status, date, priority } = req.body;

        if (!_id) {
            return res.status(400).send({ error: 'Task ID is required.' });
        }

        const existingTask = await Task.findOne({ _id, user: req.user._id });
        if (!existingTask) {
            return res.status(404).send({ error: 'Task not found.' });
        }

        existingTask.task = task || existingTask.task;
        existingTask.status = status || existingTask.status;
        existingTask.date = date || existingTask.date;
        existingTask.priority = priority || existingTask.priority;

        await existingTask.save();
        res.status(200).send(existingTask);
    } catch (error) {
        res.status(500).send({ error: 'Failed to update task.' });
    }
});

// Delete user tasks
router.delete('/delete', auth, async (req, res) => {
    try {
        const { _id } = req.query;
        console.log(_id);
        if (!_id) {
            return res.status(400).send({ error: 'Task ID is required.' });
        }

        const task = await Task.findOne({ _id, user: req.user._id });
        console.log(task);
        if (!task) {
            return res.status(404).send({ error: 'Task not found.' });
        }

        await task.deleteOne();
        res.status(200).send({ message: 'Task deleted successfully.', task });
    } catch (error) {
        res.status(500).send({ error: 'Failed to delete task.' });
    }
});

module.exports = router;
