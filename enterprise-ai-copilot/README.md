# Enterprise AI Decision Copilot
### Strategic Planning & Scenario Simulation Platform

---

## Project Structure

```
enterprise-ai-copilot/
├── frontend/          # React + Vite app
├── backend/           # Node.js + Express API
├── aiml/              # Python AI/ML services
└── docker-compose.yml # Run everything together
```

---

## Quick Start (VS Code)

### Prerequisites
- Node.js 18+
- Python 3.10+
- npm or yarn

### 1. Clone & Open in VS Code
```bash
code enterprise-ai-copilot
```

### 2. Start Backend
```bash
cd backend
npm install
npm run dev
# Runs on http://localhost:5000
```

### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

### 4. Start AI/ML Service
```bash
cd aiml
pip install -r requirements.txt
python main.py
# Runs on http://localhost:8000
```

### 5. Or run everything with Docker
```bash
docker-compose up
```

---

## Domain Expert Modules

| Expert | Tech | Status |
|--------|------|--------|
| AI/ML Expert | Python, LangChain, OpenAI | Active |
| Full Stack Developer | React, Node.js, Express | Active |
| Data Engineer | Python, Pandas, SQLite | Active |
| Cloud Architect | AWS/GCP, Terraform, K8s | Phase 2 |

---

## Environment Variables

Create `.env` in `backend/`:
```
PORT=5000
OPENAI_API_KEY=your_key_here
JWT_SECRET=your_secret_here
```

Create `.env` in `aiml/`:
```
OPENAI_API_KEY=your_key_here
PORT=8000
```
