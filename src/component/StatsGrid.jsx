import React from 'react';

const StatsGrid = () => {
  const stats = [
    { label: 'Total Orders', value: '453', active: true },
    { label: 'Revenue', value: '₹ 2,345,670' },
    { label: 'Revenue', value: '₹ 2,345,670' },
    { label: 'New Users', value: '89' }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, i) => (
        <div key={i} className={`bg-[#1a1c1e] p-6 rounded-2xl border border-gray-800 text-center transition-all hover:scale-105 ${stat.active ? 'border-b-4 border-b-red-600 shadow-lg shadow-red-900/10' : ''}`}>
          <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">{stat.label}</p>
          <h3 className="text-2xl font-black text-white">{stat.value}</h3>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;