import { useNavigate } from 'react-router-dom'
import { automationChallenges } from '../data/automationChallenges'
import LevelCard from '../components/LevelCard'
import { getSaved, getLevelStatus } from '../utils/progressUtils'

const MISSIONS_PER_SESSION = 5

export default function AutoLevelsPage() {
  const navigate = useNavigate()
  const levelEntries = Object.entries(automationChallenges)

  function handleStart(levelId, locked) {
    if (locked) return
    const saved = getSaved(levelId)
    if (saved?.completed) {
      localStorage.removeItem(`vibebug_${levelId}`)
    }
    navigate(`/challenge/${levelId}`)
  }

  return (
    <div style={styles.container}>
      <button onClick={() => navigate('/')} style={styles.btnBack}>← Accueil</button>

      <div style={styles.header}>
        <span style={styles.icon}>⚙️</span>
        <div>
          <h1 style={styles.heading}>Automatisation</h1>
          <p style={styles.subheading}>Scripts, cron, CI/CD — repère les pièges des scripts générés par IA</p>
        </div>
      </div>

      <div style={styles.grid}>
        {levelEntries.map(([id, level], index) => {
          const locked = getLevelStatus(id, index, levelEntries) === 'locked'
          return (
            <LevelCard
              key={id}
              id={id}
              title={level.title}
              poolSize={level.challenges.length}
              sessionSize={Math.min(MISSIONS_PER_SESSION, level.challenges.length)}
              saved={getSaved(id)}
              locked={locked}
              onStart={(levelId) => handleStart(levelId, locked)}
            />
          )
        })}
      </div>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '640px',
    margin: '3rem auto',
    padding: '1rem',
    fontFamily: 'system-ui, sans-serif',
  },
  btnBack: {
    background: 'none',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '0.4rem 0.875rem',
    fontSize: '0.875rem',
    color: '#374151',
    cursor: 'pointer',
    fontWeight: '500',
    marginBottom: '2rem',
    display: 'inline-block',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '2rem',
  },
  icon: {
    fontSize: '2.5rem',
    lineHeight: 1,
  },
  heading: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#111827',
    margin: '0 0 0.25rem',
  },
  subheading: {
    fontSize: '0.875rem',
    color: '#6b7280',
    margin: 0,
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
}
