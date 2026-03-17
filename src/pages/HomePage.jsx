import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>VibeBug</h1>
      <p style={styles.subtitle}>Testez vos connaissances Bash</p>
      <button onClick={() => navigate('/levels')} style={styles.btn}>
        Commencer
      </button>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80vh',
    fontFamily: 'system-ui, sans-serif',
    textAlign: 'center',
    padding: '1rem',
  },
  title: {
    fontSize: '3rem',
    fontWeight: '800',
    color: '#111827',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '1.15rem',
    color: '#6b7280',
    marginBottom: '2rem',
  },
  btn: {
    padding: '0.875rem 2rem',
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    fontWeight: '600',
  },
}
