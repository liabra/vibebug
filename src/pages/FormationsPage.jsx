import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formations, LEVELS, CATEGORIES } from '../data/formations'

function getProgress(id) {
  try { return JSON.parse(localStorage.getItem(`vibebug_formation_${id}_progress`)) ?? 0 } catch { return 0 }
}

function getQuizScore(id) {
  try { return JSON.parse(localStorage.getItem(`vibebug_formation_${id}_quiz_score`)) } catch { return null }
}

export default function FormationsPage() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState(null)
  const [activeLevel, setActiveLevel]       = useState(null)

  const filtered = formations.filter(f => {
    if (activeCategory && f.category !== activeCategory) return false
    if (activeLevel    && f.level    !== activeLevel)    return false
    return true
  })

  return (
    <div style={styles.page}>
      <div style={styles.pageHeader}>
        <h1 style={styles.heading}>Formations</h1>
        <p style={styles.subheading}>
          Approfondis tes connaissances en Product Management, économie, organisation et philosophie.
        </p>
      </div>

      <div style={styles.layout}>

        {/* ── Sidebar ── */}
        <aside style={styles.sidebar}>
          <p style={styles.sidebarLabel}>Catégorie</p>
          <button
            onClick={() => setActiveCategory(null)}
            style={{ ...styles.catBtn, ...(activeCategory === null ? styles.catBtnActive : {}) }}
          >
            Toutes
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
              style={{ ...styles.catBtn, ...(activeCategory === cat.id ? styles.catBtnActive : {}) }}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </aside>

        {/* ── Main ── */}
        <main style={styles.main}>
          {/* Level filters */}
          <div style={styles.levelFilters}>
            <button
              onClick={() => setActiveLevel(null)}
              style={{ ...styles.chip, ...(activeLevel === null ? styles.chipAllActive : {}) }}
            >
              Tous niveaux
            </button>
            {Object.entries(LEVELS).map(([key, lvl]) => (
              <button
                key={key}
                onClick={() => setActiveLevel(activeLevel === key ? null : key)}
                style={{
                  ...styles.chip,
                  ...(activeLevel === key
                    ? { background: lvl.bg, color: lvl.color, borderColor: lvl.border, fontWeight: '700' }
                    : {}),
                }}
              >
                {lvl.label}
              </button>
            ))}
          </div>

          <p style={styles.count}>{filtered.length} formation{filtered.length !== 1 ? 's' : ''}</p>

          {/* Grid */}
          <div style={styles.grid}>
            {filtered.map(f => {
              const lvl       = LEVELS[f.level]
              const cat       = CATEGORIES.find(c => c.id === f.category)
              const progress  = getProgress(f.id)
              const quizScore = getQuizScore(f.id)
              return (
                <div key={f.id} style={styles.card}>
                  <div style={styles.cardTop}>
                    <span style={{ ...styles.levelBadge, background: lvl.bg, color: lvl.color, borderColor: lvl.border }}>
                      {lvl.label}
                    </span>
                    <span style={styles.catLabel}>{cat?.icon} {cat?.label}</span>
                  </div>

                  <h2 style={styles.cardTitle}>{f.title}</h2>
                  <p style={styles.cardAuthor}>{f.author}</p>

                  <div style={styles.cardMeta}>
                    <span style={styles.metaItem}>⏱ {f.duration}</span>
                    <span style={styles.metaItem}>📚 {f.chapters.length} ch.</span>
                    {f.hasPdf && <span style={styles.pdfBadge}>📄 PDF</span>}
                    {quizScore !== null && (
                      <span style={{ ...styles.scoreBadge, color: lvl.color }}>✓ {quizScore}/20</span>
                    )}
                  </div>

                  {progress > 0 && (
                    <div style={styles.progressWrap}>
                      <div style={styles.progressTrack}>
                        <div style={{ ...styles.progressFill, width: `${progress}%`, background: lvl.color }} />
                      </div>
                      <span style={{ ...styles.progressPct, color: lvl.color }}>{progress}%</span>
                    </div>
                  )}

                  <button
                    onClick={() => navigate(`/formations/${f.id}`)}
                    style={{ ...styles.cardBtn, background: lvl.color }}
                  >
                    Voir la formation →
                  </button>
                </div>
              )
            })}
          </div>

          {filtered.length === 0 && (
            <p style={styles.empty}>Aucune formation pour cette sélection.</p>
          )}
        </main>
      </div>
    </div>
  )
}

