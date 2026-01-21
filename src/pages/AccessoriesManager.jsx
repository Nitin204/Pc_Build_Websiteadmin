// import React, { useState, useRef } from 'react';
// import { Monitor, Keyboard, Mouse, Headset, Gamepad, Plus, Edit, Trash2, Upload } from 'lucide-react';
// import { useTheme } from '../context/ThemeContext';

// const AccessoriesManager = () => {
//   const { cardBg, border, text, textSecondary } = useTheme();
//   const [activeTab, setActiveTab] = useState('MONITOR');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const fileInputRef = useRef(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     specs: '',
//     price: '',
//     quantity: '',
//     category: 'MONITOR',
//     image: null
//   });

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFormData({ ...formData, image: reader.result });
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (editingId) {
//       setAccessoryList(accessoryList.map(item => 
//         item.id === editingId ? { ...formData, id: editingId } : item
//       ));
//     } else {
//       setAccessoryList([...accessoryList, { ...formData, id: Date.now() }]);
//     }
//     setIsModalOpen(false);
//     setEditingId(null);
//     setFormData({ name: '', specs: '', price: '', quantity: '', category: activeTab, image: null });
//   };

//   const handleEdit = (item) => {
//     setFormData(item);
//     setEditingId(item.id);
//     setIsModalOpen(true);
//   };

//   const handleDelete = (id) => {
//     if(window.confirm('Delete this item?')) {
//       setAccessoryList(accessoryList.filter(item => item.id !== id));
//     }
//   };

//   const tabs = [
//     { id: 'MONITOR', icon: <Monitor />, label: 'MONITOR' },
//     { id: 'KEYBOARD', icon: <Keyboard />, label: 'KEYBOARD' },
//     { id: 'MOUSE', icon: <Mouse />, label: 'MOUSE' },
//     { id: 'HEADSET', icon: <Headset />, label: 'HEADSET' },
//     { id: 'SIMULATOR', icon: <Gamepad />, label: 'SIMULATOR' },
//   ];

//   const [accessoryList, setAccessoryList] = useState([
//     {
//       id: 1,
//       name: "MSI PRO MP272 E2",
//       specs: "27-inch Full HD Office Monitor - 100Hz, Eye-Friendly...",
//       price: "8,490",
//       category: "MONITOR",
//       image: "https://placehold.co/100x100/1a1c1e/white?text=MSI+PRO"
//     },
//     // Aap aur items yahan add kar sakte hain
//   ]);

//   return (
//     <div className="space-y-8 animate-in fade-in duration-500">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div>
//           <h1 className={`text-2xl font-black uppercase tracking-tighter ${text}`}>
//             ACCESSORIES <span className="text-red-600">INVENTORY</span>
//           </h1>
//           <p className={`text-sm ${textSecondary}`}>Manage user add-ons, pricing, and visibility</p>
//         </div>
//         <button onClick={() => setIsModalOpen(true)} className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-red-900/20 transition-all active:scale-95">
//           <Plus size={18} /> ADD NEW ITEM
//         </button>
//       </div>

//       {/* User-End Style Tabs (Admin Controller) */}
//       <div className={`p-6 rounded-3xl shadow-xl ${cardBg} ${border}`}>
//         <div className="flex flex-wrap justify-center gap-8 md:gap-14">
//           {tabs.map((tab) => (
//             <div 
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className="flex flex-col items-center gap-3 cursor-pointer relative group"
//             >
//               <div className={`p-4 rounded-2xl transition-all duration-300 ${activeTab === tab.id ? 'text-red-600 bg-red-600/10' : `${text} hover:text-red-400 opacity-60`}`}>
//                 {React.cloneElement(tab.icon, { size: 28 })}
//               </div>
//               <span className={`text-[10px] font-black tracking-widest ${activeTab === tab.id ? 'text-red-600' : text}`}>
//                 {tab.label}
//               </span>
//               {activeTab === tab.id && <div className="absolute -bottom-2 w-full h-0.5 bg-red-600"></div>}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Accessories Table/List */}
//       <div className="space-y-4">
//         {accessoryList.filter(item => item.category === activeTab).map((item) => (
//           <div key={item.id} className={`p-6 rounded-3xl flex flex-col md:flex-row items-center gap-6 group hover:border-gray-600 transition-all ${cardBg} ${border}`}>
//             {/* Image Preview */}
//             <div className={`w-24 h-24 rounded-2xl flex items-center justify-center p-2 ${cardBg} ${border}`}>
//               <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
//             </div>

//             {/* Details */}
//             <div className="flex-1 space-y-1 text-center md:text-left">
//               <div className="flex flex-col md:flex-row md:items-center gap-2">
//                 <h3 className={`text-lg font-bold uppercase ${text}`}>{item.name}</h3>
//                 <span className="bg-red-900/20 text-red-500 text-[10px] font-bold px-3 py-0.5 rounded-full w-fit mx-auto md:mx-0 border border-red-900/50">
//                   {item.category}
//                 </span>
//               </div>
//               <p className={`text-xs line-clamp-2 ${textSecondary}`}>{item.specs}</p>
//               <div className="flex flex-col md:flex-row md:items-center gap-2 pt-2">
//                 <p className={`text-xl font-black ${text}`}>₹ {item.price}/-</p>
//                 <span className={`text-xs ${textSecondary}`}>Qty: {item.quantity || 'N/A'}</span>
//               </div>
//             </div>

//             {/* Admin Actions */}
//             <div className="flex gap-3">
//               <button onClick={() => handleEdit(item)} className="bg-[#25282c] hover:bg-gray-700 text-gray-300 p-3 rounded-xl transition">
//                 <Edit size={18} />
//               </button>
//               <button onClick={() => handleDelete(item.id)} className="bg-red-900/10 hover:bg-red-600 text-red-500 hover:text-white p-3 rounded-xl transition border border-red-900/20">
//                 <Trash2 size={18} />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Add Item Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/90 backdrop-blur-sm">
//           <div className={`w-full max-w-sm rounded-xl shadow-2xl ${cardBg} ${border}`}>
//             <div className="bg-red-600 p-3 flex justify-between items-center text-white">
//               <h2 className="font-black uppercase tracking-widest text-xs">{editingId ? 'Edit Item' : 'Add New Item'}</h2>
//               <button onClick={() => setIsModalOpen(false)} className="hover:rotate-90 transition-transform">×</button>
//             </div>
//             <form onSubmit={handleSubmit} className="p-3 space-y-2">
//               <div className="col-span-2 mb-2">
//                 <div className={`flex items-center justify-center border border-dashed rounded-lg p-2 hover:border-red-600 transition-all cursor-pointer ${cardBg} ${border}`} 
//                      onClick={() => fileInputRef.current.click()}>
//                   <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
//                   {formData.image ? (
//                     <img src={formData.image} alt="preview" className="h-12 rounded object-contain" />
//                   ) : (
//                     <div className={`flex items-center gap-1 ${textSecondary}`}>
//                       <Upload size={14} />
//                       <span className="text-[8px] font-black uppercase">Upload</span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 gap-2">
//                 <div>
//                   <label className={`text-[8px] font-black uppercase ${textSecondary}`}>Item Name</label>
//                   <input required type="text" className={`w-full rounded-lg p-1.5 focus:border-red-600 outline-none text-xs ${cardBg} ${border} ${text}`} 
//                     value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
//                 </div>
//                 <div>
//                   <label className={`text-[8px] font-black uppercase ${textSecondary}`}>Category</label>
//                   <select className={`w-full rounded-lg p-1.5 focus:border-red-600 outline-none text-xs ${cardBg} ${border} ${text}`}
//                     value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
//                     {tabs.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
//                   </select>
//                 </div>
//                 <div className="col-span-2">
//                   <label className={`text-[8px] font-black uppercase ${textSecondary}`}>Specifications</label>
//                   <textarea required rows="1" className={`w-full rounded-lg p-1.5 focus:border-red-600 outline-none text-[9px] ${cardBg} ${border} ${text}`} 
//                     value={formData.specs} onChange={(e) => setFormData({...formData, specs: e.target.value})} />
//                 </div>
//                 <div>
//                   <label className={`text-[8px] font-black uppercase ${textSecondary}`}>Price</label>
//                   <input required type="number" className={`w-full rounded-lg p-1.5 focus:border-red-600 outline-none text-xs ${cardBg} ${border} ${text}`} 
//                     value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
//                 </div>
//                 <div>
//                   <label className={`text-[8px] font-black uppercase ${textSecondary}`}>Quantity</label>
//                   <input required type="number" className={`w-full rounded-lg p-1.5 focus:border-red-600 outline-none text-xs ${cardBg} ${border} ${text}`} 
//                     value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} placeholder="Stock Qty" />
//                 </div>
//               </div>
//               <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-black uppercase tracking-widest transition shadow-lg text-xs">
//                 {editingId ? 'Update' : 'Add Item'}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };


// export default AccessoriesManager;
// import React, { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import { Monitor, Keyboard, Mouse, Headset, Gamepad, Plus, Edit, Trash2, Upload } from 'lucide-react';
// import { useTheme } from '../context/ThemeContext';

// const AccessoriesManager = () => {
//   const { cardBg, border, text, textSecondary } = useTheme();
//   const [activeTab, setActiveTab] = useState('MONITOR');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const fileInputRef = useRef(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     specs: '',
//     price: '',
//     quantity: '',
//     category: 'MONITOR',
//     image: null
//   });
//   const [accessoryList, setAccessoryList] = useState([]);

//   const API = "http://localhost:8080/api/admin/accessories"; // backend URL

//   // Load accessories by category
//   const loadAccessories = async () => {
//     try {
//       const res = await axios.get(`${API}/${activeTab}`);
//       setAccessoryList(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     loadAccessories();
//   }, [activeTab]);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFormData({ ...formData, image: reader.result });
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editingId) {
//         await axios.put(`${API}/${editingId}`, formData);
//       } else {
//         await axios.post(API, formData);
//       }
//       setIsModalOpen(false);
//       setEditingId(null);
//       setFormData({ name: '', specs: '', price: '', quantity: '', category: activeTab, image: null });
//       loadAccessories(); // reload list
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleEdit = (item) => {
//     setFormData(item);
//     setEditingId(item.id);
//     setIsModalOpen(true);
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Delete this item?')) {
//       try {
//         await axios.delete(`${API}/${id}`);
//         setAccessoryList(accessoryList.filter(item => item.id !== id));
//       } catch (err) {
//         console.error(err);
//       }
//     }
//   };

//   const tabs = [
//     { id: 'MONITOR', icon: <Monitor />, label: 'MONITOR' },
//     { id: 'KEYBOARD', icon: <Keyboard />, label: 'KEYBOARD' },
//     { id: 'MOUSE', icon: <Mouse />, label: 'MOUSE' },
//     { id: 'HEADSET', icon: <Headset />, label: 'HEADSET' },
//     { id: 'SIMULATOR', icon: <Gamepad />, label: 'SIMULATOR' },
//   ];

//   return (
//     <div className="space-y-8 animate-in fade-in duration-500">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div>
//           <h1 className={`text-2xl font-black uppercase tracking-tighter ${text}`}>
//             ACCESSORIES <span className="text-red-600">INVENTORY</span>
//           </h1>
//           <p className={`text-sm ${textSecondary}`}>Manage user add-ons, pricing, and visibility</p>
//         </div>
//         <button onClick={() => setIsModalOpen(true)} className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-red-900/20 transition-all active:scale-95">
//           <Plus size={18} /> ADD NEW ITEM
//         </button>
//       </div>

//       {/* Tabs */}
//       <div className={`p-6 rounded-3xl shadow-xl ${cardBg} ${border}`}>
//         <div className="flex flex-wrap justify-center gap-8 md:gap-14">
//           {tabs.map((tab) => (
//             <div 
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className="flex flex-col items-center gap-3 cursor-pointer relative group"
//             >
//               <div className={`p-4 rounded-2xl transition-all duration-300 ${activeTab === tab.id ? 'text-red-600 bg-red-600/10' : `${text} hover:text-red-400 opacity-60`}`}>
//                 {React.cloneElement(tab.icon, { size: 28 })}
//               </div>
//               <span className={`text-[10px] font-black tracking-widest ${activeTab === tab.id ? 'text-red-600' : text}`}>
//                 {tab.label}
//               </span>
//               {activeTab === tab.id && <div className="absolute -bottom-2 w-full h-0.5 bg-red-600"></div>}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Accessories List */}
//       <div className="space-y-4">
//         {accessoryList.map((item) => (
//           <div key={item.id} className={`p-6 rounded-3xl flex flex-col md:flex-row items-center gap-6 group hover:border-gray-600 transition-all ${cardBg} ${border}`}>
//             <div className={`w-24 h-24 rounded-2xl flex items-center justify-center p-2 ${cardBg} ${border}`}>
//               <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
//             </div>
//             <div className="flex-1 space-y-1 text-center md:text-left">
//               <div className="flex flex-col md:flex-row md:items-center gap-2">
//                 <h3 className={`text-lg font-bold uppercase ${text}`}>{item.name}</h3>
//                 <span className="bg-red-900/20 text-red-500 text-[10px] font-bold px-3 py-0.5 rounded-full w-fit mx-auto md:mx-0 border border-red-900/50">
//                   {item.category}
//                 </span>
//               </div>
//               <p className={`text-xs line-clamp-2 ${textSecondary}`}>{item.specs}</p>
//               <div className="flex flex-col md:flex-row md:items-center gap-2 pt-2">
//                 <p className={`text-xl font-black ${text}`}>₹ {item.price}/-</p>
//                 <span className={`text-xs ${textSecondary}`}>Qty: {item.quantity || 'N/A'}</span>
//               </div>
//             </div>
//             <div className="flex gap-3">
//               <button onClick={() => handleEdit(item)} className="bg-[#25282c] hover:bg-gray-700 text-gray-300 p-3 rounded-xl transition">
//                 <Edit size={18} />
//               </button>
//               <button onClick={() => handleDelete(item.id)} className="bg-red-900/10 hover:bg-red-600 text-red-500 hover:text-white p-3 rounded-xl transition border border-red-900/20">
//                 <Trash2 size={18} />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/90 backdrop-blur-sm">
//           <div className={`w-full max-w-sm rounded-xl shadow-2xl ${cardBg} ${border}`}>
//             <div className="bg-red-600 p-3 flex justify-between items-center text-white">
//               <h2 className="font-black uppercase tracking-widest text-xs">{editingId ? 'Edit Item' : 'Add New Item'}</h2>
//               <button onClick={() => setIsModalOpen(false)} className="hover:rotate-90 transition-transform">×</button>
//             </div>
//             <form onSubmit={handleSubmit} className="p-3 space-y-2">
//               <div className="col-span-2 mb-2">
//                 <div className={`flex items-center justify-center border border-dashed rounded-lg p-2 hover:border-red-600 transition-all cursor-pointer ${cardBg} ${border}`} 
//                      onClick={() => fileInputRef.current.click()}>
//                   <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
//                   {formData.image ? (
//                     <img src={formData.image} alt="preview" className="h-12 rounded object-contain" />
//                   ) : (
//                     <div className={`flex items-center gap-1 ${textSecondary}`}>
//                       <Upload size={14} />
//                       <span className="text-[8px] font-black uppercase">Upload</span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 gap-2">
//                 <div>
//                   <label className={`text-[8px] font-black uppercase ${textSecondary}`}>Item Name</label>
//                   <input required type="text" className={`w-full rounded-lg p-1.5 focus:border-red-600 outline-none text-xs ${cardBg} ${border} ${text}`} 
//                     value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
//                 </div>
//                 <div>
//                   <label className={`text-[8px] font-black uppercase ${textSecondary}`}>Category</label>
//                   <select className={`w-full rounded-lg p-1.5 focus:border-red-600 outline-none text-xs ${cardBg} ${border} ${text}`}
//                     value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
//                     {tabs.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
//                   </select>
//                 </div>
//                 <div className="col-span-2">
//                   <label className={`text-[8px] font-black uppercase ${textSecondary}`}>Specifications</label>
//                   <textarea required rows="1" className={`w-full rounded-lg p-1.5 focus:border-red-600 outline-none text-[9px] ${cardBg} ${border} ${text}`} 
//                     value={formData.specs} onChange={(e) => setFormData({...formData, specs: e.target.value})} />
//                 </div>
//                 <div>
//                   <label className={`text-[8px] font-black uppercase ${textSecondary}`}>Price</label>
//                   <input required type="number" className={`w-full rounded-lg p-1.5 focus:border-red-600 outline-none text-xs ${cardBg} ${border} ${text}`} 
//                     value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
//                 </div>
//                 <div>
//                   <label className={`text-[8px] font-black uppercase ${textSecondary}`}>Quantity</label>
//                   <input required type="number" className={`w-full rounded-lg p-1.5 focus:border-red-600 outline-none text-xs ${cardBg} ${border} ${text}`} 
//                     value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} placeholder="Stock Qty" />
//                 </div>
//               </div>
//               <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-black uppercase tracking-widest transition shadow-lg text-xs">
//                 {editingId ? 'Update' : 'Add Item'}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AccessoriesManager;
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Monitor, Keyboard, Mouse, Headset, Gamepad, Plus, Edit, Trash2, Upload } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const AccessoriesManager = () => {
  const { cardBg, border, text, textSecondary } = useTheme();
  const [activeTab, setActiveTab] = useState('MONITOR');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    specs: '',
    price: '',
    quantity: '',
    category: 'MONITOR',
    image: null
  });

  const [accessoryList, setAccessoryList] = useState([]);
  const API = "http://localhost:8181/api/admin/accessories"; // backend URL

  // Fetch all accessories
  const loadAccessories = async () => {
    try {
      const res = await axios.get(API); // fetch all items
      setAccessoryList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadAccessories(); // load on mount
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, formData);
        alert('Item updated successfully!');
      } else {
        await axios.post(API, formData);
        alert('Item added successfully!');
      }
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ name: '', specs: '', price: '', quantity: '', category: activeTab, image: null });
      loadAccessories(); // reload all items
    } catch (err) {
      console.error(err);
      alert('Error saving item!');
    }
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditingId(item.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Item deleted successfully!')) {
      try {
        await axios.delete(`${API}/${id}`);
        setAccessoryList(accessoryList.filter(item => item.id !== id));
       
      } catch (err) {
        console.error(err);
        alert('Error deleting item!');
      }
    }
  };

  const tabs = [
    { id: 'MONITOR', icon: <Monitor />, label: 'MONITOR' },
    { id: 'KEYBOARD', icon: <Keyboard />, label: 'KEYBOARD' },
    { id: 'MOUSE', icon: <Mouse />, label: 'MOUSE' },
    { id: 'HEADSET', icon: <Headset />, label: 'HEADSET' },
    { id: 'SIMULATOR', icon: <Gamepad />, label: 'SIMULATOR' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className={`text-2xl font-black uppercase tracking-tighter ${text}`}>
            ACCESSORIES <span className="text-red-600">INVENTORY</span>
          </h1>
          <p className={`text-sm ${textSecondary}`}>Manage user add-ons, pricing, and visibility</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-red-900/20 transition-all active:scale-95">
          <Plus size={18} /> ADD NEW ITEM
        </button>
      </div>

      {/* Tabs */}
      <div className={`p-6 rounded-3xl shadow-xl ${cardBg} ${border}`}>
        <div className="flex flex-wrap justify-center gap-8 md:gap-14">
          {tabs.map((tab) => (
            <div 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-center gap-3 cursor-pointer relative group"
            >
              <div className={`p-4 rounded-2xl transition-all duration-300 ${activeTab === tab.id ? 'text-red-600 bg-red-600/10' : `${text} hover:text-red-400 opacity-60`}`}>
                {React.cloneElement(tab.icon, { size: 28 })}
              </div>
              <span className={`text-[10px] font-black tracking-widest ${activeTab === tab.id ? 'text-red-600' : text}`}>
                {tab.label}
              </span>
              {activeTab === tab.id && <div className="absolute -bottom-2 w-full h-0.5 bg-red-600"></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Accessories List */}
      <div className="space-y-4">
        {accessoryList
          .filter(item => item.category === activeTab) // filter locally by activeTab
          .map((item) => (
          <div key={item.id} className={`p-6 rounded-3xl flex flex-col md:flex-row items-center gap-6 group hover:border-gray-600 transition-all ${cardBg} ${border}`}>
            <div className={`w-24 h-24 rounded-2xl flex items-center justify-center p-2 ${cardBg} ${border}`}>
              <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
            </div>
            <div className="flex-1 space-y-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <h3 className={`text-lg font-bold uppercase ${text}`}>{item.name}</h3>
                <span className="bg-red-900/20 text-red-500 text-[10px] font-bold px-3 py-0.5 rounded-full w-fit mx-auto md:mx-0 border border-red-900/50">
                  {item.category}
                </span>
              </div>
              <p className={`text-xs line-clamp-2 ${textSecondary}`}>{item.specs}</p>
              <div className="flex flex-col md:flex-row md:items-center gap-2 pt-2">
                <p className={`text-xl font-black ${text}`}>₹ {item.price}/-</p>
                <span className={`text-xs ${item.quantity === 0 ? 'text-red-500' : textSecondary}`}>
                  {item.quantity === 0 ? 'Stock Not Available' : `Qty: ${item.quantity || 'N/A'}`}
                </span>
              </div>
            </div>
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/90 backdrop-blur-sm">
          <div className={`w-full max-w-sm rounded-xl shadow-2xl ${cardBg} ${border}`}>
            <div className="bg-red-600 p-3 flex justify-between items-center text-white">
              <h2 className="font-black uppercase tracking-widest text-xs">{editingId ? 'Edit Item' : 'Add New Item'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="hover:rotate-90 transition-transform">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-3 space-y-2">
              <div className="col-span-2 mb-2">
                <div className={`flex items-center justify-center border border-dashed rounded-lg p-2 hover:border-red-600 transition-all cursor-pointer ${cardBg} ${border}`} 
                     onClick={() => fileInputRef.current.click()}>
                  <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                  {formData.image ? (
                    <img src={formData.image} alt="preview" className="h-12 rounded object-contain" />
                  ) : (
                    <div className={`flex items-center gap-1 ${textSecondary}`}>
                      <Upload size={14} />
                      <span className="text-[8px] font-black uppercase">Upload</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={`text-[8px] font-black uppercase ${textSecondary}`}>Item Name</label>
                  <input required type="text" className={`w-full rounded-lg p-1.5 focus:border-red-600 outline-none text-xs ${cardBg} ${border} ${text}`} 
                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className={`text-[8px] font-black uppercase ${textSecondary}`}>Category</label>
                  <select className={`w-full rounded-lg p-1.5 focus:border-red-600 outline-none text-xs ${cardBg} ${border} ${text}`}
                    value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                    {tabs.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className={`text-[8px] font-black uppercase ${textSecondary}`}>Specifications</label>
                  <textarea required rows="1" className={`w-full rounded-lg p-1.5 focus:border-red-600 outline-none text-[9px] ${cardBg} ${border} ${text}`} 
                    value={formData.specs} onChange={(e) => setFormData({...formData, specs: e.target.value})} />
                </div>
                <div>
                  <label className={`text-[8px] font-black uppercase ${textSecondary}`}>Price</label>
                  <input required type="number" className={`w-full rounded-lg p-1.5 focus:border-red-600 outline-none text-xs ${cardBg} ${border} ${text}`} 
                    value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                </div>
                <div>
                  <label className={`text-[8px] font-black uppercase ${textSecondary}`}>Quantity</label>
                  <input required type="number" className={`w-full rounded-lg p-1.5 focus:border-red-600 outline-none text-xs ${cardBg} ${border} ${text}`} 
                    value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} placeholder="Stock Qty" />
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
