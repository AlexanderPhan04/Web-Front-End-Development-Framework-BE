import { body, param } from "express-validator";
import mongoose from "mongoose";

const isValidObjectId = (value) => {
  return mongoose.Types.ObjectId.isValid(value);
};

export const postIdParamValidator = [
  param("postId")
    .custom(isValidObjectId)
    .withMessage("Invalid post id"),
];

export const commentIdParamValidator = [
  param("id")
    .custom(isValidObjectId)
    .withMessage("Invalid comment id"),
];

export const createCommentValidator = [
  param("postId")
    .custom(isValidObjectId)
    .withMessage("Invalid post id"),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("Comment content is required")
    .isLength({ min: 1, max: 500 })
    .withMessage("Comment must be between 1 and 500 characters"),
];