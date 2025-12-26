import React from 'react';

const RecentOrders = () => {
  const orders = [
    { name: 'RTX 4090 GPU', storage: '1.5TB SSD', price: '₹ 4,50,000', status: 'Shipped' },
    { name: 'RTX 3080 GPU', storage: '1.5TB SSD', price: '₹ 1,20,000', status: 'Pending' }
  ];

  return (
    <div className="xl:col-span-2 bg-[#1a1c1e] p-6 rounded-2xl border border-gray-800">
      <h4 className="text-sm font-bold mb-6 flex justify-between uppercase tracking-wider text-gray-400">
        Recent Orders <span className="text-blue-500 text-xs cursor-pointer hover:underline font-bold">View All</span>
      </h4>
      <div className="space-y-3">
        {orders.map((order, i) => (
          <div key={i} className="flex justify-between items-center p-4 bg-[#25282c] rounded-xl border border-gray-800 hover:border-gray-600 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-800 rounded-lg text-red-500 font-bold text-xs">{i === 0 ? 'RTX' : 'GTX'}</div>
              <div>
                <p className="text-sm font-bold text-white">{order.name}</p>
                <p className="text-[10px] text-gray-500 font-semibold uppercase">{order.storage}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-white">{order.price}</p>
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