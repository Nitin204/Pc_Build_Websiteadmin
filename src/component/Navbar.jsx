import React, { useState } from 'react';
import { Bell, LogOut, Menu, User, X, Chrome, ShieldAlert, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ setIsOpen, onLogout }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { isDark, toggleTheme, cardBg, border, text, textSecondary } = useTheme();
  const navigate = useNavigate();

  // Admin Credentials (Real project mein ye database se check hota hai)
  const ADMIN_EMAIL = "admin@fusion.com";
  const ADMIN_PASSWORD = "admin123";

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setError('');

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      alert("Admin Access Granted!");
      setIsLoginOpen(false);
      // Yahan aap admin ko dashboard par redirect kar sakte hain
    } else {
      setError("Unauthorized! Only Administrators can access this area.");
    }
  };

  return (
    <>
      <header className={`flex justify-between items-center mb-6 p-3 sm:p-4 rounded-2xl shadow-xl transition-colors duration-300 ${cardBg} ${border}`}>
        <div className="flex items-center gap-2 sm:gap-4">
          <button onClick={() => setIsOpen(true)} className={`lg:hidden ${textSecondary}`}>
            <Menu size={20} />
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 pr-1 sm:pr-2">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl transition-all hover:scale-105 ${
              isDark ? 'bg-[#25282c] hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
            }`}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun size={18} className="text-orange-400" /> : <Moon size={18} className="text-indigo-600" />}
          </button>
          
          
          
          <button onClick={onLogout} className={`hidden sm:flex items-center cursor-pointer gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[10px] sm:text-xs transition ${
            isDark ? 'bg-[#25282c] hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
          }`}>
            <LogOut size={12} /> Logout
          </button>

         
          <button 
            onClick={() => navigate('/settings')}
            className="w-8 h-8 sm:w-9 sm:h-9 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg cursor-pointer hover:bg-red-700 transition-all active:scale-95"
            title="Admin Login"
          >
            <User size={16} />
          </button>
        </div>
      </header>

      {/* --- ADMIN ONLY LOGIN MODAL --- */}
     
    </>
  );
}