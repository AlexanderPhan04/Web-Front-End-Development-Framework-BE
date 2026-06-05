import { body, param, query } from "express-validator";
import mongoose from "mongoose";

const isValidObjectId = (value) => {
  return mongoose.Types.ObjectId.isValid(value);
};

export const getPostsValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive number"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be between 1 and 50"),

  query("search")
    .optional()
    .trim(),

  query("category")
    .optional()
    .trim(),
];

export const postIdValidator = [
  param("id")
    .custom(isValidObjectId)
    .withMessage("Invalid post id"),
];

export const createPostValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 10 })
    .withMessage("Content must be at least 10 characters"),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required"),
];

export const updatePostValidator = [
  param("id")
    .custom(isValidObjectId)
    .withMessage("Invalid post id"),

  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),

  body("content")
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage("Content must be at least 10 characters"),

  body("category")
    .optional()
    .trim(),
];