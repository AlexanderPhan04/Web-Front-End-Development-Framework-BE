import express from 'express';
import {
    getCommentByPost,
    createComment,
    deleteComment,
} from '../controllers/comment.controller.js';

import protect from '../middleware/auth.middleware.js';

const router = express.Router();

router.get("/posts/:postId/comments", getCommentByPost);
router.post("/posts/:postId/comments", protect, createComment);
router.delete("/comments/:id", protect, deleteComment);

export default router;