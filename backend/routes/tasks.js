const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const Task = require('../models/task');

// Add a new task
router.post('/add', auth ,async (req, res) => {
    try {
        const { task, status, date, priority, user } = req.body;

        if (!task || !user) {
            return res.status(400).send({ error: 'Task and user are required fields.' });
        }

        const newTask = new Task({ task, status, date, priority, user });
        await newTask.save();
        res.status(201).send(newTask);
    } catch (error) {
        res.status(500).send({ error: 'Failed to add task.' });
    }
});

// Get tasks by user
router.get('/get', auth ,async (req, res) => {
    try {
        const { user } = req.query;

        if (!user) {
            return res.status(400).send({ error: 'User is required.' });
        }

        const tasks = await Task.find({ user });
        res.status(200).send(tasks);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch tasks.' });
    }
});

// Update a task
router.put('/update', auth ,async (req, res) => {
    try {
        const { _id, task, status, date, priority } = req.body;

        if (!_id) {
            return res.status(400).send({ error: 'Task ID is required.' });
        }

        const existingTask = await Task.findById(_id);
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

// Delete a task
router.delete('/delete', auth ,async (req, res) => {
    try {
        const { _id } = req.query;

        if (!_id) {
            return res.status(400).send({ error: 'Task ID is required.' });
        }

        const task = await Task.findById(_id);
        if (!task) {
            return res.status(404).send({ error: 'Task not found.' });
        }

        await task.remove();
        res.status(200).send({ message: 'Task deleted successfully.', task });
    } catch (error) {
        res.status(500).send({ error: 'Failed to delete task.' });
    }
});

module.exports = router;
