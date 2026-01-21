

import React, { useState, useRef, useEffect } from 'react';
import { PlusCircle, Trash2, Monitor, Upload, Edit3, ListPlus, ShieldCheck, ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

const FullAdminPCManager = () => {
    const { cardBg, border, text, textSecondary, isDark } = useTheme();
    const [savedBuilds, setSavedBuilds] = useState([]);
    const [isEditing, setIsEditing] = useState(null);
    const [popup, setPopup] = useState({ show: false, message: '', type: '' });
    const fileInputRef = useRef(null);

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

    const emptySpecs = {};
    Object.values(subFieldMapping).flat().forEach(field => { emptySpecs[field.key] = field.options[0]; });

    const [pcBuild, setPcBuild] = useState({
        name: "",
        price: "",
        discountPrice: "",
        quantity: 1,
        preview: null,
        specs: emptySpecs,
        features: ["RGB Lighting Control", "Liquid Cooling System"],
        warranty: ["3 Year Warranty", "Free Delivery"]
    });

    const API_BASE = "https://pc-build-websiteabackend-2.onrender.com/api/pcbuilds"; // backend URL

    // Fetch builds from backend
    const fetchBuilds = async () => {
        try {
            const res = await axios.get(API_BASE);
            setSavedBuilds(res.data);
        } catch (err) {
            console.error("Error fetching builds:", err);
        }
    };

   useEffect(() => {
  if (popup.show) {
    const timer = setTimeout(() => {
      setPopup({ show: false, message: '', type: '' });
    }, 2500); // 2.5 seconds

    return () => clearTimeout(timer);
  }
}, [popup.show]);

    useEffect(() => {
        fetchBuilds();
    }, []);


    // Handle spec changes
    const handleSpecChange = (key, value) => {
        setPcBuild(prev => ({ ...prev, specs: { ...prev.specs, [key]: value } }));
    };

    // Handle file upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPcBuild(prev => ({ ...prev, preview: reader.result }));
            reader.readAsDataURL(file); // converts to Base64
        }
    };

    // Ensure valid image src
    const getImageSrc = (image) => {
        if (!image) return null;
        if (image.startsWith("data:image")) return image; // already valid
        return `data:image/png;base64,${image}`; // prepend prefix if needed
    };

    // Submit build
    const handleSubmit = async () => {
        try {
            const payload = {
                name: pcBuild.name,
                price: parseFloat(pcBuild.price),
                discountPrice: parseFloat(pcBuild.discountPrice),
                quantity: parseInt(pcBuild.quantity) || 1,
                specs: pcBuild.specs,
                features: pcBuild.features,
                warranty: pcBuild.warranty,
                image: pcBuild.preview
            };

            if (isEditing) {
                await axios.put(`${API_BASE}/${isEditing}`, payload);
                setPopup({ show: true, message: 'Build updated successfully!', type: 'success' });
            } else {
                await axios.post(API_BASE, payload);
                setPopup({ show: true, message: 'Build added successfully!', type: 'success' });
            }

            resetForm();
            fetchBuilds();
        } catch (err) {
            console.error("Error saving build:", err);
            setPopup({ show: true, message: 'Failed to save build!', type: 'error' });
        }
    };

    // Reset form
    const resetForm = () => {
        setIsEditing(null);
        setPcBuild({
            name: "", price: "", discountPrice: "", quantity: 1,
            preview: null, specs: emptySpecs, features: [], warranty: []
        });
    };

    const handleEdit = (build) => {
        setIsEditing(build.id);
        setPcBuild({
            ...build,
            preview: build.image || build.preview // handle backend field
        });
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_BASE}/${id}`);
            setPopup({ show: true, message: 'Build deleted successfully!', type: 'success' });
            fetchBuilds();
        } catch (err) {
            console.error("Error deleting build:", err);
            setPopup({ show: true, message: 'Failed to delete build!', type: 'error' });
        }
    };

    return (
        <div className={`min-h-screen p-4 font-sans transition-colors duration-300 ${isDark ? 'bg-[#0a0a0a] text-white' : 'bg-gray-50 text-black'}`}>
            <div>
                <h1 className={`text-2xl font-black uppercase tracking-tighter ${text}`}>Build <span className="text-red-600">PC</span></h1>
                <p className={`text-sm mb-10 ${textSecondary}`}>Configure user-end PC selector settings</p>
            </div>

            <div className="max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-6">
                {/* Form */}
                <div className="xl:col-span-8 space-y-6">
                    <div className={`p-6 rounded-2xl shadow-2xl ${cardBg} ${border}`}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className={`text-xl font-bold text-red-500 flex items-center gap-2 uppercase tracking-tighter ${text}`}>
                                {isEditing ? <Edit3 /> : <PlusCircle />} {isEditing ? "Edit Fusion Build" : "Add New Fusion Gaming PC"}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Left: Image & price */}
                            <div className="md:col-span-1 space-y-4">
                                <div onClick={() => fileInputRef.current.click()} className={`aspect-square border-2 border-dashed rounded-2xl flex items-center justify-center cursor-pointer hover:border-red-600 transition-all overflow-hidden relative ${isDark ? 'bg-[#1a1a1a] border-gray-600' : 'bg-white border-gray-300'}`}>
                                    {pcBuild.preview ? (
                                        <img src={getImageSrc(pcBuild.preview)} className="w-full h-full object-contain p-4" alt="PC" />
                                    ) : (
                                        <div className={`text-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                            <Upload className="mx-auto mb-2" />
                                            <p className="text-[10px] uppercase">Upload PC Photo</p>
                                        </div>
                                    )}
                                    <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
                                </div>
                                <input type="text" placeholder="PC Title" className={`w-full p-3 rounded-lg text-sm ${cardBg} ${border} ${text}`} value={pcBuild.name} onChange={(e) => setPcBuild({...pcBuild, name: e.target.value})} />
                                <div className="flex gap-2">
                                    <input type="text" placeholder="MRP" className={`w-1/3 p-2 rounded text-xs ${cardBg} ${border} ${text}`} value={pcBuild.price} onChange={(e) => setPcBuild({...pcBuild, price: e.target.value})} />
                                    <input type="text" placeholder="Offer Price" className={`w-1/3 p-2 rounded text-xs font-bold ${isDark ? 'bg-[#1a1a1a] border-gray-600 text-green-400' : 'bg-green-50 border-green-300 text-green-600'} ${border}`} value={pcBuild.discountPrice} onChange={(e) => setPcBuild({...pcBuild, discountPrice: e.target.value})} />
                                    <input type="number" placeholder="Qty" className={`w-1/3 p-2 rounded text-xs ${cardBg} ${border} ${text}`} value={pcBuild.quantity || ''} onChange={(e) => setPcBuild({...pcBuild, quantity: e.target.value})} />
                                </div>
                            </div>

                            {/* Right: Specs */}
                            <div className="md:col-span-2 space-y-6">
                                <h3 className={`text-[10px] uppercase font-bold tracking-[3px] border-b pb-2 ${textSecondary} ${border}`}>Technical Configuration</h3>
                                <div className="grid grid-cols-1 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                    {componentFields.map((compName) => (
                                        <div key={compName} className={`p-4 rounded-xl ${isDark ? 'bg-[#1a1a1a] border-gray-600' : 'bg-white border-gray-200'} ${border}`}>
                                            <p className={`text-[10px] font-black uppercase mb-3 tracking-widest ${textSecondary}`}>{compName}</p>
                                            <div className="grid grid-cols-2 gap-3">
                                                {subFieldMapping[compName].map((field) => (
                                                    <div key={field.key} className="space-y-1">
                                                        <label className={`text-[9px] uppercase font-bold ml-1 ${textSecondary}`}>{field.label}</label>
                                                        <div className="relative">
                                                            <select className={`w-full p-2 rounded text-[11px] appearance-none focus:border-red-600 outline-none pr-8 cursor-pointer ${cardBg} ${border} ${text}`}
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
                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 border-t pt-6 ${border}`}>
                            <div className="space-y-3">
                                <h3 className="text-[10px] uppercase text-red-500 font-bold flex items-center gap-2"><ListPlus size={14}/> Premium Features</h3>
                                <textarea className={`w-full p-3 rounded-lg text-xs h-20 ${cardBg} ${border} ${text}`} value={pcBuild.features.join('\n')} onChange={(e) => setPcBuild({...pcBuild, features: e.target.value.split('\n')})} />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-[10px] uppercase text-blue-500 font-bold flex items-center gap-2"><ShieldCheck size={14}/> Warranty & Support</h3>
                                <textarea className={`w-full p-3 rounded-lg text-xs h-20 ${cardBg} ${border} ${text}`} value={pcBuild.warranty.join('\n')} onChange={(e) => setPcBuild({...pcBuild, warranty: e.target.value.split('\n')})} />
                            </div>
                        </div>

                        <button onClick={handleSubmit} className="w-full mt-6 bg-red-600 hover:bg-red-700 py-4 cursor-pointer rounded-xl font-bold text-sm tracking-widest transition-all uppercase shadow-lg shadow-red-900/20">
                            {isEditing ? "Update Configuration" : "Publish Combination"}
                        </button>
                    </div>
                </div>

                {/* Saved Builds */}
                <div className="xl:col-span-4 space-y-4">
                    <h2 className={`text-xs font-bold uppercase flex items-center gap-2 px-2 ${textSecondary}`}><Monitor size={14}/> Saved Inventory ({savedBuilds.length})</h2>
                    <div className="space-y-4 max-h-[85vh] overflow-y-auto pr-2 custom-scrollbar">
                        {savedBuilds.map((build) => (
                            <div key={build.id} className={`rounded-2xl p-4 flex gap-4 group hover:border-red-600/50 transition-all ${cardBg} ${border}`}>
                                <img src={getImageSrc(build.image || build.preview)} className={`w-20 h-20 object-contain rounded-lg p-2 ${isDark ? 'bg-[#0a0a0a]' : 'bg-gray-100'} ${border}`} alt={build.name || "Build"} />
                                <div className="flex-1">
                                    <h4 className={`font-bold text-sm ${text}`}>{build.name || "Unnamed Build"}</h4>
                                    <p className="text-green-500 font-bold text-xs">₹{build.discountPrice}</p>
                                    <p className={`text-xs ${build.quantity === 0 ? 'text-red-500' : textSecondary}`}>
                                        {build.quantity === 0 ? 'Stock Not Available' : `Qty: ${build.quantity || 'N/A'}`}
                                    </p>
                                    <div className="flex gap-2 mt-3">
                                        <button onClick={() => handleEdit(build)} className={`flex-1 bg-green-600 hover:bg-gray-600 py-2 cursor-pointer rounded text-[10px] uppercase font-bold transition-all ${isDark ? 'bg-[#1a1a1a] text-white' : 'bg-gray-200 text-black'}`}>Edit</button>
                                        <button onClick={() => handleDelete(build.id)} className={`bg-red-600 p-2 cursor-pointer rounded transition-all ${isDark ? 'bg-[#1a1a1a] text-white' : 'bg-gray-200 text-black'}`}><Trash2 size={14}/></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Popup Message */}
            {popup.show && (
                <div className="fixed top-4 right-4 z-50 animate-fade-in">
                    <div className={`px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
                        popup.type === 'success' 
                            ? 'bg-green-600 text-white' 
                            : 'bg-red-600 text-white'
                    }`}>
                        <span className="text-sm font-medium">{popup.message}</span>
                    </div>
                </div>
            )}
        </div>

    );
    
};

export default FullAdminPCManager;
