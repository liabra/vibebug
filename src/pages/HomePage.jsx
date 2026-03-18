import { useNavigate } from 'react-router-dom'

const WHY_ITEMS = [
  {
    icon: '🐛',
    title: 'Comprendre les bugs',
    desc: 'Apprends à lire et décortiquer les erreurs réelles, pas juste à les copier-coller.',
  },
  {
    icon: '🔧',
    title: 'Apprendre à corriger',
    desc: 'Entraîne-toi sur des cas concrets et développe des réflexes solides.',
  },
  {
    icon: '🤖',
    title: 'Devenir autonome face à l\'IA',
    desc: 'Sache quand faire confiance au code généré — et quand ne pas le faire.',
  },
]

const MODULES = [
  {
    icon: '🐧',
    title: 'Linux / Bash',
    desc: 'Commandes, permissions, scripts, pipes — les fondations du développeur.',
    status: 'active',
  },
  {
    icon: '⚙️',
    title: 'Automatisation',
    desc: 'Cron, CI/CD, scripts Python — automatise sans casser.',
    status: 'soon',
  },
  {
    icon: '☁️',
    title: 'Cloud / Déploiement',
    desc: 'Docker, Nginx, VPS — déploie en comprenant ce que tu fais.',
    status: 'soon',
  },
]

