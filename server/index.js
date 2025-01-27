const express = require('express');
const mongoose = require('mongoose');
const puppeteer = require('puppeteer');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log("Database connection failed", err));

// Scrape function
const scrapeData = async (url, scrapeType) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    let data = [];
    if (scrapeType === 'followers' || scrapeType === 'following') {
        data = await page.evaluate(() => {
            // Example logic: Adjust according to the specific website's structure
            return Array.from(document.querySelectorAll('.user-info')).map(user => ({
                name: user.querySelector('.name')?.textContent || 'N/A',
                contact: user.querySelector('.contact')?.textContent || 'N/A',
                location: user.querySelector('.location')?.textContent || 'N/A',
                lastActive: user.querySelector('.last-active')?.textContent || 'N/A',
            }));
        });
    } else if (scrapeType === 'comments' || scrapeType === 'likes') {
        data = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('.interaction')).map(interaction => ({
                name: interaction.querySelector('.name')?.textContent || 'N/A',
                comment: interaction.querySelector('.comment')?.textContent || 'N/A',
            }));
        });
    }

    await browser.close();
    return data;
};

// API Routes
app.post('/api/scrape', async (req, res) => {
    const { url, scrapeType } = req.body;
    try {
        const scrapedData = await scrapeData(url, scrapeType);
        res.status(200).json({ success: true, data: scrapedData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
