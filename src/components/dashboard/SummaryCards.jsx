import { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Wallet, TrendingUp, TrendingDown, PiggyBank, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export default function SummaryCards() {
  const { state } = useApp();

  const stats = useMemo(() => {
    const totalIncome  = state.transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpense = state.transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const balance      = totalIncome - totalExpense;
    const savingsRate  = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;
    return { totalIncome, totalExpense, balance, savingsRate };
  }, [state.transactions]);

  const cards = [
    {
      key: 'balance', label: 'Total Balance', value: fmt(stats.balance),
      icon: Wallet, change: '+2.4%', positive: true,
      sub: 'vs last month',
    },
    {
      key: 'income', label: 'Total Income', value: fmt(stats.totalIncome),
      icon: TrendingUp, change: '+8.1%', positive: true,
      sub: 'vs last month',
    },
    {
      key: 'expense', label: 'Total Expenses', value: fmt(stats.totalExpense),
      icon: TrendingDown, change: '+3.2%', positive: false,
      sub: 'vs last month',
    },
    {
      key: 'savings', label: 'Savings Rate', value: `${stats.savingsRate}%`,
      icon: PiggyBank, change: `${stats.savingsRate}%`, positive: Number(stats.savingsRate) > 20,
      sub: 'of total income',
      savingsRate: Number(stats.savingsRate),
    },
  ];

  return (
    <div className="summary-cards">
      {cards.map((card, i) => {
        const Icon = card.icon;
        const ChangeIcon = card.positive ? ArrowUpRight : ArrowDownRight;
        return (
          <div
            key={card.key}
            className={`summary-card ${card.key} animate-fade`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="card-header-row">
              <span className="card-label">{card.label}</span>
              <div className={`card-icon ${card.key}`}>
                <Icon size={18} />
              </div>
            </div>
            <div className="card-value">{card.value}</div>
            <div className={`card-change ${card.positive ? 'positive' : 'negative'}`}>
              <ChangeIcon size={13} />
              {card.change}
              <span>{card.sub}</span>
            </div>
            {card.key === 'savings' && (
              <div className="savings-bar">
                <div className="savings-bar-fill" style={{ width: `${Math.min(card.savingsRate, 100)}%` }} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
