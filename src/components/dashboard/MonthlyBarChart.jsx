import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { useApp } from '../../context/AppContext';
import { MONTHS } from '../../data/mockData';

const fmt = (n) => `₹${(n / 1000).toFixed(0)}k`;

export default function MonthlyBarChart() {
  const { state } = useApp();
  const isDark = state.theme === 'dark';

  const { incomeData, expenseData, savings } = useMemo(() => {
    const monthlyIncome  = new Array(6).fill(0);
    const monthlyExpense = new Array(6).fill(0);
    state.transactions.forEach(t => {
      const m = new Date(t.date).getMonth();
      if (m < 6) {
        if (t.type === 'income')  monthlyIncome[m]  += t.amount;
        if (t.type === 'expense') monthlyExpense[m] += t.amount;
      }
    });
    const savings = monthlyIncome.map((inc, i) => inc - monthlyExpense[i]);
    return { incomeData: monthlyIncome, expenseData: monthlyExpense, savings };
  }, [state.transactions]);

  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const tickColor = isDark ? '#50596A' : '#8892A4';

  const data = {
    labels: MONTHS,
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        backgroundColor: 'rgba(81,207,102,0.8)',
        borderRadius: 6,
        borderSkipped: false,
        borderColor: 'rgba(81,207,102,1)',
        borderWidth: 0,
      },
      {
        label: 'Expenses',
        data: expenseData,
        backgroundColor: 'rgba(255,107,107,0.8)',
        borderRadius: 6,
        borderSkipped: false,
        borderColor: 'rgba(255,107,107,1)',
        borderWidth: 0,
      },
    ],
  };

  const options = {
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
          afterBody: (items) => {
            const inc = items.find(i => i.dataset.label === 'Income')?.raw || 0;
            const exp = items.find(i => i.dataset.label === 'Expenses')?.raw || 0;
            return [`Net Savings: ₹${(inc - exp).toLocaleString('en-IN')}`];
          },
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
          callback: (v) => fmt(v),
        },
        border: { display: false },
      },
    },
  };

  const totalSaved = savings.reduce((a, b) => a + b, 0);
  const bestMonth = MONTHS[savings.indexOf(Math.max(...savings))];

  return (
    <div className="chart-card animate-fade" style={{ animationDelay: '150ms' }}>
      <div className="chart-card-header">
        <div>
          <h3>Monthly Comparison</h3>
          <p>Income vs Expenses — Jan to Jun 2025</p>
        </div>
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-dot" style={{ background: '#51CF66' }} />
            Income
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ background: '#FF6B6B' }} />
            Expenses
          </div>
        </div>
      </div>

      <div style={{ height: 220 }}>
        <Bar data={data} options={options} />
      </div>

      <div className="monthly-bar-footer">
        <div className="monthly-stat">
          <span className="monthly-stat-label">Total Net Savings</span>
          <span className="monthly-stat-value text-income">₹{totalSaved.toLocaleString('en-IN')}</span>
        </div>
        <div className="monthly-stat">
          <span className="monthly-stat-label">Best Month</span>
          <span className="monthly-stat-value">{bestMonth}</span>
        </div>
      </div>
    </div>
  );
}
