import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Tooltip, Legend, Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useApp } from '../../context/AppContext';
import { MONTHS } from '../../data/mockData';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Tooltip, Legend, Filler
);

export default function BalanceTrendChart() {
  const { state } = useApp();

  const { incomeData, expenseData } = useMemo(() => {
    const monthlyIncome  = new Array(6).fill(0);
    const monthlyExpense = new Array(6).fill(0);
    state.transactions.forEach(t => {
      const m = new Date(t.date).getMonth(); // 0 = Jan
      if (m < 6) {
        if (t.type === 'income')  monthlyIncome[m]  += t.amount;
        if (t.type === 'expense') monthlyExpense[m] += t.amount;
      }
    });
    return { incomeData: monthlyIncome, expenseData: monthlyExpense };
  }, [state.transactions]);

  const isDark = state.theme === 'dark';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';
  const tickColor = isDark ? '#50596A' : '#8892A4';

  const data = {
    labels: MONTHS,
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        borderColor: '#51CF66',
        backgroundColor: 'rgba(81,207,102,0.08)',
        borderWidth: 2.5,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#51CF66',
        pointBorderColor: isDark ? '#1A1E2A' : '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: 'Expenses',
        data: expenseData,
        borderColor: '#FF6B6B',
        backgroundColor: 'rgba(255,107,107,0.08)',
        borderWidth: 2.5,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#FF6B6B',
        pointBorderColor: isDark ? '#1A1E2A' : '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
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
          label: (ctx) => ` ₹${ctx.raw.toLocaleString('en-IN')}`,
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

  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <div>
          <h3>Income vs Expenses</h3>
          <p>6-month balance trend</p>
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
      <div style={{ height: 240 }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
