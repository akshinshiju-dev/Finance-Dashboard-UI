import { useState } from 'react';
import { Sun, Moon, Search, LogOut, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const PAGE_TITLES = {
  dashboard:    { title: 'Dashboard',    sub: 'Welcome back' },
  transactions: { title: 'Transactions', sub: 'Manage your financial activity' },
  insights:     { title: 'Insights',     sub: 'Understand your spending patterns' },
};

export default function Header({ onMenuClick, currentUser, onLogout }) {
  const { state, dispatch } = useApp();
  const { title, sub } = PAGE_TITLES[state.activePage] || PAGE_TITLES.dashboard;
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleTheme = () => {
    dispatch({ type: 'SET_THEME', payload: state.theme === 'dark' ? 'light' : 'dark' });
  };

  const handleSearch = (e) => {
    dispatch({ type: 'SET_FILTER', payload: { search: e.target.value } });
    if (state.activePage !== 'transactions') {
      dispatch({ type: 'SET_PAGE', payload: 'transactions' });
    }
  };

  // Build initials from name
  const initials = currentUser?.name
    ? currentUser.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  const greeting = state.activePage === 'dashboard'
    ? `${sub}, ${currentUser?.name?.split(' ')[0] || 'there'} 👋`
    : sub;

  return (
    <header className="header">
      <button className="hamburger" onClick={onMenuClick} id="hamburger-btn" aria-label="Open menu">
        <span /><span /><span />
      </button>

      <div className="header-title">
        <h2>{title}</h2>
        <p>{greeting}</p>
      </div>

      <div className="header-search">
        <Search size={15} className="search-icon" />
        <input
          id="global-search"
          type="text"
          placeholder="Search transactions..."
          value={state.filters.search}
          onChange={handleSearch}
        />
      </div>

      <div className="header-actions">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          id="theme-toggle-btn"
          title={state.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {state.theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* User menu */}
        <div className="header-user-menu" style={{ position: 'relative' }}>
          <button
            className="header-user-btn"
            onClick={() => setMenuOpen((o) => !o)}
            id="user-menu-btn"
            title={currentUser?.name}
          >
            <div className="header-avatar">{initials}</div>
            <div className="header-user-info">
              <span className="header-user-name">{currentUser?.name || 'User'}</span>
              <span className="header-user-role">{currentUser?.role || 'viewer'}</span>
            </div>
            <ChevronDown size={14} style={{ opacity: 0.5, transition: 'transform 0.2s', transform: menuOpen ? 'rotate(180deg)' : 'none' }} />
          </button>

          {menuOpen && (
            <div className="header-dropdown animate-fade">
              <div className="header-dropdown-info">
                <div className="header-dropdown-avatar">{initials}</div>
                <div>
                  <div className="header-dropdown-name">{currentUser?.name}</div>
                  <div className="header-dropdown-email">{currentUser?.email}</div>
                  <span className={`badge badge-${currentUser?.role === 'admin' ? 'accent' : 'warning'}`} style={{ marginTop: 4 }}>
                    {currentUser?.role}
                  </span>
                </div>
              </div>
              <div className="divider" style={{ margin: '8px 0' }} />
              <button
                className="header-dropdown-item header-dropdown-logout"
                id="logout-btn"
                onClick={() => { setMenuOpen(false); onLogout(); }}
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
