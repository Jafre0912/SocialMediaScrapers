import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
    const [url, setUrl] = useState('');
    const [scrapeType, setScrapeType] = useState('');
    const [data, setData] = useState([]);

    const handleScrape = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/scrape', {
                url,
                scrapeType,
            });
            setData(response.data.data);
        } catch (error) {
            console.error('Error scraping data:', error.message);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Social Media Scraper</h1>
            <input
                type="text"
                placeholder="Enter URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="border p-2 m-2"
            />
            <select
                value={scrapeType}
                onChange={(e) => setScrapeType(e.target.value)}
                className="border p-2 m-2"
            >
                <option value="">Select Scrape Type</option>
                <option value="followers">Followers</option>
                <option value="following">Following</option>
                <option value="comments">Comments</option>
                <option value="likes">Likes</option>
            </select>
            <button onClick={handleScrape} className="bg-blue-500 text-white p-2 rounded">
                Scrape
            </button>
            <div>
                <h2 className="text-xl font-semibold">Scraped Data:</h2>
                <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(data, null, 2)}</pre>
            </div>
        </div>
    );
};

export default App;
