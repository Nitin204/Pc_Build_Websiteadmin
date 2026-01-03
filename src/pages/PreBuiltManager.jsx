import React, { useState, useRef } from 'react';
import { 
  Gamepad2, Bot, Building2, Camera, TrendingUp, 
  Edit, Save, Plus, Trash2, X, Laptop, Image as ImageIcon, Upload 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const PreBuiltManager = () => {
  const { cardBg, border, text, textSecondary, isDark } = useTheme();
  const [selectedCat, setSelectedCat] = useState('GAMING');
  const [budget, setBudget] = useState(250000);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const fileInputRef = useRef(null); // File input handle karne ke liye

  const [budgetLimits, setBudgetLimits] = useState({
    min: 50000,
    max: 500000
  });

  const [products, setProducts] = useState([
    {
      id: 1,
      category: 'GAMING',
      name: 'Fusion Gaming Master PC',
      specs: 'Core i9 14900K/Z790 WiFi/64GB DDR5/RTX 4080 Ti/2TB SSD',
      price: '219244',
      originalPrice: '249244',
      image: null 
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    specs: '',
    price: '',
    originalPrice: '',
    category: 'GAMING',
    image: null 
  });

  // Image Upload Logic
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const categories = [
    { id: 'GAMING', icon: <Gamepad2 />, label: 'GAMING', color: 'text-red-600', bg: 'bg-red-600' },
    { id: 'AI/ML', icon: <Bot />, label: 'AI/ML', color: 'text-blue-500', bg: 'bg-blue-600' },
    { id: 'ARCHITECTURE', icon: <Building2 />, label: 'ARCHITECTURE', color: 'text-purple-500', bg: 'bg-purple-600' },
    { id: 'EDITING', icon: <Camera />, label: 'EDITING', color: 'text-orange-500', bg: 'bg-orange-600' },
    { id: 'TRADING', icon: <TrendingUp />, label: 'TRADING', color: 'text-green-500', bg: 'bg-green-600' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setProducts(products.map(p => p.id === editingId ? { ...formData, id: editingId } : p));
    } else {
      setProducts([...products, { ...formData, id: Date.now() }]);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if(window.confirm("Are you sure you want to delete this build?")) {
        setProducts(products.filter(p => p.id !== id));
    }
  };

  const openEdit = (product) => {
    setFormData(product);
    setEditingId(product.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: '', specs: '', price: '', originalPrice: '', category: selectedCat, image: null });
  };

  return (
    <div className="space-y-4 sm:space-y-8 animate-in fade-in duration-500 p-2 sm:p-4 min-h-screen">
      {/* Header */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 sm:p-6 rounded-2xl shadow-xl ${cardBg} ${border}`}>
        <div>
          <h1 className={`text-xl sm:text-2xl font-black uppercase tracking-tighter ${text}`}>
          Pre-Built <span className="text-red-600">PC </span>
          </h1>
          <p className={`text-xs sm:text-sm ${textSecondary}`}>Configure user-end PC selector settings</p>
        </div>
        <button 
          onClick={() => { setFormData({...formData, category: selectedCat}); setIsModalOpen(true); }}
          className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-xs font-black flex items-center gap-2 transition uppercase tracking-widest shadow-lg shadow-red-900/20 w-full sm:w-auto justify-center"
        >
          <Plus size={16} /> Add New Build
        </button>
      </div>

      {/* Category Selection */}
      <div className={`p-4 sm:p-8 rounded-3xl ${cardBg} ${border}`}>
        <h3 className="text-red-600 text-center font-bold mb-6 sm:mb-8 tracking-widest text-xs uppercase">Edit Categories</h3>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 md:gap-16">
          {categories.map((cat) => (
            <div 
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className="flex flex-col items-center gap-2 sm:gap-4 cursor-pointer group"
            >
              <div className={`p-3 sm:p-4 rounded-2xl transition-all duration-300 ${selectedCat === cat.id ? 'text-red-600 scale-110 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : `${text} hover:text-red-400 opacity-60`}`}>
                {React.cloneElement(cat.icon, { size: 24 })}
              </div>
              <span className={`text-[9px] sm:text-[10px] font-black tracking-widest ${selectedCat === cat.id ? 'text-red-600 border-b-2 border-red-600' : text}`}>
                {cat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Budget & Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
        <div className={`p-4 sm:p-8 rounded-3xl space-y-4 sm:space-y-6 ${cardBg} ${border}`}>
          <h3 className="text-red-600 font-bold tracking-widest text-xs uppercase">Budget Settings ({selectedCat})</h3>
          <div className="space-y-4">
            <input 
              type="range" 
              min={budgetLimits.min} 
              max={budgetLimits.max} 
              step="5000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-red-600"
            />
            <div className="text-center">
              <span className={`text-xl sm:text-2xl font-black ${text}`}>₹ {Number(budget).toLocaleString()}/-</span>
            </div>
          </div>

          <div className={`grid grid-cols-2 gap-2 sm:gap-4 pt-4 border-t ${border}`}>
            <div className={`p-3 sm:p-4 rounded-2xl ${cardBg} ${border}`}>
              <p className={`text-[9px] sm:text-[10px] font-bold uppercase mb-1 ${textSecondary}`}>Min Budget</p>
              <input type="number" value={budgetLimits.min} onChange={(e) => setBudgetLimits({...budgetLimits, min: e.target.value})} className={`bg-transparent font-bold w-full outline-none text-sm ${text}`} />
            </div>
            <div className={`p-3 sm:p-4 rounded-2xl ${cardBg} ${border}`}>
              <p className={`text-[9px] sm:text-[10px] font-bold uppercase mb-1 ${textSecondary}`}>Max Budget</p>
              <input type="number" value={budgetLimits.max} onChange={(e) => setBudgetLimits({...budgetLimits, max: e.target.value})} className={`bg-transparent font-bold w-full outline-none text-sm ${text}`} />
            </div>
          </div>
        </div>

        
      </div>

      {/* Active Inventory */}
      <div className={`p-4 sm:p-8 rounded-3xl space-y-4 sm:space-y-6 ${cardBg} ${border}`}>
        <h3 className="text-red-600 font-black tracking-widest text-xs uppercase italic">{selectedCat} Active Inventory</h3>
        <div className="space-y-3 sm:space-y-4">
        {products.filter(p => p.category === selectedCat).map((product) => (
          <div key={product.id} className={`flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-5 rounded-2xl sm:rounded-3xl hover:border-red-600/50 transition-all ${cardBg} ${border}`}>
            <div className={`w-full sm:w-24 md:w-32 h-24 sm:h-24 md:h-32 rounded-xl sm:rounded-2xl flex items-center justify-center relative overflow-hidden ${isDark ? 'bg-black border-gray-800' : 'bg-gray-100 border-gray-300'} ${border}`}>
               {product.image ? (
                 <img src={product.image} alt="build" className="w-full h-full object-cover" />
               ) : (
                 <Laptop className={isDark ? 'text-gray-700' : 'text-gray-400'} size={24} />
               )}
               <div className={`absolute top-1 sm:top-2 left-1 sm:left-2 w-2 h-2 rounded-full ${categories.find(c => c.id === product.category)?.bg}`}></div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                <h4 className={`font-bold text-xs sm:text-sm uppercase ${text}`}>{product.name}</h4>
                <div className="flex gap-2 self-end sm:self-start">
                  <button onClick={() => openEdit(product)} className="p-1.5 sm:p-2 bg-gray-800 text-blue-400 rounded-lg hover:bg-blue-600 transition-all"><Edit size={12}/></button>
                  <button onClick={() => handleDelete(product.id)} className="p-1.5 sm:p-2 bg-gray-800 text-red-500 rounded-lg hover:bg-red-600 transition-all"><Trash2 size={12}/></button>
                </div>
              </div>
              <p className={`text-[10px] sm:text-[11px] leading-relaxed ${textSecondary}`}>{product.specs}</p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6 pt-2">
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="text-green-500 font-black text-sm sm:text-base">₹ {Number(product.price).toLocaleString()}</span>
                  <span className="text-gray-400 line-through text-[10px] sm:text-xs font-bold opacity-50">₹ {Number(product.originalPrice).toLocaleString()}</span>
                </div>
                <div className="bg-red-600/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-red-600/20">
                    <span className="text-red-500 font-black text-[9px] sm:text-[10px] uppercase">SAVE: ₹ {(product.originalPrice - product.price).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#1a1c1e] w-full max-w-sm rounded-xl border border-gray-800 shadow-2xl">
            <div className="bg-red-600 p-3 flex justify-between items-center text-white">
              <h2 className="font-black uppercase tracking-widest text-xs">{editingId ? 'Edit Build' : 'Create New Build'}</h2>
              <button onClick={closeModal} className="hover:rotate-90 transition-transform"><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-3 space-y-2">
              <div className="col-span-2 mb-2">
                <div className="flex items-center justify-center border border-dashed border-gray-800 rounded-lg p-2 bg-[#121417] hover:border-red-600 transition-all cursor-pointer" 
                     onClick={() => fileInputRef.current.click()}>
                  <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                  {formData.image ? (
                    <img src={formData.image} alt="preview" className="h-12 rounded object-contain" />
                  ) : (
                    <div className="flex items-center gap-1 text-gray-500">
                      <Upload size={14} />
                      <span className="text-[8px] font-black uppercase">Upload</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[8px] text-gray-500 font-black uppercase">Product Name</label>
                  <input required type="text" className="w-full bg-[#121417] border border-gray-800 rounded-lg p-1.5 text-white focus:border-red-600 outline-none text-xs" 
                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Build Name" />
                </div>
                <div>
                  <label className="text-[8px] text-gray-500 font-black uppercase">Category</label>
                  <select className="w-full bg-[#121417] border border-gray-800 rounded-lg p-1.5 text-white focus:border-red-600 outline-none text-xs"
                    value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-[8px] text-gray-500 font-black uppercase">Specifications</label>
                  <textarea required rows="1" className="w-full bg-[#121417] border border-gray-800 rounded-lg p-1.5 text-white focus:border-red-600 outline-none text-[9px]" 
                    value={formData.specs} onChange={(e) => setFormData({...formData, specs: e.target.value})} />
                </div>
                <div>
                  <label className="text-[8px] text-gray-500 font-black uppercase">Offer Price</label>
                  <input required type="number" className="w-full bg-[#121417] border border-gray-800 rounded-lg p-1.5 text-white focus:border-red-600 outline-none text-xs" 
                    value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                </div>
                <div>
                  <label className="text-[8px] text-gray-500 font-black uppercase">M.R.P</label>
                  <input required type="number" className="w-full bg-[#121417] border border-gray-800 rounded-lg p-1.5 text-white focus:border-red-600 outline-none opacity-60 text-xs" 
                    value={formData.originalPrice} onChange={(e) => setFormData({...formData, originalPrice: e.target.value})} />
                </div>
                <div>
                  <label className="text-[8px] text-gray-500 font-black uppercase">Quantity</label>
                  <input required type="number" className="w-full bg-[#121417] border border-gray-800 rounded-lg p-1.5 text-white focus:border-red-600 outline-none text-xs" 
                    value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} placeholder="Stock Qty" />
                </div>
              </div>
              <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-black uppercase tracking-widest transition shadow-lg text-xs">
                {editingId ? 'Update' : 'Add'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreBuiltManager;