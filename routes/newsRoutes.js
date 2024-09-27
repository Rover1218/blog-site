const express = require('express');
const axios = require('axios');
const router = express.Router();
const cron = require('node-cron');
require('dotenv').config();

// Environment variables
const API_KEY = process.env.API_KEY; // News API key
const ADSENSE_CLIENT = process.env.ADSENSE_CLIENT; // Google AdSense client ID
const ADSENSE_SLOT = process.env.ADSENSE_SLOT; // Google AdSense ad slot

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
    res.render('news', {
        articles,
        adsenseClient: ADSENSE_CLIENT,
        adsenseSlot: ADSENSE_SLOT
    });
});

module.exports = router;