import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Sidebar from './component/Sidebar';
import Navbar from './component/Navbar';
import StatsGrid from './component/StatsGrid';
import ChartsSection from './component/ChartsSection';
import RecentOrders from './component/RecentOrders';
import StockAlerts from './component/StockAlerts';
import Login from './pages/Login';
import { Toaster } from 'react-hot-toast';
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




const AppContent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('admin');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex min-h-screen">
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        
        <main className="flex-1 lg:ml-64 p-4 lg:p-8">
          <Navbar setIsOpen={setIsOpen} onLogout={handleLogout} />
          
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
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;