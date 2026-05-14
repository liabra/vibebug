import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ModesPage from './pages/ModesPage'
import ReconstructPage from './pages/ReconstructPage'
import LevelsPage from './pages/LevelsPage'
import AutoLevelsPage from './pages/AutoLevelsPage'
import NetworkLevelsPage from './pages/NetworkLevelsPage'
import SpeedDebugPage from './pages/SpeedDebugPage'
import ChallengePage from './pages/ChallengePage'
import ResultsPage from './pages/ResultsPage'
import ProfilePage from './pages/ProfilePage'
import FormationsPage from './pages/FormationsPage'
import FormationDetailPage from './pages/FormationDetailPage'
import FormationQuizPage from './pages/FormationQuizPage'
import Header from './components/Header'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/modes" element={<ModesPage />} />
        <Route path="/levels" element={<LevelsPage />} />
        <Route path="/auto-levels" element={<AutoLevelsPage />} />
        <Route path="/network-levels" element={<NetworkLevelsPage />} />
        <Route path="/challenge/:levelId" element={<ChallengePage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/speed" element={<SpeedDebugPage />} />
        <Route path="/reconstruct" element={<ReconstructPage />} />
        <Route path="/formations" element={<FormationsPage />} />
        <Route path="/formations/:id" element={<FormationDetailPage />} />
        <Route path="/formations/:id/quiz" element={<FormationQuizPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
