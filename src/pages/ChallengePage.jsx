import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { bashChallenges } from '../data/bashChallenges'
import { automationChallenges } from '../data/automationChallenges'

const ALL_CHALLENGES = { ...bashChallenges, ...automationChallenges }

const MISSIONS_PER_SESSION = 5

function pickChallenges(all, n, savedIds) {
  if (savedIds?.length) {
    const set = new Set(savedIds)
    const restored = all.filter((c) => set.has(c.id))
    if (restored.length > 0) return restored
  }
  if (all.length <= n) return all
  return [...all].sort(() => Math.random() - 0.5).slice(0, n)
}

const MISSION_META = {
  explain:    { icon: '🧠', label: 'Comprendre',       color: '#1d4ed8', bg: '#eff6ff', directive: 'Analyse ce code et comprends son comportement.' },
  find_error: { icon: '🔍', label: 'Trouver l\'erreur', color: '#b45309', bg: '#fffbeb', directive: 'Quelque chose cloche ici. Trouve ce qui ne va pas.' },
  fix:        { icon: '🛠', label: 'Corriger',          color: '#7c3aed', bg: '#f5f3ff', directive: 'Cette commande a un problème. Comment la corriger ?' },
  ai_error:   { icon: '🤖', label: 'Piège IA',          color: '#be123c', bg: '#fff1f2', directive: 'L\'IA t\'a proposé ce code. Est-ce vraiment correct ?' },
}

function loadProgress(key) {
  try { return JSON.parse(localStorage.getItem(key)) ?? {} } catch { return {} }
}

