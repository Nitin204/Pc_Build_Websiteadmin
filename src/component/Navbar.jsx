import React, { useState } from 'react';
import { Bell, LogOut, Menu, User, X, Chrome, ShieldAlert } from 'lucide-react';

export default function Navbar({ setIsOpen }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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
      <header className="flex justify-between items-center mb-6 bg-[#1a1c1e] p-3 sm:p-4 rounded-2xl border border-gray-800 shadow-xl">
        <div className="flex items-center gap-2 sm:gap-4">
          <button onClick={() => setIsOpen(true)} className="lg:hidden text-gray-400">
            <Menu size={20} />
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 pr-1 sm:pr-2">
          {/* Notifications & Other Icons */}
          <div className="relative cursor-pointer" onClick={() => setIsNotificationOpen(!isNotificationOpen)}>
            <Bell size={18} className="text-gray-400" />
            <span className="absolute -top-1 -right-1 bg-red-600 text-[9px] rounded-full w-3 h-3 flex items-center justify-center font-bold">3</span>
            {isNotificationOpen && (
              <div className="absolute right-0 top-8 w-64 bg-[#1a1c1e] border border-gray-800 rounded-xl shadow-xl z-50">
                <div className="p-3 border-b border-gray-800">
                  <h3 className="text-white font-bold text-xs">Notifications</h3>
                </div>
                <div className="p-2 space-y-2">
                  <div className="p-2 hover:bg-gray-800 rounded text-xs text-gray-300">New order received</div>
                  <div className="p-2 hover:bg-gray-800 rounded text-xs text-gray-300">Customer inquiry</div>
                  <div className="p-2 hover:bg-gray-800 rounded text-xs text-gray-300">System update</div>
                </div>
              </div>
            )}
          </div>
          
          <button className="hidden sm:flex items-center gap-2 bg-[#25282c] px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[10px] sm:text-xs hover:bg-gray-700 transition">
            <LogOut size={12} /> Logout
          </button>

          {/* Admin Login Trigger */}
          <div 
            onClick={() => setIsLoginOpen(true)}
            className="w-8 h-8 sm:w-9 sm:h-9 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg cursor-pointer hover:bg-red-700 transition-all active:scale-95"
            title="Admin Login"
          >
            <User size={16} />
          </div>
        </div>
      </header>

      {/* --- ADMIN ONLY LOGIN MODAL --- */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4">
          <div className="bg-[#1a1c1e] w-full max-w-[350px] sm:max-w-[400px] p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-gray-800 shadow-2xl relative animate-in fade-in zoom-in duration-300">
            
            <button 
              onClick={() => { setIsLoginOpen(false); setError(''); }}
              className="absolute top-3 right-3 sm:top-5 sm:right-5 text-gray-500 hover:text-white transition"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-6 sm:mb-8">
              <div className="bg-red-600/10 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-red-600/20">
                <ShieldAlert className="text-red-600" size={24} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Admin <span className="text-red-600">Access</span></h2>
              <p className="text-gray-500 text-xs sm:text-sm mt-2">Restricted to authorized personnel only</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-600/10 border border-red-600 text-red-500 text-xs p-3 rounded-lg mb-4 text-center">
                {error}
              </div>
            )}

            <form className="space-y-3 sm:space-y-4" onSubmit={handleAdminLogin}>
              <div>
                <label className="block text-gray-400 text-[9px] sm:text-[10px] uppercase tracking-wider font-bold mb-1 ml-1">Admin ID</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#25282c] border border-gray-700 rounded-xl p-2.5 sm:p-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600/50 transition text-sm"
                  placeholder="admin@fusion.com"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-[9px] sm:text-[10px] uppercase tracking-wider font-bold mb-1 ml-1">Security Token</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#25282c] border border-gray-700 rounded-xl p-2.5 sm:p-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600/50 transition text-sm"
                  placeholder="Enter Password"
                />
              </div>
              
              <button 
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 sm:py-3.5 rounded-xl shadow-lg transition-all active:scale-95 text-sm"
              >
                Authenticate
              </button>
            </form>

            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-800 text-center">
              
            </div>
          </div>
        </div>
      )}
    </>
  );
}