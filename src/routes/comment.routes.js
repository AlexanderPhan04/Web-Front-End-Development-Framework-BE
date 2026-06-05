import express from "express";

import {
  getCommentsByPost,
  createComment,
  deleteComment,
} from "../controllers/comment.controller.js";

import protect from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";

import {
  postIdParamValidator,
  commentIdParamValidator,
  createCommentValidator,
} from "../validators/comment.validator.js";

const router = express.Router();

router.get(
  "/posts/:postId/comments",
  postIdParamValidator,
  validate,
  getCommentsByPost
);

router.post(
  "/posts/:postId/comments",
  protect,
  createCommentValidator,
  validate,
  createComment
);

router.delete(
  "/comments/:id",
  protect,
  commentIdParamValidator,
  validate,
  deleteComment
);

export default router;