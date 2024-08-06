const user = require('./routes/user');
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

app.use(express.json());
app.use(cors());
try {
    mongoose.connect('mongodb+srv://shivasaicharandodda:taskmanager@cluster0.ldu35gg.mongodb.net/tm', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
} catch (error) {
    console.log('Error in connecting to MongoDB');
}

app.use('/api', user);

app.listen(4000, () => {
    console.log('Server started at port 4000');
});