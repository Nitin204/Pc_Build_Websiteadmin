import React, { useState } from 'react';
import { Gamepad2, Bot, Building2, Camera, TrendingUp, Edit, Save, Plus } from 'lucide-react';

const PreBuiltManager = () => {
  const [selectedCat, setSelectedCat] = useState('GAMING');
  const [budget, setBudget] = useState(250000);

  const categories = [
    { id: 'GAMING', icon: <Gamepad2 />, label: 'GAMING' },
    { id: 'AI/ML', icon: <Bot />, label: 'AI/ML' },
    { id: 'ARCHITECTURE', icon: <Building2 />, label: 'ARCHITECTURE' },
    { id: 'EDITING', icon: <Camera />, label: 'EDITING' },
    { id: 'TRADING', icon: <TrendingUp />, label: 'TRADING' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">
            PRE-BUILTS <span className="text-red-600">MANAGER</span>
          </h1>
          <p className="text-gray-500 text-sm">Configure user-end PC selector settings</p>
        </div>
        <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition">
          <Plus size={18} /> Add New Tier
        </button>
      </div>

      {/* Category Selection Controller */}
      <div className="bg-[#1a1c1e] p-8 rounded-3xl border border-gray-800">
        <h3 className="text-red-600 text-center font-bold mb-8 tracking-widest text-xs uppercase">Edit Categories</h3>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {categories.map((cat) => (
            <div 
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className="flex flex-col items-center gap-4 cursor-pointer group"
            >
              <div className={`p-4 rounded-2xl transition-all duration-300 ${selectedCat === cat.id ? 'text-red-600 scale-110 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'text-white hover:text-red-400 opacity-60'}`}>
                {React.cloneElement(cat.icon, { size: 32 })}
              </div>
              <span className={`text-[10px] font-black tracking-widest ${selectedCat === cat.id ? 'text-red-600 border-b-2 border-red-600' : 'text-white'}`}>
                {cat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Budget & Specs Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Slider Preview & Price Config */}
        <div className="bg-[#1a1c1e] p-8 rounded-3xl border border-gray-800 space-y-6">
          <h3 className="text-red-600 font-bold tracking-widest text-xs uppercase">Budget Settings ({selectedCat})</h3>
          
          <div className="space-y-4">
            <label className="text-xs text-gray-500 font-bold uppercase">Set Current Preview Budget</label>
            <input 
              type="range" 
              min="50000" 
              max="500000" 
              step="10000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-red-600"
            />
            <div className="text-center">
              <span className="text-2xl font-black text-white">₹ {Number(budget).toLocaleString()}/-</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="bg-[#121417] p-4 rounded-2xl border border-gray-800">
              <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Min Budget</p>
              <input type="text" defaultValue="₹ 50,000" className="bg-transparent text-white font-bold w-full outline-none" />
            </div>
            <div className="bg-[#121417] p-4 rounded-2xl border border-gray-800">
              <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Max Budget</p>
              <input type="text" defaultValue="₹ 5,00,000" className="bg-transparent text-white font-bold w-full outline-none" />
            </div>
          </div>
        </div>

        {/* Suggested Components Editor */}
        <div className="bg-[#1a1c1e] p-8 rounded-3xl border border-gray-800 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-red-600 font-bold tracking-widest text-xs uppercase">Auto-Suggest Components</h3>
            <button className="text-gray-400 hover:text-white transition"><Edit size={16}/></button>
          </div>

          <div className="space-y-3">
             {[
               { part: 'CPU', name: 'Intel Core i9-14900K' },
               { part: 'GPU', name: 'NVIDIA RTX 4090 24GB' },
               { part: 'RAM', name: '64GB DDR5 6000MHz' },
               { part: 'Storage', name: '2TB NVMe Gen4 SSD' }
             ].map((item, idx) => (
               <div key={idx} className="flex justify-between items-center bg-[#121417] p-4 rounded-xl border border-gray-800">
                 <span className="text-[10px] font-black text-red-600 uppercase w-16">{item.part}</span>
                 <span className="text-xs font-bold text-gray-300">{item.name}</span>
                 <Save size={14} className="text-gray-600 cursor-pointer hover:text-red-500" />
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Product List for Selected Category */}
      <div className="bg-[#1a1c1e] p-8 rounded-3xl border border-gray-800 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-red-600 font-bold tracking-widest text-xs uppercase">{selectedCat} Products</h3>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition">
            <Plus size={14} /> Add New Product
          </button>
        </div>
        
        <div className="space-y-4">
          {selectedCat === 'GAMING' && [
            {
              name: 'Fusion Gaming Master PC',
              specs: 'Core i9 14900K/Z790 WiFi Premium/64GB 5200MHz DDR5 RAM/MSI RTX 4080 Ti 16GB GDDR6/Platform AIO Liquid Cooler/750W 80+ Bronze/2TB M.2 NVMe Gen 4 SSD/Diamond Crystal Argb Mystic Black',
              price: '₹ 2,19,244/-',
              originalPrice: '₹ 2,49,244/-',
              save: '₹ 30,000/-'
            },
            {
              name: 'Budget Gaming PC',
              specs: 'Core i5 12400F/B660M WiFi/16GB DDR4 3200MHz/Nvidia RTX 4060 8GB/Stock Cooler/550W 80+ Bronze/500GB NVMe SSD/Cooler Master/ARGB',
              price: '₹ 73,500/-',
              originalPrice: '₹ 83,500/-',
              save: '₹ 10,000/-'
            }
          ].map((product, idx) => (
            <div key={idx} className="flex gap-4 bg-[#121417] p-4 rounded-xl border border-gray-800">
              <div className="w-20 h-20 bg-black rounded-lg border border-gray-700 flex items-center justify-center">
                <div className="w-16 h-16 bg-gray-800 rounded"></div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-white font-bold text-sm">{product.name}</h4>
                  <span className="bg-red-600 text-white text-[10px] px-2 py-1 rounded uppercase font-bold">GAMING</span>
                </div>
                <p className="text-gray-400 text-xs mb-3 leading-relaxed">{product.specs}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <span className="text-green-500 font-bold text-sm">{product.price}</span>
                    <span className="text-gray-500 line-through text-xs">{product.originalPrice}</span>
                    <span className="text-red-500 text-xs font-bold">SAVE: {product.save}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-bold transition">EDIT</button>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs font-bold transition">UPDATE</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {selectedCat === 'AI/ML' && [
            {
              name: 'AI Workstation Pro',
              specs: 'AMD Ryzen 9 7950X/X670E WiFi/128GB DDR5 5600MHz/NVIDIA RTX 4090 24GB/Custom Loop Cooling/1000W 80+ Gold/4TB NVMe Gen4 SSD',
              price: '₹ 4,50,000/-',
              originalPrice: '₹ 5,00,000/-',
              save: '₹ 50,000/-'
            }
          ].map((product, idx) => (
            <div key={idx} className="flex gap-4 bg-[#121417] p-4 rounded-xl border border-gray-800">
              <div className="w-20 h-20 bg-black rounded-lg border border-gray-700 flex items-center justify-center">
                <div className="w-16 h-16 bg-gray-800 rounded"></div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-white font-bold text-sm">{product.name}</h4>
                  <span className="bg-blue-600 text-white text-[10px] px-2 py-1 rounded uppercase font-bold">AI/ML</span>
                </div>
                <p className="text-gray-400 text-xs mb-3 leading-relaxed">{product.specs}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <span className="text-green-500 font-bold text-sm">{product.price}</span>
                    <span className="text-gray-500 line-through text-xs">{product.originalPrice}</span>
                    <span className="text-red-500 text-xs font-bold">SAVE: {product.save}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-bold transition">EDIT</button>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs font-bold transition">UPDATE</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {selectedCat === 'ARCHITECTURE' && [
            {
              name: 'CAD Workstation Elite',
              specs: 'Intel Xeon W-2295/C621 Chipset/64GB ECC DDR4/NVIDIA RTX A6000 48GB/Tower Cooler/850W 80+ Platinum/2TB NVMe + 4TB HDD',
              price: '₹ 6,75,000/-',
              originalPrice: '₹ 7,25,000/-',
              save: '₹ 50,000/-'
            }
          ].map((product, idx) => (
            <div key={idx} className="flex gap-4 bg-[#121417] p-4 rounded-xl border border-gray-800">
              <div className="w-20 h-20 bg-black rounded-lg border border-gray-700 flex items-center justify-center">
                <div className="w-16 h-16 bg-gray-800 rounded"></div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-white font-bold text-sm">{product.name}</h4>
                  <span className="bg-purple-600 text-white text-[10px] px-2 py-1 rounded uppercase font-bold">ARCHITECTURE</span>
                </div>
                <p className="text-gray-400 text-xs mb-3 leading-relaxed">{product.specs}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <span className="text-green-500 font-bold text-sm">{product.price}</span>
                    <span className="text-gray-500 line-through text-xs">{product.originalPrice}</span>
                    <span className="text-red-500 text-xs font-bold">SAVE: {product.save}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-bold transition">EDIT</button>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs font-bold transition">UPDATE</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {selectedCat === 'EDITING' && [
            {
              name: 'Video Editing Beast',
              specs: 'AMD Ryzen 9 7900X/X670 WiFi/64GB DDR5 5200MHz/NVIDIA RTX 4080 16GB/AIO 280mm Cooler/750W 80+ Gold/2TB NVMe Gen4 SSD',
              price: '₹ 3,25,000/-',
              originalPrice: '₹ 3,75,000/-',
              save: '₹ 50,000/-'
            }
          ].map((product, idx) => (
            <div key={idx} className="flex gap-4 bg-[#121417] p-4 rounded-xl border border-gray-800">
              <div className="w-20 h-20 bg-black rounded-lg border border-gray-700 flex items-center justify-center">
                <div className="w-16 h-16 bg-gray-800 rounded"></div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-white font-bold text-sm">{product.name}</h4>
                  <span className="bg-orange-600 text-white text-[10px] px-2 py-1 rounded uppercase font-bold">EDITING</span>
                </div>
                <p className="text-gray-400 text-xs mb-3 leading-relaxed">{product.specs}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <span className="text-green-500 font-bold text-sm">{product.price}</span>
                    <span className="text-gray-500 line-through text-xs">{product.originalPrice}</span>
                    <span className="text-red-500 text-xs font-bold">SAVE: {product.save}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-bold transition">EDIT</button>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs font-bold transition">UPDATE</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {selectedCat === 'TRADING' && [
            {
              name: 'Multi-Monitor Trading Setup',
              specs: 'Intel Core i7-13700K/Z690 WiFi/32GB DDR4 3200MHz/NVIDIA GTX 1660 Super/Tower Cooler/650W 80+ Bronze/1TB NVMe SSD',
              price: '₹ 1,85,000/-',
              originalPrice: '₹ 2,15,000/-',
              save: '₹ 30,000/-'
            }
          ].map((product, idx) => (
            <div key={idx} className="flex gap-4 bg-[#121417] p-4 rounded-xl border border-gray-800">
              <div className="w-20 h-20 bg-black rounded-lg border border-gray-700 flex items-center justify-center">
                <div className="w-16 h-16 bg-gray-800 rounded"></div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-white font-bold text-sm">{product.name}</h4>
                  <span className="bg-green-600 text-white text-[10px] px-2 py-1 rounded uppercase font-bold">TRADING</span>
                </div>
                <p className="text-gray-400 text-xs mb-3 leading-relaxed">{product.specs}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <span className="text-green-500 font-bold text-sm">{product.price}</span>
                    <span className="text-gray-500 line-through text-xs">{product.originalPrice}</span>
                    <span className="text-red-500 text-xs font-bold">SAVE: {product.save}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-bold transition">EDIT</button>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs font-bold transition">UPDATE</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PreBuiltManager;