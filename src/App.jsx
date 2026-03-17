import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LevelsPage from './pages/LevelsPage'
import ChallengePage from './pages/ChallengePage'
import ResultsPage from './pages/ResultsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/levels" element={<LevelsPage />} />
        <Route path="/challenge/:levelId" element={<ChallengePage />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
