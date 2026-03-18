import { useNavigate } from 'react-router-dom'
import { bashChallenges } from '../data/bashChallenges'
import LevelCard from '../components/LevelCard'

function getSaved(levelId) {
  try { return JSON.parse(localStorage.getItem(`vibebug_${levelId}`)) ?? null } catch { return null }
}

export default function LevelsPage() {
  const navigate = useNavigate()

  function handleStart(levelId) {
    const saved = getSaved(levelId)
    if (saved?.completed) {
      localStorage.removeItem(`vibebug_${levelId}`)
    }
    navigate(`/challenge/${levelId}`)
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Choisissez un niveau</h1>
      <div style={styles.grid}>
        {Object.entries(bashChallenges).map(([id, level]) => (
          <LevelCard
            key={id}
            id={id}
            title={level.title}
            total={level.challenges.length}
            saved={getSaved(id)}
            onStart={handleStart}
          />
        ))}
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
}
