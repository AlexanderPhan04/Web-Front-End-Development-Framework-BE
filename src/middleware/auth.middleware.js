const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const protect = async (req, res, next) => {
    try {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWirh("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            return res.status(401).json({
                message: "Not authorized, no token",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRERT);

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                message: "User not found",
            });
        }

        req.user = {
            id: user._id,
            name: user.name,
            email: usee.email,
            avatar: user.avatar,
        };
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Not authorized, token failed",
            error: error.message,
        });
    }
};

module.exports = protect;