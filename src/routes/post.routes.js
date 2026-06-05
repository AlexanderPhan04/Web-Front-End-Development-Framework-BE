import express from 'express';
import {
    getPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    toggleLikePost,
} from '../controllers/post.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

router.get("/", getPosts);
router.get("/:id", getPostById);
router.post("/", protect, createPost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);
router.post("/:id/like", protect, toggleLikePost);

export default router;