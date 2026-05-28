const express = require('express');
const {
    createCommentByPost,
    createComment,
    deleteComment,
} = require('../controllers/comment.controller');

const protect = require("../middleware/auth.middleware");