const styles = {
  page: {
    maxWidth: '960px',
    margin: '0 auto',
    padding: '2rem 1rem 4rem',
    fontFamily: 'system-ui, sans-serif',
    color: '#111827',
  },
  pageHeader: {
    marginBottom: '2rem',
  },
  heading: {
    fontSize: '1.75rem',
    fontWeight: '800',
    color: '#111827',
    marginBottom: '0.35rem',
  },
  subheading: {
    fontSize: '0.9rem',
    color: '#6b7280',
    lineHeight: 1.6,
    margin: 0,
  },
  layout: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'flex-start',
  },

  /* Sidebar */
  sidebar: {
    width: '196px',
    flexShrink: 0,
    position: 'sticky',
    top: '68px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
  },
  sidebarLabel: {
    fontSize: '0.68rem',
    fontWeight: '700',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    margin: '0 0 0.35rem',
  },
  catBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.45rem',
    width: '100%',
    padding: '0.55rem 0.75rem',
    background: 'none',
    border: '1px solid transparent',
    borderRadius: '8px',
    fontSize: '0.85rem',
    color: '#374151',
    cursor: 'pointer',
    textAlign: 'left',
    fontFamily: 'system-ui, sans-serif',
    fontWeight: '500',
  },
  catBtnActive: {
    background: '#eff6ff',
    color: '#2563eb',
    fontWeight: '700',
    border: '1px solid #bfdbfe',
  },

  /* Main */
  main: {
    flex: 1,
    minWidth: 0,
  },
  levelFilters: {
    display: 'flex',
    gap: '0.45rem',
    flexWrap: 'wrap',
    marginBottom: '1.1rem',
  },
  chip: {
    padding: '0.3rem 0.8rem',
    background: '#f3f4f6',
    border: '1px solid #e5e7eb',
    borderRadius: '999px',
    fontSize: '0.78rem',
    color: '#374151',
    cursor: 'pointer',
    fontFamily: 'system-ui, sans-serif',
    fontWeight: '500',
  },
  chipAllActive: {
    background: '#eff6ff',
    color: '#2563eb',
    borderColor: '#bfdbfe',
    fontWeight: '700',
  },
  count: {
    fontSize: '0.78rem',
    color: '#9ca3af',
    margin: '0 0 1rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(256px, 1fr))',
    gap: '1rem',
  },

  /* Card */
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    padding: '1.25rem',
    background: '#fff',
    border: '1.5px solid #e5e7eb',
    borderRadius: '14px',
  },
  cardTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  levelBadge: {
    fontSize: '0.68rem',
    fontWeight: '700',
    padding: '0.18rem 0.55rem',
    borderRadius: '999px',
    border: '1px solid',
  },
  catLabel: {
    fontSize: '0.72rem',
    color: '#9ca3af',
    fontWeight: '500',
  },
  cardTitle: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
    lineHeight: 1.35,
  },
  cardAuthor: {
    fontSize: '0.78rem',
    color: '#6b7280',
    margin: 0,
  },
  cardMeta: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  metaItem: {
    fontSize: '0.74rem',
    color: '#9ca3af',
  },
  pdfBadge: {
    fontSize: '0.72rem',
    color: '#7c3aed',
    fontWeight: '600',
  },
  scoreBadge: {
    fontSize: '0.72rem',
    fontWeight: '700',
  },
  progressWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  progressTrack: {
    flex: 1,
    height: '4px',
    background: '#e5e7eb',
    borderRadius: '999px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '999px',
  },
  progressPct: {
    fontSize: '0.7rem',
    fontWeight: '700',
  },
  cardBtn: {
    marginTop: '0.375rem',
    padding: '0.6rem 0',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'center',
    fontFamily: 'system-ui, sans-serif',
  },
  empty: {
    fontSize: '0.9rem',
    color: '#9ca3af',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: '3rem 0',
  },
}
