import React from 'react';
import { useTheme } from '../context/ThemeContext';

const StatsGrid = () => {
  const { cardBg, border, text, textSecondary } = useTheme();
  const stats = [
    { label: 'Total Orders', value: '453', active: true },
    { label: 'Revenue', value: '₹ 2,345,670' },
    { label: 'Revenue', value: '₹ 2,345,670' },
    { label: 'New Users', value: '89' }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, i) => (
        <div key={i} className={`p-6 rounded-2xl text-center transition-all hover:scale-105 ${cardBg} ${border} ${stat.active ? 'border-b-4 border-b-red-600 shadow-lg shadow-red-900/10' : ''}`}>
          <p className={`text-[10px] uppercase tracking-widest mb-2 font-bold ${textSecondary}`}>{stat.label}</p>
          <h3 className={`text-2xl font-black ${text}`}>{stat.value}</h3>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;