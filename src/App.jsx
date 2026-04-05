import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import InsightsPage from './pages/InsightsPage';
import AuthPage from './pages/AuthPage';
import './styles/global.css';
import './styles/layout.css';
import './styles/components.css';

function AppShell() {
  const { state, dispatch } = useApp();
  const { currentUser, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sync role from logged-in user into app state
  useEffect(() => {
    if (currentUser?.role && currentUser.role !== state.role) {
      dispatch({ type: 'SET_ROLE', payload: currentUser.role });
    }
  }, [currentUser]);

  const renderPage = () => {
    switch (state.activePage) {
      case 'transactions': return <TransactionsPage />;
      case 'insights':     return <InsightsPage />;
      default:             return <DashboardPage />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          currentUser={currentUser}
          onLogout={logout}
        />
        <main className="page-content">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

function AppGate() {
  const { currentUser } = useAuth();
  if (!currentUser) return <AuthPage />;
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppGate />
    </AuthProvider>
  );
}