export default function ChallengePage() {
  const { levelId } = useParams()
  const navigate = useNavigate()

  const isAiMode = levelId === 'ai'
  const level = isAiMode ? null : ALL_CHALLENGES[levelId]
  const levelTitle = isAiMode ? '🤖 Piège IA' : level?.title
  const challengePool = isAiMode
    ? Object.values(bashChallenges).flatMap((l) => l.challenges).filter((c) => c.type === 'ai_error')
    : level?.challenges ?? []

  const STORAGE_KEY = `vibebug_${levelId}`
  const savedProgress = loadProgress(STORAGE_KEY)

  const [challenges] = useState(() =>
    pickChallenges(challengePool, MISSIONS_PER_SESSION, savedProgress.challengeIds)
  )

  const [currentIndex, setCurrentIndex] = useState(() => savedProgress.currentIndex ?? 0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [score, setScore] = useState(() => savedProgress.score ?? 0)
  const [xp, setXp] = useState(() => savedProgress.xp ?? 0)
  const [xpFlash, setXpFlash] = useState(false)
  const [confirmTarget, setConfirmTarget] = useState(null)

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ currentIndex, score, xp, challengeIds: challenges.map((c) => c.id) })
    )
  }, [currentIndex, score, xp])

  useEffect(() => {
    if (!xpFlash) return
    const t = setTimeout(() => setXpFlash(false), 400)
    return () => clearTimeout(t)
  }, [xpFlash])

  if (!isAiMode && !level) {
    return (
      <div style={styles.container}>
        <p>Niveau introuvable.</p>
        <button onClick={() => navigate('/levels')} style={styles.btnNext}>
          Retour aux niveaux
        </button>
      </div>
    )
  }

  const challenge = challenges[currentIndex]
  const isAnswered = selectedAnswer !== null
  const isCorrect = selectedAnswer === challenge.correctAnswer
  const isLast = currentIndex === challenges.length - 1

  function handleSelect(index) {
    if (isAnswered) return
    const correct = index === challenge.correctAnswer
    setSelectedAnswer(index)
    if (correct) {
      setScore((s) => s + 1)
      setXp((x) => x + (isAiMode ? 15 : 10))
      setXpFlash(true)
    }
  }

  function handleNext() {
    if (isLast) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ completed: true, score, xp, total: challenges.length }))
      navigate('/results', {
        state: {
          score,
          xp,
          total: challenges.length,
          levelTitle,
          mode: isAiMode ? 'ai' : 'standard',
        },
      })
      return
    }
    setCurrentIndex((i) => i + 1)
    setSelectedAnswer(null)
  }

  function handleExitRequest(target) {
    setConfirmTarget(target)
  }

  function handleExitConfirm() {
    navigate(confirmTarget) // localStorage intact — progression conservée
  }

  function handleExitCancel() {
    setConfirmTarget(null)
  }

  function handleRestart() {
    localStorage.removeItem(STORAGE_KEY)
    setCurrentIndex(0)
    setScore(0)
    setXp(0)
    setSelectedAnswer(null)
  }

  function getOptionStyle(index) {
    if (!isAnswered) return styles.option
    if (index === challenge.correctAnswer) return { ...styles.option, ...styles.optionCorrect }
    if (index === selectedAnswer) return { ...styles.option, ...styles.optionIncorrect }
    return { ...styles.option, ...styles.optionDisabled }
  }

  return (
    <div style={styles.container}>
      <div style={styles.nav}>
        <button onClick={() => handleExitRequest('/levels')} style={styles.btnNav}>
          ← Niveaux
        </button>
        <button onClick={() => handleExitRequest('/')} style={styles.btnNav}>
          🏠 Accueil
        </button>
      </div>

      {confirmTarget && (
        <div style={styles.confirmBanner}>
          <p style={styles.confirmText}>Ta progression est sauvegardée. Quitter le niveau ?</p>
          <div style={styles.confirmActions}>
            <button onClick={handleExitConfirm} style={styles.btnConfirmYes}>Oui, quitter</button>
            <button onClick={handleExitCancel} style={styles.btnConfirmCancel}>Annuler</button>
          </div>
        </div>
      )}

      <div style={styles.header}>
        <span style={{ ...styles.level, ...(isAiMode ? styles.levelAiMode : {}) }}>
          {levelTitle}
          {(currentIndex > 0 || score > 0) && (
            <button onClick={handleRestart} style={styles.btnRestart} title="Recommencer">
              ↺
            </button>
          )}
        </span>
        <span
          style={{
            ...styles.xpBadge,
            transform: xpFlash ? 'scale(1.25)' : 'scale(1)',
            color: xpFlash ? (isAiMode ? '#be123c' : '#16a34a') : '#2563eb',
          }}
        >
          ⚡ {xp} XP
        </span>
        <span style={styles.progress}>
          {currentIndex + 1} / {challenges.length}
        </span>
      </div>

      <div style={styles.progressBar}>
        <div
          style={{
            ...styles.progressFill,
            width: `${((currentIndex + 1) / challenges.length) * 100}%`,
            background: isAiMode ? '#be123c' : '#2563eb',
          }}
        />
      </div>

      {isAiMode && (
        <div style={styles.aiModeIntro}>
          <div style={styles.aiModeIntroHeader}>
            <span>🤖</span>
            <strong style={styles.aiModeIntroTitle}>Mode Piège IA</strong>
          </div>
          <p style={styles.aiModeIntroText}>
            Quelque chose semble crédible… mais ne l'est pas. L'IA a l'air sûre d'elle — c'est exactement ça, le piège.
          </p>
        </div>
      )}

      {!isAiMode && challengePool.length > challenges.length && (
        <p style={styles.sessionHint}>
          🎲 {challenges.length} missions sélectionnées sur {challengePool.length} — la sélection varie à chaque partie
        </p>
      )}

      {challenge.scenarioContext && (
        <div style={styles.scenarioBlock}>
          <div style={styles.scenarioHeader}>
            <span style={styles.scenarioIcon}>🎯</span>
            <span style={styles.scenarioTitle}>{challenge.scenarioTitle}</span>
          </div>
          <p style={styles.scenarioContext}>{challenge.scenarioContext}</p>
        </div>
      )}

      {(() => {
        const mission = MISSION_META[challenge.type]
        return (
          <>
            {mission && (
              <div style={{
                ...styles.missionBadge,
                color: mission.color,
                background: mission.bg,
                ...(isAiMode ? styles.missionBadgeAi : {}),
              }}>
                {mission.icon} {mission.label}
              </div>
            )}
            {challenge.type === 'ai_error' && !isAiMode && (
              <div style={styles.aiWarning}>
                ⚠️ Ce code a été généré par une IA — analyse-le attentivement avant de répondre.
              </div>
            )}
            <h2 style={styles.title}>{challenge.title}</h2>
            <p style={styles.prompt}>{mission?.directive ?? challenge.prompt}</p>
          </>
        )
      })()}

      {challenge.code && (
        <pre style={styles.code}>
          <code>{challenge.code}</code>
        </pre>
      )}

      <div style={styles.options}>
        {challenge.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelect(index)}
            disabled={isAnswered}
            style={getOptionStyle(index)}
          >
            <span style={styles.optionLetter}>
              {String.fromCharCode(65 + index)}.
            </span>{' '}
            {option}
          </button>
        ))}
      </div>

      {isAnswered && (
        <div style={isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect}>
          <strong>{isCorrect ? `✓ Correct ! +${isAiMode ? 15 : 10} XP` : '✗ Raté'}</strong>
          <p style={styles.explanation}>{challenge.explanation}</p>
        </div>
      )}

      {isAnswered && (
        <button onClick={handleNext} style={{ ...styles.btnNext, ...(isAiMode ? styles.btnNextAi : {}) }}>
          {isLast ? 'Voir les résultats' : isAiMode ? 'Piège suivant →' : 'Défi suivant →'}
        </button>
      )}
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '720px',
    margin: '0 auto',
    padding: '2rem 1rem',
    fontFamily: 'system-ui, sans-serif',
  },
  nav: {
    display: 'flex',
    gap: '0.5rem',
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
  },
  confirmBanner: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    padding: '1rem 1.25rem',
    background: '#fffbeb',
    border: '1px solid #fcd34d',
    borderRadius: '10px',
    marginBottom: '1.25rem',
  },
  confirmText: {
    margin: 0,
    fontSize: '0.95rem',
    color: '#92400e',
    fontWeight: '500',
  },
  confirmActions: {
    display: 'flex',
    gap: '0.625rem',
  },
  btnConfirmYes: {
    padding: '0.45rem 1rem',
    background: '#dc2626',
    color: '#fff',
    border: 'none',
    borderRadius: '7px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  btnConfirmCancel: {
    padding: '0.45rem 1rem',
    background: '#fff',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: '7px',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem',
  },
  aiWarning: {
    padding: '0.6rem 1rem',
    background: '#fff1f2',
    border: '1px solid #fda4af',
    borderRadius: '8px',
    fontSize: '0.85rem',
    color: '#9f1239',
    marginBottom: '0.75rem',
    lineHeight: '1.4',
  },
  levelAiMode: {
    color: '#be123c',
    fontWeight: '700',
  },
  aiModeIntro: {
    padding: '1rem 1.25rem',
    background: '#fff1f2',
    border: '1px solid #fda4af',
    borderLeft: '4px solid #be123c',
    borderRadius: '10px',
    marginBottom: '1.5rem',
  },
  aiModeIntroHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.375rem',
  },
  aiModeIntroTitle: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#9f1239',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  aiModeIntroText: {
    margin: 0,
    fontSize: '0.875rem',
    color: '#be123c',
    lineHeight: '1.5',
    fontStyle: 'italic',
  },
  missionBadgeAi: {
    background: '#fecdd3',
    border: '1px solid #fb7185',
    padding: '0.4rem 1rem',
    fontSize: '0.82rem',
  },
  btnNextAi: {
    background: '#be123c',
  },
  scenarioBlock: {
    background: '#0f172a',
    borderRadius: '10px',
    padding: '1rem 1.25rem',
    marginBottom: '1.25rem',
    borderLeft: '3px solid #3b82f6',
  },
  scenarioHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem',
  },
  scenarioIcon: {
    fontSize: '0.9rem',
  },
  scenarioTitle: {
    fontSize: '0.72rem',
    fontWeight: '700',
    color: '#60a5fa',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
  },
  scenarioContext: {
    margin: 0,
    fontSize: '0.9rem',
    color: '#cbd5e1',
    lineHeight: '1.6',
  },
  sessionHint: {
    fontSize: '0.78rem',
    color: '#6b7280',
    fontStyle: 'italic',
    margin: '0 0 1.25rem',
  },
  missionBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    padding: '0.3rem 0.75rem',
    borderRadius: '999px',
    fontSize: '0.78rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.75rem',
  },
  progressBar: {
    height: '6px',
    background: '#e5e7eb',
    borderRadius: '999px',
    overflow: 'hidden',
    marginBottom: '1.75rem',
  },
  progressFill: {
    height: '100%',
    background: '#2563eb',
    borderRadius: '999px',
    transition: 'width 0.3s ease',
  },
  level: {
    fontSize: '0.875rem',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  btnRestart: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    color: '#9ca3af',
    padding: '0',
    lineHeight: 1,
  },
  xpBadge: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#2563eb',
    transition: 'transform 0.2s ease, color 0.2s ease',
    display: 'inline-block',
  },
  progress: {
    fontSize: '0.875rem',
    color: '#6b7280',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: '700',
    marginBottom: '0.5rem',
    color: '#111827',
  },
  prompt: {
    fontSize: '1rem',
    color: '#374151',
    marginBottom: '1rem',
  },
  code: {
    background: '#1e1e2e',
    color: '#cdd6f4',
    padding: '1rem 1.25rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
    lineHeight: '1.6',
    overflowX: 'auto',
    marginBottom: '1.5rem',
    whiteSpace: 'pre-wrap',
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
    fontSize: '0.95rem',
    textAlign: 'left',
    transition: 'border-color 0.15s, background 0.15s',
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
    opacity: 0.5,
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
    fontSize: '0.9rem',
    lineHeight: '1.5',
  },
  btnNext: {
    padding: '0.75rem 1.5rem',
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: '600',
  },
}
