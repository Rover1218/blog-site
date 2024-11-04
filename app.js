const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const session = require('express-session');
const postRoutes = require('./routes/postRoutes');
const authRoutes = require('./routes/authRoutes');
const favicon = require('serve-favicon'); // Import the favicon middleware
const path = require('path');
const newsRoutes = require('./routes/newsRoutes');
const MongoStore = require('connect-mongo');
// Load environment variables from .env file
dotenv.config();

// Initialize express app
const app = express();
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
// Serve favicon
app.use(favicon(__dirname + '/public/images/favicon.ico')); // Adjust the path as needed
// Middleware to parse URL-encoded data and JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (CSS, JS, images)
app.use(express.static('public', {
    setHeaders: (res, path) => {
        if (path.endsWith('.json')) {
            // This tells browsers "this is a PWA manifest file"
            res.setHeader('Content-Type', 'application/manifest+json');
        }
    }
}));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// MongoDB connection
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
    console.error('MONGO_URI is not defined in the .env file.');
    process.exit(1); // Stop the server if the URI is not defined
}
app.get('/about', (req, res) => {
    res.render('about');
});

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
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI, // Use your MongoDB connection string
        ttl: 14 * 24 * 60 * 60 // = 14 days. Default
    }),
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Routes
app.use('/', postRoutes);
app.use('/', authRoutes);
app.use('/', newsRoutes);
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
    console.log(`Server running on http://localhost:${PORT}`);

    // Ping the console every 10 seconds
    setInterval(() => {
        console.log('Ping: Server is up and running...');
    }, 300000); // 10000 milliseconds = 10 seconds
});