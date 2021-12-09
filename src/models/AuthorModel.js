const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: 'First name is required', //if user will not give fname name this will print on user side.
        trim: true, //if user uses unnecessary space before and after than trim will remove it.
    },
    lname: {
        type: String,
        required: 'Last name is required', //if user will not give lname name this will print on user side.
        trim: true,
    },
    title: {
        type: String,
        enum: ['Mr', 'Mrs', 'Miss', 'Mast'],
        trim: true,
        required: 'Title is required'
    },
    email: {
        type: String,
        required: 'email is required',
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: 'Password is required'
    }
}, { timestamps: true })
module.exports = mongoose.model('author', authorSchema)