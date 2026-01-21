import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

const API_URL = "https://pc-build-websiteabackend-2.onrender.com/api";



// Sales Trend Chart Component
const SalesTrend = ({ range }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    axios
      .get(`${API_URL}/dashboard/sales`, {
        params: { range }
      })
      .then(res => {
        console.log('Chart data:', res.data, 'Range:', range);
        let chartData = res.data;
        
        // Transform data for 12M to show month names
        if (range === '12M') {
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          chartData = chartData.map(item => {
            const monthIndex = parseInt(item.name) - 1;
            return {
              ...item,
              name: months[monthIndex] || item.name
            };
          });
          console.log('Transformed data:', chartData);
        }
        
        setData(chartData);
      })
      .catch(err => {
        console.error("Sales API error", err);
        setData([]);
      })
      .finally(() => setLoading(false));

  }, [range]);

  if (loading) {
    return <div className="text-xs text-gray-400">Loading chart...</div>;
  }

  return (
    <div className="w-full h-[160px] sm:h-[200px] lg:h-[220px] min-h-[160px] sm:min-h-[200px] lg:min-h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" vertical={false} />
          <XAxis dataKey="name" stroke="#666" fontSize={10} />
          <YAxis stroke="#666" fontSize={10} />
          <Tooltip />
          <Bar dataKey="online" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="offline" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Stats Grid Component
const StatsGrid = () => {
  const { cardBg, border, text, textSecondary } = useTheme();
  const [stats, setStats] = useState([
    { label: 'Total Orders', value: '0', active: true },
    { label: 'Online Revenue', value: '₹ 0' },
    { label: 'Offline Revenue', value: '₹ 0' },
    { label: 'Users', value: '0' }
  ]);

  useEffect(() => {
    Promise.all([
      axios.get(`${API_URL}/order/count`),
      axios.get(`${API_URL}/auth/users/getusercount`),
      axios.get(`${API_URL}/order/income`),
      axios.get(`${API_URL}/offline-orders/revenue`)
    ])
      .then(([orderCountRes, userCountRes, incomeRes, offlineRevenueRes]) => {
        setStats([
          {
            label: 'Total Orders Online',
            value: orderCountRes.data,
            active: true
          },
          {
            label: 'Online Revenue',
            value: `₹ ${incomeRes.data}`,
            active: true
          },
          {
            label: 'Offline Revenue',
            value: `₹ ${offlineRevenueRes.data}`,
            active: true
          },
          {
            label: 'Users',
            value: userCountRes.data,
            active: true
          }
        ]);
      })
      .catch(() => {
        // Fallback data (UNCHANGED)
        setStats([
          { label: 'Total Orders Online', value: '453', active: true },
          { label: 'Online Revenue', value: '₹ 2,345,670', active: true },
          { label: 'Offline Revenue', value: '₹ 2,345,670', active: true },
          { label: 'Users', value: '89', active: true }
        ]);
      });
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
      {stats.map((stat, i) => (
        <div
          key={i}
          className={`p-3 sm:p-4 lg:p-6 rounded-2xl text-center transition-all hover:scale-105 ${cardBg} ${border} ${
            stat.active ? 'border-b-4 border-b-red-600 shadow-lg shadow-red-900/10' : ''
          }`}
        >
          <p className={`text-[10px] uppercase tracking-widest mb-2 font-bold ${textSecondary}`}>
            {stat.label}
          </p>
          <h3 className={`text-lg sm:text-xl lg:text-2xl font-black ${text}`}>{stat.value}</h3>
        </div>
      ))}
    </div>
  );
};

// Charts Section Component
const ChartsSection = () => {
  const [timeRange, setTimeRange] = useState('30D');
  const { cardBg, border, textSecondary, isDark } = useTheme();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mb-8">
      <div className={`p-3 sm:p-4 lg:p-6 rounded-2xl shadow-inner ${cardBg} ${border}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
          <h4 className={`text-sm font-bold uppercase tracking-tighter ${textSecondary}`}>
            PC Component Sales Profit
          </h4>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className={textSecondary}>Online</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className={textSecondary}>Offline</span>
            </div>
          </div>
          <div className={`flex p-1 rounded-lg ${isDark ? 'bg-[#121417] border-gray-800' : 'bg-gray-100 border-gray-200'} ${border}`}>
            {['7D', '30D', '12M'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                  timeRange === range ? 'bg-red-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
        <SalesTrend range={timeRange} />
      </div>
    </div>
  );
};

// Recent Orders Component
const RecentOrders = () => {
  const { cardBg, border, text, textSecondary, isDark } = useTheme();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/order`)
      .then(res => setOrders(res.data.slice(-3).reverse()))
      .catch(() => setOrders([]));
  }, []);

  return (
    <div className={`p-3 sm:p-4 lg:p-6 rounded-2xl border-b-4 border-b-red-600 shadow-lg shadow-red-900/10 ${cardBg} ${border}`}>
      <h4 className={`text-sm font-bold mb-6 flex justify-between uppercase tracking-wider ${textSecondary}`}>
        Recent PC Orders
      </h4>
      <div className="space-y-2 sm:space-y-3">
        {orders.map((order, i) => (
          <div
            key={order.id || i}
            className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 sm:p-4 rounded-xl hover:border-gray-600 transition-colors gap-3 sm:gap-0 ${
              isDark ? 'bg-[#25282c] border-gray-800' : 'bg-gray-50 border-gray-200'
            } ${border}`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg text-red-500 font-bold text-xs ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
                PC
              </div>
              <div>
                <p className={`text-sm font-bold ${text}`}>{order.userName}</p>
                <p className={`text-[10px] font-semibold uppercase ${textSecondary}`}>{order.id}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm font-bold ${text}`}>₹ {order.totalAmount}</p>
              <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-tighter ${
                order.status === 'Completed' || order.status === 'Shipped'
                  ? 'bg-green-900/30 text-green-500'
                  : 'bg-yellow-900/30 text-yellow-500'
              }`}>
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  return (
    <div className="space-y-6">
      <StatsGrid />
      <ChartsSection />
      <div className="grid grid-cols-1 xl:grid-cols-1 gap-8">
        <RecentOrders />
      </div>
    </div>
  );
};

export default Dashboard;
