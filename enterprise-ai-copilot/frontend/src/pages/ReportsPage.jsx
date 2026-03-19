import { useState } from 'react'
import styles from './ReportsPage.module.css'

const REPORTS = [
  { id: 'market', icon: '🌐', bg: 'blue',   name: 'Market Expansion Analysis',  tag: 'AI/ML + Data',  desc: 'Deep-dive into new market opportunities, competitive landscape, and entry strategy.' },
  { id: 'cost',   icon: '💡', bg: 'green',  name: 'Cost Optimisation Report',   tag: 'Data + Cloud', desc: 'Identifies cost reduction levers across infrastructure, operations, and supply chain.' },
  { id: 'risk',   icon: '🛡️', bg: 'red',    name: 'Risk Assessment Report',     tag: 'AI/ML',        desc: 'Comprehensive risk matrix across market, operational, regulatory, and financial dimensions.' },
  { id: 'q4',     icon: '📋', bg: 'purple', name: 'Q4 Strategic Plan',          tag: 'Full Stack',   desc: 'Quarterly planning document with OKRs, resource allocation, and scenario-based targets.' },
  { id: 'ai',     icon: '🤖', bg: 'amber',  name: 'AI Adoption Roadmap',        tag: 'AI/ML',        desc: 'Enterprise AI integration plan with capability assessment and toolchain recommendations.' },
  { id: 'cloud',  icon: '☁️', bg: 'teal',   name: 'Cloud Migration Plan',       tag: 'Phase 2',      desc: 'Phase 2 cloud architecture plan — pending Cloud Architect onboarding. Preview available.' },
]

const REPORT_CONTENT = {
  market: {
    title: 'Market Expansion Analysis',
    author: 'AI/ML + Data Engineering Team',
    kpis: [{ val: '+34%', label: 'Revenue Uplift', color: 'var(--green)' }, { val: '2.4x', label: 'ROI Projected', color: 'var(--accent)' }, { val: '18mo', label: 'Timeline', color: 'var(--amber)' }],
    sections: [
      { h: 'Executive Summary', p: 'Analysis of 3 target markets reveals significant growth potential. AI model confidence: 84%. Recommended entry sequence: SEA → MENA → EU, phased over 18 months.' },
      { h: 'Key Findings', p: 'Market 1 (SEA): Highest growth velocity, lowest regulatory friction. Market 2 (MENA): Strong demand signal, moderate political risk. Market 3 (EU): Established market with GDPR compliance requirements — longer entry timeline needed.' },
      { h: 'Recommendations', p: 'Allocate 40% of expansion budget to SEA in Month 1–6. Engage regulatory consultants for EU entry no later than Month 9. Cloud infrastructure (Phase 2) critical for multi-region operations by Month 12.' },
    ],
  },
  cost: {
    title: 'Cost Optimisation Report',
    author: 'Data Engineering + Full Stack Team',
    kpis: [{ val: '-22%', label: 'Cost Reduction', color: 'var(--green)' }, { val: '$2.4M', label: 'Annual Savings', color: 'var(--accent)' }, { val: '6mo', label: 'Payback', color: 'var(--amber)' }],
    sections: [
      { h: 'Executive Summary', p: 'Identified $2.4M in annualised cost reduction opportunities across infrastructure (38%), operations (34%), and vendor contracts (28%). Implementation timeline: 6 months.' },
      { h: 'Top Levers', p: '1. Cloud right-sizing (Phase 2) — estimated 38% infra reduction. 2. Data pipeline consolidation (Kafka + Snowflake) — 18% compute savings. 3. Vendor renegotiation — 3 contracts flagged for Q2 renewal.' },
    ],
  },
  risk: {
    title: 'Risk Assessment Report',
    author: 'AI/ML Expert — Risk Module',
    kpis: [{ val: '42', label: 'Risk Score', color: 'var(--amber)' }, { val: '2', label: 'High Risks', color: 'var(--red)' }, { val: '5', label: 'Mitigated', color: 'var(--green)' }],
    sections: [
      { h: 'Risk Matrix Summary', p: 'Overall enterprise risk score: Moderate (42/100). Four primary risk categories assessed across market, operational, regulatory, and financial dimensions.' },
      { h: 'Critical Risks', p: '1. Regulatory compliance in EU markets — HIGH. Mitigation: legal review by Month 3. 2. Cloud dependency pre-Phase 2 — MEDIUM. Mitigation: redundant infra plan in place. 3. Data sovereignty — MEDIUM. Mitigation: regional residency mapped.' },
    ],
  },
  q4: {
    title: 'Q4 Strategic Plan 2026',
    author: 'Full Stack + AI/ML Team',
    kpis: [{ val: '5', label: 'Enterprise Targets', color: 'var(--accent)' }, { val: '95%', label: 'Uptime Target', color: 'var(--green)' }, { val: 'Phase 2', label: 'Cloud Goal', color: 'var(--amber)' }],
    sections: [
      { h: 'Q4 OKRs', p: 'Objective 1: Launch AI Copilot to 5 enterprise clients. KR: 3 signed, 5 in pilot. Objective 2: Complete Phase 2 Cloud integration. KR: All 4 domain experts active. Objective 3: 95% uptime SLA maintained.' },
      { h: 'Resource Allocation', p: 'AI/ML: 40% bandwidth on simulation engine. Full Stack: 35% on client portal. Data: 25% on governance. Cloud Architect onboarding: Month 10.' },
    ],
  },
  ai: {
    title: 'AI Adoption Roadmap',
    author: 'AI/ML Expert',
    kpis: [{ val: 'L3→L4', label: 'Maturity Target', color: 'var(--accent)' }, { val: '84%', label: 'Model Confidence', color: 'var(--green)' }, { val: '12mo', label: 'Roadmap', color: 'var(--amber)' }],
    sections: [
      { h: 'Capability Assessment', p: 'Current AI maturity: Level 3 (Defined). Target by Q4: Level 4 (Managed). Key gaps: real-time inference at scale, multimodal inputs, automated retraining pipelines.' },
      { h: 'Toolchain Recommendations', p: 'Phase 1: LangChain + OpenAI API + ChromaDB (RAG). Phase 2: Fine-tuned domain model on proprietary data. Phase 3: Multimodal inputs. Phase 4: Fully autonomous decision workflows.' },
    ],
  },
  cloud: {
    title: 'Cloud Migration Plan (Preview)',
    author: 'Cloud Architect — Phase 2',
    kpis: [{ val: 'Phase 2', label: 'Start', color: 'var(--amber)' }, { val: 'TBD', label: 'Cloud Provider', color: 'var(--text3)' }, { val: 'TBD', label: 'Regions', color: 'var(--text3)' }],
    sections: [
      { h: 'Status: Pending Cloud Architect Onboarding', p: 'This report will be fully generated once the Cloud Architect joins in Phase 2. Below is the preliminary architecture plan drafted by the AI/ML and Full Stack teams.' },
      { h: 'Planned Architecture', p: 'Multi-region deployment on AWS/GCP. Kubernetes cluster with auto-scaling. Terraform IaC for reproducible infrastructure. CI/CD via GitHub Actions + ArgoCD. Full IAM security model with least-privilege access.' },
    ],
  },
}

