import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";

export const getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({
      post: req.params.postId,
    })
      .populate("author", "name email avatar")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      comments,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Get comments failed",
      error: error.message,
    });
  }
};

export const createComment = async (req, res) => {
  try {
    const { content } = req.body;

    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const comment = await Comment.create({
      content,
      post: req.params.postId,
      author: req.user._id,
    });

    const populatedComment = await comment.populate(
      "author",
      "name email avatar"
    );

    return res.status(201).json({
      message: "Comment created successfully",
      comment: populatedComment,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Create comment failed",
      error: error.message,
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id).populate("post");

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    const isCommentAuthor =
      comment.author.toString() === req.user._id.toString();

    const isPostAuthor =
      comment.post.author.toString() === req.user._id.toString();

    if (!isCommentAuthor && !isPostAuthor) {
      return res.status(403).json({
        message: "Not authorized to delete this comment",
      });
    }

    await comment.deleteOne();

    return res.status(200).json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Delete comment failed",
      error: error.message,
    });
  }
};