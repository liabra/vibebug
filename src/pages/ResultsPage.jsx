import { useLocation, useNavigate } from 'react-router-dom'

function getModeContent(mode, score, total, xp, levelTitle, percentage, navigate) {
  if (mode === 'ai') {
    const badge =
      percentage === 100 ? { label: 'Esprit critique', icon: '🧠', bg: '#fff1f2', border: '#be123c', color: '#9f1239' }
      : percentage >= 60  ? { label: 'Bon instinct',    icon: '🔍', bg: '#fef2f2', border: '#dc2626', color: '#991b1b' }
      :                      { label: 'Continue',        icon: '💪', bg: '#fef2f2', border: '#dc2626', color: '#991b1b' }
    return {
      heading: 'Vigilance activée.',
      subtitle: `${score} piège${score > 1 ? 's' : ''} repéré${score > 1 ? 's' : ''} sur ${total}`,
      flavor: "L'IA est convaincante — mais pas pour toi.",
      badge,
      actions: (
        <>
          <button onClick={() => navigate('/challenge/ai')} style={styles.btnPrimary}>↺ Rejouer</button>
          <button onClick={() => navigate('/')} style={styles.btnSecondary}>Accueil</button>
        </>
      ),
    }
  }

  if (mode === 'speed') {
    const badge =
      score === total    ? { label: 'Réflexes de pro', icon: '⚡', bg: '#fefce8', border: '#ca8a04', color: '#854d0e' }
      : score >= total * 0.8 ? { label: 'Bon instinct',   icon: '👍', bg: '#f0fdf4', border: '#16a34a', color: '#166534' }
      :                        { label: 'Continue',        icon: '💪', bg: '#fef2f2', border: '#dc2626', color: '#991b1b' }
    return {
      heading: 'Session terminée.',
      subtitle: `⚡ Speed Debug · ${xp} XP gagnés`,
      flavor: 'Réflexe + précision = bon développeur.',
      badge,
      actions: (
        <>
          <button onClick={() => navigate('/speed')} style={styles.btnPrimary}>↺ Rejouer</button>
          <button onClick={() => navigate('/levels')} style={styles.btnSecondary}>Niveaux</button>
        </>
      ),
    }
  }

  // standard
  const badge =
    percentage === 100 ? { label: 'Expert Bash', icon: '🏆', bg: '#fefce8', border: '#ca8a04', color: '#854d0e' }
    : percentage >= 60  ? { label: 'Bon niveau',  icon: '👍', bg: '#f0fdf4', border: '#16a34a', color: '#166534' }
    :                      { label: 'À améliorer', icon: '💪', bg: '#fef2f2', border: '#dc2626', color: '#991b1b' }
  return {
    heading: 'Mission accomplie !',
    subtitle: levelTitle,
    flavor: null,
    badge,
    actions: (
      <>
        <button onClick={() => navigate('/levels')} style={styles.btnSecondary}>Choisir un autre niveau</button>
        <button onClick={() => navigate('/')} style={styles.btnPrimary}>Accueil</button>
      </>
    ),
  }
}

export default function ResultsPage() {
  const { state } = useLocation()
  const navigate = useNavigate()

  const score = state?.score ?? 0
  const xp = state?.xp ?? 0
  const total = state?.total ?? 0
  const levelTitle = state?.levelTitle ?? ''
  const mode = state?.mode ?? 'standard'
  const bonusXp = state?.bonusXp ?? 0
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0

  const content = getModeContent(mode, score, total, xp, levelTitle, percentage, navigate)
  const { badge } = content

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>{content.heading}</h1>
      {content.subtitle && <p style={styles.level}>{content.subtitle}</p>}

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

      {content.flavor && <p style={styles.flavor}>{content.flavor}</p>}

      {mode === 'speed' && bonusXp > 0 && (
        <p style={styles.bonusLine}>
          {bonusXp === 30 ? '🏆 Session parfaite' : '👍 Bonne session'} · +{bonusXp} XP bonus
        </p>
      )}

      <div style={styles.actions}>
        {content.actions}
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
  flavor: {
    fontSize: '0.9rem',
    color: '#6b7280',
    fontStyle: 'italic',
    marginBottom: '1.5rem',
    marginTop: '-1rem',
  },
  bonusLine: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#d97706',
    marginBottom: '1.5rem',
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
