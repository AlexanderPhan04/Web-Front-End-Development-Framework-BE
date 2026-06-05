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
import validate from "../middleware/validate.middleware.js";

import {
    getPostsValidator,
    postIdValidator,
    createPostValidator,
    updatePostValidator,
} from "../validators/post.validator.js";

const router = express.Router();

router.get("/", getPostsValidator, validate, getPosts);
router.get("/:id", postIdValidator, validate, getPostById);

router.post("/", protect, createPostValidator, validate, createPost);
router.put("/:id", protect, updatePostValidator, validate, updatePost);
router.delete("/:id", protect, postIdValidator, validate, deletePost);
router.post("/:id/like", protect, postIdValidator, validate, toggleLikePost);

export default router;