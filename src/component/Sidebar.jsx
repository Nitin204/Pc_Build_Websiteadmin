import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Package, Wrench, Monitor, Gamepad2, FileText, Receipt, Settings, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import logo from '../assets/logo.png';
const SidebarItem = ({ icon, label, to, onClick }) => {
  const { isDark } = useTheme();
  return (
    <NavLink 
      to={to}
      onClick={onClick}
      className={({ isActive }) => `
        flex items-center gap-3 p-3 rounded-xl cursor-pointer mb-2 transition-all duration-200
        ${isActive 
          ? `${isDark ? 'bg-[#25282c]' : 'bg-red-50'} text-red-500 border-l-4 border-red-600 font-bold shadow-lg` 
          : `${isDark ? 'text-gray-400 hover:bg-[#25282c] hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'}`
        }
      `}
    >
      {icon}
      <span className="text-sm font-medium tracking-wide">{label}</span>
    </NavLink>
  );
};

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { isDark, cardBg, border, text } = useTheme();
  
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden" onClick={() => setIsOpen(false)}></div>
      )}

      <aside className={`fixed inset-y-0 left-0 w-64 z-[70] transition-all duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 ${cardBg} ${border} border-r`}>
        <div className="flex items-center justify-between p-6 mb-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="w-18 h-18 object-contain" />
            <span className={`font-extrabold tracking-widest text-lg uppercase ${text}`}>System Builders</span>
          </div>
          <button onClick={() => setIsOpen(false)} className={`lg:hidden transition ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}><X size={24} /></button>
        </div>

        <nav className="px-4">
          <SidebarItem icon={<Home size={18}/>} label="Dashboard" to="/" onClick={() => setIsOpen(false)} />
          <SidebarItem icon={<Package size={18}/>} label="Orders" to="/orders" onClick={() => setIsOpen(false)} />
          <SidebarItem icon={<Wrench size={18}/>} label="Built PC" to="/products" onClick={() => setIsOpen(false)} />
          <SidebarItem icon={<Monitor size={18}/>} label="Pre-Built PC" to="/pre-built" onClick={() => setIsOpen(false)} />
          <SidebarItem icon={<Gamepad2 size={18}/>} label="Accessories" to="/accessories" onClick={() => setIsOpen(false)} />
          <SidebarItem icon={<FileText size={18}/>} label="Requests/Careers" to="/reports" onClick={() => setIsOpen(false)} />
          <SidebarItem icon={<Receipt size={18}/>} label="Offline Bill" to="/online-offline" onClick={() => setIsOpen(false)} />
          <SidebarItem icon={<Settings size={18}/>} label="Settings" to="/settings" onClick={() => setIsOpen(false)} />
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;