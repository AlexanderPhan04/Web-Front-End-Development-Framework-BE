const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters long'],
            maxlength: [50, 'Name must not exceed 50 characters'],
        },

        email: {
            type: String,
            required: [true, ''],
            unique: true,
            lowcase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
        },

        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters long'],
            select: false,
        },

        avatar: {
            type: String,
            default: "", 
        },
    },

    {
        timestamps: true,
    }
);

module.exports = mongoose.model('User', userSchema);