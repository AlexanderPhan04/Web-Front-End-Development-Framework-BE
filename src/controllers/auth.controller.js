const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });
};

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already in use",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        const token = generateToken(user._id);

        res.status(201).json({
            message: "Register successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
            },
        });
    } catch (error) {
        return res.status(500).json({
            message: "Register failed",
            error: error.message
        })
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const token = generateToken(user._id);

        return res.status(200).json({
            message: "Login successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
            },
        });
    } catch (error) {
        return res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
};

const getMe = async ( req, res ) => {
    return res.status(200).json({
        user: req.user,
    });
};

module.exports = {
    register,
    login,
    getMe,
}