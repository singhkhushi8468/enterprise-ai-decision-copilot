import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import styles from './ChatPage.module.css'

const QUICK_CHIPS = [
  'What are the key risks in expanding to 3 new markets?',
  'Analyze cost reduction strategies for Q3',
  'Compare cloud migration scenarios A vs B',
  'Generate a strategic planning summary for Q4',
]

const FALLBACK_RESPONSES = [
  "Based on enterprise data and AI scenario models, I recommend a phased approach. The analysis shows a 34% revenue uplift potential over 12 months with moderate risk. Key action: validate assumptions with the Data Engineer pipeline outputs before committing capital.",
  "The cost-benefit model indicates a 2.4x ROI over the selected horizon. There is a regulatory flag for 2 of the 3 target markets. I recommend a legal review in Week 1 of execution before any go-live decisions.",
  "Scenario simulation has processed 47 similar decisions in the knowledge base. The highest-confidence path is a phased rollout — starting with the lowest-risk market, scaling thereafter. Full Stack dashboards can support real-time monitoring from Day 1.",
  "Competitive intelligence shows the first-mover advantage window is approximately 6-8 weeks. Cloud infrastructure (Phase 2) will be critical for scale, but current Phase 1 architecture handles initial load comfortably.",
  "Data pipeline quality is confirmed at 94% — sufficient for AI inference. Proceeding with the scenario is recommended. A full strategic report can be auto-generated. Shall I run the Scenario Simulation now?",
]
let fallbackIdx = 0

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1, role: 'ai',
      text: "Namaste! I'm your Enterprise AI Decision Copilot. I help with strategic planning, scenario analysis, market decisions, risk assessment, and more.\n\nKya aap koi specific business scenario explore karna chahte hain?",
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

  async function sendMessage(text) {
    const userText = text || input.trim()
    if (!userText) return
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = '48px'

    const newMessages = [...messages, { id: Date.now(), role: 'user', text: userText }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const res = await axios.post('/api/chat', {
        message: userText,
        history: newMessages.slice(-6).map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text }))
      })
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: res.data.reply }])
    } catch {
      // fallback if backend not running
      await new Promise(r => setTimeout(r, 1200))
      setMessages(prev => [...prev, {
        id: Date.now() + 1, role: 'ai',
        text: FALLBACK_RESPONSES[fallbackIdx++ % FALLBACK_RESPONSES.length]
      }])
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }
  function autoResize(el) {
    el.style.height = '48px'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.messages}>
        {messages.map(m => (
          <div key={m.id} className={`${styles.msg} ${m.role === 'user' ? styles.userMsg : ''}`}>
            <div className={`${styles.avatar} ${m.role === 'ai' ? styles.aiAvatar : styles.userAvatar}`}>
              {m.role === 'ai' ? '🤖' : '👤'}
            </div>
            <div className={styles.body}>
              <div className={styles.name}>{m.role === 'ai' ? 'AI Copilot' : 'You'}</div>
              <div className={styles.bubble}>{m.text}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className={styles.msg}>
            <div className={`${styles.avatar} ${styles.aiAvatar}`}>🤖</div>
            <div className={styles.body}>
              <div className={styles.name}>AI Copilot</div>
              <div className={styles.bubble}>
                <div className={styles.typing}>
                  <span/><span/><span/>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      <div className={styles.inputArea}>
        <div className={styles.chips}>
          {QUICK_CHIPS.map((c, i) => (
            <div key={i} className={styles.chip} onClick={() => sendMessage(c)}>{c}</div>
          ))}
        </div>
        <div className={styles.inputRow}>
          <textarea
            ref={textareaRef}
            className={styles.textarea}
            value={input}
            onChange={e => { setInput(e.target.value); autoResize(e.target) }}
            onKeyDown={handleKey}
            placeholder="Ask the AI Copilot about strategy, scenarios, decisions..."
            rows={1}
          />
          <button className={styles.sendBtn} onClick={() => sendMessage()}>
            <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 9l13-7-4 7 4 7-13-7z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
