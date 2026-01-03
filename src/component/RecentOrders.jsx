import React from 'react';
import { useTheme } from '../context/ThemeContext';

const RecentOrders = () => {
  const { cardBg, border, text, textSecondary, isDark } = useTheme();
  const orders = [
    { name: 'RTX 4090 GPU', storage: '1.5TB SSD', price: '₹ 4,50,000', status: 'Shipped' },
    { name: 'RTX 3080 GPU', storage: '1.5TB SSD', price: '₹ 1,20,000', status: 'Pending' }
  ];

  return (
    <div className={`xl:col-span-2 p-6 rounded-2xl ${cardBg} ${border}`}>
      <h4 className={`text-sm font-bold mb-6 flex justify-between uppercase tracking-wider ${textSecondary}`}>
        Recent Orders <span className="text-blue-500 text-xs cursor-pointer hover:underline font-bold">View All</span>
      </h4>
      <div className="space-y-3">
        {orders.map((order, i) => (
          <div key={i} className={`flex justify-between items-center p-4 rounded-xl hover:border-gray-600 transition-colors ${isDark ? 'bg-[#25282c] border-gray-800' : 'bg-gray-50 border-gray-200'} ${border}`}>
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg text-red-500 font-bold text-xs ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>{i === 0 ? 'RTX' : 'GTX'}</div>
              <div>
                <p className={`text-sm font-bold ${text}`}>{order.name}</p>
                <p className={`text-[10px] font-semibold uppercase ${textSecondary}`}>{order.storage}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm font-bold ${text}`}>{order.price}</p>
              <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-tighter ${order.status === 'Shipped' ? 'bg-green-900/30 text-green-500' : 'bg-yellow-900/30 text-yellow-500'}`}>
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentOrders;