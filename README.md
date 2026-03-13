# 📚 AI Knowledge Base

An AI-powered Q&A system that lets you upload documents and ask natural language questions. Built with **Node.js**, **MongoDB**, and the **Anthropic Claude API** using the **RAG (Retrieval-Augmented Generation)** pattern.

🔗 **Live Demo:** [ai-knowledge-base-production-0516.up.railway.app](https://ai-knowledge-base-production-0516.up.railway.app)

![AI Knowledge Base](https://img.shields.io/badge/Node.js-18+-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green) ![Claude](https://img.shields.io/badge/Anthropic-Claude-orange) ![Railway](https://img.shields.io/badge/Deployed-Railway-purple)

---

## 🧠 How It Works

This app implements the **RAG pattern** from scratch — no LangChain or framework abstractions.

```
Upload Document → Split into Chunks → Store in MongoDB
                                            ↓
Ask Question → Find Relevant Chunks → Send to Claude → Get Answer
```

1. **Chunking** — Documents are split into 500-word overlapping chunks (100-word overlap) so no context is lost at boundaries
2. **Retrieval** — Keyword scoring finds the most relevant chunks for each question
3. **Generation** — Claude receives only the relevant chunks as context and answers from them

---

## ✨ Features

- 📄 Upload `.txt` and `.md` files
- 💬 Chat-style dark UI
- 🔍 Keyword-based chunk retrieval
- 🤖 Claude AI answers grounded in your documents
- 📁 Q&A history saved in MongoDB
- 🗑️ Delete documents from the knowledge base
- 🚀 Deployed on Railway

---

## 🗂 Project Structure

```
ai-knowledge-base/
├── src/
│   ├── server.js              # Express app + MongoDB connection
│   ├── models/
│   │   ├── Document.js        # Stores documents + chunks
│   │   └── QA.js              # Stores Q&A history
│   ├── routes/
│   │   ├── documents.js       # Upload / list / delete endpoints
│   │   └── ask.js             # Ask question + history endpoints
│   └── services/
│       └── ragService.js      # Core RAG logic (chunking, retrieval, Claude)
├── public/
│   └── index.html             # Frontend (dark chat UI)
├── .env.example
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)
- Anthropic API key

### 1. Clone the repo
```bash
git clone https://github.com/Ayushhj21/ai-knowledge-base.git
cd ai-knowledge-base
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-knowledge-base
ANTHROPIC_API_KEY=sk-ant-...
```

### 4. Run the app
```bash
npm run dev     # development (auto-restart)
npm start       # production
```

### 5. Open in browser
```
http://localhost:3000
```

---

## 📡 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Server + DB status |
| `POST` | `/api/documents` | Upload a `.txt` or `.md` file |
| `GET` | `/api/documents` | List all documents |
| `DELETE` | `/api/documents/:id` | Delete a document |
| `POST` | `/api/ask` | Ask a question |
| `GET` | `/api/ask/history` | Get recent Q&A history |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express |
| Database | MongoDB Atlas, Mongoose |
| AI | Anthropic Claude API |
| File Upload | Multer |
| Frontend | HTML, CSS, Vanilla JS |
| Deployment | Railway |

---

## 🔧 Key Concepts Learned

- **RAG Pattern** — Retrieval-Augmented Generation for grounding AI answers in real documents
- **Document Chunking** — Splitting large documents with overlap for better retrieval
- **Keyword Retrieval** — Scoring chunks based on question word matches
- **Prompt Engineering** — Structuring prompts so Claude stays grounded to document context
- **REST API Design** — Clean route separation with Express
- **MongoDB Schemas** — Designing schemas for documents and Q&A history

---

## 🛣 Roadmap

- [ ] PDF support with `pdf-parse`
- [ ] Vector embeddings + semantic search (MongoDB Atlas Vector Search)
- [ ] Streaming responses from Claude
- [ ] User authentication with JWT
- [ ] Multi-user support with separate knowledge bases

