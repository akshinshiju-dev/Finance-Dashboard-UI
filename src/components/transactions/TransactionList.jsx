import { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES, CATEGORY_COLORS } from '../../data/mockData';
import {
  ArrowUpDown, ArrowUp, ArrowDown,
  Edit2, Trash2, Plus, Download, Filter
} from 'lucide-react';
import TransactionModal from './TransactionModal';

const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const CATEGORY_ICONS = {
  'Housing': '🏠', 'Food & Dining': '🍔', 'Transportation': '🚗',
  'Entertainment': '🎬', 'Healthcare': '💊', 'Shopping': '🛍️',
  'Utilities': '⚡', 'Salary': '💼', 'Freelance': '💻', 'Investment': '📈',
};

const PER_PAGE = 10;

export default function TransactionList() {
  const { state, dispatch } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTx, setEditTx] = useState(null);
  const [page, setPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const { filters } = state;

  const filtered = useMemo(() => {
    let txs = [...state.transactions];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      txs = txs.filter(t =>
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    }
    if (filters.category !== 'all') txs = txs.filter(t => t.category === filters.category);
    if (filters.type !== 'all') txs = txs.filter(t => t.type === filters.type);

    // Sort
    txs.sort((a, b) => {
      let va = a[filters.sortBy], vb = b[filters.sortBy];
      if (filters.sortBy === 'date') { va = new Date(va); vb = new Date(vb); }
      if (filters.sortBy === 'amount') { va = Number(va); vb = Number(vb); }
      if (va < vb) return filters.sortOrder === 'asc' ? -1 : 1;
      if (va > vb) return filters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return txs;
  }, [state.transactions, filters]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const toggleSort = (col) => {
    if (filters.sortBy === col) {
      dispatch({ type: 'SET_FILTER', payload: { sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' } });
    } else {
      dispatch({ type: 'SET_FILTER', payload: { sortBy: col, sortOrder: 'desc' } });
    }
    setPage(1);
  };

  const SortIcon = ({ col }) => {
    if (filters.sortBy !== col) return <ArrowUpDown size={13} className="sort-icon" />;
    return filters.sortOrder === 'asc'
      ? <ArrowUp size={13} className="sort-icon" />
      : <ArrowDown size={13} className="sort-icon" />;
  };

  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    setConfirmDelete(null);
  };

  const exportCSV = () => {
    const header = 'Date,Description,Category,Type,Amount\n';
    const rows = filtered.map(t =>
      `${t.date},"${t.description}",${t.category},${t.type},${t.amount}`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'transactions.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const handleFilter = (key, val) => {
    dispatch({ type: 'SET_FILTER', payload: { [key]: val } });
    setPage(1);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Transactions</h1>
          <p style={{ marginTop: 4, fontSize: '0.85rem' }}>
            {filtered.length} transaction{filtered.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-ghost btn-sm" onClick={exportCSV} id="export-csv-btn">
            <Download size={15} /> Export CSV
          </button>
          {state.role === 'admin' && (
            <button className="btn btn-primary btn-sm" onClick={() => { setEditTx(null); setModalOpen(true); }} id="add-transaction-btn">
              <Plus size={15} /> Add Transaction
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <Filter size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        <div className="filter-group">
          <label>Type</label>
          <select className="filter-select" value={filters.type} onChange={e => handleFilter('type', e.target.value)} id="filter-type">
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Category</label>
          <select className="filter-select" value={filters.category} onChange={e => handleFilter('category', e.target.value)} id="filter-category">
            <option value="all">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Sort By</label>
          <select className="filter-select" value={filters.sortBy} onChange={e => handleFilter('sortBy', e.target.value)} id="filter-sort">
            <option value="date">Date</option>
            <option value="amount">Amount</option>
            <option value="description">Description</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Order</label>
          <select className="filter-select" value={filters.sortOrder} onChange={e => handleFilter('sortOrder', e.target.value)} id="filter-order">
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => dispatch({ type: 'RESET_FILTERS' })} id="reset-filters-btn">
          Reset
        </button>
      </div>

      {/* Table */}
      <div className="transactions-table-wrap">
        {paginated.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Filter size={28} />
            </div>
            <h3>No transactions found</h3>
            <p>Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <table className="transactions-table">
            <thead>
              <tr>
                <th onClick={() => toggleSort('date')} className={filters.sortBy === 'date' ? 'sorted' : ''}>
                  Date <SortIcon col="date" />
                </th>
                <th onClick={() => toggleSort('description')} className={filters.sortBy === 'description' ? 'sorted' : ''}>
                  Description <SortIcon col="description" />
                </th>
                <th>Category</th>
                <th>Type</th>
                <th onClick={() => toggleSort('amount')} className={filters.sortBy === 'amount' ? 'sorted' : ''}>
                  Amount <SortIcon col="amount" />
                </th>
                {state.role === 'admin' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {paginated.map((tx, i) => (
                <tr key={tx.id} className="animate-fade" style={{ animationDelay: `${i * 30}ms` }}>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {new Date(tx.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td>
                    <div className="transaction-desc">
                      <div
                        className="transaction-icon"
                        style={{ background: (CATEGORY_COLORS[tx.category] || '#6C63FF') + '22' }}
                      >
                        {CATEGORY_ICONS[tx.category] || '💰'}
                      </div>
                      <div>
                        <div className="transaction-name">{tx.description}</div>
                        <div className="transaction-cat">{tx.category}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge" style={{
                      background: (CATEGORY_COLORS[tx.category] || '#6C63FF') + '22',
                      color: CATEGORY_COLORS[tx.category] || '#6C63FF',
                    }}>
                      {tx.category}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${tx.type}`}>
                      {tx.type === 'income' ? '↑' : '↓'} {tx.type}
                    </span>
                  </td>
                  <td>
                    <span className={`amount-cell ${tx.type}`}>
                      {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
                    </span>
                  </td>
                  {state.role === 'admin' && (
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon" title="Edit" id={`edit-${tx.id}`}
                          onClick={() => { setEditTx(tx); setModalOpen(true); }}>
                          <Edit2 size={14} />
                        </button>
                        {confirmDelete === tx.id ? (
                          <>
                            <button className="btn btn-danger btn-sm" id={`confirm-delete-${tx.id}`}
                              onClick={() => handleDelete(tx.id)}>Confirm</button>
                            <button className="btn btn-ghost btn-sm" onClick={() => setConfirmDelete(null)}>Cancel</button>
                          </>
                        ) : (
                          <button className="btn-icon" title="Delete" id={`delete-${tx.id}`}
                            onClick={() => setConfirmDelete(tx.id)} style={{ color: 'var(--expense)' }}>
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <span className="pagination-info">
              Showing {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
            </span>
            <div className="pagination-btns">
              <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)} id="prev-page">‹</button>
              {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                const p = i + 1;
                return (
                  <button key={p} className={`page-btn ${page === p ? 'active' : ''}`}
                    onClick={() => setPage(p)} id={`page-${p}`}>{p}</button>
                );
              })}
              <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)} id="next-page">›</button>
            </div>
          </div>
        )}
      </div>

      {modalOpen && (
        <TransactionModal
          transaction={editTx}
          onClose={() => { setModalOpen(false); setEditTx(null); }}
        />
      )}
    </div>
  );
}
