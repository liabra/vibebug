import { useNavigate } from 'react-router-dom'

const MODES = [
  {
    id: 'parcours',
    eyebrow: 'Entraînement structuré',
    icon: '🗂',
    title: 'Parcours principal',
    desc: "Progresse niveau par niveau sur Linux / Bash et l'automatisation. Comprends les bugs, corrige les erreurs, débloque la suite. Le vrai entraînement de fond.",
    promise: 'Du débutant au confirmé — à ton rythme, avec de la progression réelle.',
    tags: ['Niveaux débloqués', 'XP & badges', 'Progression sauvegardée'],
    btn: 'Choisir un niveau →',
    path: '/levels',
    theme: {
      bg: '#eff6ff',
      border: '#bfdbfe',
      eyebrowColor: '#2563eb',
      titleColor: '#1e3a8a',
      tagBg: '#dbeafe',
      tagColor: '#1d4ed8',
      btnBg: '#2563eb',
    },
  },
  {
    id: 'ai',
    eyebrow: 'Esprit critique',
    icon: '🤖',
    title: 'Mode Piège IA',
    desc: "L'IA génère du code plausible — mais pas toujours correct. Sauras-tu repérer ce qui cloche avant de valider en prod ? Ce mode entraîne un réflexe rare : douter au bon moment.",
    promise: "Deviens le dernier rempart entre le code IA et la prod.",
    tags: ['Code généré par IA', '+15 XP / bonne réponse', 'Badge Détecteur d\'illusions'],
    btn: 'Lancer le mode →',
    path: '/challenge/ai',
    theme: {
      bg: '#fff1f2',
      border: '#fda4af',
      eyebrowColor: '#be123c',
      titleColor: '#9f1239',
      tagBg: '#ffe4e6',
      tagColor: '#be123c',
      btnBg: '#be123c',
    },
  },
  {
    id: 'speed',
    eyebrow: 'Réflexes',
    icon: '⚡',
    title: 'Speed Debug',
    desc: '5 missions. 15 secondes chacune. Le timer tourne, pas le temps d\'analyser à fond — fais confiance à ce que tu as appris. Idéal pour tester ses acquis sous pression.',
    promise: 'Réflexe + précision = bon développeur.',
    tags: ['5 questions', '15 s / question', 'Bonus vitesse'],
    btn: 'Lancer la session →',
    path: '/speed',
    theme: {
      bg: '#fffbeb',
      border: '#fcd34d',
      eyebrowColor: '#d97706',
      titleColor: '#92400e',
      tagBg: '#fef3c7',
      tagColor: '#b45309',
      btnBg: '#d97706',
    },
  },
]

export default function ModesPage() {
  const navigate = useNavigate()

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.heading}>Modes de jeu</h1>
        <p style={styles.sub}>
          Trois façons de s'entraîner — selon ton humeur, ton niveau et le temps dont tu disposes.
        </p>
      </div>

      <div style={styles.cards}>
        {MODES.map((mode) => (
          <div
            key={mode.id}
            style={{
              ...styles.card,
              background: mode.theme.bg,
              borderColor: mode.theme.border,
            }}
          >
            <div style={styles.cardTop}>
              <span style={{ ...styles.eyebrow, color: mode.theme.eyebrowColor }}>
                {mode.eyebrow}
              </span>
              <div style={styles.titleRow}>
                <span style={styles.icon}>{mode.icon}</span>
                <h2 style={{ ...styles.title, color: mode.theme.titleColor }}>{mode.title}</h2>
              </div>
            </div>

            <p style={styles.desc}>{mode.desc}</p>

            <p style={{ ...styles.promise, color: mode.theme.eyebrowColor }}>
              "{mode.promise}"
            </p>

            <div style={styles.tags}>
              {mode.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    ...styles.tag,
                    background: mode.theme.tagBg,
                    color: mode.theme.tagColor,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <button
              onClick={() => navigate(mode.path)}
              style={{ ...styles.btn, background: mode.theme.btnBg }}
            >
              {mode.btn}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  page: {
    maxWidth: '640px',
    margin: '0 auto',
    padding: '2rem 1rem 4rem',
    fontFamily: 'system-ui, sans-serif',
    color: '#111827',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2.5rem',
  },
  heading: {
    fontSize: '1.75rem',
    fontWeight: '800',
    color: '#111827',
    marginBottom: '0.5rem',
  },
  sub: {
    fontSize: '0.95rem',
    color: '#6b7280',
    lineHeight: 1.6,
    margin: 0,
  },
  cards: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  card: {
    border: '2px solid',
    borderRadius: '16px',
    padding: '1.5rem 1.5rem 1.25rem',
  },
  cardTop: {
    marginBottom: '0.875rem',
  },
  eyebrow: {
    fontSize: '0.72rem',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    display: 'block',
    marginBottom: '0.4rem',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  icon: {
    fontSize: '1.5rem',
    lineHeight: 1,
  },
  title: {
    fontSize: '1.3rem',
    fontWeight: '800',
    margin: 0,
  },
  desc: {
    fontSize: '0.9rem',
    color: '#374151',
    lineHeight: 1.65,
    margin: '0 0 0.875rem',
  },
  promise: {
    fontSize: '0.875rem',
    fontWeight: '600',
    fontStyle: 'italic',
    margin: '0 0 1.1rem',
    lineHeight: 1.5,
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.4rem',
    marginBottom: '1.25rem',
  },
  tag: {
    fontSize: '0.72rem',
    fontWeight: '700',
    padding: '0.25rem 0.65rem',
    borderRadius: '999px',
  },
  btn: {
    display: 'block',
    width: '100%',
    padding: '0.75rem',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '0.95rem',
    fontWeight: '700',
    cursor: 'pointer',
    textAlign: 'center',
  },
}
