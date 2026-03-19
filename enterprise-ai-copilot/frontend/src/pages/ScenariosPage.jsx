import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts'
import axios from 'axios'
import styles from './ScenariosPage.module.css'

const DOMAINS = ['Market Expansion', 'Cost Optimisation', 'Product Launch', 'M&A Strategy', 'Digital Transformation']
const RISKS   = ['Conservative', 'Moderate', 'Aggressive']

function computeResults(domain, risk, horizon, confidence) {
  const rMult = risk === 'Conservative' ? 0.6 : risk === 'Moderate' ? 1.0 : 1.4
  const cMult = confidence / 100
  const rev   = Math.round(20 + rMult * 20 * cMult)
  const cost  = Math.round(10 + rMult * 12)
  const roi   = (rev / Math.max(cost, 1) * 0.7).toFixed(1)
  const months = Array.from({ length: Math.min(horizon, 8) }, (_, i) => ({
    name: `M${i + 1}`,
    projected: Math.round(20 + (rev / 8) * i + Math.random() * 6),
    baseline:  Math.round(10 + i * 1.5),
  }))
  return { rev, cost, roi, months }
}

const INSIGHTS = {
  Conservative: [
    { color: 'var(--green)', text: 'Low-risk strategy with steady, predictable returns. Suitable for capital-preservation focus.' },
    { color: 'var(--accent)', text: 'Cash flow remains positive throughout horizon. Ideal for board-level conservative mandates.' },
    { color: 'var(--amber)', text: 'Growth ceiling is limited — consider increasing confidence or extending horizon for better upside.' },
  ],
  Moderate: [
    { color: 'var(--green)', text: 'Balanced risk-reward profile. Strong positive outlook with current confidence levels.' },
    { color: 'var(--amber)', text: 'Cost overruns likely in months 3–6. Recommend phased capital deployment strategy.' },
    { color: 'var(--accent)', text: 'First-mover advantage window ~8 weeks. Competitive intelligence confirms similar moves by 2 peers.' },
    { color: 'var(--red)', text: 'Regulatory risk in target markets — legal review recommended before Q2 go-live.' },
  ],
  Aggressive: [
    { color: 'var(--green)', text: 'High upside potential. Maximum revenue capture if execution risk is managed proactively.' },
    { color: 'var(--red)', text: 'Elevated operational risk. Requires dedicated risk monitoring team and weekly steering committee.' },
    { color: 'var(--amber)', text: 'Capital requirements are 40% higher than moderate path. Ensure liquidity buffer is in place.' },
    { color: 'var(--accent)', text: 'Cloud infrastructure (Phase 2) will be critical for scale at aggressive growth rates.' },
  ],
}

