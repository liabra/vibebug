import { useNavigate } from 'react-router-dom'
import { bashChallenges } from '../data/bashChallenges'
import LevelCard from '../components/LevelCard'

function getSaved(levelId) {
  try { return JSON.parse(localStorage.getItem(`vibebug_${levelId}`)) ?? null } catch { return null }
}

export default function LevelsPage() {
  const navigate = useNavigate()
  const levelEntries = Object.entries(bashChallenges)

  function isLocked(index) {
    if (index === 0) return false
    const prevId = levelEntries[index - 1][0]
    return !getSaved(prevId)?.completed
  }

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
      <h1 style={styles.heading}>Choisissez un niveau</h1>
      <div style={styles.grid}>
        {levelEntries.map(([id, level], index) => {
          const locked = isLocked(index)
          return (
            <LevelCard
              key={id}
              id={id}
              title={level.title}
              total={level.challenges.length}
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
