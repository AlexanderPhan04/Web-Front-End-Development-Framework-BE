import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            minlength: [3, 'Title must be at least 3 characters long'],
            maxlength: [100, 'Title must not exceed 100 characters'],
        },

        content: {
            type: String,
            required: [true, 'Content is required'],
            trim: true,
            minlength: [10, 'Content must be at least 10 characters long'],
        },

        category: {
            type: String,
            required: [true, 'Category is required'],
            trim: true,
            default: "General",
        },

        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Post = mongoose.model('Post', postSchema);

export default Post;