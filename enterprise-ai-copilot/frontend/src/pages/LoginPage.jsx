import { useState } from 'react'
import styles from './LoginPage.module.css'

export default function LoginPage({ onLogin, onGoSignup }) {
  const [form, setForm]       = useState({ email: '', username: '', password: '', remember: false })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [show, setShow]       = useState(false)

  function update(e) {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.email && !form.username) return setError('Email ya Username dono mein se ek zaroori hai')
    if (!form.password) return setError('Password zaroori hai')
    if (form.password.length < 4) return setError('Password kam se kam 4 characters ka hona chahiye')

    setLoading(true)
    // Simulate API call — replace with real backend call later
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)

    // Store in localStorage if remember me
    const user = { email: form.email || form.username, username: form.username || form.email.split('@')[0], remember: form.remember }
    if (form.remember) localStorage.setItem('ai_copilot_user', JSON.stringify(user))
    onLogin(user)
  }

  function handleGoogle() {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onLogin({ email: 'user@gmail.com', username: 'Google User', avatar: 'G' })
    }, 1500)
  }

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>
            <svg viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="7" stroke="white" strokeWidth="1.3"/>
              <path d="M5 9h8M9 5v8" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
              <circle cx="9" cy="9" r="2.5" fill="white" opacity=".9"/>
            </svg>
          </div>
          <div className={styles.brandName}>AI Decision Copilot</div>
        </div>
        <div className={styles.leftContent}>
          <div className={styles.tagline}>Data beats emotions.<br/>Decisions create destiny.</div>
          <div className={styles.features}>
            {['Scenario Simulation Engine', 'Strategic Planning Reports', 'Domain Expert Roster', 'AI-Powered Chat Copilot'].map((f, i) => (
              <div key={i} className={styles.feature}>
                <div className={styles.featureDot}/>
                {f}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.leftFooter}>Enterprise · Strategic · Phase 1</div>
      </div>

      <div className={styles.right}>
        <div className={styles.card}>
          <div className={styles.cardTop}>
            <div className={styles.cardTitle}>Welcome back</div>
            <div className={styles.cardSub}>Sign in to your account</div>
          </div>

          {/* Google Button */}
          <button className={styles.googleBtn} onClick={handleGoogle} disabled={loading}>
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className={styles.divider}><span>or sign in with email</span></div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label>Email address</label>
              <input name="email" type="email" placeholder="you@company.com"
                value={form.email} onChange={update} autoComplete="email"/>
            </div>
            <div className={styles.field}>
              <label>Username <span className={styles.optional}>(optional)</span></label>
              <input name="username" type="text" placeholder="your_username"
                value={form.username} onChange={update} autoComplete="username"/>
            </div>
            <div className={styles.field}>
              <div className={styles.pwdRow}>
                <label>Password</label>
                <span className={styles.forgot}>Forgot password?</span>
              </div>
              <div className={styles.pwdWrap}>
                <input name="password" type={show ? 'text' : 'password'} placeholder="••••••••"
                  value={form.password} onChange={update} autoComplete="current-password"/>
                <button type="button" className={styles.eyeBtn} onClick={() => setShow(s => !s)}>
                  {show
                    ? <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z"/><circle cx="10" cy="10" r="2.5"/><path d="M3 3l14 14" stroke="currentColor"/></svg>
                    : <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z"/><circle cx="10" cy="10" r="2.5"/></svg>
                  }
                </button>
              </div>
            </div>

            <label className={styles.rememberRow}>
              <input type="checkbox" name="remember" checked={form.remember} onChange={update}/>
              <span>Remember me for 30 days</span>
            </label>

            {error && <div className={styles.error}>{error}</div>}

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? <span className={styles.spinner}/> : 'Sign in →'}
            </button>
          </form>

          <div className={styles.signup}>
            Don't have an account?&nbsp;
            <span onClick={onGoSignup}>Create account</span>
          </div>
        </div>
      </div>
    </div>
  )
}
