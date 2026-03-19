import { useState } from 'react'
import styles from './LoginPage.module.css'
import signStyles from './SignupPage.module.css'

export default function SignupPage({ onSignup, onGoLogin }) {
  const [form, setForm]       = useState({ name: '', email: '', username: '', password: '', confirm: '', role: 'Analyst' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [show, setShow]       = useState(false)

  function update(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name)     return setError('Full name zaroori hai')
    if (!form.email)    return setError('Email zaroori hai')
    if (!form.username) return setError('Username zaroori hai')
    if (form.password.length < 6) return setError('Password kam se kam 6 characters ka hona chahiye')
    if (form.password !== form.confirm) return setError('Passwords match nahi kar rahe')

    setLoading(true)
    await new Promise(r => setTimeout(r, 1400))
    setLoading(false)
    onSignup({ name: form.name, email: form.email, username: form.username, role: form.role })
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
          <div className={styles.tagline}>Join the future of enterprise decisions.</div>
          <div className={styles.features}>
            {['Strategic AI at your fingertips', 'Real-time scenario simulation', 'Domain expert collaboration', 'C-suite grade reporting'].map((f, i) => (
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
            <div className={styles.cardTitle}>Create account</div>
            <div className={styles.cardSub}>Start your strategic AI journey</div>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={signStyles.row}>
              <div className={styles.field}>
                <label>Full Name</label>
                <input name="name" type="text" placeholder="Priya Sharma"
                  value={form.name} onChange={update}/>
              </div>
              <div className={styles.field}>
                <label>Username</label>
                <input name="username" type="text" placeholder="priya_sharma"
                  value={form.username} onChange={update}/>
              </div>
            </div>

            <div className={styles.field}>
              <label>Email address</label>
              <input name="email" type="email" placeholder="priya@company.com"
                value={form.email} onChange={update}/>
            </div>

            <div className={styles.field}>
              <label>Role</label>
              <select name="role" value={form.role} onChange={update} className={signStyles.select}>
                <option>Analyst</option>
                <option>Manager</option>
                <option>Director</option>
                <option>VP / C-Suite</option>
                <option>Admin</option>
              </select>
            </div>

            <div className={styles.field}>
              <label>Password</label>
              <div className={styles.pwdWrap}>
                <input name="password" type={show ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={form.password} onChange={update}/>
                <button type="button" className={styles.eyeBtn} onClick={() => setShow(s => !s)}>
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z"/>
                    <circle cx="10" cy="10" r="2.5"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className={styles.field}>
              <label>Confirm Password</label>
              <input name="confirm" type="password" placeholder="Re-enter password"
                value={form.confirm} onChange={update}/>
            </div>

            {/* Password strength */}
            {form.password && (
              <div className={signStyles.strength}>
                <div className={signStyles.strengthBars}>
                  {[1,2,3,4].map(i => (
                    <div key={i} className={`${signStyles.bar} ${
                      form.password.length >= i * 3 ? signStyles['bar' + Math.min(i,4)] : ''
                    }`}/>
                  ))}
                </div>
                <span className={signStyles.strengthLabel}>
                  {form.password.length < 4 ? 'Weak' : form.password.length < 8 ? 'Fair' : form.password.length < 12 ? 'Good' : 'Strong'}
                </span>
              </div>
            )}

            {error && <div className={styles.error}>{error}</div>}

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? <span className={styles.spinner}/> : 'Create Account →'}
            </button>
          </form>

          <div className={styles.signup}>
            Already have an account?&nbsp;
            <span onClick={onGoLogin}>Sign in</span>
          </div>
        </div>
      </div>
    </div>
  )
}
