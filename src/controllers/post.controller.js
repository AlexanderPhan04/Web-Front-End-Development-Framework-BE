import Post from '../models/post.model.js';
import Comment from '../models/comment.model.js';

export const getPosts = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 6;
        const search = req.query.search || "";
        const category = req.query.category || "";

        const query = {};

        if (search) {
            query.title = { $regex: search, $options: "i" };
        }

        if (category) {
            query.category = category;
        }

        const total = await Post.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        const posts = await Post.find(query)
        .populate("author", "name email avatar")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

        const postsWithLikeCount = posts.map((post) => ({
        ...post.toObject(),
        likeCount: post.likes.length,
        }));

        return res.status(200).json({
            posts: postsWithLikeCount,
            totalPages,
            currentPage: page,
            total,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Get posts failed",
            error: error.message,
        });
    }
};

export const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate(
            "author",
            "name email avatar"
        );

        if (!post) {
            return res.status(404).json({
                message: "Post not found",
            });
        }

        return res.status(200).json({
            post: {
                ...post.toObject(),
                likeCount: post.likes.length,
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: "Get post failed",
            error: error.message,
        });
    }
};

export const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id })
      .populate("author", "name email avatar")
      .sort({ createdAt: -1 });

    const postsWithLikeCount = posts.map((post) => ({
      ...post.toObject(),
      likeCount: post.likes.length,
    }));

    return res.status(200).json({
      posts: postsWithLikeCount,
      total: postsWithLikeCount.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Get my posts failed",
      error: error.message,
    });
  }
};

export const createPost = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    const post = await Post.create({
      title,
      content,
      category,
      author: req.user._id,
    });

    return res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Create post failed",
      error: error.message,
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to update this post",
      });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category;

    await post.save();

    return res.status(200).json({
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Update post failed",
      error: error.message,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to delete this post",
      });
    }

    await Comment.deleteMany({ post: post._id });

    await post.deleteOne();

    return res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Delete post failed",
      error: error.message,
    });
  }
};

export const toggleLikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found",
            });
        }

        const userId = req.user.id;
        const alreadyLiked = post.likes.some(
            (id) => id.toString() === userId.toString()
        );

        if (alreadyLiked) {
            post.likes = post.likes.filter(
                (id) => id.toString() !== userId.toString()
            );
        } else {
            post.likes.push(userId);
        }
        await post.save();
        return res.status(200).json({
            message: alreadyLiked ? "Post unliked" : "Post liked",
            likeCount: post.likes.length,
            likes: post.likes,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Toggle like post failed",
            error: error.message,
        });
    }
};

export default {
    getPosts,
    getPostById,
    getMyPosts,
    createPost,
    updatePost,
    deletePost,
    toggleLikePost,
};
