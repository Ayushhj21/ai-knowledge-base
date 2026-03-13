const express = require('express');
const router = express.Router();
const Document = require('../models/Document');
const { chunkText } = require('../services/ragService');
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(), //memoryStorage() — keeps the file in RAM instead of saving to disk, perfect for text files
  fileFilter: (req, file, cb) => { //fileFilter — rejects anything that isn't .txt or .md
    const ext = '.' + file.originalname.split('.').pop().toLowerCase();
    if (['.txt', '.md'].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only .txt and .md files allowed'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// POST - upload a document
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const content = req.file.buffer.toString('utf-8');
    const chunks = chunkText(content);

    const doc = new Document({
      originalName: req.file.originalname,
      content,
      chunks,
      wordCount: content.split(/\s+/).length,
    });

    await doc.save();

    res.json({
      message: 'Document uploaded!',
      document: {
        id: doc._id,
        name: doc.originalName,
        wordCount: doc.wordCount,
        chunkCount: doc.chunks.length,
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET - list all documents
router.get('/', async (req, res) => {
  try {
    const docs = await Document.find({}, 'originalName wordCount chunks uploadedAt');
    res.json(docs.map(d => ({
      id: d._id,
      name: d.originalName,
      wordCount: d.wordCount,
      chunkCount: d.chunks.length,
      uploadedAt: d.uploadedAt,
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE - remove a document
router.delete('/:id', async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    
    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }

    await doc.deleteOne();
    res.json({ message: 'Document deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;