const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username });

        if (!user) {
            return res.json({ status: 'User Not Found' });
        }

        const isPasswordValid = user.password === password;
        if (!isPasswordValid) {
            return res.json({ status: 'Password Incorrect' });
        }
        const token = jwt.sign({ _id: user._id}, 'suspendisse', { expiresIn: '1h' });
        return res.json({ status: 'Login Successful', token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'Server Error' });
    }
});

router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    const user = new User({ username, password });
    await user.save();

    res.json({ status: 'User Saved' });
});

module.exports = router;
