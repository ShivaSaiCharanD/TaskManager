const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'pending'
    },
    date: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        default : 5
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});
module.exports = mongoose.model('Task', taskSchema);