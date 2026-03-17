import { useNavigate } from 'react-router-dom'
import { bashChallenges } from '../data/bashChallenges'

export default function LevelsPage() {
  const navigate = useNavigate()

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Choisissez un niveau</h1>
      <div style={styles.grid}>
        {Object.entries(bashChallenges).map(([id, level]) => (
          <button
            key={id}
            onClick={() => navigate(`/challenge/${id}`)}
            style={styles.card}
          >
            <span style={styles.cardTitle}>{level.title}</span>
            <span style={styles.cardCount}>{level.challenges.length} questions</span>
          </button>
        ))}
      </div>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '3rem auto',
    padding: '1rem',
    fontFamily: 'system-ui, sans-serif',
    textAlign: 'center',
  },
  heading: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '2rem',
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  card: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.25rem 1.5rem',
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  },
  cardTitle: {
    fontWeight: '600',
    color: '#111827',
  },
  cardCount: {
    fontSize: '0.875rem',
    color: '#6b7280',
  },
}
