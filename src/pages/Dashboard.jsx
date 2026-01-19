import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

const API_URL = "http://localhost:8181/api";

// Chart Data for PC Components Monthly Profit
const dataSets = {
  '7D': [
    { name: 'Mon', profit: 12000 }, { name: 'Tue', profit: 8500 }, { name: 'Wed', profit: 15000 }, 
    { name: 'Thu', profit: 18000 }, { name: 'Fri', profit: 11000 }, { name: 'Sat', profit: 22000 }, { name: 'Sun', profit: 25000 }
  ],
  '30D': [
    { name: 'Day 1', profit: 8000 }, { name: 'Day 5', profit: 12000 }, { name: 'Day 10', profit: 15000 },
    { name: 'Day 15', profit: 18000 }, { name: 'Day 20', profit: 22000 }, { name: 'Day 25', profit: 25000 }, { name: 'Day 30', profit: 28000 }
  ],
  '12M': [
    { name: 'Jan', profit: 180000 }, { name: 'Feb', profit: 220000 }, { name: 'Mar', profit: 195000 }, 
    { name: 'Apr', profit: 285000 }, { name: 'May', profit: 320000 }, { name: 'Jun', profit: 380000 },
    { name: 'Jul', profit: 420000 }, { name: 'Aug', profit: 395000 }, { name: 'Sep', profit: 450000 },
    { name: 'Oct', profit: 485000 }, { name: 'Nov', profit: 520000 }, { name: 'Dec', profit: 580000 }
  ]
};

// Sales Trend Chart Component
const SalesTrend = ({ range }) => {
  const currentData = dataSets[range] || dataSets['30D'];

  return (
    <div className="w-full h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={currentData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" vertical={false} />
          <XAxis dataKey="name" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
          <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ backgroundColor: '#1a1c1e', border: 'none', borderRadius: '8px' }} />
          <Bar dataKey="profit" fill="#ef4444" radius={[4, 4, 0, 0]} />
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
      axios.get(`${API_URL}/order/income`)
    ])
      .then(([orderCountRes, userCountRes, incomeRes]) => {
        setStats([
          {
            label: 'Total Orders',
            value: orderCountRes.data,
            active: true
          },
          {
            label: 'Online Revenue',
            value: `₹ ${incomeRes.data}`
          },
          {
            label: 'Offline Revenue',
            value: '₹ 0'
          },
          {
            label: 'Users',
            value: userCountRes.data
          }
        ]);
      })
      .catch(() => {
        // Fallback data (UNCHANGED)
        setStats([
          { label: 'Total Orders', value: '453', active: true },
          { label: 'Online Revenue', value: '₹ 2,345,670' },
          { label: 'Offline Revenue', value: '₹ 2,345,670' },
          { label: 'Users', value: '89' }
        ]);
      });
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, i) => (
        <div
          key={i}
          className={`p-6 rounded-2xl text-center transition-all hover:scale-105 ${cardBg} ${border} ${
            stat.active ? 'border-b-4 border-b-red-600 shadow-lg shadow-red-900/10' : ''
          }`}
        >
          <p className={`text-[10px] uppercase tracking-widest mb-2 font-bold ${textSecondary}`}>
            {stat.label}
          </p>
          <h3 className={`text-2xl font-black ${text}`}>{stat.value}</h3>
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
      <div className={`p-6 rounded-2xl shadow-inner ${cardBg} ${border}`}>
        <div className="flex justify-between items-center mb-6">
          <h4 className={`text-sm font-bold uppercase tracking-tighter ${textSecondary}`}>
            PC Component Sales Profit
          </h4>
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
      .then(res => setOrders(res.data.slice(0, 5)))
      .catch(() => setOrders([]));
  }, []);

  return (
    <div className={`xl:col-span-2 p-6 rounded-2xl ${cardBg} ${border}`}>
      <h4 className={`text-sm font-bold mb-6 flex justify-between uppercase tracking-wider ${textSecondary}`}>
        Recent PC Orders
      </h4>
      <div className="space-y-3">
        {orders.map((order, i) => (
          <div
            key={order.id || i}
            className={`flex justify-between items-center p-4 rounded-xl hover:border-gray-600 transition-colors ${
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
