const Anthropic = require('@anthropic-ai/sdk');
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function chunkText(text, chunkSize = 500, overlap = 100) {
  const words = text.split(/\s+/);
  const chunks = [];

  for (let i = 0; i < words.length; i += chunkSize - overlap) {
    const chunk = words.slice(i, i + chunkSize).join(' ');
    if (chunk.trim()) chunks.push({ content: chunk, index: chunks.length });
    if (i + chunkSize >= words.length) break;
  }

  return chunks;
}

function findRelevantChunks(question, documents, topK = 5) {
  const questionWords = question.toLowerCase().split(/\s+/)
    .filter(w => w.length > 3);

  const scored = [];

  for (const doc of documents) {
    for (const chunk of doc.chunks) {
      const chunkLower = chunk.content.toLowerCase();
      const score = questionWords.reduce((acc, word) => {
        return acc + (chunkLower.includes(word) ? 1 : 0);
      }, 0);

      if (score > 0) {
        scored.push({ content: chunk.content, score, docName: doc.originalName });
      }
    }
  }

  return scored.sort((a, b) => b.score - a.score).slice(0, topK);
}


async function answerQuestion(question, documents) {
  if (documents.length === 0) {
    return {
      answer: "No documents in the knowledge base yet. Please upload some first!",
      sources: [],
    };
  }

  const relevantChunks = findRelevantChunks(question, documents);
  const sources = [...new Set(relevantChunks.map(c => c.docName))];

  const context = relevantChunks
    .map(c => `[Source: ${c.docName}]\n${c.content}`)
    .join('\n\n---\n\n');

  const prompt = `You are a helpful assistant with access to a knowledge base of documents.

Here are the relevant excerpts from the knowledge base:

${context}

---

Question: ${question}

Instructions:
- Prioritize information from the documents above
- You can use your own knowledge to supplement or provide additional context
- Be clear about when you're drawing from the documents vs your own knowledge
- Be concise and helpful`;

 const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    messages: [{ role: 'user', content: prompt }],
  });

  return {
    answer: response.content[0].text,
    sources,
  };
}


module.exports = { chunkText, answerQuestion };