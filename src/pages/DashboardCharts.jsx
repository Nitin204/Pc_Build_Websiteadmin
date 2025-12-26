import React from 'react';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

// Alag-alag time ranges ke liye data
const dataSets = {
  '7D': [
    { name: 'Mon', v: 40 }, { name: 'Tue', v: 30 }, { name: 'Wed', v: 60 }, 
    { name: 'Thu', v: 80 }, { name: 'Fri', v: 50 }, { name: 'Sat', v: 90 }, { name: 'Sun', v: 100 }
  ],
  '30D': [
    { name: 'Week 1', v: 100 }, { name: 'Week 2', v: 250 }, 
    { name: 'Week 3', v: 380 }, { name: 'Week 4', v: 420 }
  ],
  '12M': [
    { name: 'Jan', v: 1200 }, { name: 'Feb', v: 2100 }, { name: 'Mar', v: 1800 }, 
    { name: 'Apr', v: 2800 }, { name: 'May', v: 3500 }, { name: 'Jun', v: 4200 }
  ]
};

export const SalesTrend = ({ range }) => {
  const currentData = dataSets[range] || dataSets['30D'];

  return (
    <div className="w-full h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={currentData}>
          <defs>
            <linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" vertical={false} />
          <XAxis dataKey="name" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
          <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ backgroundColor: '#1a1c1e', border: 'none', borderRadius: '8px' }} />
          <Area type="monotone" dataKey="v" stroke="#ef4444" strokeWidth={3} fill="url(#colorV)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// CategoryBars waisa hi rahega jaisa pehle tha...
export const CategoryBars = () => {
  const catData = [
    { name: 'GPU', value: 45, color: '#3b82f6' },
    { name: 'CPU', value: 65, color: '#60a5fa' },
    { name: 'RAM', value: 85, color: '#ef4444' }
  ];
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={catData}>
        <XAxis dataKey="name" hide />
        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#1a1c1e', border: 'none' }} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {catData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};