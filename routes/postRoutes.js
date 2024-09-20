// Import necessary modules
const express = require('express');
const router = express.Router();
const Post = require('../models/postModel');
const User = require('../models/userModel'); // Import the User model

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

// Search route
router.get('/search', async (req, res) => {
    const searchQuery = req.query.query;
    try {
        // Find posts by title (case-insensitive)
        const posts = await Post.find({ title: { $regex: searchQuery, $options: 'i' } });
        const user = req.session.userEmail ? await User.findOne({ email: req.session.userEmail }) : null;

        if (posts.length === 0) {
            return res.render('index', { user, posts: [], message: 'No posts found matching your search.' });
        }
        res.render('index', { user, posts });
    } catch (err) {
        console.error('Error during search:', err);
        res.status(500).render('500', { message: 'Error during search' }); // Render error page
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
    const { title, content, name } = req.body;
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
        await Post.create({ title, content, userEmail, name });
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

module.exports = router;
