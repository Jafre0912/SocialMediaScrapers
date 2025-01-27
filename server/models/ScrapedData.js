const mongoose = require('mongoose');

const ScrapedDataSchema = new mongoose.Schema({
    name: String,
    contact: String,
    location: String,
    lastActive: String,
});

module.exports = mongoose.model('ScrapedData', ScrapedDataSchema);
