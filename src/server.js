const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const postRoutes = require('./routes/post.routes');
require('dotenv').config();

const connectDB = require('./config/db');

const app = express();

connectDB();

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

app.get("/", (req,res) => {
    res.json({
        message: "Backend API running",
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});