const STEPS = [
  { number: '01', title: 'Choisis un niveau', desc: 'Débutant, intermédiaire ou avancé — commence là où tu en es.' },
  { number: '02', title: 'Résous les erreurs', desc: 'Des questions courtes, des cas réels, un feedback immédiat.' },
  { number: '03', title: 'Gagne de l\'XP et progresse', desc: 'Suis ta progression, débloque les niveaux, deviens inarrêtable.' },
]

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div style={styles.page}>

      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroBadge}>⚡ Vibecoding intelligent</div>
        <h1 style={styles.heroTitle}>
          Apprends à débugger<br />
          <span style={styles.heroAccent}>comme un vrai dev</span>
        </h1>
        <p style={styles.heroSub}>
          Comprends les erreurs que l'IA ne t'explique pas.<br />
          Module Linux / Bash disponible maintenant.
        </p>
        <div style={styles.heroCta}>
          <button onClick={() => navigate('/levels')} style={styles.btnPrimary}>
            Commencer →
          </button>
          <button onClick={() => navigate('/levels')} style={styles.btnSecondary}>
            Voir les niveaux
          </button>
        </div>
      </section>

      {/* Why */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Pourquoi Vibebug ?</h2>
        <div style={styles.grid3}>
          {WHY_ITEMS.map((item) => (
            <div key={item.title} style={styles.whyCard}>
              <span style={styles.whyIcon}>{item.icon}</span>
              <h3 style={styles.whyTitle}>{item.title}</h3>
              <p style={styles.whyDesc}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Modules */}
      <section style={{ ...styles.section, background: '#f9fafb', borderRadius: '16px', padding: '2.5rem 1.5rem' }}>
        <h2 style={styles.sectionTitle}>Modules</h2>
        <div style={styles.grid3}>
          {MODULES.map((mod) => (
            <div
              key={mod.title}
              style={{
                ...styles.moduleCard,
                ...(mod.status === 'soon' ? styles.moduleCardSoon : {}),
              }}
            >
              <div style={styles.moduleTop}>
                <span style={styles.moduleIcon}>{mod.icon}</span>
                {mod.status === 'soon' && <span style={styles.soonBadge}>Bientôt</span>}
                {mod.status === 'active' && <span style={styles.activeBadge}>Disponible</span>}
              </div>
              <h3 style={styles.moduleTitle}>{mod.title}</h3>
              <p style={styles.moduleDesc}>{mod.desc}</p>
              {mod.status === 'active' && (
                <button onClick={() => navigate('/levels')} style={styles.moduleBtn}>
                  Jouer →
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Comment ça marche</h2>
        <div style={styles.steps}>
          {STEPS.map((step, i) => (
            <div key={step.number} style={styles.step}>
              <div style={styles.stepNumber}>{step.number}</div>
              {i < STEPS.length - 1 && <div style={styles.stepConnector} />}
              <div style={styles.stepContent}>
                <h3 style={styles.stepTitle}>{step.title}</h3>
                <p style={styles.stepDesc}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>Prêt à arrêter de copier-coller à l'aveugle ?</h2>
        <button onClick={() => navigate('/levels')} style={styles.btnPrimary}>
          Commencer maintenant →
        </button>
      </section>

    </div>
  )
}

const styles = {
  page: {
    maxWidth: '860px',
    margin: '0 auto',
    padding: '0 1rem 4rem',
    fontFamily: 'system-ui, sans-serif',
    color: '#111827',
  },

  /* Hero */
  hero: {
    textAlign: 'center',
    padding: '4rem 1rem 3rem',
  },
  heroBadge: {
    display: 'inline-block',
    background: '#eff6ff',
    color: '#2563eb',
    border: '1px solid #bfdbfe',
    borderRadius: '999px',
    padding: '0.3rem 1rem',
    fontSize: '0.8rem',
    fontWeight: '600',
    marginBottom: '1.25rem',
    letterSpacing: '0.03em',
  },
  heroTitle: {
    fontSize: 'clamp(2rem, 6vw, 3rem)',
    fontWeight: '800',
    lineHeight: 1.15,
    marginBottom: '1rem',
    color: '#111827',
  },
  heroAccent: {
    color: '#2563eb',
  },
  heroSub: {
    fontSize: '1.05rem',
    color: '#6b7280',
    lineHeight: 1.6,
    marginBottom: '2rem',
  },
  heroCta: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },

  /* Buttons */
  btnPrimary: {
    padding: '0.8rem 1.75rem',
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '9px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
  },
  btnSecondary: {
    padding: '0.8rem 1.75rem',
    background: '#fff',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: '9px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },

  /* Sections */
  section: {
    marginBottom: '3.5rem',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: '2rem',
    color: '#111827',
  },
  grid3: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.25rem',
  },

  /* Why cards */
  whyCard: {
    padding: '1.5rem',
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '14px',
    textAlign: 'center',
  },
  whyIcon: {
    fontSize: '2rem',
    display: 'block',
    marginBottom: '0.75rem',
  },
  whyTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    marginBottom: '0.5rem',
    color: '#111827',
  },
  whyDesc: {
    fontSize: '0.875rem',
    color: '#6b7280',
    lineHeight: 1.55,
    margin: 0,
  },

  /* Module cards */
  moduleCard: {
    padding: '1.5rem',
    background: '#fff',
    border: '1.5px solid #e5e7eb',
    borderRadius: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  moduleCardSoon: {
    opacity: 0.55,
  },
  moduleTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moduleIcon: {
    fontSize: '1.75rem',
  },
  soonBadge: {
    fontSize: '0.7rem',
    fontWeight: '700',
    color: '#6b7280',
    background: '#f3f4f6',
    border: '1px solid #d1d5db',
    borderRadius: '999px',
    padding: '0.2rem 0.6rem',
  },
  activeBadge: {
    fontSize: '0.7rem',
    fontWeight: '700',
    color: '#16a34a',
    background: '#f0fdf4',
    border: '1px solid #86efac',
    borderRadius: '999px',
    padding: '0.2rem 0.6rem',
  },
  moduleTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
  },
  moduleDesc: {
    fontSize: '0.85rem',
    color: '#6b7280',
    lineHeight: 1.5,
    margin: 0,
    flexGrow: 1,
  },
  moduleBtn: {
    marginTop: '0.5rem',
    padding: '0.5rem 1rem',
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '7px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    alignSelf: 'flex-start',
  },

  /* Steps */
  steps: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
  },
  step: {
    display: 'flex',
    gap: '1.25rem',
    alignItems: 'flex-start',
    position: 'relative',
  },
  stepNumber: {
    flexShrink: 0,
    width: '2.5rem',
    height: '2.5rem',
    background: '#2563eb',
    color: '#fff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8rem',
    fontWeight: '800',
    zIndex: 1,
  },
  stepConnector: {
    position: 'absolute',
    left: '1.25rem',
    top: '2.5rem',
    width: '2px',
    height: 'calc(100% + 1rem)',
    background: '#e5e7eb',
    zIndex: 0,
  },
  stepContent: {
    paddingBottom: '2rem',
  },
  stepTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#111827',
    margin: '0.35rem 0 0.3rem',
  },
  stepDesc: {
    fontSize: '0.875rem',
    color: '#6b7280',
    lineHeight: 1.55,
    margin: 0,
  },

  /* Final CTA */
  ctaSection: {
    textAlign: 'center',
    padding: '2.5rem 1.5rem',
    background: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: '16px',
  },
  ctaTitle: {
    fontSize: '1.3rem',
    fontWeight: '800',
    color: '#1e3a8a',
    marginBottom: '1.5rem',
    lineHeight: 1.35,
  },
}
