import { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { formations, LEVELS, CATEGORIES, CHAPTER_TYPES } from '../data/formations'
import { useWindowSize } from '../utils/useWindowSize'

function loadCompletedChapters(id) {
  try { return JSON.parse(localStorage.getItem(`vibebug_formation_${id}_chapters`)) ?? [] } catch { return [] }
}

function saveCompletedChapters(id, completedIds, totalChapters) {
  localStorage.setItem(`vibebug_formation_${id}_chapters`, JSON.stringify(completedIds))
  const pct = Math.round((completedIds.length / totalChapters) * 100)
  localStorage.setItem(`vibebug_formation_${id}_progress`, JSON.stringify(pct))
}

export default function FormationDetailPage() {
  const { id }      = useParams()
  const navigate    = useNavigate()
  const chaptersRef = useRef(null)
  const width       = useWindowSize()
  const isMobile    = width < 768

  const formation = formations.find(f => f.id === id)

  const [completedChapters, setCompletedChapters] = useState(() => loadCompletedChapters(id))

  if (!formation) {
    return (
      <div style={styles.container}>
        <p style={{ color: '#6b7280' }}>Formation introuvable.</p>
        <button onClick={() => navigate('/formations')} style={styles.btnNav}>← Formations</button>
      </div>
    )
  }

  const lvl      = LEVELS[formation.level]
  const cat      = CATEGORIES.find(c => c.id === formation.category)
  const progress = Math.round((completedChapters.length / formation.chapters.length) * 100)
  const quizScore = (() => {
    try { return JSON.parse(localStorage.getItem(`vibebug_formation_${id}_quiz_score`)) } catch { return null }
  })()

  function toggleChapter(chapterId) {
    const updated = completedChapters.includes(chapterId)
      ? completedChapters.filter(c => c !== chapterId)
      : [...completedChapters, chapterId]
    setCompletedChapters(updated)
    saveCompletedChapters(id, updated, formation.chapters.length)
  }

  function handleCommencer() {
    chaptersRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const commencerLabel = progress === 0 ? 'Commencer' : progress === 100 ? '↺ Relire' : 'Continuer →'

  return (
    <div style={styles.container}>

      {/* Nav */}
      <div style={styles.nav}>
        <button onClick={() => navigate('/formations')} style={styles.btnNav}>← Formations</button>
      </div>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerMeta}>
          <span style={{ ...styles.levelBadge, background: lvl.bg, color: lvl.color, borderColor: lvl.border }}>
            {lvl.label}
          </span>
          <span style={styles.catTag}>{cat?.icon} {cat?.label}</span>
        </div>

        <h1 style={styles.title}>{formation.title}</h1>
        <p style={styles.author}>par {formation.author}</p>

        <div style={styles.metaRow}>
          <span style={styles.metaItem}>⏱ {formation.duration}</span>
          <span style={styles.metaItem}>📚 {formation.chapters.length} chapitres</span>
          {formation.hasPdf && <span style={styles.pdfBadge}>📄 PDF inclus</span>}
          {quizScore !== null && (
            <span style={{ ...styles.quizBadge, color: lvl.color, borderColor: lvl.border, background: lvl.bg }}>
              Quiz : {quizScore}/20
            </span>
          )}
        </div>

        <p style={styles.desc}>{formation.desc}</p>

        {/* Progress bar */}
        {progress > 0 && (
          <div style={styles.progressWrap}>
            <div style={styles.progressTrack}>
              <div style={{ ...styles.progressFill, width: `${progress}%`, background: lvl.color }} />
            </div>
            <span style={{ ...styles.progressPct, color: lvl.color }}>{progress}% lu</span>
          </div>
        )}

        {/* Action buttons */}
        <div style={{ ...styles.actions, flexDirection: isMobile ? 'column' : 'row' }}>
          <button
            onClick={handleCommencer}
            style={{ ...styles.btnPrimary, background: lvl.color, ...(isMobile ? styles.btnFull : {}) }}
          >
            {commencerLabel}
          </button>
          <button
            onClick={() => navigate(`/formations/${id}/quiz`)}
            style={{ ...styles.btnQuiz, ...(isMobile ? styles.btnFull : {}) }}
          >
            ✏️ Quiz noté /20
          </button>
          <button
            onClick={() => navigate('/levels')}
            style={{ ...styles.btnGame, ...(isMobile ? styles.btnFull : {}) }}
          >
            🎮 Mode jeu
          </button>
        </div>
      </div>

      {/* Chapters */}
      <div ref={chaptersRef} style={styles.chaptersSection}>
        <h2 style={styles.sectionTitle}>Chapitres</h2>
        <div style={styles.chapterList}>
          {formation.chapters.map((chapter, i) => {
            const isDone    = completedChapters.includes(chapter.id)
            const typeInfo  = CHAPTER_TYPES[chapter.type]
            return (
              <div
                key={chapter.id}
                style={{ ...styles.chapterRow, ...(isDone ? styles.chapterRowDone : {}) }}
              >
                <div style={styles.chapterLeft}>
                  <span style={styles.chapterNum}>{i + 1}</span>
                  <span style={styles.chapterTypeIcon} title={typeInfo?.label}>{typeInfo?.icon}</span>
                  <div>
                    <div style={styles.chapterTitle}>{chapter.title}</div>
                    <div style={styles.chapterMeta}>{typeInfo?.label} · {chapter.duration}</div>
                  </div>
                </div>
                <button
                  onClick={() => toggleChapter(chapter.id)}
                  style={isDone ? styles.chapterBtnDone : styles.chapterBtnPending}
                >
                  {isDone ? '✓ Lu' : 'Marquer lu'}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom actions */}
      <div style={{ ...styles.bottomActions, flexDirection: isMobile ? 'column' : 'row' }}>
        <button
          onClick={() => navigate(`/formations/${id}/quiz`)}
          style={{ ...styles.btnPrimary, background: lvl.color, ...(isMobile ? styles.btnFull : {}) }}
        >
          Passer le quiz noté /20 →
        </button>
        <button onClick={() => navigate('/formations')} style={styles.btnNav}>
          ← Retour aux formations
        </button>
      </div>

    </div>
  )
}

const styles = {
  container: {
    maxWidth: '680px',
    margin: '0 auto',
    padding: '2rem 1rem 4rem',
    fontFamily: 'system-ui, sans-serif',
    color: '#111827',
  },
  nav: {
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
    fontFamily: 'system-ui, sans-serif',
  },

  /* Header */
  header: {
    marginBottom: '2.5rem',
  },
  headerMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
    marginBottom: '0.875rem',
    flexWrap: 'wrap',
  },
  levelBadge: {
    fontSize: '0.72rem',
    fontWeight: '700',
    padding: '0.2rem 0.65rem',
    borderRadius: '999px',
    border: '1px solid',
  },
  catTag: {
    fontSize: '0.78rem',
    color: '#6b7280',
    fontWeight: '500',
  },
  title: {
    fontSize: '1.6rem',
    fontWeight: '800',
    color: '#111827',
    lineHeight: 1.25,
    marginBottom: '0.35rem',
  },
  author: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginBottom: '0.875rem',
  },
  metaRow: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  metaItem: {
    fontSize: '0.82rem',
    color: '#9ca3af',
  },
  pdfBadge: {
    fontSize: '0.78rem',
    color: '#7c3aed',
    fontWeight: '600',
  },
  quizBadge: {
    fontSize: '0.75rem',
    fontWeight: '700',
    padding: '0.18rem 0.6rem',
    borderRadius: '999px',
    border: '1px solid',
  },
  desc: {
    fontSize: '0.9rem',
    color: '#374151',
    lineHeight: 1.7,
    marginBottom: '1.25rem',
  },
  progressWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
    marginBottom: '1.25rem',
  },
  progressTrack: {
    flex: 1,
    height: '6px',
    background: '#e5e7eb',
    borderRadius: '999px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '999px',
    transition: 'width 0.3s ease',
  },
  progressPct: {
    fontSize: '0.78rem',
    fontWeight: '700',
  },
  actions: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
  },
  btnPrimary: {
    padding: '0.7rem 1.5rem',
    color: '#fff',
    border: 'none',
    borderRadius: '9px',
    fontSize: '0.95rem',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: 'system-ui, sans-serif',
  },
  btnQuiz: {
    padding: '0.7rem 1.25rem',
    background: '#fff',
    color: '#374151',
    border: '1.5px solid #d1d5db',
    borderRadius: '9px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'system-ui, sans-serif',
  },
  btnGame: {
    padding: '0.7rem 1.25rem',
    background: '#f3f4f6',
    color: '#374151',
    border: '1px solid #e5e7eb',
    borderRadius: '9px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'system-ui, sans-serif',
  },

  /* Chapters */
  chaptersSection: {
    marginBottom: '2.5rem',
  },
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '0.875rem',
  },
  chapterList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  chapterRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    padding: '0.875rem 1rem',
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
  },
  chapterRowDone: {
    background: '#f0fdf4',
    borderColor: '#86efac',
  },
  chapterLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    flex: 1,
    minWidth: 0,
  },
  chapterNum: {
    flexShrink: 0,
    width: '1.5rem',
    height: '1.5rem',
    background: '#e5e7eb',
    color: '#6b7280',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.72rem',
    fontWeight: '700',
  },
  chapterTypeIcon: {
    fontSize: '1.1rem',
    flexShrink: 0,
  },
  chapterTitle: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#111827',
  },
  chapterMeta: {
    fontSize: '0.75rem',
    color: '#9ca3af',
    marginTop: '0.1rem',
  },
  chapterBtnPending: {
    flexShrink: 0,
    padding: '0.35rem 0.875rem',
    background: '#fff',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '0.78rem',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'system-ui, sans-serif',
    whiteSpace: 'nowrap',
  },
  chapterBtnDone: {
    flexShrink: 0,
    padding: '0.35rem 0.875rem',
    background: '#f0fdf4',
    color: '#16a34a',
    border: '1px solid #86efac',
    borderRadius: '6px',
    fontSize: '0.78rem',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: 'system-ui, sans-serif',
    whiteSpace: 'nowrap',
  },

  /* Bottom */
  bottomActions: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingTop: '1rem',
    borderTop: '1px solid #e5e7eb',
  },
  btnFull: {
    width: '100%',
    textAlign: 'center',
    justifyContent: 'center',
  },
}
