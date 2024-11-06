// Import necessary modules
const express = require('express');
const router = express.Router();
const Post = require('../models/postModel');
const User = require('../models/userModel'); // Import the User model
const Comment = require('../models/Comment');
const Reaction = require('../models/Reaction');
const mongoose = require('mongoose');

// Get all posts
router.get('/', async (req, res) => {
    try {
        const userEmail = req.session.userEmail; // Get the user's email from the session
        const userPosts = userEmail ? await Post.find({ userEmail }) : []; // Fetch user's posts if logged in
        const otherPosts = await Post.find({ userEmail: { $ne: userEmail } }); // Fetch other posts

        const user = userEmail ? await User.findOne({ email: userEmail }) : null; // Fetch user info if logged in

        // Combine posts into a single array
        const posts = [...userPosts, ...otherPosts];

        res.render('index', { user, posts }); // Pass user and combined posts to the view
    } catch (err) {
        console.error('Error loading posts:', err);
        res.status(500).render('500', { message: 'Error loading posts' }); // Render error page
    }
});

// Render the form to create a new post
router.get('/create', async (req, res) => {
    try {
        const user = req.session.userEmail ? await User.findOne({ email: req.session.userEmail }) : null;
        res.render('create', { user });
    } catch (err) {
        console.error('Error loading create post form:', err);
        res.status(500).render('500', { message: 'Error loading create post form' }); // Render error page
    }
});

// Create a new post (handle form submission)
router.post('/create', async (req, res) => {
    const { title, name, topic, content, secondParagraph, thirdParagraph, bulletPoints, summary } = req.body;
    const userEmail = req.session.userEmail; // Get user email from session

    // Check if title, content, and userEmail are provided
    if (!title || !content) {
        return res.status(400).send('Title and content are required');
    }

    if (!userEmail) {
        return res.status(400).send('User email is required');
    }

    try {
        // Create the post with userEmail and other details
        await Post.create({ title, userEmail, name, topic, content, secondParagraph, thirdParagraph, bulletPoints, summary });
        res.redirect('/'); // Redirect to homepage after creating the post
    } catch (err) {
        console.error('Error creating post:', err);
        res.status(500).render('500', { message: 'Error creating post' });
    }
});
// Profile route
router.get('/profile', async (req, res) => {
    const userId = req.session.userId; // Get userId from session
    if (userId) {
        try {
            const user = await User.findById(userId); // Fetch user
            const posts = await Post.find({ userEmail: user.email }); // Fetch user's posts using user.email

            res.render('profile', { user: user, posts: posts || [] }); // Pass user and posts to the view
        } catch (err) {
            console.error('Error fetching user or posts:', err);
            res.status(500).send('Error fetching user or posts');
        }
    } else {
        res.redirect('/login'); // Redirect to login if user is not authenticated
    }
});
// View a specific post by ID
router.get('/post/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).render('404'); // Render 404 view if post is not found
        }
        const user = req.session.userEmail ? await User.findOne({ email: req.session.userEmail }) : null;
        res.render('post', { post, user }); // Render post view with post data
    } catch (err) {
        console.error('Error finding post:', err);
        res.status(500).send('Error loading post');
    }
});

// Delete a post
router.post('/delete/:id', async (req, res) => {
    const postId = req.params.id;
    const userEmail = req.session.userEmail; // Get user email from session

    try {
        // Find the post to check if the user is the author
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).send('Post not found');
        }
        if (post.userEmail !== userEmail) {
            return res.status(403).send('Unauthorized to delete this post');
        }

        // Delete the post
        await Post.findByIdAndDelete(postId);
        res.redirect('/'); // Redirect to home or wherever
    } catch (err) {
        console.error('Error deleting post:', err);
        res.status(500).send('Error deleting post'); // Render error message
    }
});

// Get comments for a specific post
router.get('/comments/:postId', async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId });
        res.json(comments);
    } catch (err) {
        console.error('Error fetching comments:', err);
        res.status(500).send('Error fetching comments');
    }
});

// Add a comment to a specific post
router.post('/comments', async (req, res) => {
    try {
        const { postId, text } = req.body;
        const userEmail = req.session.userEmail;

        if (!userEmail) {
            return res.status(401).send('User not authenticated');
        }

        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return res.status(401).send('User not found');
        }

        const comment = new Comment({
            postId,
            text,
            userEmail: user.email,
            userName: user.username // Ensure userName is correctly set
        });

        await comment.save();
        res.json(comment);
    } catch (err) {
        console.error('Error adding comment:', err);
        res.status(500).send('Error adding comment');
    }
});

// Delete a comment
router.delete('/comments/:id', async (req, res) => {
    const commentId = req.params.id;
    const userEmail = req.session.userEmail; // Get user email from session

    try {
        // Find the comment to check if the user is the author
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).send('Comment not found');
        }
        if (comment.userEmail !== userEmail) {
            return res.status(403).send('Unauthorized to delete this comment');
        }

        // Delete the comment
        await Comment.findByIdAndDelete(commentId);
        res.status(200).send('Comment deleted');
    } catch (err) {
        console.error('Error deleting comment:', err);
        res.status(500).send('Error deleting comment');
    }
});

// Get reactions for a specific post
router.get('/reactions/:postId', async (req, res) => {
    try {
        const reactions = await Reaction.find({ postId: req.params.postId });
        res.json(reactions);
    } catch (err) {
        console.error('Error fetching reactions:', err);
        res.status(500).send('Error fetching reactions');
    }
});

// Add a reaction to a specific post
router.post('/reactions', async (req, res) => {
    try {
        const { postId, type } = req.body;
        const userEmail = req.session.userEmail;

        if (!userEmail) {
            return res.status(401).send('User not authenticated');
        }

        // Find any existing reaction by this user on this post
        const existingReaction = await Reaction.findOne({ postId, userEmail });

        if (existingReaction) {
            // If the existing reaction is the same type, do nothing
            if (existingReaction.type === type) {
                return res.json(existingReaction);
            }

            // Otherwise, decrement the count of the existing reaction type
            const prevReaction = await Reaction.findOne({ postId, type: existingReaction.type });
            if (prevReaction) {
                prevReaction.count -= 1;
                if (prevReaction.count <= 0) {
                    await Reaction.deleteOne({ _id: prevReaction._id });
                } else {
                    await prevReaction.save();
                }
            }
        }

        // Find or create the new reaction type
        let reaction = await Reaction.findOne({ postId, type });
        if (reaction) {
            reaction.count += 1;
        } else {
            reaction = new Reaction({ postId, type, count: 1, userEmail });
        }
        await reaction.save();

        res.json(reaction);
    } catch (err) {
        console.error('Error adding reaction:', err);
        res.status(500).send('Error adding reaction');
    }
});

module.exports = router;
