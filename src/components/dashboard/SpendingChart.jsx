import { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { useApp } from '../../context/AppContext';
import { CATEGORY_COLORS } from '../../data/mockData';

const fmt = (n) => `₹${n.toLocaleString('en-IN')}`;

export default function SpendingChart() {
  const { state } = useApp();

  const { labels, data, colors, topCategories, total } = useMemo(() => {
    const map = {};
    state.transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });

    const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]);
    const top = sorted.slice(0, 6);
    const totalAmt = top.reduce((s, [, v]) => s + v, 0);

    return {
      labels: top.map(([k]) => k),
      data: top.map(([, v]) => v),
      colors: top.map(([k]) => CATEGORY_COLORS[k] || '#6C63FF'),
      topCategories: top,
      total: totalAmt,
    };
  }, [state.transactions]);

  const isDark = state.theme === 'dark';

  const chartData = {
    labels,
    datasets: [{
      data,
      backgroundColor: colors.map(c => c + 'CC'),
      borderColor: colors,
      borderWidth: 2,
      hoverOffset: 6,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
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
          label: (ctx) => ` ${fmt(ctx.raw)} (${((ctx.raw / total) * 100).toFixed(1)}%)`,
        },
      },
    },
  };

  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <div>
          <h3>Spending Breakdown</h3>
          <p>By category</p>
        </div>
      </div>
      <div style={{ height: 180, margin: '0 auto' }}>
        <Doughnut data={chartData} options={options} />
      </div>
      <div className="donut-meta" style={{ marginTop: 16 }}>
        {topCategories.slice(0, 4).map(([cat, amt]) => (
          <div key={cat} className="donut-stat">
            <div
              className="donut-stat-dot"
              style={{ background: CATEGORY_COLORS[cat] || '#6C63FF' }}
            />
            <span className="donut-stat-label">{cat}</span>
            <span className="donut-stat-value">{fmt(amt)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
