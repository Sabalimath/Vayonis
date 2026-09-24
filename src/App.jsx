import { Navigate, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import AccountsPage from './pages/AccountsPage.jsx'
import CreatePage from './pages/CreatePage.jsx'
import CalendarPage from './pages/CalendarPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import OnboardingPage from './pages/OnboardingPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import MainLayout from './layouts/MainLayout.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import { AppProvider } from './state/AppContext.jsx'
import { AuthProvider } from './state/AuthContext.jsx'

const routes = [
  { path: '/', label: 'Accueil' },
  { path: '/login', label: 'Connexion' },
  { path: '/register', label: 'Inscription' },
  { path: '/onboarding', label: 'Onboarding' },
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/accounts', label: 'Comptes' },
  { path: '/create', label: 'Créer' },
  { path: '/calendar', label: 'Calendrier' },
]

function Placeholder({ label }) {
  return (
    <div className="placeholder">
      <p className="eyebrow">Vayonis</p>
      <h1>{label}</h1>
      <p>Cette page sera construite dans une prochaine étape.</p>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/accounts" element={<AccountsPage />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/calendar" element={<CalendarPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppProvider>
    </AuthProvider>
  )
}

export default App