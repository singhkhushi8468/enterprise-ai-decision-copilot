import styles from './Sidebar.module.css'

const navItems = [
  { id: 'dashboard', label: 'Dashboard',           icon: 'grid' },
  { id: 'chat',      label: 'AI Copilot Chat',      icon: 'chat' },
  { id: 'scenarios', label: 'Scenario Simulation',  icon: 'chart' },
  { id: 'reports',   label: 'Strategic Reports',    icon: 'doc' },
  { id: 'experts',   label: 'Expert Roster',        icon: 'users' },
]

const icons = {
  grid:  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><rect x="1" y="1" width="6" height="6" rx="1.5"/><rect x="9" y="1" width="6" height="6" rx="1.5"/><rect x="1" y="9" width="6" height="6" rx="1.5"/><rect x="9" y="9" width="6" height="6" rx="1.5"/></svg>,
  chat:  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9.5A4.5 4.5 0 019.5 14H3L2 15V8a6 6 0 1112 0v1.5z"/></svg>,
  chart: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><path d="M2 13L5 8l3 3 3-5 3 2"/></svg>,
  doc:   <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><rect x="2" y="2" width="12" height="12" rx="2"/><path d="M5 6h6M5 9h4M5 12h2"/></svg>,
  users: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><circle cx="6" cy="5" r="3"/><path d="M1 14c0-3 2-5 5-5s5 2 5 5"/><path d="M11 2a3 3 0 010 6M15 14c0-2.5-1.5-4.5-4-5"/></svg>,
}

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.brandIcon}>
          <svg viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="7" stroke="white" strokeWidth="1.3"/>
            <path d="M5 9h8M9 5v8" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
            <circle cx="9" cy="9" r="2.5" fill="white" opacity=".9"/>
          </svg>
        </div>
        <div className={styles.brandName}>AI Decision<br/>Copilot</div>
        <div className={styles.brandSub}>Enterprise · Strategic</div>
      </div>

      <nav className={styles.nav}>
        <div className={styles.navSection}>Main</div>
        {navItems.slice(0, 4).map(item => (
          <div
            key={item.id}
            className={`${styles.navItem} ${activePage === item.id ? styles.active : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className={styles.navIcon}>{icons[item.icon]}</span>
            {item.label}
          </div>
        ))}
        <div className={styles.navSection}>System</div>
        <div
          className={`${styles.navItem} ${activePage === 'experts' ? styles.active : ''}`}
          onClick={() => onNavigate('experts')}
        >
          <span className={styles.navIcon}>{icons.users}</span>
          Expert Roster
        </div>
      </nav>

      <div className={styles.footer}>
        <div className={styles.phaseBadge}>
          <div className={styles.phaseLabel}>Current Phase</div>
          <div className={styles.phaseVal}>Phase 1 — Core Build</div>
          <div className={styles.phaseBar}><div className={styles.phaseFill}/></div>
        </div>
      </div>
    </aside>
  )
}
