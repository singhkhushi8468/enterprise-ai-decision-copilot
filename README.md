<div align="center">

# 🧠 Enterprise AI Decision Copilot
### *for Strategic Planning & Scenario Simulation*

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express.js-Backend-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![Anthropic](https://img.shields.io/badge/Claude%20AI-Powered-D97757?style=for-the-badge&logo=anthropic&logoColor=white)](https://anthropic.com)
[![HTML](https://img.shields.io/badge/Frontend-HTML%2FCSS%2FJS-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![Status](https://img.shields.io/badge/Status-In%20Development-yellow?style=for-the-badge)]()

> **An intelligent AI co-pilot that empowers enterprise leaders to make faster, smarter, and explainable strategic decisions — backed by real-time scenario simulation and Claude-powered reasoning.**

---

</div>

## 📌 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Project Objectives](#-project-objectives)
- [System Architecture](#-system-architecture)
- [Key Features](#-key-features)
- [Project Structure](#-project-structure)
- [Environment Setup](#-environment-setup)
- [Technologies Used](#-technologies-used)
- [Development Approach](#-development-approach)
- [Future Scope](#-future-scope)
- [Team](#-team)

---

## 🌐 Overview

The **Enterprise AI Decision Copilot** is an adaptive, explainable AI system designed to support C-suite executives, strategists, and enterprise planners in making high-stakes decisions.

Built on a **Node.js + Express backend** with an **Anthropic Claude AI** reasoning core, this system transforms complex business questions into actionable strategic intelligence — enabling organizations to simulate futures, stress-test strategies, and receive explainable AI recommendations through a clean chat interface.

> *Stop guessing. Start simulating. Let AI co-pilot your strategy.*

---

## ❗ Problem Statement

Modern enterprises face a strategic decision-making crisis:

| Challenge | Impact |
|-----------|--------|
| 📊 Data is siloed across departments | No unified decision intelligence |
| ⏱️ Decisions are made reactively | Missed opportunities and costly pivots |
| 🤖 AI outputs are black boxes | Leaders cannot trust unexplained predictions |
| 🔁 No scenario simulation capability | Inability to stress-test strategies |
| 🧩 Planning is disconnected from real-time data | Strategies become obsolete quickly |
| 📉 Past decision failures are not learned from | Recurring strategic mistakes |

> **There is no unified, adaptive, and explainable AI system that co-pilots enterprise strategy in real time.**

---

## 🎯 Project Objectives

This project is engineered to:

- 🔗 **Unify** enterprise context into a single AI-powered strategic intelligence layer
- 🔮 **Simulate** multiple strategic scenarios with probabilistic reasoning via Claude AI
- 🧩 **Explain** every AI recommendation with transparent chain-of-thought reasoning
- 🚨 **Detect** early signals of strategic risk and operational shifts
- 🔄 **Adapt** through session-based memory and conversation continuity
- 📡 **Alert** decision-makers proactively before risks materialize
- 📊 **Deliver** insights through a secure, rate-limited, production-ready API

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND LAYER                              │
│              frontend/project.html                              │
│         Chat UI · Strategy Input · Response Rendering           │
└───────────────────────────┬─────────────────────────────────────┘
                            │  HTTP Requests
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                  EXPRESS SERVER  (server.js)                    │
│                     PORT: 3001                                  │
└───────┬──────────────┬──────────────┬──────────────────────────┘
        │              │              │
        ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌────────────────────┐
│  auth.js     │ │rateLimiter.js│ │  errorHandler.js   │
│  Auth Guard  │ │ 20 req/60s   │ │  Global Error Mgmt │
└──────────────┘ └──────────────┘ └────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ROUTES LAYER                                 │
│                   routes/chat.js                                │
│           Request Handling · Session Management                 │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                CONFIG / SYSTEM PROMPT                           │
│              config/systemPrompt.js                             │
│     Strategic Persona · Reasoning Rules · Domain Context        │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│              ANTHROPIC CLAUDE AI  (claude-sonnet)               │
│       Scenario Simulation · Strategic Reasoning · XAI           │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

### 🔮 Claude-Powered Strategy Reasoning
Natural language interface for querying strategic decisions — powered by Anthropic's Claude. Ask questions like *"What happens if we expand to Southeast Asia in Q3?"* and receive data-grounded, explainable answers.

### 🛡️ Secure Authentication Middleware
Built-in `auth.js` middleware protects all API routes, ensuring only authorized enterprise users can access the copilot.

### ⚡ Intelligent Rate Limiting
`rateLimiter.js` enforces 20 requests per 60-second window — preventing abuse while maintaining a smooth experience for real users.

### 🧠 Configurable System Prompt Engine
`config/systemPrompt.js` defines the AI's strategic persona, domain expertise, and reasoning framework — fully customizable per enterprise context.

### 🔄 Session-Based Conversation Memory
`session.js` maintains conversation continuity (TTL: 3,600,000ms / 1 hour), so the copilot remembers prior context within a strategic planning session.

### 🚨 Global Error Handling
`errorHandler.js` provides centralized, production-grade error management — ensuring graceful degradation and clear error reporting.

### 🌐 CORS-Enabled API
Configurable `ALLOWED_ORIGIN` supports flexible frontend deployment — from local development to enterprise-hosted frontends.

---

## 📁 Project Structure

```
enterprise-ai-decision-copilot/
│
├── backend/
│   ├── config/
│   │   └── systemPrompt.js        # AI persona & strategic reasoning config
│   │
│   ├── middleware/
│   │   ├── auth.js                # Authentication & authorization guard
│   │   ├── errorHandler.js        # Global error handling middleware
│   │   ├── rateLimiter.js         # Rate limiting (20 req / 60s window)
│   │   └── session.js             # Session management (TTL: 1 hour)
│   │
│   ├── routes/
│   │   └── chat.js                # Chat API route & Claude integration
│   │
│   ├── .env.example               # Environment variable template
│   ├── package.json               # Node.js dependencies & scripts
│   └── server.js                  # Express server entry point (PORT 3001)
│
├── frontend/
│   └── project.html               # Chat UI & strategy input interface
│
└── README.md
```

---

## ⚙️ Environment Setup

Copy `.env.example` to `.env` and fill in your values:

```env
# Anthropic Claude API Key
ANTHROPIC_API_KEY=sk-ant-api0-...

# App-level API authentication key
APP_API_KEY=your-app-secret-key

# Server port
PORT=3001

# Environment mode
NODE_ENV=development

# CORS allowed origin (* for dev, your frontend URL for production)
ALLOWED_ORIGIN=*

# Rate limiting: 20 requests per 60 seconds
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=20

# Session timeout: 1 hour
SESSION_TTL_MS=3600000
```

### 🚀 Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/your-username/enterprise-ai-decision-copilot.git
cd enterprise-ai-decision-copilot

# 2. Install backend dependencies
cd backend
npm install

# 3. Configure environment variables
cp .env.example .env
# Add your ANTHROPIC_API_KEY and APP_API_KEY to .env

# 4. Start the server
npm start
# → Server running at http://localhost:3001

# 5. Open the frontend
# Open frontend/project.html in your browser
```

---

## 🛠️ Technologies Used

| Category | Tools |
|----------|-------|
| **Runtime** | Node.js 18+ |
| **Framework** | Express.js |
| **AI Engine** | Anthropic Claude (claude-sonnet) |
| **Frontend** | HTML, CSS, JavaScript |
| **Middleware** | Custom Auth, Rate Limiter, Session, Error Handler |
| **Security** | API Key Auth, CORS, Rate Limiting |
| **Configuration** | dotenv (.env) |
| **Version Control** | Git & GitHub |
| **Deployment (Future)** | Docker, AWS / GCP |

---

## 🔧 Development Approach

This project is built using a structured, modular engineering methodology:

- ✅ **Modular middleware architecture** — auth, rate limiting, sessions, and error handling are fully isolated
- ✅ **Version control tracking** — every stage has its own meaningful Git commit
- ✅ **Configurable AI persona** — system prompt is cleanly separated from business logic
- ✅ **Environment-driven config** — no hardcoded secrets, fully `.env` driven
- ✅ **Clean Express architecture** — routes, middleware, and config clearly separated
- ✅ **Production-ready foundations** — security and resilience built from day one

---

## 🚀 Future Scope

| Milestone | Description |
|-----------|-------------|
| 🌊 **Streaming Responses** | Stream Claude responses token-by-token for better UX |
| 📊 **Analytics Dashboard** | Visual scenario comparison and decision tracking |
| 🗄️ **Database Integration** | Persist sessions and decisions with PostgreSQL / MongoDB |
| ☁️ **Cloud Deployment** | Dockerized microservices on AWS / GCP |
| 🔌 **Enterprise API** | REST API for ERP / CRM / BI tool integration |
| 🛡️ **OAuth 2.0 Auth** | Enterprise SSO and role-based access control |
| 🌍 **Multi-Agent Reasoning** | Multiple Claude agents collaborating on complex strategy |

---

## 👥 Team

<div align="center">

| Role | Name |
|------|------|
| 👑 **Team Leader** | **Khushi Singh** |
| 🤝 **Team Member** | **Ajeeta Singh** |

*AI & Machine Learning Engineers*

*Enterprise AI Decision Copilot — Strategic Planning & Scenario Simulation*

---

⭐ *If this project resonates with you, consider giving it a star!*

</div>