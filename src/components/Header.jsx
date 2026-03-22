import { useLocation, useNavigate } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'Accueil', path: '/' },
  { label: 'Modes',   path: '/modes' },
  { label: 'Niveaux', path: '/levels' },
  { label: 'Profil',  path: '/profile' },
]

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()

  // Pages immersives : pas de header
  if (location.pathname.startsWith('/challenge') || location.pathname === '/results' || location.pathname === '/speed' || location.pathname === '/reconstruct') {
    return null
  }

  return (
    <header style={styles.header}>
      <div style={styles.inner}>
        <button onClick={() => navigate('/')} style={styles.brand}>
          ⚡ Vibebug
        </button>
        <nav style={styles.nav}>
          {NAV_LINKS.map(({ label, path }) => {
            const active = location.pathname === path
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                style={{ ...styles.link, ...(active ? styles.linkActive : {}) }}
              >
                {label}
                {active && <span style={styles.dot} />}
              </button>
            )
          })}
        </nav>
      </div>
    </header>
  )
}

const styles = {
  header: {
    borderBottom: '1px solid #e5e7eb',
    background: '#fff',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  inner: {
    maxWidth: '860px',
    margin: '0 auto',
    padding: '0 1rem',
    height: '52px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    background: 'none',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '800',
    color: '#2563eb',
    cursor: 'pointer',
    fontFamily: 'system-ui, sans-serif',
    padding: 0,
    letterSpacing: '-0.01em',
  },
  nav: {
    display: 'flex',
    gap: '0.25rem',
  },
  link: {
    position: 'relative',
    background: 'none',
    border: 'none',
    padding: '0.4rem 0.75rem',
    borderRadius: '7px',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#6b7280',
    cursor: 'pointer',
    fontFamily: 'system-ui, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
  },
  linkActive: {
    color: '#2563eb',
    fontWeight: '700',
    background: '#eff6ff',
  },
  dot: {
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    background: '#2563eb',
  },
}
