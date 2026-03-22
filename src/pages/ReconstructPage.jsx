import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { reconstructChallenges } from '../data/reconstructChallenges'

// Wrapper — gère le restart en remontant la key de ReconstructGame
export default function ReconstructPage() {
  const [sessionKey, setSessionKey] = useState(0)
  return <ReconstructGame key={sessionKey} onRestart={() => setSessionKey((k) => k + 1)} />
}

function ReconstructGame({ onRestart }) {
  const navigate = useNavigate()

  // Shuffle les blocs de chaque défi une seule fois au démarrage
  const [challenges] = useState(() =>
    reconstructChallenges.map((c) => ({
      ...c,
      shuffledBlocks: [...c.blocks].sort(() => Math.random() - 0.5),
    }))
  )

  const [challengeIndex, setChallengeIndex] = useState(0)
  const [placed, setPlaced] = useState([])   // IDs des blocs placés, dans l'ordre
  const [checked, setChecked] = useState(false)
  const [score, setScore] = useState(0)
  const [xp, setXp] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  const challenge = challenges[challengeIndex]
  const pool = challenge.shuffledBlocks.filter((b) => !placed.includes(b.id))
  const placedBlocks = placed.map((id) => challenge.blocks.find((b) => b.id === id))
  const allPlaced = placed.length === challenge.blocks.length
  const isCorrect = checked && placed.join(',') === challenge.correctOrder.join(',')
  const correctBlocks = challenge.correctOrder.map((id) => challenge.blocks.find((b) => b.id === id))

  function handlePlaceBlock(id) {
    if (checked) return
    setPlaced((prev) => [...prev, id])
  }

  function handleRemoveBlock(id) {
    if (checked) return
    setPlaced((prev) => prev.filter((bid) => bid !== id))
  }

  function handleCheck() {
    const correct = placed.join(',') === challenge.correctOrder.join(',')
    setChecked(true)
    if (correct) {
      setScore((s) => s + 1)
      setXp((x) => x + 20)
    }
  }

  function handleReset() {
    if (checked) return
    setPlaced([])
  }

  function handleNext() {
    const next = challengeIndex + 1
    if (next >= challenges.length) {
      setGameOver(true)
    } else {
      setChallengeIndex(next)
      setPlaced([])
      setChecked(false)
    }
  }

  // ── Écran de fin ────────────────────────────────────────────────────────────
  if (gameOver) {
    const total = challenges.length
    const badge =
      score === total     ? '🏆 Logique parfaite'
      : score >= total - 1 ? '👍 Bonne maîtrise'
      : score >= total - 2 ? '💪 Continue l\'entraînement'
      :                       '🔁 Relis tes scripts'

    return (
      <div style={styles.container}>
        <div style={styles.gameoverBox}>
          <div style={styles.gameoverFlag}>🔧</div>
          <h2 style={styles.gameoverTitle}>Session terminée</h2>
          <div style={styles.gameoverScore}>
            {score} <span style={styles.gameoverTotal}>/ {total}</span>
          </div>
          <div style={styles.gameoverBadge}>{badge}</div>
          <div style={styles.gameoverXp}>⚡ {xp} XP gagnés</div>
          <div style={styles.gameoverActions}>
            <button onClick={onRestart} style={styles.btnPrimary}>↺ Rejouer</button>
            <button onClick={() => navigate('/modes')} style={styles.btnSecondary}>← Modes</button>
          </div>
        </div>
      </div>
    )
  }

  // ── Écran de jeu ────────────────────────────────────────────────────────────
  return (
    <div style={styles.container}>

      {/* Nav */}
      <div style={styles.nav}>
        <button onClick={() => navigate('/modes')} style={styles.btnNav}>← Quitter</button>
        <span style={styles.navTitle}>🔧 Reconstruct Script</span>
        <span style={styles.navScore}>✓ {score}</span>
      </div>

      {/* Progression */}
      <div style={styles.progressRow}>
        <div style={styles.progressTrack}>
          <div style={{
            ...styles.progressFill,
            width: `${((challengeIndex + 1) / challenges.length) * 100}%`,
          }} />
        </div>
        <span style={styles.progressLabel}>{challengeIndex + 1} / {challenges.length}</span>
      </div>

      {/* Contexte */}
      <h2 style={styles.title}>{challenge.title}</h2>
      <p style={styles.context}>{challenge.context}</p>

      {/* Zone de placement */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionLabel}>Ton script</span>
          {!checked && placed.length > 0 && (
            <button onClick={handleReset} style={styles.btnReset}>↺ Vider</button>
          )}
        </div>
        <div style={styles.placedArea}>
          {placedBlocks.length === 0 ? (
            <p style={styles.placedEmpty}>Clique sur les blocs ci-dessous pour les placer dans l'ordre…</p>
          ) : (
            placedBlocks.map((block, i) => {
              const blockCorrect = checked && challenge.correctOrder[i] === block.id
              const blockWrong = checked && !blockCorrect
              return (
                <button
                  key={block.id}
                  onClick={() => handleRemoveBlock(block.id)}
                  disabled={checked}
                  style={{
                    ...styles.placedBlock,
                    ...(blockCorrect ? styles.blockCorrect : {}),
                    ...(blockWrong   ? styles.blockWrong   : {}),
                    cursor: checked ? 'default' : 'pointer',
                  }}
                >
                  <span style={styles.lineNumber}>{i + 1}</span>
                  <code style={styles.blockCode}>{block.code}</code>
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* Pool de blocs */}
      {pool.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionLabel}>Blocs disponibles</span>
          </div>
          <div style={styles.pool}>
            {pool.map((block) => (
              <button
                key={block.id}
                onClick={() => handlePlaceBlock(block.id)}
                style={styles.poolBlock}
              >
                <code style={styles.blockCode}>{block.code}</code>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Vérifier */}
      {!checked && (
        <button
          onClick={handleCheck}
          disabled={!allPlaced}
          style={{ ...styles.btnCheck, opacity: allPlaced ? 1 : 0.4, cursor: allPlaced ? 'pointer' : 'default' }}
        >
          Vérifier l'ordre →
        </button>
      )}

      {/* Feedback */}
      {checked && (
        <>
          <div style={isCorrect ? styles.feedbackOk : styles.feedbackKo}>
            <strong>{isCorrect ? '✓ Bonne séquence ! +20 XP' : '✗ Pas tout à fait…'}</strong>
            <p style={styles.explanation}>{challenge.explanation}</p>
          </div>

          {!isCorrect && (
            <div style={styles.correctOrderBlock}>
              <span style={styles.correctOrderLabel}>Ordre correct :</span>
              {correctBlocks.map((block, i) => (
                <div key={block.id} style={styles.correctLine}>
                  <span style={styles.lineNumber}>{i + 1}</span>
                  <code style={styles.blockCode}>{block.code}</code>
                </div>
              ))}
            </div>
          )}

          <button onClick={handleNext} style={styles.btnNext}>
            {challengeIndex + 1 >= challenges.length ? 'Voir les résultats' : 'Défi suivant →'}
          </button>
        </>
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
  },
  navTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#111827',
  },
  navScore: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#7c3aed',
    minWidth: '2rem',
    textAlign: 'right',
  },
  progressRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1.75rem',
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
    background: '#7c3aed',
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
  title: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '0.4rem',
  },
  context: {
    fontSize: '0.9rem',
    color: '#374151',
    lineHeight: '1.6',
    marginBottom: '1.5rem',
  },
  section: {
    marginBottom: '1.25rem',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  sectionLabel: {
    fontSize: '0.72rem',
    fontWeight: '800',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
  },
  btnReset: {
    background: 'none',
    border: 'none',
    fontSize: '0.78rem',
    color: '#9ca3af',
    cursor: 'pointer',
    padding: '0',
    fontWeight: '600',
  },
  placedArea: {
    minHeight: '3rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.375rem',
    padding: '0.75rem',
    background: '#f9fafb',
    border: '1.5px dashed #d1d5db',
    borderRadius: '10px',
  },
  placedEmpty: {
    fontSize: '0.82rem',
    color: '#9ca3af',
    fontStyle: 'italic',
    margin: 0,
    textAlign: 'center',
    padding: '0.5rem 0',
  },
  placedBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.5rem 0.75rem',
    background: '#fff',
    border: '1px solid #d1d5db',
    borderRadius: '7px',
    textAlign: 'left',
    width: '100%',
    transition: 'border-color 0.15s',
  },
  blockCorrect: {
    borderColor: '#16a34a',
    background: '#f0fdf4',
  },
  blockWrong: {
    borderColor: '#dc2626',
    background: '#fef2f2',
  },
  pool: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.375rem',
  },
  poolBlock: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.6rem 0.875rem',
    background: '#fff',
    border: '1.5px solid #e5e7eb',
    borderRadius: '8px',
    cursor: 'pointer',
    textAlign: 'left',
    width: '100%',
    transition: 'border-color 0.15s, background 0.15s',
  },
  lineNumber: {
    flexShrink: 0,
    fontSize: '0.72rem',
    fontWeight: '700',
    color: '#9ca3af',
    minWidth: '1.25rem',
    fontFamily: 'system-ui, sans-serif',
  },
  blockCode: {
    fontSize: '0.85rem',
    fontFamily: 'ui-monospace, SFMono-Regular, monospace',
    color: '#111827',
    wordBreak: 'break-all',
  },
  btnCheck: {
    display: 'block',
    width: '100%',
    padding: '0.75rem',
    background: '#7c3aed',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '0.95rem',
    fontWeight: '700',
    marginBottom: '1rem',
  },
  feedbackOk: {
    padding: '0.875rem 1rem',
    borderRadius: '8px',
    background: '#f0fdf4',
    borderLeft: '4px solid #16a34a',
    color: '#166534',
    fontSize: '0.9rem',
    marginBottom: '0.875rem',
  },
  feedbackKo: {
    padding: '0.875rem 1rem',
    borderRadius: '8px',
    background: '#fef2f2',
    borderLeft: '4px solid #dc2626',
    color: '#991b1b',
    fontSize: '0.9rem',
    marginBottom: '0.875rem',
  },
  explanation: {
    margin: '0.5rem 0 0',
    fontSize: '0.85rem',
    lineHeight: '1.55',
    fontWeight: '400',
  },
  correctOrderBlock: {
    background: '#1e1e2e',
    borderRadius: '8px',
    padding: '0.875rem 1rem',
    marginBottom: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
  },
  correctOrderLabel: {
    fontSize: '0.7rem',
    fontWeight: '700',
    color: '#60a5fa',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '0.375rem',
  },
  correctLine: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  btnNext: {
    display: 'block',
    width: '100%',
    padding: '0.75rem',
    background: '#111827',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '0.95rem',
    fontWeight: '700',
    cursor: 'pointer',
  },

  // Game over
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
    color: '#7c3aed',
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
    color: '#7c3aed',
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