export default function ReportsPage() {
  const [selected, setSelected] = useState(null)

  function openReport(id) {
    setSelected(selected === id ? null : id)
  }

  const content = selected ? REPORT_CONTENT[selected] : null

  return (
    <div className={styles.page}>
      <div className={styles.sectionHdr}>
        <div className={styles.title}>Strategic Planning Reports</div>
        <div className={styles.sub}>AI-generated enterprise reports</div>
      </div>

      <div className={styles.grid}>
        {REPORTS.map(r => (
          <div
            key={r.id}
            className={`${styles.card} ${selected === r.id ? styles.active : ''}`}
            onClick={() => openReport(r.id)}
          >
            <div className={`${styles.icon} ${styles['icon_' + r.bg]}`}>{r.icon}</div>
            <div className={styles.cardName}>{r.name}</div>
            <div className={styles.cardDesc}>{r.desc}</div>
            <div className={styles.cardFooter}>
              <span className={`${styles.tag} ${r.id === 'cloud' ? styles.tagWarn : ''}`}>{r.tag}</span>
              <div className={`${styles.viewBtn} ${r.id === 'cloud' ? styles.viewBtnWarn : ''}`}>
                {selected === r.id ? 'Hide ↑' : 'View Report'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {content && (
        <div className={styles.preview}>
          <div className={styles.previewTitle}>{content.title}</div>
          <div className={styles.previewMeta}>
            <span>Generated: March 2026</span>
            <span>|</span>
            <span>By: {content.author}</span>
          </div>

          <div className={styles.kpis}>
            {content.kpis.map((k, i) => (
              <div key={i} className={styles.kpiBox}>
                <div className={styles.kpiVal} style={{ color: k.color }}>{k.val}</div>
                <div className={styles.kpiLabel}>{k.label}</div>
              </div>
            ))}
          </div>

          {content.sections.map((s, i) => (
            <div key={i} className={styles.section}>
              <div className={styles.sectionH}>{s.h}</div>
              <div className={styles.sectionP}>{s.p}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
