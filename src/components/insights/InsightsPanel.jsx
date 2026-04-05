import { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORY_COLORS, MONTHS } from '../../data/mockData';
import { Bar } from 'react-chartjs-2';
import {
  TrendingUp, TrendingDown, Award, AlertCircle,
  Target, PiggyBank, Activity, DollarSign
} from 'lucide-react';

const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export default function InsightsPanel() {
  const { state } = useApp();
  const isDark = state.theme === 'dark';

  const stats = useMemo(() => {
    const txs = state.transactions;

    // Category map (expenses only)
    const catMap = {};
    txs.filter(t => t.type === 'expense').forEach(t => {
      catMap[t.category] = (catMap[t.category] || 0) + t.amount;
    });
    const catSorted = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
    const top = catSorted[0];
    const totalExpense = catSorted.reduce((s, [, v]) => s + v, 0);
    const totalIncome  = txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);

    // Monthly buckets
    const monthly = {};
    txs.forEach(t => {
      const m = new Date(t.date).getMonth();
      if (!monthly[m]) monthly[m] = { income: 0, expense: 0, count: 0 };
      monthly[m][t.type] += t.amount;
      monthly[m].count++;
    });

    const monthKeys = Object.keys(monthly).map(Number).sort();
    let maxSavings = 0, maxSavingsMonth = 0;
    let maxSpend = 0, maxSpendMonth = 0;
    let totalMonthlySavings = 0;
    monthKeys.forEach(m => {
      const savings = monthly[m].income - monthly[m].expense;
      totalMonthlySavings += savings;
      if (savings > maxSavings) { maxSavings = savings; maxSavingsMonth = m; }
      if (monthly[m].expense > maxSpend) { maxSpend = monthly[m].expense; maxSpendMonth = m; }
    });

    const lastTwo = monthKeys.slice(-2);
    let monthlyChange = 0;
    if (lastTwo.length === 2) {
      const prev = monthly[lastTwo[0]]?.expense || 0;
      const curr = monthly[lastTwo[1]]?.expense || 0;
      monthlyChange = prev > 0 ? (((curr - prev) / prev) * 100).toFixed(1) : 0;
    }

    // Monthly bar chart data
    const incomeByMonth  = new Array(6).fill(0);
    const expenseByMonth = new Array(6).fill(0);
    txs.forEach(t => {
      const m = new Date(t.date).getMonth();
      if (m < 6) {
        if (t.type === 'income')  incomeByMonth[m]  += t.amount;
        if (t.type === 'expense') expenseByMonth[m] += t.amount;
      }
    });

    const avgMonthlyExpense = expenseByMonth.filter(v => v > 0).reduce((a, b) => a + b, 0) /
                               (expenseByMonth.filter(v => v > 0).length || 1);
    const incomeExpenseRatio = totalExpense > 0 ? (totalIncome / totalExpense).toFixed(2) : '∞';
    const savingsRate = totalIncome > 0 ? ((totalMonthlySavings / totalIncome) * 100).toFixed(1) : 0;

    return {
      topCategory: top ? top[0] : 'N/A',
      topAmount: top ? top[1] : 0,
      topPercent: top && totalExpense ? ((top[1] / totalExpense) * 100).toFixed(1) : 0,
      catSorted,
      totalExpense,
      totalIncome,
      totalTransactions: txs.length,
      maxSavings,
      maxSavingsMonth,
      maxSpendMonth,
      monthlyChange: Number(monthlyChange),
      incomeByMonth,
      expenseByMonth,
      avgMonthlyExpense,
      incomeExpenseRatio,
      savingsRate: Number(savingsRate),
    };
  }, [state.transactions]);

  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const tickColor = isDark ? '#50596A' : '#8892A4';

  const barData = {
    labels: MONTHS,
    datasets: [
      {
        label: 'Income',
        data: stats.incomeByMonth,
        backgroundColor: 'rgba(81,207,102,0.82)',
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: 'Expenses',
        data: stats.expenseByMonth,
        backgroundColor: 'rgba(255,107,107,0.82)',
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? '#1A1E2A' : '#fff',
        titleColor: isDark ? '#F0F2F8' : '#0D0F14',
        bodyColor: isDark ? '#8892A4' : '#4A5568',
        borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: (ctx) => ` ${ctx.dataset.label}: ₹${ctx.raw.toLocaleString('en-IN')}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: { color: tickColor, font: { family: 'Inter', size: 11 } },
        border: { display: false },
      },
      y: {
        grid: { color: gridColor },
        ticks: {
          color: tickColor,
          font: { family: 'Inter', size: 11 },
          callback: (v) => `₹${(v / 1000).toFixed(0)}k`,
        },
        border: { display: false },
      },
    },
  };

  const insightCards = [
    {
      id: 'top-cat',
      icon: Award,
      iconBg: 'var(--warning-bg)',
      iconColor: 'var(--warning)',
      label: 'Top Expense Category',
      value: stats.topCategory,
      sub: `${fmt(stats.topAmount)} · ${stats.topPercent}% of expenses`,
    },
    {
      id: 'monthly-change',
      icon: stats.monthlyChange >= 0 ? TrendingUp : TrendingDown,
      iconBg: stats.monthlyChange >= 0 ? 'var(--expense-bg)' : 'var(--income-bg)',
      iconColor: stats.monthlyChange >= 0 ? 'var(--expense)' : 'var(--income)',
      label: 'Monthly Expense Change',
      value: `${stats.monthlyChange >= 0 ? '+' : ''}${stats.monthlyChange}%`,
      sub: 'vs previous month',
    },
    {
      id: 'best-savings',
      icon: Target,
      iconBg: 'var(--income-bg)',
      iconColor: 'var(--income)',
      label: 'Best Savings Month',
      value: MONTHS[stats.maxSavingsMonth],
      sub: `Saved ${fmt(stats.maxSavings)} that month`,
    },
    {
      id: 'avg-expense',
      icon: Activity,
      iconBg: 'rgba(108,99,255,0.12)',
      iconColor: 'var(--accent)',
      label: 'Avg Monthly Expense',
      value: fmt(stats.avgMonthlyExpense),
      sub: 'Average over tracked months',
    },
    {
      id: 'income-ratio',
      icon: DollarSign,
      iconBg: 'var(--teal-glow)',
      iconColor: 'var(--teal)',
      label: 'Income / Expense Ratio',
      value: `${stats.incomeExpenseRatio}×`,
      sub: stats.incomeExpenseRatio >= 1.2 ? '✅ Healthy surplus ratio' : '⚠️ Keep expenses lower',
    },
    {
      id: 'savings-rate',
      icon: PiggyBank,
      iconBg: 'rgba(255,166,77,0.12)',
      iconColor: '#FFA94D',
      label: 'Overall Savings Rate',
      value: `${stats.savingsRate}%`,
      sub: stats.savingsRate >= 20 ? '💪 Above 20% — excellent!' : 'Aim for 20%+ savings rate',
    },
  ];

  const maxCat = stats.catSorted[0]?.[1] || 1;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Insights</h1>
          <p style={{ marginTop: 4, fontSize: '0.85rem' }}>
            Understand your financial patterns — {stats.totalTransactions} transactions analysed
          </p>
        </div>
      </div>

      {/* 6 Insight Cards */}
      <div className="insights-grid" style={{ marginBottom: 24 }}>
        {insightCards.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="insight-card animate-fade" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="insight-card-icon" style={{ background: item.iconBg, color: item.iconColor }}>
                <Icon size={20} />
              </div>
              <div>
                <div className="insight-card-label">{item.label}</div>
                <div className="insight-card-value">{item.value}</div>
                <div className="insight-card-sub">{item.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Monthly Comparison Bar Chart */}
      <div className="chart-card" style={{ marginBottom: 24 }}>
        <div className="chart-card-header">
          <div>
            <h3>Monthly Comparison</h3>
            <p>Income vs Expenses — Jan to Jun 2025</p>
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-dot" style={{ background: '#51CF66' }} />Income
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: '#FF6B6B' }} />Expenses
            </div>
          </div>
        </div>
        <div style={{ height: 260 }}>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="card">
        <div style={{ marginBottom: 20 }}>
          <h3>Spending by Category</h3>
          <p style={{ fontSize: '0.82rem', marginTop: 4 }}>
            Distribution across {stats.catSorted.length} expense categories
          </p>
        </div>
        <div className="category-bar-list">
          {stats.catSorted.map(([cat, amt]) => (
            <div key={cat} className="category-bar-item">
              <div className="category-bar-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      width: 10, height: 10, borderRadius: '50%',
                      background: CATEGORY_COLORS[cat] || 'var(--accent)', flexShrink: 0
                    }}
                  />
                  <span className="category-bar-name">{cat}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {((amt / stats.totalExpense) * 100).toFixed(1)}%
                  </span>
                  <span className="category-bar-amount">{fmt(amt)}</span>
                </div>
              </div>
              <div className="category-bar-track">
                <div
                  className="category-bar-fill"
                  style={{
                    width: `${(amt / maxCat) * 100}%`,
                    background: CATEGORY_COLORS[cat] || 'var(--accent)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
