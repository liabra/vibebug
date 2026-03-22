import { useNavigate } from 'react-router-dom'
import { bashChallenges } from '../data/bashChallenges'
import LevelCard from '../components/LevelCard'
import { getSaved, getLevelStatus } from '../utils/progressUtils'

const MISSIONS_PER_SESSION = 5

export default function LevelsPage() {
  const navigate = useNavigate()
  const levelEntries = Object.entries(bashChallenges)

  function handleStart(levelId, locked) {
    if (locked) return
    const saved = getSaved(levelId)
    if (saved?.completed) {
      localStorage.removeItem(`vibebug_${levelId}`)
    }
    navigate(`/challenge/${levelId}`)
  }

  function handleStartTrap() {
    const saved = getSaved('ai')
    if (saved?.completed) {
      localStorage.removeItem('vibebug_ai')
    }
    navigate('/challenge/ai')
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Choisissez un niveau</h1>
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

      <div style={styles.separator}>
        <span style={styles.separatorLine} />
        <span style={styles.separatorLabel}>Mode spécial</span>
        <span style={styles.separatorLine} />
      </div>

      <div style={styles.specialCards}>
        <div style={styles.trapCard}>
          <div style={styles.trapLeft}>
            <span style={styles.trapTitle}>🤖 Piège IA</span>
            <span style={styles.trapDesc}>
              Repère ce que l'IA te ferait croire — des patterns plausibles mais incorrects.
            </span>
          </div>
          <button onClick={handleStartTrap} style={styles.trapBtn}>
            {getSaved('ai')?.completed ? 'Rejouer' : 'Lancer'}
          </button>
        </div>

        <div style={styles.speedCard}>
          <div style={styles.trapLeft}>
            <span style={styles.speedTitle}>⚡ Speed Debug</span>
            <span style={styles.speedDesc}>
              5 missions · 15 secondes chacune — entraîne tes réflexes de diagnostic.
            </span>
          </div>
          <button onClick={() => navigate('/speed')} style={styles.speedBtn}>
            Lancer
          </button>
        </div>

        <div style={styles.reconstructCard}>
          <div style={styles.trapLeft}>
            <span style={styles.reconstructTitle}>🔧 Reconstruct Script</span>
            <span style={styles.reconstructDesc}>
              5 défis · remets les blocs dans le bon ordre — entraîne ta logique d'exécution.
            </span>
          </div>
          <button onClick={() => navigate('/reconstruct')} style={styles.reconstructBtn}>
            Lancer
          </button>
        </div>
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
  heading: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  separator: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    margin: '2rem 0 1rem',
  },
  separatorLine: {
    flex: 1,
    height: '1px',
    background: '#e5e7eb',
    display: 'block',
  },
  separatorLabel: {
    fontSize: '0.72rem',
    fontWeight: '700',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    whiteSpace: 'nowrap',
  },
  specialCards: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  trapCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.25rem 1.5rem',
    background: '#fff1f2',
    border: '1.5px solid #fda4af',
    borderRadius: '14px',
    gap: '1rem',
  },
  trapLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.375rem',
  },
  trapTitle: {
    fontWeight: '700',
    fontSize: '1rem',
    color: '#9f1239',
  },
  trapDesc: {
    fontSize: '0.82rem',
    color: '#be123c',
    lineHeight: '1.4',
  },
  trapBtn: {
    flexShrink: 0,
    padding: '0.6rem 1.25rem',
    background: '#be123c',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  speedCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.25rem 1.5rem',
    background: '#fffbeb',
    border: '1.5px solid #fcd34d',
    borderRadius: '14px',
    gap: '1rem',
  },
  speedTitle: {
    fontWeight: '700',
    fontSize: '1rem',
    color: '#92400e',
  },
  speedDesc: {
    fontSize: '0.82rem',
    color: '#b45309',
    lineHeight: '1.4',
  },
  speedBtn: {
    flexShrink: 0,
    padding: '0.6rem 1.25rem',
    background: '#d97706',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  reconstructCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.25rem 1.5rem',
    background: '#f5f3ff',
    border: '1.5px solid #c4b5fd',
    borderRadius: '14px',
    gap: '1rem',
  },
  reconstructTitle: {
    fontWeight: '700',
    fontSize: '1rem',
    color: '#4c1d95',
  },
  reconstructDesc: {
    fontSize: '0.82rem',
    color: '#6d28d9',
    lineHeight: '1.4',
  },
  reconstructBtn: {
    flexShrink: 0,
    padding: '0.6rem 1.25rem',
    background: '#7c3aed',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
}
