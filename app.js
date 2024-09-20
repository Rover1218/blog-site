const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const session = require('express-session');
const postRoutes = require('./routes/postRoutes');
const authRoutes = require('./routes/authRoutes');

// Load environment variables from .env file
dotenv.config();

// Initialize express app
const app = express();

// Middleware to parse URL-encoded data and JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (CSS, JS, images)
app.use(express.static('public'));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// MongoDB connection
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
    console.error('MONGO_URI is not defined in the .env file.');
    process.exit(1); // Stop the server if the URI is not defined
}

mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Stop the server if MongoDB fails to connect
    });

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Routes
app.use('/', postRoutes);
app.use('/', authRoutes);

// Error handling middleware (for routes not found)
app.use((req, res, next) => {
    res.status(404).render('404');
});

// Global error handling middleware (for all errors)
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).render('500', { message: 'Internal Server Error' }); // Create a 500.ejs template for better UX
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});