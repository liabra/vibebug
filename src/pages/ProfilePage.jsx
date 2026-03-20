import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { bashChallenges } from '../data/bashChallenges'
import { getSaved, getLevelStatus, getBadge, getTotalXp, getCompletedCount, getUsername, setUsername } from '../utils/progressUtils'

// --- component ---------------------------------------------------------------

export default function ProfilePage() {
  const navigate = useNavigate()
  const levelEntries = Object.entries(bashChallenges)
  const [username, setUsernameState] = useState(getUsername)
  const [inputValue, setInputValue] = useState(getUsername)
  const total = levelEntries.length

  const levels = levelEntries.map(([id, level], index) => {
    const saved = getSaved(id)
    const status = getLevelStatus(id, index, levelEntries)
    const badge = getBadge(saved)
    const pct = saved?.completed && saved.total
      ? Math.round((saved.score / saved.total) * 100)
      : null
    return { id, title: level.title, total: level.challenges.length, saved, status, badge, pct }
  })

  const totalXp        = getTotalXp(levelEntries)
  const completedCount = getCompletedCount(levelEntries)
  const globalPct      = Math.round((completedCount / total) * 100)
  const badges         = levels.map(l => l.badge).filter(Boolean)

  return (
    <div style={styles.page}>

      {/* Nav */}
      <div style={styles.nav}>
        <button onClick={() => navigate('/')} style={styles.btnNav}>🏠 Accueil</button>
        <button onClick={() => navigate('/levels')} style={styles.btnNav}>← Niveaux</button>
      </div>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.avatar}>🧑‍💻</div>
        <div>
          <h1 style={styles.heading}>{username || 'Mon Profil'}</h1>
          <p style={styles.subheading}>Progression Vibebug</p>
        </div>
      </div>

      {/* Username editor */}
      <div style={styles.usernameBox}>
        <label style={styles.usernameLabel} htmlFor="username-input">Ton pseudo</label>
        <div style={styles.usernameRow}>
          <input
            id="username-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setUsername(inputValue)
                setUsernameState(inputValue.trim())
              }
            }}
            placeholder="Choisis un pseudo…"
            maxLength={24}
            style={styles.usernameInput}
          />
          <button
            onClick={() => {
              setUsername(inputValue)
              setUsernameState(inputValue.trim())
            }}
            style={styles.usernameSave}
          >
            Enregistrer
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsRow}>
        <div style={styles.statBox}>
          <span style={styles.statValue}>⚡ {totalXp}</span>
          <span style={styles.statLabel}>XP total</span>
        </div>
        <div style={styles.statBox}>
          <span style={styles.statValue}>{completedCount} / {total}</span>
          <span style={styles.statLabel}>Niveaux terminés</span>
        </div>
        <div style={styles.statBox}>
          <span style={styles.statValue}>{badges.length}</span>
          <span style={styles.statLabel}>Badges obtenus</span>
        </div>
      </div>

      {/* Global progress */}
      <div style={styles.section}>
        <div style={styles.progressHeader}>
          <span style={styles.progressLabel}>Progression globale</span>
          <span style={styles.progressPct}>{globalPct} %</span>
        </div>
        <div style={styles.bar}>
          <div style={{ ...styles.barFill, width: `${globalPct}%` }} />
        </div>
      </div>

      {/* Levels */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Niveaux</h2>
        <div style={styles.levelList}>
          {levels.map((l) => {
            const meta = STATUS_META[l.status]
            return (
              <div key={l.id} style={{ ...styles.levelCard, borderColor: meta.border, background: meta.bg, opacity: l.status === 'locked' ? 0.55 : 1 }}>
                <div style={styles.levelLeft}>
                  <div style={styles.levelTop}>
                    <span style={styles.levelTitle}>{l.title}</span>
                    <span style={{ ...styles.badge, color: meta.color, borderColor: meta.color }}>
                      {meta.label}
                    </span>
                  </div>
                  <div style={styles.levelMeta}>
                    <span style={styles.metaItem}>{l.total} questions</span>
                    {l.saved?.xp > 0 && <span style={styles.metaXp}>⚡ {l.saved.xp} XP</span>}
                    {l.status === 'done' && l.pct != null && (
                      <span style={styles.metaItem}>Score : {l.pct} %</span>
                    )}
                    {l.status === 'inProgress' && l.saved?.currentIndex != null && (
                      <span style={styles.metaItem}>Question {l.saved.currentIndex + 1} / {l.total}</span>
                    )}
                  </div>
                </div>
                {l.status !== 'locked' && (
                  <button
                    onClick={() => navigate(`/challenge/${l.id}`)}
                    style={styles.levelBtn}
                  >
                    {l.status === 'done' ? 'Rejouer' : l.status === 'new' ? 'Commencer' : 'Continuer'}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Badges */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Badges</h2>
        {badges.length === 0 ? (
          <p style={styles.empty}>Aucun badge pour l'instant. Termine un niveau pour en obtenir un !</p>
        ) : (
          <div style={styles.badgesRow}>
            {badges.map((b, i) => (
              <div key={i} style={{ ...styles.badgeCard, background: b.bg, borderColor: b.border, color: b.color }}>
                <span style={styles.badgeIcon}>{b.icon}</span>
                <span style={styles.badgeLabel}>{b.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

// --- styles ------------------------------------------------------------------

const styles = {
  page: {
    maxWidth: '640px',
    margin: '0 auto',
    padding: '1.5rem 1rem 4rem',
    fontFamily: 'system-ui, sans-serif',
    color: '#111827',
  },
  nav: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1.5rem',
  },
  btnNav: {
    background: 'none',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '0.4rem 0.875rem',
    fontSize: '0.875rem',
    color: '#374151',
    cursor: 'pointer',
    fontWeight: '500',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.75rem',
  },
  avatar: {
    fontSize: '3rem',
    lineHeight: 1,
  },
  heading: {
    fontSize: '1.75rem',
    fontWeight: '800',
    margin: 0,
    color: '#111827',
  },
  subheading: {
    fontSize: '0.875rem',
    color: '#6b7280',
    margin: '0.2rem 0 0',
  },
  usernameBox: {
    marginBottom: '1.75rem',
    padding: '1rem 1.25rem',
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
  },
  usernameLabel: {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.5rem',
  },
  usernameRow: {
    display: 'flex',
    gap: '0.5rem',
  },
  usernameInput: {
    flex: 1,
    padding: '0.5rem 0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontFamily: 'system-ui, sans-serif',
    color: '#111827',
    outline: 'none',
  },
  usernameSave: {
    flexShrink: 0,
    padding: '0.5rem 1rem',
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '0.75rem',
    marginBottom: '2rem',
  },
  statBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1rem 0.5rem',
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    gap: '0.25rem',
  },
  statValue: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: '#111827',
  },
  statLabel: {
    fontSize: '0.72rem',
    color: '#6b7280',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    fontWeight: '600',
  },
  section: {
    marginBottom: '2.25rem',
  },
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    marginBottom: '1rem',
    color: '#111827',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
  },
  progressLabel: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#374151',
  },
  progressPct: {
    fontSize: '0.875rem',
    fontWeight: '700',
    color: '#2563eb',
  },
  bar: {
    height: '10px',
    background: '#e5e7eb',
    borderRadius: '999px',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    background: '#2563eb',
    borderRadius: '999px',
    transition: 'width 0.4s ease',
  },
  levelList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  levelCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    padding: '1rem 1.25rem',
    border: '1.5px solid',
    borderRadius: '12px',
  },
  levelLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
  },
  levelTop: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  levelTitle: {
    fontWeight: '700',
    fontSize: '0.95rem',
    color: '#111827',
  },
  badge: {
    fontSize: '0.7rem',
    fontWeight: '600',
    padding: '0.15rem 0.55rem',
    borderRadius: '999px',
    border: '1px solid',
    background: 'transparent',
  },
  levelMeta: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  metaItem: {
    fontSize: '0.78rem',
    color: '#6b7280',
  },
  metaXp: {
    fontSize: '0.78rem',
    fontWeight: '700',
    color: '#2563eb',
  },
  levelBtn: {
    flexShrink: 0,
    padding: '0.5rem 1rem',
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  badgesRow: {
    display: 'flex',
    gap: '0.875rem',
    flexWrap: 'wrap',
  },
  badgeCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.45rem',
    padding: '0.625rem 1.1rem',
    border: '2px solid',
    borderRadius: '999px',
    fontWeight: '700',
  },
  badgeIcon: {
    fontSize: '1.25rem',
    lineHeight: 1,
  },
  badgeLabel: {
    fontSize: '0.875rem',
  },
  empty: {
    fontSize: '0.875rem',
    color: '#9ca3af',
    fontStyle: 'italic',
  },
}
