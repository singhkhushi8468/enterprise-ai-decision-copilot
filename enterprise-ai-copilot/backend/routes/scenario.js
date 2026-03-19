const express = require('express')
const router  = express.Router()

// POST /api/scenario
router.post('/', (req, res) => {
  const { domain = 'Market Expansion', risk = 'Moderate', horizon = 12, confidence = 72 } = req.body

  const rMult = risk === 'Conservative' ? 0.6 : risk === 'Moderate' ? 1.0 : 1.4
  const cMult = Math.max(10, Math.min(100, confidence)) / 100

  const rev  = Math.round(20 + rMult * 20 * cMult)
  const cost = Math.round(10 + rMult * 12)
  const roi  = parseFloat((rev / Math.max(cost, 1) * 0.7).toFixed(1))

  const months = Array.from({ length: Math.min(Number(horizon), 8) }, (_, i) => ({
    name:      `M${i + 1}`,
    projected: Math.round(20 + (rev / 8) * i + (Math.random() * 6 - 3)),
    baseline:  Math.round(10 + i * 1.5),
  }))

  const riskScore = risk === 'Conservative' ? 22 : risk === 'Moderate' ? 42 : 68
  const riskLabel = risk === 'Conservative' ? 'Low' : risk === 'Moderate' ? 'Moderate' : 'Elevated'

  const insights = generateInsights(domain, risk, horizon, confidence)

  res.json({ rev, cost, roi, months, riskScore, riskLabel, domain, risk, horizon, confidence, insights })
})

// GET /api/scenario/domains
router.get('/domains', (req, res) => {
  res.json({
    domains: ['Market Expansion', 'Cost Optimisation', 'Product Launch', 'M&A Strategy', 'Digital Transformation'],
    riskLevels: ['Conservative', 'Moderate', 'Aggressive'],
  })
})

function generateInsights(domain, risk, horizon, confidence) {
  const base = [
    { level: 'positive', text: `${domain} analysis complete. Confidence-adjusted outlook: ${confidence >= 70 ? 'strong' : 'moderate'}.` },
    { level: 'warning',  text: `Cost overruns possible in months 3–6. Phased capital deployment recommended.` },
    { level: 'info',     text: `First-mover advantage window: ~${Math.round(6 + (confidence / 100) * 4)} weeks based on competitive intelligence.` },
  ]
  if (risk === 'Aggressive') base.push({ level: 'danger', text: 'Elevated risk profile requires dedicated monitoring team and weekly steering committee.' })
  if (horizon > 24) base.push({ level: 'info', text: 'Long horizon increases uncertainty. Recommend 6-month review gates.' })
  return base
}

module.exports = router
