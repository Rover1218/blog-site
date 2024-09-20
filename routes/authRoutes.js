const express = require('express');
const router = express.Router();
const User = require('../models/userModel'); // Ensure this model has a comparePassword method

// Signup route
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('User already exists with that email');
        }

        // Create a new user
        const newUser = new User({ username, email, password });
        await newUser.save();

        // Set session after signup
        req.session.userId = newUser._id;
        req.session.username = newUser.username;
        res.redirect('/'); // Redirect to home page after signup
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).send('Error creating user: ' + err.message);
    }
});


// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).send('Invalid email or password');
        }

        // Set session after successful login
        req.session.userEmail = user.email; // Store user email in session
        req.session.userId = user._id; // Optionally store user ID
        req.session.username = user.username; // Optionally store username
        res.redirect('/'); // Redirect to home page after login
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).send('Error logging in: ' + err.message);
    }
});

// Logout route
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).send('Error logging out');
        }
        res.redirect('/'); // Redirect to home page after logout
    });
});

module.exports = router;