export default function ScenariosPage() {
  const [domain,     setDomain]     = useState(DOMAINS[0])
  const [risk,       setRisk]       = useState('Aggressive')
  const [horizon,    setHorizon]    = useState(12)
  const [confidence, setConfidence] = useState(72)
  const [results,    setResults]    = useState(null)
  const [loading,    setLoading]    = useState(false)

  useEffect(() => { runSim() }, [])

  async function runSim() {
    setLoading(true)
    try {
      const res = await axios.post('/api/scenario', { domain, risk, horizon, confidence })
      setResults(res.data)
    } catch {
      await new Promise(r => setTimeout(r, 600))
      setResults(computeResults(domain, risk, horizon, confidence))
    } finally {
      setLoading(false)
    }
  }

  const insights = INSIGHTS[risk] || INSIGHTS.Moderate

  return (
    <div className={styles.page}>
      <div className={styles.layout}>

        {/* LEFT */}
        <div className={styles.left}>
          <div className={styles.sectionHdr}>
            <div className={styles.title}>Scenario Simulation Engine</div>
            <div className={styles.sub}>Configure parameters and run</div>
          </div>

          <div className={styles.controls}>
            <div className={styles.ctrlLabel}>Simulation Parameters</div>
            <div className={styles.ctrlGrid}>
              <div className={styles.ctrlItem}>
                <label>Business Domain</label>
                <select value={domain} onChange={e => setDomain(e.target.value)}>
                  {DOMAINS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className={styles.ctrlItem}>
                <label>Risk Appetite</label>
                <select value={risk} onChange={e => setRisk(e.target.value)}>
                  {RISKS.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div className={styles.ctrlItem}>
                <label>
                  Time Horizon
                  <span className={styles.sliderVal}>{horizon} months</span>
                </label>
                <input type="range" min={3} max={60} step={3} value={horizon}
                  onChange={e => setHorizon(Number(e.target.value))} />
              </div>
              <div className={styles.ctrlItem}>
                <label>
                  Market Confidence
                  <span className={styles.sliderVal}>{confidence}%</span>
                </label>
                <input type="range" min={10} max={100} value={confidence}
                  onChange={e => setConfidence(Number(e.target.value))} />
              </div>
            </div>
            <button className={styles.runBtn} onClick={runSim} disabled={loading}>
              {loading ? '⟳ Running...' : '▶ Run Simulation'}
            </button>
          </div>

          {results && (
            <>
              <div className={styles.resultCards}>
                <div className={styles.resultCard}>
                  <div className={styles.resultIcon}>📈</div>
                  <div className={styles.resultLabel}>Revenue Impact</div>
                  <div className={`${styles.resultVal} ${styles.up}`}>+{results.rev}%</div>
                  <div className={styles.resultSub}>Projected growth</div>
                </div>
                <div className={styles.resultCard}>
                  <div className={styles.resultIcon}>💰</div>
                  <div className={styles.resultLabel}>Cost Delta</div>
                  <div className={`${styles.resultVal} ${styles.down}`}>+{results.cost}%</div>
                  <div className={styles.resultSub}>Additional spend</div>
                </div>
                <div className={styles.resultCard}>
                  <div className={styles.resultIcon}>⚡</div>
                  <div className={styles.resultLabel}>ROI Estimate</div>
                  <div className={`${styles.resultVal} ${styles.neutral}`}>{results.roi}x</div>
                  <div className={styles.resultSub}>Over horizon</div>
                </div>
              </div>

              <div className={styles.chartCard}>
                <div className={styles.chartTitle}>Projected vs Baseline Performance</div>
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={results.months}>
                    <CartesianGrid stroke="#ffffff08" strokeDasharray="3 3"/>
                    <XAxis dataKey="name" tick={{ fill: '#5a5e78', fontSize: 10 }} axisLine={false} tickLine={false}/>
                    <YAxis tick={{ fill: '#5a5e78', fontSize: 10 }} axisLine={false} tickLine={false}/>
                    <Tooltip
                      contentStyle={{ background: '#13161f', border: '1px solid #ffffff14', borderRadius: 8, fontSize: 12 }}
                      labelStyle={{ color: '#9498b0' }} itemStyle={{ color: '#e8eaf0' }}
                    />
                    <Line type="monotone" dataKey="projected" stroke="#4f8ef7" strokeWidth={2} dot={false} name="Projected"/>
                    <Line type="monotone" dataKey="baseline"  stroke="#5a5e78" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Baseline"/>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>

        {/* RIGHT */}
        <div className={styles.right}>
          <div className={styles.title} style={{ marginBottom: 12 }}>AI Insights</div>
          <div className={styles.insightsCard}>
            {insights.map((ins, i) => (
              <div key={i} className={styles.insightItem}>
                <div className={styles.insightDot} style={{ background: ins.color }}/>
                <div className={styles.insightText}>{ins.text}</div>
              </div>
            ))}
          </div>

          <div className={styles.riskCard}>
            <div className={styles.ctrlLabel}>Risk Assessment</div>
            <div className={styles.riskBar}>
              <div style={{ flex: 3, background: 'var(--green)', borderRadius: 2 }}/>
              <div style={{ flex: 2, background: 'var(--amber)', borderRadius: 2 }}/>
              <div style={{ flex: 1, background: 'var(--red)',   borderRadius: 2 }}/>
            </div>
            <div className={styles.riskLegend}>
              <span>Low</span><span>Medium</span><span>High</span>
            </div>
            <div className={styles.riskText}>
              Overall risk:&nbsp;
              <span style={{ color: risk === 'Conservative' ? 'var(--green)' : risk === 'Moderate' ? 'var(--amber)' : 'var(--red)', fontWeight: 500 }}>
                {risk}
              </span>
              . Confidence-adjusted downside is{' '}
              {risk === 'Conservative' ? 'minimal with strong mitigation.' : risk === 'Moderate' ? 'manageable with proper mitigation.' : 'elevated — dedicated risk team recommended.'}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
