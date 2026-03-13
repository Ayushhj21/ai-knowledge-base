const mongoose = require('mongoose');

const chunkSchema = new mongoose.Schema({
    content: { type: String, required: true },
    index: { type: Number, required: true },
});

const documentSchema = new mongoose.Schema({
    originalName: { type: String, required: true },
    content: { type: String, required: true },
    chunks: [chunkSchema],
    wordCount: { type: Number },
    uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Document', documentSchema);