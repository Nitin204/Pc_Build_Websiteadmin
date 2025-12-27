import React, { useState, useRef } from 'react';
import { Monitor, Keyboard, Mouse, Headset, Gamepad, Plus, Edit, Trash2, Upload } from 'lucide-react';

const AccessoriesManager = () => {
  const [activeTab, setActiveTab] = useState('MONITOR');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    specs: '',
    price: '',
    category: 'MONITOR',
    image: null
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setAccessoryList(accessoryList.map(item => 
        item.id === editingId ? { ...formData, id: editingId } : item
      ));
    } else {
      setAccessoryList([...accessoryList, { ...formData, id: Date.now() }]);
    }
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: '', specs: '', price: '', category: activeTab, image: null });
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditingId(item.id);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if(window.confirm('Delete this item?')) {
      setAccessoryList(accessoryList.filter(item => item.id !== id));
    }
  };

  const tabs = [
    { id: 'MONITOR', icon: <Monitor />, label: 'MONITOR' },
    { id: 'KEYBOARD', icon: <Keyboard />, label: 'KEYBOARD' },
    { id: 'MOUSE', icon: <Mouse />, label: 'MOUSE' },
    { id: 'HEADSET', icon: <Headset />, label: 'HEADSET' },
    { id: 'SIMULATOR', icon: <Gamepad />, label: 'SIMULATOR' },
  ];

  const [accessoryList, setAccessoryList] = useState([
    {
      id: 1,
      name: "MSI PRO MP272 E2",
      specs: "27-inch Full HD Office Monitor - 100Hz, Eye-Friendly...",
      price: "8,490",
      category: "MONITOR",
      image: "https://placehold.co/100x100/1a1c1e/white?text=MSI+PRO"
    },
    // Aap aur items yahan add kar sakte hain
  ]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">
            ACCESSORIES <span className="text-red-600">INVENTORY</span>
          </h1>
          <p className="text-gray-500 text-sm">Manage user add-ons, pricing, and visibility</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-red-900/20 transition-all active:scale-95">
          <Plus size={18} /> ADD NEW ITEM
        </button>
      </div>

      {/* User-End Style Tabs (Admin Controller) */}
      <div className="bg-[#1a1c1e] p-6 rounded-3xl border border-gray-800 shadow-xl">
        <div className="flex flex-wrap justify-center gap-8 md:gap-14">
          {tabs.map((tab) => (
            <div 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-center gap-3 cursor-pointer relative group"
            >
              <div className={`p-4 rounded-2xl transition-all duration-300 ${activeTab === tab.id ? 'text-red-600 bg-red-600/10' : 'text-white hover:text-red-400 opacity-60'}`}>
                {React.cloneElement(tab.icon, { size: 28 })}
              </div>
              <span className={`text-[10px] font-black tracking-widest ${activeTab === tab.id ? 'text-red-600' : 'text-white'}`}>
                {tab.label}
              </span>
              {activeTab === tab.id && <div className="absolute -bottom-2 w-full h-0.5 bg-red-600"></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Accessories Table/List */}
      <div className="space-y-4">
        {accessoryList.filter(item => item.category === activeTab).map((item) => (
          <div key={item.id} className="bg-[#1a1c1e] p-6 rounded-3xl border border-gray-800 flex flex-col md:flex-row items-center gap-6 group hover:border-gray-600 transition-all">
            {/* Image Preview */}
            <div className="w-24 h-24 bg-[#121417] rounded-2xl border border-gray-800 flex items-center justify-center p-2">
              <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
            </div>

            {/* Details */}
            <div className="flex-1 space-y-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <h3 className="text-lg font-bold text-white uppercase">{item.name}</h3>
                <span className="bg-red-900/20 text-red-500 text-[10px] font-bold px-3 py-0.5 rounded-full w-fit mx-auto md:mx-0 border border-red-900/50">
                  {item.category}
                </span>
              </div>
              <p className="text-gray-500 text-xs line-clamp-2">{item.specs}</p>
              <p className="text-xl font-black text-white pt-2">₹ {item.price}/-</p>
            </div>

            {/* Admin Actions */}
            <div className="flex gap-3">
              <button onClick={() => handleEdit(item)} className="bg-[#25282c] hover:bg-gray-700 text-gray-300 p-3 rounded-xl transition">
                <Edit size={18} />
              </button>
              <button onClick={() => handleDelete(item.id)} className="bg-red-900/10 hover:bg-red-600 text-red-500 hover:text-white p-3 rounded-xl transition border border-red-900/20">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/90 backdrop-blur-sm">
          <div className="bg-[#1a1c1e] w-full max-w-sm rounded-xl border border-gray-800 shadow-2xl">
            <div className="bg-red-600 p-3 flex justify-between items-center text-white">
              <h2 className="font-black uppercase tracking-widest text-xs">{editingId ? 'Edit Item' : 'Add New Item'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="hover:rotate-90 transition-transform">×</button>
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
                  <label className="text-[8px] text-gray-500 font-black uppercase">Item Name</label>
                  <input required type="text" className="w-full bg-[#121417] border border-gray-800 rounded-lg p-1.5 text-white focus:border-red-600 outline-none text-xs" 
                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="text-[8px] text-gray-500 font-black uppercase">Category</label>
                  <select className="w-full bg-[#121417] border border-gray-800 rounded-lg p-1.5 text-white focus:border-red-600 outline-none text-xs"
                    value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                    {tabs.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-[8px] text-gray-500 font-black uppercase">Specifications</label>
                  <textarea required rows="1" className="w-full bg-[#121417] border border-gray-800 rounded-lg p-1.5 text-white focus:border-red-600 outline-none text-[9px]" 
                    value={formData.specs} onChange={(e) => setFormData({...formData, specs: e.target.value})} />
                </div>
                <div className="col-span-2">
                  <label className="text-[8px] text-gray-500 font-black uppercase">Price</label>
                  <input required type="number" className="w-full bg-[#121417] border border-gray-800 rounded-lg p-1.5 text-white focus:border-red-600 outline-none text-xs" 
                    value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-black uppercase tracking-widest transition shadow-lg text-xs">
                {editingId ? 'Update' : 'Add Item'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


export default AccessoriesManager;