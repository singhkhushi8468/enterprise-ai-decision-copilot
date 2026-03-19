const express = require('express')
const router  = express.Router()

const REPORTS_DB = {
  market: {
    id: 'market', title: 'Market Expansion Analysis',
    author: 'AI/ML + Data Engineering Team',
    generatedAt: '2026-03-19',
    kpis: [
      { val: '+34%', label: 'Revenue Uplift', color: 'green' },
      { val: '2.4x', label: 'ROI Projected',  color: 'blue' },
      { val: '18mo', label: 'Timeline',        color: 'amber' },
    ],
    sections: [
      { heading: 'Executive Summary', body: 'Analysis of 3 target markets reveals significant growth potential. AI model confidence: 84%. Recommended entry: SEA → MENA → EU, phased over 18 months.' },
      { heading: 'Key Findings', body: 'SEA: highest growth velocity, lowest regulatory friction. MENA: strong demand, moderate political risk. EU: GDPR compliance required — longer entry timeline.' },
      { heading: 'Recommendations', body: '40% budget to SEA in M1-6. Regulatory consultants for EU by M9. Cloud infrastructure critical by M12.' },
    ],
  },
  cost: {
    id: 'cost', title: 'Cost Optimisation Report',
    author: 'Data Engineering + Full Stack Team',
    generatedAt: '2026-03-19',
    kpis: [
      { val: '-22%', label: 'Cost Reduction', color: 'green' },
      { val: '$2.4M', label: 'Annual Savings', color: 'blue' },
      { val: '6mo',  label: 'Payback Period', color: 'amber' },
    ],
    sections: [
      { heading: 'Executive Summary', body: '$2.4M annualised cost reduction: infra (38%), operations (34%), vendors (28%). Timeline: 6 months phased rollout.' },
      { heading: 'Top Levers', body: 'Cloud right-sizing (Phase 2) saves 38%. Kafka+Snowflake consolidation saves 18%. 3 vendor contracts up for Q2 renegotiation.' },
    ],
  },
  risk: {
    id: 'risk', title: 'Risk Assessment Report',
    author: 'AI/ML Expert — Risk Module',
    generatedAt: '2026-03-19',
    kpis: [
      { val: '42', label: 'Risk Score',  color: 'amber' },
      { val: '2',  label: 'High Risks', color: 'red'   },
      { val: '5',  label: 'Mitigated',  color: 'green' },
    ],
    sections: [
      { heading: 'Risk Matrix Summary', body: 'Overall risk: Moderate (42/100). Market, operational, regulatory, and financial dimensions assessed.' },
      { heading: 'Critical Risks', body: 'EU regulatory compliance — HIGH (legal review M3). Cloud pre-Phase2 dependency — MEDIUM (redundant infra planned). Data sovereignty — MEDIUM (regional residency mapped).' },
    ],
  },
  q4: {
    id: 'q4', title: 'Q4 Strategic Plan 2026',
    author: 'Full Stack + AI/ML Team',
    generatedAt: '2026-03-19',
    kpis: [
      { val: '5',       label: 'Enterprise Targets', color: 'blue'  },
      { val: '95%',     label: 'Uptime Target',      color: 'green' },
      { val: 'Phase 2', label: 'Cloud Goal',         color: 'amber' },
    ],
    sections: [
      { heading: 'Q4 OKRs', body: 'O1: 5 enterprise clients. O2: Phase 2 Cloud complete. O3: 95% uptime SLA. O4: 84%+ AI model confidence maintained.' },
      { heading: 'Resource Allocation', body: 'AI/ML 40% on simulation engine. Full Stack 35% on client portal. Data 25% on governance. Cloud Architect onboarding: M10.' },
    ],
  },
}

// GET /api/reports
router.get('/', (req, res) => {
  const list = Object.values(REPORTS_DB).map(r => ({ id: r.id, title: r.title, author: r.author, generatedAt: r.generatedAt }))
  res.json({ reports: list })
})

// GET /api/reports/:id
router.get('/:id', (req, res) => {
  const report = REPORTS_DB[req.params.id]
  if (!report) return res.status(404).json({ error: 'Report not found' })
  res.json(report)
})

module.exports = router
