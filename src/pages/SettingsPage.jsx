import React, { useState } from 'react';
import { User, Bell, Shield, Moon, Sun, Save, Camera } from 'lucide-react';

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        
        <h1 className="text-2xl font-black text-white uppercase  tracking-tighter">
            Settings
          </h1>
          <p className="text-gray-500 text-sm">Manage your account and dashboard preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Sidebar Navigation for Settings */}
        <div className="space-y-2">
          {[
            { id: 'profile', label: 'Profile', icon: <User size={18}/>, active: true },
           
          ].map((item) => (
            <div key={item.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition ${item.active ? 'bg-red-600 text-white font-bold' : 'text-gray-400 hover:bg-[#1a1c1e]'}`}>
              {item.icon} <span>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Right: Settings Form */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Profile Section */}
          <div className="bg-[#1a1c1e] p-6 rounded-2xl border border-gray-800 space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="w-20 h-20 bg-red-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black">
                  JD
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition">
                  <Camera size={20} className="text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-white font-bold">John Doe</h3>
                <p className="text-gray-500 text-xs uppercase tracking-widest">Administrator</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                <input type="text" defaultValue="John Doe" className="w-full bg-[#121417] border border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:border-red-600 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
                <input type="email" defaultValue="admin@systembuilders.com" className="w-full bg-[#121417] border border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:border-red-600 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Password</label>
                <input type="password" placeholder="Enter new password" className="w-full bg-[#121417] border border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:border-red-600 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Confirm Password</label>
                <input type="password" placeholder="Confirm new password" className="w-full bg-[#121417] border border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:border-red-600 outline-none" />
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          
          {/* Save Button */}
          <div className="flex justify-end">
            <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-red-900/20 transition active:scale-95">
              <Save size={18} /> Save Changes
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;