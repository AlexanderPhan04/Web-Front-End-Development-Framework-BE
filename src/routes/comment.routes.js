const express = require('express');
const {
    createCommentByPost,
    createComment,
    deleteComment,
} = require('../controllers/comment.controller');

const protect = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/posts/:postId/comments", getCommentByPost);
router.post("/posts/:postId/comments", protect, createComment);
router.delete("/comments/:id", protect, deleteComment);

module.exports = router;