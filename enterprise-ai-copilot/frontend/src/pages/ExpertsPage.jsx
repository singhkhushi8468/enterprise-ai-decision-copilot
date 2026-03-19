import { EXPERTS } from '../assets/expertsData.js'
import ExpertCard from '../components/ExpertCard.jsx'
import styles from './ExpertsPage.module.css'

export default function ExpertsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.sectionHdr}>
        <div className={styles.title}>Domain Expert Roster</div>
        <div className={styles.sub}>Full roster — 4 domain experts · 3 active · 1 Phase 2</div>
      </div>
      <div className={styles.grid}>
        {EXPERTS.map(expert => (
          <ExpertCard key={expert.id} expert={expert} onClick={() => {}} />
        ))}
      </div>
    </div>
  )
}
