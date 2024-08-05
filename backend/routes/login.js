const express = require('express');
const router = express.Router();

const User = require('../models/user');

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const valid = await User.findOne({"username": username});
    const validPassword = valid.password === password;
    if (valid) {
        res.json({ status: 'User Found' });
    } else {
        res.json({ status: 'User Not Found' });
    }
    if (validPassword) {
        res.json({ status: 'Password Correct' });
    }
    else {
        res.json({ status: 'Password Incorrect' });
    } 
});