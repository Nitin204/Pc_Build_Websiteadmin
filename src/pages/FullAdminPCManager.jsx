import React, { useState, useRef } from 'react';
import { PlusCircle, Trash2, Monitor, Upload, Edit3, XCircle, ListPlus, ShieldCheck, ChevronDown } from 'lucide-react';

const FullAdminPCManager = () => {
    const [savedBuilds, setSavedBuilds] = useState([]);
    const [isEditing, setIsEditing] = useState(null);
    const fileInputRef = useRef(null);

    // --- Data Mappings provided by you ---
    const componentFields = ["Processor", "Chipset", "RAM", "GPU", "Cooler", "Storage", "Power Supply", "Cabinet"];
    
    const subFieldMapping = {
        "Processor": [
            { label: "Platform", key: "platform", options: ["AMD", "Intel"] },
            { label: "Series", key: "processor_series", options: ["5000", "7000", "800", "9000"] },
            { label: "GPU Type", key: "gpu_type", options: ["Dedicated", "In-Build"] },
            { label: "Model", key: "processor_model", options: ["Ryzen 5 5500", "Ryzen 7 5700X"] },
        ],
        "Chipset": [{ label: "Model", key: "chipset_model", options: ["B450M", "B450M WiFi", "B550M WiFi"] }],
        "RAM": [
            { label: "RGB", key: "ram_rgb", options: ["Yes", "No"] },
            { label: "Size/Speed", key: "ram_size", options: ["8GB 3200MHz(8x1)", "16GB 3200MHz(16x1)", "16GB 3200MHz(8x2)", "32GB 3200MHz(32x1)"] },
        ],
        "GPU": [
            { label: "Brand", key: "gpu_brand", options: ["AMD", "NVIDIA"] },
            { label: "Model", key: "gpu_model", options: ["Radeon RX 580 8GB GDDR5", "RTX 4060", "RTX 4070"] },
        ],
        "Cooler": [{ label: "Model", key: "cooler_model", options: ["Premium Air Cooler", "AIO 240mm", "AIO 360mm"] }],
        "Storage": [
            { label: "Primary", key: "primary_storage", options: ["256GB M.2 NVMe Gen 3 SSD", "1TB M.2 NVMe Gen 4 SSD"] },
            { label: "Secondary", key: "secondary_storage", options: ["None", "2TB HDD", "500GB SSD"] },
        ],
        "Power Supply": [{ label: "Model", key: "psu_model", options: ["1000W 80+ Gold", "750W 80+ Bronze"] }],
        "Cabinet": [
            { label: "Brand", key: "cabinet_brand", options: ["Lian Li", "NZXT"] },
            { label: "Model", key: "cabinet_model", options: ["O11 Vision (Black)", "H5 Flow"] },
        ],
    };

    // Initialize state with keys from subFieldMapping
    const emptySpecs = {};
    Object.values(subFieldMapping).flat().forEach(field => { emptySpecs[field.key] = field.options[0]; });

    const [pcBuild, setPcBuild] = useState({
        name: "",
        price: "",
        discountPrice: "",
        preview: null,
        specs: emptySpecs,
        features: ["RGB Lighting Control", "Liquid Cooling System"],
        warranty: ["3 Year Warranty", "Free Delivery"]
    });

    const handleSpecChange = (key, value) => {
        setPcBuild(prev => ({ ...prev, specs: { ...prev.specs, [key]: value } }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) setPcBuild({ ...pcBuild, preview: URL.createObjectURL(file) });
    };

    const handleSubmit = () => {
        if (isEditing) {
            setSavedBuilds(savedBuilds.map(b => b.id === isEditing ? { ...pcBuild, id: isEditing } : b));
            setIsEditing(null);
        } else {
            setSavedBuilds([...savedBuilds, { ...pcBuild, id: Date.now() }]);
        }
        resetForm();
    };

    const resetForm = () => {
        setIsEditing(null);
        setPcBuild({
            name: "", price: "", discountPrice: "", preview: null,
            specs: emptySpecs,
            features: [], warranty: []
        });
    };

    return (
        
        <div className="min-h-screen  text-white p-4 font-sans">
            <div>
         
          <h1 className="text-2xl font-black text-white uppercase  tracking-tighter ">
            Build  <span className="text-red-600">PC</span>
          </h1>
          <p className="text-gray-500 text-sm mb-10">Configure user-end PC selector settings</p>
        </div>

            <div className="max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-6">
                
                
                {/* --- Left: Detailed Form --- */}
                <div className="xl:col-span-8 space-y-6">
                    <div className="bg-[#111] p-6 rounded-2xl border border-gray-800 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-red-500 flex items-center gap-2 uppercase tracking-tighter">
                                {isEditing ? <Edit3 /> : <PlusCircle />} {isEditing ? "Edit Fusion Build" : "Add New Fusion Gaming PC"}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Left Side: Photo & Basic Info */}
                            <div className="md:col-span-1 space-y-4">
                                <div onClick={() => fileInputRef.current.click()} className="aspect-square bg-black border-2 border-dashed border-gray-800 rounded-2xl flex items-center justify-center cursor-pointer hover:border-red-600 transition-all overflow-hidden relative">
                                    {pcBuild.preview ? (
                                        <img src={pcBuild.preview} className="w-full h-full object-contain p-4" alt="PC" />
                                    ) : (
                                        <div className="text-center text-gray-600"><Upload className="mx-auto mb-2" /><p className="text-[10px] uppercase">Upload PC Photo</p></div>
                                    )}
                                    <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
                                </div>
                                <input type="text" placeholder="PC Title" className="w-full bg-black border border-gray-800 p-3 rounded-lg text-sm" value={pcBuild.name} onChange={(e) => setPcBuild({...pcBuild, name: e.target.value})} />
                                <div className="flex gap-2">
                                    <input type="text" placeholder="MRP" className="w-1/2 bg-black border border-gray-800 p-2 rounded text-xs" value={pcBuild.price} onChange={(e) => setPcBuild({...pcBuild, price: e.target.value})} />
                                    <input type="text" placeholder="Offer Price" className="w-1/2 bg-black border border-gray-800 p-2 rounded text-xs text-green-500 font-bold" value={pcBuild.discountPrice} onChange={(e) => setPcBuild({...pcBuild, discountPrice: e.target.value})} />
                                </div>
                            </div>

                            {/* Right Side: Categorized Sub-fields */}
                            <div className="md:col-span-2 space-y-6">
                                <h3 className="text-[10px] uppercase text-gray-500 font-bold tracking-[3px] border-b border-gray-800 pb-2">Technical Configuration</h3>
                                <div className="grid grid-cols-1 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                    {componentFields.map((compName) => (
                                        <div key={compName} className="bg-[#0a0a0a] p-4 rounded-xl border border-gray-800/50">
                                            <p className="text-[10px] font-black text-gray-400 uppercase mb-3 tracking-widest">{compName}</p>
                                            <div className="grid grid-cols-2 gap-3">
                                                {subFieldMapping[compName].map((field) => (
                                                    <div key={field.key} className="space-y-1">
                                                        <label className="text-[9px] uppercase text-gray-600 font-bold ml-1">{field.label}</label>
                                                        <div className="relative">
                                                            <select 
                                                                className="w-full bg-black border border-gray-800 p-2 rounded text-[11px] appearance-none focus:border-red-600 outline-none pr-8 cursor-pointer"
                                                                value={pcBuild.specs[field.key]}
                                                                onChange={(e) => handleSpecChange(field.key, e.target.value)}
                                                            >
                                                                {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                            </select>
                                                            <ChevronDown size={12} className="absolute right-2 top-2.5 text-gray-600 pointer-events-none" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Features & Warranty */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 border-t border-gray-800 pt-6">
                            <div className="space-y-3">
                                <h3 className="text-[10px] uppercase text-red-500 font-bold flex items-center gap-2"><ListPlus size={14}/> Premium Features</h3>
                                <textarea className="w-full bg-black border border-gray-800 p-3 rounded-lg text-xs h-20" value={pcBuild.features.join('\n')} onChange={(e) => setPcBuild({...pcBuild, features: e.target.value.split('\n')})} />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-[10px] uppercase text-blue-500 font-bold flex items-center gap-2"><ShieldCheck size={14}/> Warranty & Support</h3>
                                <textarea className="w-full bg-black border border-gray-800 p-3 rounded-lg text-xs h-20" value={pcBuild.warranty.join('\n')} onChange={(e) => setPcBuild({...pcBuild, warranty: e.target.value.split('\n')})} />
                            </div>
                        </div>

                        <button onClick={handleSubmit} className="w-full mt-6 bg-red-600 hover:bg-red-700 py-4 rounded-xl font-bold text-sm tracking-widest transition-all uppercase shadow-lg shadow-red-900/20">
                            {isEditing ? "Update Configuration" : "Publish Combination"}
                        </button>
                    </div>
                </div>

                {/* --- Right: Inventory Preview --- */}
                <div className="xl:col-span-4 space-y-4">
                    <h2 className="text-gray-500 text-xs font-bold uppercase flex items-center gap-2 px-2"><Monitor size={14}/> Saved Inventory ({savedBuilds.length})</h2>
                    <div className="space-y-4 max-h-[85vh] overflow-y-auto pr-2 custom-scrollbar">
                        {savedBuilds.map((build) => (
                            <div key={build.id} className="bg-[#111] border border-gray-800 rounded-2xl p-4 flex gap-4 group hover:border-gray-600 transition-all">
                                <img src={build.preview} className="w-20 h-20 object-contain bg-black rounded-lg border border-gray-800 p-2" alt="Build" />
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm text-white">{build.name || "Unnamed Build"}</h4>
                                    <p className="text-green-500 font-bold text-xs">₹{build.discountPrice}</p>
                                    <div className="flex gap-2 mt-3">
                                        <button onClick={() => { setIsEditing(build.id); setPcBuild(build); }} className="flex-1 bg-gray-900 hover:bg-red-600 py-2 rounded text-[10px] uppercase font-bold transition-all">Edit</button>
                                        <button onClick={() => setSavedBuilds(savedBuilds.filter(b => b.id !== build.id))} className="bg-gray-900 hover:bg-red-900 p-2 rounded transition-all"><Trash2 size={14}/></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FullAdminPCManager;