const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    text: { type: String, required: true }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;