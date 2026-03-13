const express = require('express');
const router = express.Router();
const QA = require('../models/QA');
const Document = require('../models/Document');
const { answerQuestion } = require('../services/ragService');

// GET - fetch recent Q&A history
router.get('/history', async (req, res) => {
  try {
    const history = await QA.find({})
      .sort({ askedAt: -1 })
      .limit(20);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/', async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ error: 'Question is required' });
    }

    // 1. Fetch all documents from MongoDB
    const documents = await Document.find({});

    // 2. Call RAG service (we'll build this next)
    const { answer, sources } = await answerQuestion(question, documents);

    // 3. Save to QA history (just like you said!)
    const qa = new QA({ question, answer, sourceDocs: sources });
    await qa.save();

    // 4. Send response back
    res.json({ question, answer, sources });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;