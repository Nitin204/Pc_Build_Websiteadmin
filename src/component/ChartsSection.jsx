import React, { useState } from 'react';
import { SalesTrend, CategoryBars } from '../pages/DashboardCharts';
import { useTheme } from '../context/ThemeContext';

const ChartsSection = () => {
  const [timeRange, setTimeRange] = useState('30D');
  const { cardBg, border, textSecondary, isDark } = useTheme();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Sales Trend Card */}
      <div className={`p-6 rounded-2xl shadow-inner ${cardBg} ${border}`}>
        <div className="flex justify-between items-center mb-6">
          <h4 className={`text-sm font-bold uppercase tracking-tighter ${textSecondary}`}>
            Sales Trend
          </h4>
          
          {/* Time Filter Buttons */}
          <div className={`flex p-1 rounded-lg ${isDark ? 'bg-[#121417] border-gray-800' : 'bg-gray-100 border-gray-200'} ${border}`}>
            {['7D', '30D', '12M'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                  timeRange === range 
                  ? 'bg-red-600 text-white shadow-lg' 
                  : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
        
        {/* Graph ko timeRange pass kar rahe hain */}
        <SalesTrend range={timeRange} />
      </div>

      {/* Top Categories Card */}
      <div className={`p-6 rounded-2xl shadow-inner ${cardBg} ${border}`}>
        <div className="flex justify-between items-center mb-6">
          <h4 className={`text-sm font-bold uppercase tracking-tighter ${textSecondary}`}>
            Top Selling Categories
          </h4>
        </div>
        <CategoryBars />
      </div>
    </div>
  );
};

export default ChartsSection;