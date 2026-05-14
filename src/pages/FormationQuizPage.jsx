import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { formations, LEVELS } from '../data/formations'
import { useWindowSize } from '../utils/useWindowSize'

const POINTS_PER_QUESTION = 2 // 10 questions × 2 = /20

function getMention(score) {
  if (score >= 18) return { label: 'Excellent',      color: '#0f766e', bg: '#f0fdfa', border: '#99f6e4' }
  if (score >= 14) return { label: 'Bien',           color: '#16a34a', bg: '#f0fdf4', border: '#86efac' }
  if (score >= 10) return { label: 'Assez bien',     color: '#d97706', bg: '#fffbeb', border: '#fcd34d' }
  return               { label: 'À retravailler',   color: '#dc2626', bg: '#fef2f2', border: '#fca5a5' }
}

export default function FormationQuizPage() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const width    = useWindowSize()
  const isMobile = width < 768

  const formation = formations.find(f => f.id === id)

  const [currentIndex,    setCurrentIndex]    = useState(0)
  const [selectedAnswer,  setSelectedAnswer]  = useState(null)
  const [score,           setScore]           = useState(0)
  const [xpFlash,         setXpFlash]         = useState(false)
  const [finished,        setFinished]        = useState(false)

  if (!formation) {
    return (
      <div style={styles.container}>
        <p style={{ color: '#6b7280' }}>Formation introuvable.</p>
        <button onClick={() => navigate('/formations')} style={styles.btnNav}>← Formations</button>
      </div>
    )
  }

  const lvl        = LEVELS[formation.level]
  const questions  = formation.quiz
  const question   = questions[currentIndex]
  const isAnswered = selectedAnswer !== null
  const isCorrect  = selectedAnswer === question?.correctAnswer
  const isLast     = currentIndex === questions.length - 1
  const totalScore = score * POINTS_PER_QUESTION // /20

  function handleSelect(index) {
    if (isAnswered) return
    const correct = index === question.correctAnswer
    setSelectedAnswer(index)
    if (correct) {
      setScore(s => s + 1)
      setXpFlash(true)
      setTimeout(() => setXpFlash(false), 400)
    }
  }

  function handleNext() {
    if (isLast) {
      const finalScore = (score + (isCorrect ? 1 : 0)) * POINTS_PER_QUESTION
      localStorage.setItem(`vibebug_formation_${id}_quiz_score`, JSON.stringify(finalScore))
      setFinished(true)
      return
    }
    setCurrentIndex(i => i + 1)
    setSelectedAnswer(null)
  }

  function getOptionStyle(index) {
    if (!isAnswered) return styles.option
    if (index === question.correctAnswer) return { ...styles.option, ...styles.optionCorrect }
    if (index === selectedAnswer)         return { ...styles.option, ...styles.optionIncorrect }
    return { ...styles.option, ...styles.optionDisabled }
  }

  // ── Écran de fin ───────────────────────────────────────────────────────────
  if (finished) {
    const finalScore = totalScore + (isCorrect ? 0 : 0) // already counted in handleNext
    const saved = (() => {
      try { return JSON.parse(localStorage.getItem(`vibebug_formation_${id}_quiz_score`)) } catch { return null }
    })()
    const displayScore = saved ?? finalScore
    const mention = getMention(displayScore)

    return (
      <div style={styles.container}>
        <div style={styles.resultBox}>
          <div style={styles.resultIcon}>✏️</div>
          <h2 style={styles.resultTitle}>Quiz terminé</h2>
          <p style={styles.resultFormation}>{formation.title}</p>

          <div style={styles.scoreWrap}>
            <span style={{ ...styles.scoreNum, color: lvl.color }}>{displayScore}</span>
            <span style={styles.scoreMax}>/20</span>
          </div>

          <div style={{
            ...styles.mentionBadge,
            background: mention.bg,
            borderColor: mention.border,
            color: mention.color,
          }}>
            {mention.label}
          </div>

          <p style={styles.resultSub}>
            {score} bonne{score > 1 ? 's' : ''} réponse{score > 1 ? 's' : ''} sur {questions.length}
          </p>

          <div style={styles.resultActions}>
            <button
              onClick={() => { setCurrentIndex(0); setSelectedAnswer(null); setScore(0); setFinished(false) }}
              style={{ ...styles.btnPrimary, background: lvl.color }}
            >
              ↺ Recommencer
            </button>
            <button onClick={() => navigate(`/formations/${id}`)} style={styles.btnSecondary}>
              ← Retour à la formation
            </button>
            <button onClick={() => navigate('/levels')} style={styles.btnGame}>
              🎮 Mode jeu Vibebug
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Écran de question ──────────────────────────────────────────────────────
  return (
    <div style={styles.container}>

      {/* Nav */}
      <div style={styles.nav}>
        <button onClick={() => navigate(`/formations/${id}`)} style={styles.btnNav}>
          {isMobile ? '←' : `← ${formation.title}`}
        </button>
        <span
          style={{
            ...styles.xpBadge,
            transform: xpFlash ? 'scale(1.25)' : 'scale(1)',
            color: xpFlash ? lvl.color : '#2563eb',
          }}
        >
          ⚡ {totalScore}/20
        </span>
      </div>

      {/* Progress */}
      <div style={styles.progressRow}>
        <div style={styles.progressTrack}>
          <div style={{
            ...styles.progressFill,
            width: `${((currentIndex + 1) / questions.length) * 100}%`,
            background: lvl.color,
          }} />
        </div>
        <span style={styles.progressLabel}>{currentIndex + 1} / {questions.length}</span>
      </div>

      {/* Level context */}
      <div style={{ ...styles.quizContext, background: lvl.bg, borderColor: lvl.border }}>
        <span style={{ ...styles.quizContextLabel, color: lvl.color }}>{lvl.label}</span>
        <span style={styles.quizContextTitle}>{formation.title}</span>
      </div>

      {/* Question */}
      <h2 style={{ ...styles.questionTitle, fontSize: isMobile ? '1.05rem' : '1.15rem' }}>{question.question}</h2>

      {/* Options */}
      <div style={styles.options}>
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelect(index)}
            disabled={isAnswered}
            style={{
              ...getOptionStyle(index),
              fontSize: isMobile ? '0.95rem' : '0.925rem',
              padding: isMobile ? '0.875rem 1rem' : '0.75rem 1rem',
            }}
          >
            <span style={styles.optionLetter}>{String.fromCharCode(65 + index)}.</span>
            {option}
          </button>
        ))}
      </div>

      {/* Feedback */}
      {isAnswered && (
        <div style={isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect}>
          <strong>{isCorrect ? `✓ Correct ! +${POINTS_PER_QUESTION} pts` : '✗ Raté'}</strong>
          <p style={styles.explanation}>{question.explanation}</p>
        </div>
      )}

      {isAnswered && (
        <button onClick={handleNext} style={{ ...styles.btnNext, background: lvl.color }}>
          {isLast ? 'Voir mon score →' : 'Question suivante →'}
        </button>
      )}
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '680px',
    margin: '0 auto',
    padding: '2rem 1rem 3rem',
    fontFamily: 'system-ui, sans-serif',
    color: '#111827',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.25rem',
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
    maxWidth: '60%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  xpBadge: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#2563eb',
    transition: 'transform 0.2s ease, color 0.2s ease',
    display: 'inline-block',
    flexShrink: 0,
  },
  progressRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1.5rem',
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
  progressLabel: {
    fontSize: '0.8rem',
    color: '#9ca3af',
    fontWeight: '600',
    minWidth: '2.5rem',
    textAlign: 'right',
  },
  quizContext: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    border: '1px solid',
    marginBottom: '1.5rem',
  },
  quizContextLabel: {
    fontSize: '0.68rem',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
  },
  quizContextTitle: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#111827',
  },
  questionTitle: {
    fontSize: '1.15rem',
    fontWeight: '700',
    color: '#111827',
    lineHeight: 1.45,
    marginBottom: '1.25rem',
  },
  options: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.625rem',
    marginBottom: '1.25rem',
  },
  option: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    background: '#fff',
    color: '#111827',
    cursor: 'pointer',
    fontSize: '0.925rem',
    textAlign: 'left',
    fontFamily: 'system-ui, sans-serif',
    transition: 'border-color 0.15s, background 0.15s',
    lineHeight: 1.5,
  },
  optionCorrect: {
    borderColor: '#16a34a',
    background: '#f0fdf4',
    color: '#166534',
    cursor: 'default',
  },
  optionIncorrect: {
    borderColor: '#dc2626',
    background: '#fef2f2',
    color: '#991b1b',
    cursor: 'default',
  },
  optionDisabled: {
    opacity: 0.45,
    cursor: 'default',
  },
  optionLetter: {
    fontWeight: '700',
    flexShrink: 0,
  },
  feedbackCorrect: {
    padding: '1rem 1.25rem',
    borderRadius: '8px',
    background: '#f0fdf4',
    borderLeft: '4px solid #16a34a',
    color: '#166534',
    marginBottom: '1.25rem',
  },
  feedbackIncorrect: {
    padding: '1rem 1.25rem',
    borderRadius: '8px',
    background: '#fef2f2',
    borderLeft: '4px solid #dc2626',
    color: '#991b1b',
    marginBottom: '1.25rem',
  },
  explanation: {
    margin: '0.5rem 0 0',
    fontSize: '0.875rem',
    lineHeight: 1.6,
    fontWeight: '400',
  },
  btnNext: {
    display: 'block',
    width: '100%',
    padding: '0.8rem',
    color: '#fff',
    border: 'none',
    borderRadius: '9px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: 'system-ui, sans-serif',
  },

  /* Result screen */
  resultBox: {
    marginTop: '3rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem',
    textAlign: 'center',
  },
  resultIcon: {
    fontSize: '3rem',
    lineHeight: 1,
  },
  resultTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
  },
  resultFormation: {
    fontSize: '0.875rem',
    color: '#6b7280',
    margin: 0,
  },
  scoreWrap: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.25rem',
    marginTop: '0.5rem',
  },
  scoreNum: {
    fontSize: '4rem',
    fontWeight: '800',
    lineHeight: 1,
  },
  scoreMax: {
    fontSize: '2rem',
    fontWeight: '600',
    color: '#9ca3af',
  },
  mentionBadge: {
    padding: '0.5rem 1.25rem',
    borderRadius: '999px',
    border: '2px solid',
    fontSize: '1rem',
    fontWeight: '700',
  },
  resultSub: {
    fontSize: '0.875rem',
    color: '#6b7280',
    margin: 0,
  },
  resultActions: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: '0.75rem',
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
  btnSecondary: {
    padding: '0.7rem 1.25rem',
    background: '#fff',
    color: '#374151',
    border: '1px solid #d1d5db',
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
}
