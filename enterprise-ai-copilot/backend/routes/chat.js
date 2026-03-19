const express = require('express')
const axios   = require('axios')
const router  = express.Router()

const SYSTEM_PROMPT = `You are an Enterprise AI Decision Copilot for Strategic Planning & Scenario Simulation.
You help C-suite executives and enterprise strategists with:
- Market expansion analysis
- Cost optimisation strategies
- Scenario-based risk assessment
- Strategic planning and OKR setting
- Competitive intelligence

Domain Experts on the team:
1. AI/ML Expert — decision models, NLP, RAG pipelines (Active)
2. Full Stack Developer — React dashboards, APIs (Active)
3. Data Engineer — ETL pipelines, Snowflake, Kafka (Active)
4. Cloud Architect — AWS/GCP, Kubernetes (Phase 2, joining later)

Always respond with strategic, data-driven, enterprise-grade insights.
Be concise but thorough. Reference the expert domains where relevant.
Current Phase: Phase 1 (Core Build). Cloud integration is planned for Phase 2.`

// POST /api/chat
router.post('/', async (req, res) => {
  const { message, history = [] } = req.body

  if (!message) return res.status(400).json({ error: 'Message is required' })

  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey || apiKey === 'your_key_here') {
    // Demo mode — no API key needed
    return res.json({ reply: getDemoReply(message), mode: 'demo' })
  }

  try {
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.slice(-8),
      { role: 'user', content: message },
    ]

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      { model: 'gpt-4o-mini', messages, max_tokens: 600, temperature: 0.7 },
      { headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' } }
    )

    const reply = response.data.choices[0].message.content
    res.json({ reply, mode: 'live', tokens: response.data.usage })
  } catch (err) {
    console.error('OpenAI error:', err.response?.data || err.message)
    res.json({ reply: getDemoReply(message), mode: 'demo_fallback' })
  }
})

const DEMO_REPLIES = [
  "Based on enterprise AI analysis, I recommend a phased approach. Revenue uplift potential: 34% over 12 months with moderate risk exposure. Key action: validate data pipeline quality (currently at 94%) before capital commitment.\n\n*Running in demo mode. Add your OPENAI_API_KEY in backend/.env for live AI responses.*",
  "Strategic assessment complete. Cost-benefit model shows 2.4x ROI over the selected horizon. Regulatory flag raised for 2 of 3 target markets — legal review recommended in Week 1.\n\n*Demo mode active. Set OPENAI_API_KEY for live responses.*",
  "Scenario simulation processed 47 comparable enterprise decisions. Highest-confidence path: phased rollout starting with lowest-risk market, scaling subsequently. Full Stack team can support real-time monitoring dashboards from Day 1.\n\n*Add OPENAI_API_KEY to backend/.env to enable live AI responses.*",
  "Competitive intelligence indicates first-mover advantage window of ~6-8 weeks. Current Phase 1 architecture handles initial load. Cloud infrastructure (Phase 2) becomes critical at >10x scale.\n\n*Demo mode — configure your API key for live strategic analysis.*",
  "Data quality confirmed at 94% across all pipelines. AI model confidence: 84%. Recommendation: proceed with execution. A full strategic report can be generated from the Reports section.\n\n*Demo mode active. Set OPENAI_API_KEY in backend/.env for live AI.*",
]
let demoIdx = 0
function getDemoReply(message) {
  return DEMO_REPLIES[demoIdx++ % DEMO_REPLIES.length]
}

module.exports = router
