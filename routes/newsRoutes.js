const express = require('express');
const axios = require('axios');
const router = express.Router();
const cron = require('node-cron');

const API_KEY = '842b8a6a9c8140bfbd6372520934f24d'; // Use environment variable for your API key
let articles = [];

// Function to fetch news articles
async function fetchNews() {
    try {
        const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`);
        articles = response.data.articles;
        console.log('News articles updated.');
    } catch (err) {
        console.error('Error fetching news:', err);
    }
}

// Fetch news every 5 minutes
cron.schedule('*/5 * * * *', fetchNews);

// Initial fetch of news articles
fetchNews();

// News route
router.get('/news', (req, res) => {
    res.render('news', { articles });
});

module.exports = router;