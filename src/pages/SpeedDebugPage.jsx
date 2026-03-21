import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { bashChallenges } from '../data/bashChallenges'
import { automationChallenges } from '../data/automationChallenges'

const QUESTION_COUNT = 5
const TIME_PER_QUESTION = 15

const MISSION_META = {
  explain:    { icon: '🧠', label: 'Comprendre' },
  find_error: { icon: '🔍', label: "Trouver l'erreur" },
  fix:        { icon: '🛠', label: 'Corriger' },
  ai_error:   { icon: '🤖', label: 'Piège IA' },
}

function buildPool() {
  const bash = Object.values(bashChallenges).flatMap((l) => l.challenges)
  const auto = Object.values(automationChallenges).flatMap((l) => l.challenges)
  return [...bash, ...auto].filter((c) => !c.scenarioContext)
}

function pickRandom(pool, n) {
  return [...pool].sort(() => Math.random() - 0.5).slice(0, n)
}

// Wrapper : gère le restart en changeant la key de SpeedGame
export default function SpeedDebugPage() {
  const [sessionKey, setSessionKey] = useState(0)
  return <SpeedGame key={sessionKey} onRestart={() => setSessionKey((k) => k + 1)} />
}

// Composant principal du mini-jeu
function SpeedGame({ onRestart }) {
  const navigate = useNavigate()
  const [challenges] = useState(() => pickRandom(buildPool(), QUESTION_COUNT))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION)
  const [score, setScore] = useState(0)
  const [xp, setXp] = useState(0)
  const [lastXp, setLastXp] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  const challenge = challenges[currentIndex]
  const isAnswered = selectedAnswer !== null
  const isTimeout = selectedAnswer === -1
  const isCorrect = !isTimeout && selectedAnswer === challenge?.correctAnswer
  const timerPct = (timeLeft / TIME_PER_QUESTION) * 100
  const timerColor = timeLeft > 8 ? '#16a34a' : timeLeft > 4 ? '#d97706' : '#dc2626'

  // Remet le timer à zéro à chaque nouvelle question
  useEffect(() => {
    setTimeLeft(TIME_PER_QUESTION)
  }, [currentIndex])

  // Décompte : un tick par seconde via setTimeout récursif
  useEffect(() => {
    if (isAnswered || gameOver) return
    if (timeLeft === 0) {
      setSelectedAnswer(-1) // timeout → déclenche isAnswered = true
      return
    }
    const t = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, isAnswered, gameOver])

  // Avance automatiquement 1,5 s après une réponse ou un timeout
  useEffect(() => {
    if (!isAnswered) return
    const t = setTimeout(() => {
      const next = currentIndex + 1
      if (next >= QUESTION_COUNT) {
        setGameOver(true)
      } else {
        setCurrentIndex(next)
        setSelectedAnswer(null)
      }
    }, 1500)
    return () => clearTimeout(t)
  }, [isAnswered, currentIndex])

  function handleSelect(index) {
    if (isAnswered) return
    const correct = index === challenge.correctAnswer
    setSelectedAnswer(index)
    if (correct) {
      const bonus = timeLeft >= 10 ? 20 : timeLeft >= 5 ? 15 : 10
      setScore((s) => s + 1)
      setXp((x) => x + bonus)
      setLastXp(bonus)
    }
  }

  function getOptionStyle(index) {
    if (!isAnswered) return styles.option
    if (index === challenge.correctAnswer) return { ...styles.option, ...styles.optionCorrect }
    if (!isTimeout && index === selectedAnswer) return { ...styles.option, ...styles.optionIncorrect }
    return { ...styles.option, ...styles.optionFaded }
  }

  // ── Écran de fin ────────────────────────────────────────────────────────────
  if (gameOver) {
    const badge =
      score === QUESTION_COUNT ? '⚡ Réflexes de pro'
      : score >= 4             ? '👍 Bon instinct'
      : score >= 3             ? '💪 Continue l\'entraînement'
      :                          '🐢 Prends le temps de lire'

    return (
      <div style={styles.container}>
        <div style={styles.gameoverBox}>
          <div style={styles.gameoverFlag}>🏁</div>
          <h2 style={styles.gameoverTitle}>Session terminée</h2>
          <div style={styles.gameoverScore}>
            {score} <span style={styles.gameoverTotal}>/ {QUESTION_COUNT}</span>
          </div>
          <div style={styles.gameoverBadge}>{badge}</div>
          <div style={styles.gameoverXp}>⚡ {xp} XP gagnés</div>
          <div style={styles.gameoverActions}>
            <button onClick={onRestart} style={styles.btnPrimary}>↺ Rejouer</button>
            <button onClick={() => navigate('/levels')} style={styles.btnSecondary}>← Niveaux</button>
          </div>
        </div>
      </div>
    )
  }

  // ── Écran de jeu ────────────────────────────────────────────────────────────
  const mission = MISSION_META[challenge.type]
  const correctLetter = String.fromCharCode(65 + challenge.correctAnswer)

  return (
    <div style={styles.container}>

      {/* Barre de navigation */}
      <div style={styles.nav}>
        <button onClick={() => navigate('/levels')} style={styles.btnNav}>← Quitter</button>
        <span style={styles.navTitle}>⚡ Speed Debug</span>
        <span style={styles.navScore}>✓ {score}</span>
      </div>

      {/* Timer */}
      <div style={styles.timerRow}>
        <div style={styles.timerTrack}>
          <div
            style={{
              ...styles.timerFill,
              width: `${timerPct}%`,
              background: timerColor,
              transition: timeLeft < TIME_PER_QUESTION ? 'width 0.9s linear, background 0.3s' : 'none',
            }}
          />
        </div>
        <span style={{ ...styles.timerNum, color: timerColor }}>{timeLeft}s</span>
      </div>

      {/* En-tête de la question */}
      <div style={styles.questionMeta}>
        {mission && (
          <span style={styles.missionChip}>{mission.icon} {mission.label}</span>
        )}
        <span style={styles.questionCounter}>{currentIndex + 1} / {QUESTION_COUNT}</span>
      </div>

      <h2 style={styles.title}>{challenge.title}</h2>
      <p style={styles.prompt}>{challenge.prompt}</p>

      {challenge.code && (
        <pre style={styles.code}><code>{challenge.code}</code></pre>
      )}

      {/* Options */}
      <div style={styles.options}>
        {challenge.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelect(index)}
            disabled={isAnswered}
            style={getOptionStyle(index)}
          >
            <span style={styles.letter}>{String.fromCharCode(65 + index)}.</span>{' '}
            {option}
          </button>
        ))}
      </div>

      {/* Feedback rapide */}
      {isAnswered && (
        <div style={isCorrect ? styles.feedbackOk : styles.feedbackKo}>
          {isCorrect ? (
            <>✓ Correct ! <span style={styles.xpEarned}>+{lastXp} XP</span></>
          ) : isTimeout ? (
            `⏱ Temps écoulé — bonne réponse : ${correctLetter}`
          ) : (
            `✗ Raté — bonne réponse : ${correctLetter}`
          )}
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '640px',
    margin: '0 auto',
    padding: '1.5rem 1rem 3rem',
    fontFamily: 'system-ui, sans-serif',
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
  },
  navTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#111827',
  },
  navScore: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#16a34a',
    minWidth: '2rem',
    textAlign: 'right',
  },
  timerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1.5rem',
  },
  timerTrack: {
    flex: 1,
    height: '10px',
    background: '#f3f4f6',
    borderRadius: '999px',
    overflow: 'hidden',
  },
  timerFill: {
    height: '100%',
    borderRadius: '999px',
  },
  timerNum: {
    fontSize: '1rem',
    fontWeight: '700',
    minWidth: '2.5rem',
    textAlign: 'right',
    fontVariantNumeric: 'tabular-nums',
  },
  questionMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem',
  },
  missionChip: {
    fontSize: '0.78rem',
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  questionCounter: {
    fontSize: '0.85rem',
    color: '#9ca3af',
    fontWeight: '600',
  },
  title: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '0.4rem',
  },
  prompt: {
    fontSize: '0.95rem',
    color: '#374151',
    marginBottom: '1rem',
    lineHeight: '1.5',
  },
  code: {
    background: '#1e1e2e',
    color: '#cdd6f4',
    padding: '0.875rem 1rem',
    borderRadius: '8px',
    fontSize: '0.85rem',
    lineHeight: '1.6',
    overflowX: 'auto',
    marginBottom: '1.25rem',
    whiteSpace: 'pre-wrap',
  },
  options: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  option: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.5rem',
    padding: '0.65rem 0.875rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    background: '#fff',
    color: '#111827',
    cursor: 'pointer',
    fontSize: '0.9rem',
    textAlign: 'left',
    transition: 'border-color 0.1s, background 0.1s',
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
  optionFaded: {
    opacity: 0.45,
    cursor: 'default',
  },
  letter: {
    fontWeight: '700',
    flexShrink: 0,
    color: 'inherit',
  },
  feedbackOk: {
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    background: '#f0fdf4',
    borderLeft: '4px solid #16a34a',
    color: '#166534',
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  feedbackKo: {
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    background: '#fef2f2',
    borderLeft: '4px solid #dc2626',
    color: '#991b1b',
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  xpEarned: {
    marginLeft: '0.5rem',
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#2563eb',
  },
  gameoverBox: {
    marginTop: '4rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem',
    textAlign: 'center',
  },
  gameoverFlag: {
    fontSize: '3rem',
    lineHeight: 1,
  },
  gameoverTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
  },
  gameoverScore: {
    fontSize: '3.5rem',
    fontWeight: '800',
    color: '#111827',
    lineHeight: 1,
    marginTop: '0.5rem',
  },
  gameoverTotal: {
    fontSize: '2rem',
    fontWeight: '600',
    color: '#9ca3af',
  },
  gameoverBadge: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#374151',
    padding: '0.4rem 1rem',
    background: '#f3f4f6',
    borderRadius: '999px',
  },
  gameoverXp: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#2563eb',
  },
  gameoverActions: {
    display: 'flex',
    gap: '0.75rem',
    marginTop: '1rem',
  },
  btnPrimary: {
    padding: '0.7rem 1.5rem',
    background: '#111827',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  btnSecondary: {
    padding: '0.7rem 1.5rem',
    background: '#fff',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
  },
}
