import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import SummaryCards from '../components/dashboard/SummaryCards';
import BalanceTrendChart from '../components/dashboard/BalanceTrendChart';
import SpendingChart from '../components/dashboard/SpendingChart';
import MonthlyBarChart from '../components/dashboard/MonthlyBarChart';
import { CATEGORY_COLORS } from '../data/mockData';
import { ArrowRight, Clock, ShieldCheck, Eye } from 'lucide-react';

const CATEGORY_ICONS = {
  'Housing': '🏠', 'Food & Dining': '🍔', 'Transportation': '🚗',
  'Entertainment': '🎬', 'Healthcare': '💊', 'Shopping': '🛍️',
  'Utilities': '⚡', 'Salary': '💼', 'Freelance': '💻', 'Investment': '📈',
};

const fmt = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export default function DashboardPage() {
  const { state, dispatch } = useApp();

  const recent = useMemo(() => {
    return [...state.transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 8);
  }, [state.transactions]);

  return (
    <div>
      {/* Role Banner */}
      {state.role === 'admin' ? (
        <div className="role-banner role-banner-admin animate-fade">
          <ShieldCheck size={15} />
          <span><strong>Admin Mode</strong> — You can add, edit, and delete transactions via the Transactions page.</span>
        </div>
      ) : (
        <div className="role-banner role-banner-viewer animate-fade">
          <Eye size={15} />
          <span><strong>Viewer Mode</strong> — Read-only access. Switch to Admin in the sidebar to make changes.</span>
        </div>
      )}

      {/* Summary Cards */}
      <SummaryCards />

      {/* Charts Row 1: Line + Donut */}
      <div className="charts-grid" style={{ marginBottom: 20 }}>
        <BalanceTrendChart />
        <SpendingChart />
      </div>

      {/* Charts Row 2: Monthly Bar (full width) */}
      <MonthlyBarChart />

      {/* Recent Transactions */}
      <div className="card animate-fade" style={{ animationDelay: '250ms', marginTop: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={17} style={{ color: 'var(--accent)' }} /> Recent Transactions
            </h3>
            <p style={{ fontSize: '0.78rem', marginTop: 4 }}>Latest 8 entries across all categories</p>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => dispatch({ type: 'SET_PAGE', payload: 'transactions' })}
            id="view-all-btn"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            View All <ArrowRight size={13} />
          </button>
        </div>

        <div className="recent-list">
          {recent.map((tx) => (
            <div key={tx.id} className="recent-item">
              <div
                className="transaction-icon"
                style={{ background: (CATEGORY_COLORS[tx.category] || '#6C63FF') + '22', borderRadius: 10 }}
              >
                {CATEGORY_ICONS[tx.category] || '💰'}
              </div>
              <div className="recent-item-info">
                <div className="recent-item-name">{tx.description}</div>
                <div className="recent-item-cat">{tx.category}</div>
              </div>
              <div className="recent-item-right">
                <div className={`recent-item-amount ${tx.type === 'income' ? 'text-income' : 'text-expense'}`}>
                  {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
                </div>
                <div className="recent-item-date">
                  {new Date(tx.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
