import { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { X, TrendingUp, TrendingDown } from 'lucide-react';
import { CATEGORIES } from '../../data/mockData';

const generateId = () => Math.random().toString(36).substr(2, 9);

const empty = {
  description: '', category: 'Food & Dining',
  type: 'expense', amount: '', date: new Date().toISOString().split('T')[0],
};

export default function TransactionModal({ transaction, onClose }) {
  const { dispatch } = useApp();
  const isEdit = Boolean(transaction);
  const [form, setForm] = useState(isEdit ? { ...transaction, amount: String(transaction.amount) } : empty);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      errs.amount = 'Enter a valid positive amount';
    if (!form.date) errs.date = 'Date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = { ...form, amount: Number(form.amount), id: isEdit ? transaction.id : generateId() };
    dispatch({ type: isEdit ? 'EDIT_TRANSACTION' : 'ADD_TRANSACTION', payload });
    onClose();
  };

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    if (errors[key]) setErrors(e => { const n = { ...e }; delete n[key]; return n; });
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>{isEdit ? '✏️ Edit Transaction' : '➕ Add Transaction'}</h3>
          <button className="btn-icon" onClick={onClose} id="close-modal-btn"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Type Toggle */}
            <div className="form-group">
              <label className="form-label">Type</label>
              <div className="type-toggle">
                <button
                  type="button"
                  className={`type-btn ${form.type === 'income' ? 'active-income' : ''}`}
                  onClick={() => set('type', 'income')}
                  id="type-income-btn"
                >
                  <TrendingUp size={15} /> Income
                </button>
                <button
                  type="button"
                  className={`type-btn ${form.type === 'expense' ? 'active-expense' : ''}`}
                  onClick={() => set('type', 'expense')}
                  id="type-expense-btn"
                >
                  <TrendingDown size={15} /> Expense
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Description</label>
              <input
                id="tx-description"
                className={`form-input ${errors.description ? 'is-error' : ''}`}
                placeholder="e.g. Grocery Shopping"
                value={form.description}
                onChange={e => set('description', e.target.value)}
                style={errors.description ? { borderColor: 'var(--expense)' } : {}}
              />
              {errors.description && <span style={{ color: 'var(--expense)', fontSize: '0.75rem' }}>{errors.description}</span>}
            </div>

            {/* Amount + Date in grid */}
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Amount (₹)</label>
                <input
                  id="tx-amount"
                  className="form-input"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="0"
                  value={form.amount}
                  onChange={e => set('amount', e.target.value)}
                  style={errors.amount ? { borderColor: 'var(--expense)' } : {}}
                />
                {errors.amount && <span style={{ color: 'var(--expense)', fontSize: '0.75rem' }}>{errors.amount}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  id="tx-date"
                  className="form-input"
                  type="date"
                  value={form.date}
                  onChange={e => set('date', e.target.value)}
                  style={errors.date ? { borderColor: 'var(--expense)' } : {}}
                />
              </div>
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                id="tx-category"
                className="form-select"
                value={form.category}
                onChange={e => set('category', e.target.value)}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose} id="cancel-btn">Cancel</button>
            <button type="submit" className="btn btn-primary" id="submit-tx-btn">
              {isEdit ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
