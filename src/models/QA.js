const mongoose = require('mongoose');

const qaSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  sourceDocs: [{ type: String }], //is an array of strings — it stores which document names were used to answer the question. So the UI can show something like *"answered from: notes.md
  askedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('QA', qaSchema);