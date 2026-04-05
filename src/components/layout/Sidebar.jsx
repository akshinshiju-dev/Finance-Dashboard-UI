import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard, Receipt, Lightbulb,
  TrendingUp, ChevronRight, ShieldCheck, Eye
} from 'lucide-react';

export default function Sidebar({ mobileOpen, onClose }) {
  const { state, dispatch } = useApp();

  const navigate = (page) => {
    dispatch({ type: 'SET_PAGE', payload: page });
    onClose?.();
  };

  const setRole = (e) => {
    dispatch({ type: 'SET_ROLE', payload: e.target.value });
  };

  const txCount = state.transactions.length;

  const NAV_ITEMS = [
    { id: 'dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: Receipt, badge: txCount },
    { id: 'insights',     label: 'Insights',     icon: Lightbulb },
  ];

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${mobileOpen ? 'open' : ''}`}
        onClick={onClose}
      />

      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-header">
          <div className="logo-icon">
            <TrendingUp size={20} color="#fff" />
          </div>
          <div className="logo-text">
            <span className="logo-name">FinFlow</span>
            <span className="logo-tagline">Finance Dashboard</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          <span className="nav-section-label">Main Menu</span>
          {NAV_ITEMS.map(({ id, label, icon: Icon, badge }) => (
            <button
              key={id}
              className={`nav-item ${state.activePage === id ? 'active' : ''}`}
              onClick={() => navigate(id)}
              id={`nav-${id}`}
            >
              <Icon size={18} className="nav-icon" />
              {label}
              {badge !== undefined && (
                <span className="nav-badge">{badge}</span>
              )}
              {state.activePage === id && !badge && (
                <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.6 }} />
              )}
            </button>
          ))}
        </nav>

        {/* Footer: Role Selector */}
        <div className="sidebar-footer">
          <div className="role-selector">
            <span className="role-label">Access Role</span>
            <select
              className="role-select"
              value={state.role}
              onChange={setRole}
              id="role-selector"
            >
              <option value="viewer">👁️ Viewer</option>
              <option value="admin">🛡️ Admin</option>
            </select>
            <div className={`role-badge ${state.role}`}>
              {state.role === 'admin'
                ? <><ShieldCheck size={11} /> Administrator</>
                : <><Eye size={11} /> View Only</>
              }
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
