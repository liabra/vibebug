const STATUS = {
  locked:    { label: 'Verrouillé', color: '#9ca3af', bg: '#f3f4f6', border: '#d1d5db' },
  new:       { label: 'Nouveau',    color: '#6b7280', bg: '#f9fafb', border: '#e5e7eb' },
  inProgress:{ label: 'En cours',  color: '#d97706', bg: '#fffbeb', border: '#fcd34d' },
  done:      { label: 'Terminé',   color: '#16a34a', bg: '#f0fdf4', border: '#86efac' },
}

export default function LevelCard({ id, title, poolSize, sessionSize, saved, locked, onStart }) {
  const status = locked ? 'locked' : !saved ? 'new' : saved.completed ? 'done' : 'inProgress'
  const theme = STATUS[status]
  const hasVariety = poolSize > sessionSize

  const btnLabel = locked ? '🔒 Verrouillé' : status === 'new' ? 'Commencer' : status === 'done' ? 'Rejouer' : 'Continuer'

  return (
    <div style={{ ...styles.card, background: theme.bg, borderColor: theme.border, opacity: locked ? 0.6 : 1 }}>
      <div style={styles.left}>
        <div style={styles.top}>
          <span style={{ ...styles.title, color: locked ? '#9ca3af' : '#111827' }}>{title}</span>
          <span style={{ ...styles.badge, color: theme.color, background: theme.bg, borderColor: theme.color }}>
            {theme.label}
          </span>
        </div>
        <div style={styles.meta}>
          {hasVariety ? (
            <>
              <span style={styles.metaItem}>{sessionSize} missions sur {poolSize}</span>
              <span style={styles.replayChip}>🎲 varie à chaque partie</span>
            </>
          ) : (
            <span style={styles.metaItem}>{sessionSize} missions</span>
          )}
          {!locked && saved?.xp > 0 && (
            <span style={styles.xp}>⚡ {saved.xp} XP</span>
          )}
          {status === 'inProgress' && saved?.currentIndex != null && (
            <span style={styles.metaItem}>
              Mission {saved.currentIndex + 1} / {sessionSize}
            </span>
          )}
          {status === 'done' && saved?.score != null && (
            <span style={styles.metaItem}>
              Score : {saved.score} / {saved.total ?? sessionSize}
            </span>
          )}
        </div>
      </div>
      <button
        onClick={() => onStart(id)}
        disabled={locked}
        style={{ ...styles.btn, ...(locked ? styles.btnLocked : {}) }}
      >
        {btnLabel}
      </button>
    </div>
  )
}

const styles = {
  card: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.25rem 1.5rem',
    border: '1.5px solid',
    borderRadius: '14px',
    gap: '1rem',
  },
  left: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.375rem',
    textAlign: 'left',
  },
  top: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
    flexWrap: 'wrap',
  },
  title: {
    fontWeight: '700',
    fontSize: '1rem',
    color: '#111827',
  },
  badge: {
    fontSize: '0.75rem',
    fontWeight: '600',
    padding: '0.2rem 0.6rem',
    borderRadius: '999px',
    border: '1px solid',
  },
  meta: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  metaItem: {
    fontSize: '0.8rem',
    color: '#6b7280',
  },
  replayChip: {
    fontSize: '0.75rem',
    color: '#7c3aed',
    fontWeight: '600',
  },
  xp: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#2563eb',
  },
  btn: {
    flexShrink: 0,
    padding: '0.6rem 1.25rem',
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  btnLocked: {
    background: '#d1d5db',
    color: '#6b7280',
    cursor: 'not-allowed',
  },
}
