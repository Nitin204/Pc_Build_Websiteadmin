import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './component/Sidebar';
import Navbar from './component/Navbar';
import StatsGrid from './component/StatsGrid';
import ChartsSection from './component/ChartsSection';
import RecentOrders from './component/RecentOrders';
import StockAlerts from './component/StockAlerts';

// pages ke liye simple components banaye hain
import OrdersPage from './pages/OrdersPage';
import ProductsPage from './pages/FullAdminPCManager';
import SettingsPage from './pages/SettingsPage';
import PreBuiltManager from './pages/PreBuiltManager';
import AccessoriesManager from './pages/AccessoriesManager';
import ReportsPage from './pages/ReportsPage';
import OnlineOfflineManager from './pages/OnlineOfflineManager';
const Dashboard = () => (
  <div className="space-y-6">
    <StatsGrid />
    <ChartsSection />
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <RecentOrders />
      <StockAlerts />
    </div>
  </div>
);




function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Router>
      <div className="flex bg-[#121417] min-h-screen text-gray-200">
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        
        <main className="flex-1 lg:ml-64 p-4 lg:p-8">
          <Navbar setIsOpen={setIsOpen} />
          
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/pre-built" element={<PreBuiltManager />} />
            <Route path="/accessories" element={<AccessoriesManager />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/online-offline" element={<OnlineOfflineManager />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;