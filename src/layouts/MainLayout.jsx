import { useState } from 'react'
import {
  BarChart3,
  Bell,
  CalendarDays,
  ChevronRight,
  FilePlus2,
  LogOut,
  Menu,
  Settings,
  UsersRound,
  X,
} from 'lucide-react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Avatar } from '../components/index.js'
import { useAuth } from '../state/AuthContext.jsx'

const navigationItems = [
  { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { path: '/accounts', label: 'Comptes sociaux', icon: UsersRound },
  { path: '/create', label: 'Créer une publication', icon: FilePlus2 },
  { path: '/calendar', label: 'Calendrier', icon: CalendarDays },
]

const pageTitles = Object.fromEntries(navigationItems.map((item) => [item.path, item.label]))

function Logo() {
  return (
    <NavLink className="main-layout-logo" to="/dashboard" aria-label="Vayonis, dashboard">
      <span className="logo-mark">V</span>
      <span>Vayonis</span>
    </NavLink>
  )
}

function Navigation({ onNavigate }) {
  return (
    <nav className="main-layout-navigation" aria-label="Navigation de l'espace connecté">
      <p className="main-layout-nav-label">Espace de travail</p>
      {navigationItems.map(({ path, label, icon: Icon }) => (
        <NavLink
          className={({ isActive }) => `main-layout-nav-link ${isActive ? 'is-active' : ''}`}
          key={path}
          to={path}
          onClick={onNavigate}
        >
          <Icon size={19} strokeWidth={1.8} />
          <span>{label}</span>
          <ChevronRight className="main-layout-nav-arrow" size={15} />
        </NavLink>
      ))}
    </nav>
  )
}

function UserBlock({ user, onNavigate, onLogout }) {
  const displayName = user?.name || 'Votre espace'
  const displayEmail = user?.email || 'Compte Vayonis'

  return (
    <div className="main-layout-bottom">
      <div className="main-layout-user">
        <Avatar name={displayName} size="md" />
        <span><strong>{displayName}</strong><small>{displayEmail}</small></span>
      </div>
      <div className="main-layout-account-links">
        <button type="button" onClick={onNavigate}><Settings size={17} /> Paramètres</button>
        <button type="button" onClick={onLogout}><LogOut size={17} /> Déconnexion</button>
      </div>
    </div>
  )
}

function Sidebar({ mobile = false, onClose, onLogout }) {
  const { user } = useAuth()

  return (
    <aside className={`main-layout-sidebar ${mobile ? 'main-layout-sidebar-mobile' : ''}`} aria-label="Menu de l'espace connecté">
      <div className="main-layout-sidebar-top">
        <div className="main-layout-sidebar-heading">
          <Logo />
          {mobile && <button className="main-layout-close" type="button" aria-label="Fermer le menu" onClick={onClose}><X size={20} /></button>}
        </div>
        <Navigation onNavigate={onClose} />
      </div>
      <UserBlock user={user} onNavigate={onClose} onLogout={onLogout} />
    </aside>
  )
}

function MainLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const title = pageTitles[location.pathname] || 'Vayonis'
  const { user, logout } = useAuth()
  const displayName = user?.name || 'Votre espace'
  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="main-layout">
      <Sidebar onLogout={handleLogout} />
      {mobileOpen && <button className="main-layout-overlay" type="button" aria-label="Fermer le menu" onClick={() => setMobileOpen(false)} />}
      {mobileOpen && <Sidebar mobile onClose={() => setMobileOpen(false)} onLogout={handleLogout} />}
      <div className="main-layout-frame">
        <header className="main-layout-header">
          <div className="main-layout-header-leading">
            <button className="main-layout-menu-button" type="button" aria-label="Ouvrir le menu" aria-expanded={mobileOpen} onClick={() => setMobileOpen(true)}><Menu size={21} /></button>
            <div><p className="main-layout-header-kicker">Espace de travail</p><h1>{title}</h1></div>
          </div>
          <div className="main-layout-header-actions">
            <button className="main-layout-icon-button" type="button" aria-label="Voir les notifications"><Bell size={19} /><span className="notification-dot" /></button>
            <div className="main-layout-header-user"><Avatar name={displayName} size="sm" /><span>{displayName}</span></div>
          </div>
        </header>
        <main className="main-layout-content"><Outlet /></main>
      </div>
    </div>
  )
}

export default MainLayout
