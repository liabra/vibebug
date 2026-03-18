import { useLocation, useNavigate } from 'react-router-dom'

export default function ResultsPage() {
  const { state } = useLocation()
  const navigate = useNavigate()

  const score = state?.score ?? 0
  const xp = state?.xp ?? 0
  const total = state?.total ?? 0
  const levelTitle = state?.levelTitle ?? ''
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0

  function getBadge() {
    if (percentage === 100) return { label: 'Expert Bash', icon: '🏆', bg: '#fefce8', border: '#ca8a04', color: '#854d0e' }
    if (percentage >= 60)  return { label: 'Bon niveau',  icon: '👍', bg: '#f0fdf4', border: '#16a34a', color: '#166534' }
    return                        { label: 'À améliorer', icon: '💪', bg: '#fef2f2', border: '#dc2626', color: '#991b1b' }
  }

  const badge = getBadge()

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Résultats</h1>
      {levelTitle && <p style={styles.level}>{levelTitle}</p>}

      <div style={styles.scoreBox}>
        <span style={styles.scoreNumber}>{score}</span>
        <span style={styles.scoreTotal}>/ {total}</span>
      </div>

      <p style={styles.percentage}>{percentage} %</p>
      <p style={styles.xp}>⚡ {xp} XP gagnés</p>

      <div style={{ ...styles.badge, background: badge.bg, borderColor: badge.border, color: badge.color }}>
        <span style={styles.badgeIcon}>{badge.icon}</span>
        <span style={styles.badgeLabel}>{badge.label}</span>
      </div>

      <div style={styles.actions}>
        <button onClick={() => navigate('/levels')} style={styles.btnSecondary}>
          Choisir un autre niveau
        </button>
        <button onClick={() => navigate('/')} style={styles.btnPrimary}>
          Accueil
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '480px',
    margin: '4rem auto',
    padding: '2rem 1rem',
    textAlign: 'center',
    fontFamily: 'system-ui, sans-serif',
  },
  heading: {
    fontSize: '1.75rem',
    fontWeight: '700',
    marginBottom: '0.25rem',
    color: '#111827',
  },
  level: {
    color: '#6b7280',
    marginBottom: '2rem',
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  scoreBox: {
    display: 'inline-flex',
    alignItems: 'baseline',
    gap: '0.25rem',
    marginBottom: '0.5rem',
  },
  scoreNumber: {
    fontSize: '4rem',
    fontWeight: '800',
    color: '#2563eb',
    lineHeight: 1,
  },
  scoreTotal: {
    fontSize: '2rem',
    color: '#9ca3af',
    fontWeight: '600',
  },
  percentage: {
    fontSize: '1.25rem',
    color: '#6b7280',
    marginBottom: '0.75rem',
  },
  xp: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#2563eb',
    marginBottom: '0.5rem',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.625rem 1.25rem',
    border: '2px solid',
    borderRadius: '999px',
    marginBottom: '2.5rem',
    fontWeight: '700',
  },
  badgeIcon: {
    fontSize: '1.4rem',
    lineHeight: 1,
  },
  badgeLabel: {
    fontSize: '1rem',
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  btnPrimary: {
    padding: '0.75rem 1.5rem',
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: '600',
  },
  btnSecondary: {
    padding: '0.75rem 1.5rem',
    background: '#fff',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: '500',
  },
}
