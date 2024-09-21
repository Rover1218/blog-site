
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    name: { type: String, required: true }, // User's name
    userEmail: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return v !== null && v !== undefined;
            },
            message: 'Email cannot be null or undefined'
        }
    },
    topic: { type: String, required: true }, // User's name
    content: { type: String, required: true },
    secondParagraph: { type: String, default: '' }, // Optional second paragraph
    thirdParagraph: { type: String, default: '' }, // Optional third paragraph
    bulletPoints: { type: String, default: '' }, // Optional bullet points
    summary: { type: String, default: '' }, // Optional summary
    createdAt: { type: Date, default: Date.now }
});

// Remove the unique index on userEmail
// Instead, we'll create a compound index if needed for querying efficiency
postSchema.index({ userEmail: 1, createdAt: -1 });

// Creating the model
module.exports = mongoose.model('Post', postSchema);