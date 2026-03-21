import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LevelsPage from './pages/LevelsPage'
import AutoLevelsPage from './pages/AutoLevelsPage'
import ChallengePage from './pages/ChallengePage'
import ResultsPage from './pages/ResultsPage'
import ProfilePage from './pages/ProfilePage'
import Header from './components/Header'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/levels" element={<LevelsPage />} />
        <Route path="/auto-levels" element={<AutoLevelsPage />} />
        <Route path="/challenge/:levelId" element={<ChallengePage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
