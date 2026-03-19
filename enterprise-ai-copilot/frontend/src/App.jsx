import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Topbar from './components/Topbar.jsx'
import LoadingScreen from './components/LoadingScreen.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ChatPage from './pages/ChatPage.jsx'
import ScenariosPage from './pages/ScenariosPage.jsx'
import ReportsPage from './pages/ReportsPage.jsx'
import ExpertsPage from './pages/ExpertsPage.jsx'

const PAGES = {
  dashboard: { label: 'Dashboard',           component: Dashboard },
  chat:      { label: 'AI Copilot Chat',      component: ChatPage },
  scenarios: { label: 'Scenario Simulation',  component: ScenariosPage },
  reports:   { label: 'Strategic Reports',    component: ReportsPage },
  experts:   { label: 'Expert Roster',        component: ExpertsPage },
}

// Auth states: 'login' | 'signup' | 'loading' | 'app'
export default function App() {
  const [authState,   setAuthState]   = useState('login')
  const [user,        setUser]        = useState(null)
  const [activePage,  setActivePage]  = useState('dashboard')

  // Check remembered login on mount
  useEffect(() => {
    const saved = localStorage.getItem('ai_copilot_user')
    if (saved) {
      try {
        const u = JSON.parse(saved)
        if (u?.remember) { setUser(u); setAuthState('loading') }
      } catch {}
    }
  }, [])

  function handleLogin(u) {
    setUser(u)
    setAuthState('loading')
  }

  function handleSignup(u) {
    setUser(u)
    setAuthState('loading')
  }

  function handleLogout() {
    localStorage.removeItem('ai_copilot_user')
    setUser(null)
    setAuthState('login')
    setActivePage('dashboard')
  }

  if (authState === 'login')
    return <LoginPage onLogin={handleLogin} onGoSignup={() => setAuthState('signup')} />

  if (authState === 'signup')
    return <SignupPage onSignup={handleSignup} onGoLogin={() => setAuthState('login')} />

  if (authState === 'loading')
    return <LoadingScreen user={user} onDone={() => setAuthState('app')} />

  const PageComponent = PAGES[activePage]?.component || Dashboard

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Topbar
          title={PAGES[activePage]?.label || 'Dashboard'}
          user={user}
          onNewSession={() => setActivePage('chat')}
          onLogout={handleLogout}
        />
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <PageComponent onNavigate={setActivePage} />
        </div>
      </div>
    </div>
  )
}
