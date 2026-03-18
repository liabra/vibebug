import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { bashChallenges } from '../data/bashChallenges'

export default function ChallengePage() {
  const { levelId } = useParams()
  const navigate = useNavigate()

  const level = bashChallenges[levelId]
  const challenges = level?.challenges ?? []

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [score, setScore] = useState(0)

  if (!level) {
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
    if (correct) setScore((s) => s + 1)
  }

  function handleNext() {
    if (isLast) {
      navigate('/results', {
        state: {
          score,
          total: challenges.length,
          levelTitle: level.title,
        },
      })
      return
    }
    setCurrentIndex((i) => i + 1)
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
      <div style={styles.header}>
        <span style={styles.level}>{level.title}</span>
        <span style={styles.progress}>
          {currentIndex + 1} / {challenges.length}
        </span>
      </div>

      <h2 style={styles.title}>{challenge.title}</h2>
      <p style={styles.prompt}>{challenge.prompt}</p>

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
          <strong>{isCorrect ? '✓ Correct !' : '✗ Incorrect'}</strong>
          <p style={styles.explanation}>{challenge.explanation}</p>
        </div>
      )}

      {isAnswered && (
        <button onClick={handleNext} style={styles.btnNext}>
          {isLast ? 'Voir les résultats' : 'Question suivante →'}
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  level: {
    fontSize: '0.875rem',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
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
