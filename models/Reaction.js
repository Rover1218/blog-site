const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    type: { type: String, required: true },
    count: { type: Number, default: 0 },
    userEmail: { type: String, required: true } // Add userEmail to track which user reacted
});

const Reaction = mongoose.model('Reaction', reactionSchema);

module.exports = Reaction;