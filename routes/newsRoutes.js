const express = require('express');
const axios = require('axios');
const router = express.Router();
const cron = require('node-cron');
const path = require('path');
require('dotenv').config();

// Environment variables
const GUARDIAN_API_KEY = process.env.GUARDIAN_API_KEY;
let articles = [];

// Function to fetch news articles from The Guardian
async function fetchNews() {
    try {
        const response = await axios.get('https://content.guardianapis.com/search', {
            params: {
                'api-key': GUARDIAN_API_KEY,
                'show-fields': 'headline,thumbnail,trailText,lastModified,shortUrl',
                'page-size': 30,
                'show-tags': 'contributor',
                'order-by': 'newest',
                'section': 'news|world|technology|business|science'
            }
        });

        // Transform Guardian API response to match your frontend expectations
        articles = response.data.response.results.map(article => ({
            title: article.webTitle,
            url: article.webUrl,
            description: article.fields?.trailText || 'No description available',
            thumbnail: article.fields?.thumbnail,
            publishedAt: article.webPublicationDate,
            section: article.sectionName,
            shortUrl: article.fields?.shortUrl
        }));

        console.log(`Successfully fetched ${articles.length} articles from The Guardian`);
    } catch (err) {
        console.error('Error fetching news from The Guardian:', err.response?.data || err.message);
    }
}

// Route to render the news page (HTML)
router.get('/view', (req, res) => {
    res.render('news', { articles });
});

// Route to get all articles (JSON API)
router.get('/api', (req, res) => {
    res.json(articles);
});

// Route to get articles by section (JSON API)
router.get('/api/section/:section', (req, res) => {
    const sectionArticles = articles.filter(
        article => article.section.toLowerCase() === req.params.section.toLowerCase()
    );
    res.json(sectionArticles);
});

// Fetch news every 15 minutes
cron.schedule('*/15 * * * *', fetchNews);

// Initial fetch of news articles
fetchNews();

module.exports = router;