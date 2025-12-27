import React from 'react';
import { NavLink } from 'react-router-dom'; // NavLink import kiya
import { LayoutDashboard, ShoppingCart, Box, Monitor, MousePointer, BarChart3, Settings, X, Receipt } from 'lucide-react';
import logo from '../assets/logo.png'; // Agar aap logo image use karna chahte hain
const SidebarItem = ({ icon, label, to }) => (
  <NavLink 
    to={to}
    className={({ isActive }) => `
      flex items-center gap-3 p-3 rounded-xl cursor-pointer mb-2 transition-all duration-200
      ${isActive 
        ? 'bg-[#25282c] text-red-500 border-l-4 border-red-600 font-bold shadow-lg' 
        : 'text-gray-400 hover:bg-[#25282c] hover:text-white'
      }
    `}
  >
    {icon}
    <span className="text-sm font-medium tracking-wide">{label}</span>
  </NavLink>
);

const Sidebar = ({ isOpen, setIsOpen }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden" onClick={() => setIsOpen(false)}></div>
      )}

      <aside className={`fixed inset-y-0 left-0 w-64 bg-[#1a1c1e] border-r border-gray-800 z-[70] transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex items-center justify-between p-6 mb-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="w-18 h-18 object-contain" />
            <span className="text-white font-extrabold tracking-widest text-lg uppercase">System Builders</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-400 hover:text-white"><X size={24} /></button>
        </div>

        <nav className="px-4">
          <SidebarItem icon={<LayoutDashboard size={18}/>} label="Dashboard" to="/" />
          <SidebarItem icon={<ShoppingCart size={18}/>} label="Orders" to="/orders" />
          <SidebarItem icon={<Box size={18}/>} label="Built PC" to="/products" />
          <SidebarItem icon={<Monitor size={18}/>} label="Pre-Built PC" to="/pre-built" />
          <SidebarItem icon={<MousePointer size={18}/>} label="Accessories" to="/accessories" />
          <SidebarItem icon={<BarChart3 size={18}/>} label="Reports" to="/reports" />
          <SidebarItem icon={<Receipt size={18}/>} label="Offline Bill" to="/online-offline" />
          <SidebarItem icon={<Settings size={18}/>} label="Settings" to="/settings" />
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;