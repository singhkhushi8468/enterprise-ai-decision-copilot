import { useEffect, useState } from 'react'
import styles from './LoadingScreen.module.css'

const STEPS = [
  'Authenticating user...',
  'Loading AI models...',
  'Connecting to backend...',
  'Fetching expert roster...',
  'Preparing dashboard...',
]

export default function LoadingScreen({ user, onDone }) {
  const [step, setStep]     = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const total = STEPS.length
    let current = 0

    const interval = setInterval(() => {
      current++
      setStep(Math.min(current, total - 1))
      setProgress(Math.round((current / total) * 100))
      if (current >= total) {
        clearInterval(interval)
        setTimeout(onDone, 400)
      }
    }, 480)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={styles.screen}>
      <div className={styles.center}>
        {/* Logo */}
        <div className={styles.logo}>
          <svg viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="7" stroke="white" strokeWidth="1.3"/>
            <path d="M5 9h8M9 5v8" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
            <circle cx="9" cy="9" r="2.5" fill="white" opacity=".9"/>
          </svg>
        </div>

        <div className={styles.title}>AI Decision Copilot</div>
        <div className={styles.welcome}>Welcome back, <span>{user?.username || user?.email || 'User'}</span></div>

        {/* Animated rings */}
        <div className={styles.rings}>
          <div className={styles.ring1}/>
          <div className={styles.ring2}/>
          <div className={styles.ring3}/>
        </div>

        {/* Progress bar */}
        <div className={styles.progressWrap}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: progress + '%' }}/>
          </div>
          <div className={styles.progressText}>{progress}%</div>
        </div>

        {/* Current step */}
        <div className={styles.stepText}>{STEPS[step]}</div>

        {/* Steps dots */}
        <div className={styles.dots}>
          {STEPS.map((_, i) => (
            <div key={i} className={`${styles.dot} ${i <= step ? styles.dotActive : ''}`}/>
          ))}
        </div>
      </div>
    </div>
  )
}
