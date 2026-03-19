import { useState } from 'react'
import styles from './Topbar.module.css'

export default function Topbar({ title, onNewSession, user, onLogout }) {
  const [showMenu, setShowMenu] = useState(false)
  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() || 'U'

  return (
    <div className={styles.topbar}>
      <div className={styles.title}>{title}</div>
      <div className={styles.statusDot} />
      <div className={styles.statusLabel}>System Active</div>
      <button className={styles.btn} onClick={onNewSession}>+ New Session</button>

      {/* User avatar */}
      <div className={styles.avatarWrap} onClick={() => setShowMenu(s => !s)}>
        <div className={styles.avatar}>{initials}</div>
        {showMenu && (
          <div className={styles.menu}>
            <div className={styles.menuUser}>
              <div className={styles.menuName}>{user?.username || 'User'}</div>
              <div className={styles.menuEmail}>{user?.email || ''}</div>
            </div>
            <div className={styles.menuDivider}/>
            <div className={styles.menuItem} onClick={onLogout}>
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
                <path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M11 11l3-3-3-3M14 8H6"/>
              </svg>
              Sign out
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
