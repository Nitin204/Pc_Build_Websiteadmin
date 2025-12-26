import React, { useState } from 'react';
import { SalesTrend, CategoryBars } from '../pages/DashboardCharts';

const ChartsSection = () => {
  const [timeRange, setTimeRange] = useState('30D');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Sales Trend Card */}
      <div className="bg-[#1a1c1e] p-6 rounded-2xl border border-gray-800 shadow-inner">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-tighter">
            Sales Trend
          </h4>
          
          {/* Time Filter Buttons */}
          <div className="flex bg-[#121417] p-1 rounded-lg border border-gray-800">
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
      <div className="bg-[#1a1c1e] p-6 rounded-2xl border border-gray-800 shadow-inner">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-tighter">
            Top Selling Categories
          </h4>
        </div>
        <CategoryBars />
      </div>
    </div>
  );
};

export default ChartsSection;