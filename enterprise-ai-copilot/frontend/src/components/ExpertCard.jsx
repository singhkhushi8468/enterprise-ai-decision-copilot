import styles from './ExpertCard.module.css'

export default function ExpertCard({ expert, onClick }) {
  const { name, role, desc, skills, avatar, progress, progressColor, badges, colorClass, locked } = expert

  return (
    <div
      className={`${styles.card} ${styles[colorClass] || ''} ${locked ? styles.locked : ''}`}
      onClick={!locked ? onClick : undefined}
    >
      <div className={styles.top}>
        <div className={`${styles.avatar} ${styles[avatar.bg]}`}>{avatar.emoji}</div>
        <div className={styles.badges}>
          {badges.map((b, i) => (
            <span key={i} className={`${styles.badge} ${styles['badge_' + b.type]}`}>{b.label}</span>
          ))}
        </div>
      </div>

      <div className={styles.name}>{name}</div>
      <div className={styles.role}>{role}</div>
      <div className={styles.desc}>{desc}</div>

      <div className={styles.skills}>
        {skills.map((s, i) => <span key={i} className={styles.skill}>{s}</span>)}
      </div>

      <div className={styles.footer}>
        <div className={styles.progressWrap}>
          <div className={styles.progressMeta}>
            <span>Contribution</span>
            <span>{locked ? '🔒 Planned' : progress + '%'}</span>
          </div>
          <div className={styles.progBar}>
            <div
              className={`${styles.progFill} ${styles['fill_' + progressColor]}`}
              style={{ width: locked ? '12%' : progress + '%' }}
            />
          </div>
        </div>
        {!locked && <div className={styles.link}>Details ↗</div>}
      </div>
    </div>
  )
}
