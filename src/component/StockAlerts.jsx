import React from 'react';
import { useTheme } from '../context/ThemeContext';

const StockAlerts = () => {
  const { cardBg, border, textSecondary, isDark } = useTheme();
  
  return (
    <div className={`p-6 rounded-2xl ${cardBg} ${border}`}>
      <h4 className="text-sm font-bold mb-6 text-red-600 uppercase tracking-widest italic">Low Stock Alerts</h4>
      <div className="space-y-4">
        {['i9-13900K Processor', 'DDR5 32GB RAM', 'RTX 4080 Super'].map((item, i) => (
          <div key={i} className={`flex justify-between items-center border-b pb-2 ${isDark ? 'border-gray-800/50' : 'border-gray-200/50'}`}>
            <span className={`text-xs font-medium ${textSecondary}`}>{item}</span>
            <span className="text-xs text-red-500 font-black px-2 py-1 bg-red-900/10 rounded tracking-tighter">
              {i + 2} LEFT
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockAlerts;