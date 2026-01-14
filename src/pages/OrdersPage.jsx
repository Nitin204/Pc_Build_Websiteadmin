import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, MoreVertical, Eye } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

import axios from 'axios';


const OrdersPage = () => {
  const { cardBg, border, text, textSecondary } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [orders, setOrders] = useState([]);


  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
const changeStatus = async (orderId, newStatus) => {
  const id = orderId.replace("#ORD-", "");

  try {
    await axios.put(
      `http://localhost:8181/api/order/${id}/status`,
      null,
      { params: { status: newStatus } }
    );

    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  } catch (err) {
    console.error("Status update failed", err);
  }
};



  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsViewOpen(true);
  };

  const handleMoreActions = (order) => {
    alert(`More actions for ${order.id}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Shipped': return 'text-blue-400 bg-blue-900/20';
      case 'Delivered': return 'text-green-400 bg-green-900/20';
      case 'Processing': return 'text-yellow-400 bg-yellow-900/20';
      case 'Cancelled': return 'text-red-400 bg-red-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };
  useEffect(() => {
  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:8181/api/order");

      const formattedOrders = res.data.map(order => {
        const addr = order.shippingAddress || order.address;
        const addressStr = addr && typeof addr === 'object' 
          ? `${addr.street || ''}, ${addr.city || ''}, ${addr.state || ''} ${addr.pincode || ''}`.trim()
          : addr || "N/A";
        
        return {
          id: order.id || `#ORD-${order._id || order.orderId}`,
          date: new Date(order.createdAt || order.date).toLocaleDateString(),
          customer: order.userName || order.customer || "Customer",
          product: order.items?.[0]?.name || "Multiple Products",
          total: `₹ ${order.totalAmount?.toLocaleString()}`,
          status: order.status || "Processing",
          address: addressStr
        };
      });

      setOrders(formattedOrders);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  fetchOrders();
}, []);


  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
         
          <h1 className={`text-2xl font-black uppercase tracking-tighter ${text}`}>
            Orders <span className="text-red-600">Management</span>
          </h1>
          <p className={`text-sm ${textSecondary}`}>Manage and track your customer orders</p>
        </div>

        
        
      </div>

      {/* Filters & Search */}
      <div className={`p-3 rounded-2xl flex flex-col md:flex-row gap-3 items-center ${cardBg} ${border}`}>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input 
            type="text" 
            placeholder="Search by Order ID or Customer..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full rounded-xl py-1.5 pl-9 pr-3 text-xs focus:outline-none focus:border-red-600 transition ${cardBg} ${border} ${text}`}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto relative">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl text-xs w-full md:w-auto hover:bg-opacity-80 transition ${cardBg} ${border} ${text}`}
          >
            <Filter size={14} /> Filter
          </button>
          {isFilterOpen && (
            <div className={`absolute top-12 right-0 rounded-xl p-3 shadow-xl z-50 w-48 ${cardBg} ${border}`}>
              <h3 className={`font-bold text-xs mb-2 ${text}`}>Filter by Status</h3>
              {['All', 'Shipped', 'Processing', 'Delivered', 'Cancelled'].map(status => (
                <button
                  key={status}
                  onClick={() => { setStatusFilter(status); setIsFilterOpen(false); }}
                  className={`block w-full text-left px-2 py-1 rounded text-xs hover:bg-opacity-80 transition ${
                    statusFilter === status ? 'text-red-500 bg-red-900/20' : textSecondary
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className={`rounded-2xl overflow-hidden ${cardBg} ${border}`}>
        {/* Mobile Card View */}
        <div className="block md:hidden space-y-3 p-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className={`p-4 rounded-xl space-y-2 ${cardBg} ${border}`}>
              <div className="flex justify-between items-start">
                <span className="text-red-500 font-bold text-sm">{order.id}</span>
                <select 
                  value={order.status}
                  onChange={(e) => changeStatus(order.id, e.target.value)}
                  className={`px-2 py-1 rounded text-[9px] font-bold uppercase ${getStatusColor(order.status)} bg-transparent border-0 outline-none`}
                >
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className={`text-xs ${textSecondary}`}>{order.date}</div>
              <div className={`text-sm font-semibold ${text}`}>{order.customer}</div>
              <div className={`text-xs truncate ${textSecondary}`}>{order.product}</div>
              <div className={`text-xs truncate ${textSecondary}`}>{order.address}</div>
              <div className="flex justify-between items-center pt-2">
                <span className={`font-bold ${text}`}>{order.total}</span>
                <div className="flex gap-2">
                  <button onClick={() => handleViewOrder(order)} className="p-1.5 hover:bg-gray-800 rounded text-gray-400 hover:text-white transition">
                    <Eye size={14} />
                  </button>
                  <button onClick={() => handleMoreActions(order)} className="p-1.5 hover:bg-gray-800 rounded text-gray-400 hover:text-white transition">
                    <MoreVertical size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className={`text-[10px] uppercase tracking-widest ${cardBg} ${textSecondary}`}>
              <tr>
                <th className="px-2 py-3 font-bold">Order ID</th>
                <th className="px-2 py-3 font-bold">Date</th>
                <th className="px-2 py-3 font-bold">Customer</th>
                <th className="px-2 py-3 font-bold">Product</th>
                <th className="px-2 py-3 font-bold">Address</th>
                <th className="px-2 py-3 font-bold">Total</th>
                <th className="px-2 py-3 font-bold">Status</th>
                <th className="px-2 py-3 font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-opacity-50 transition-colors">
                  <td className="px-2 py-3 text-xs font-bold text-red-500">{order.id}</td>
                  <td className={`px-2 py-3 text-xs ${textSecondary}`}>{order.date}</td>
                  <td className={`px-2 py-3 text-xs font-semibold ${text}`}>{order.customer}</td>
                  <td className={`px-2 py-3 text-xs ${textSecondary} max-w-[120px] truncate`}>{order.product}</td>
                  <td className={`px-2 py-3 text-xs ${textSecondary} max-w-[150px] truncate`}>{order.address}</td>
                  <td className={`px-2 py-3 text-xs font-bold ${text}`}>{order.total}</td>
                  <td className="px-2 py-3">
                    <select 
                      value={order.status}
                      onChange={(e) => changeStatus(order.id, e.target.value)}
                      className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-tighter bg-transparent border-0 outline-none cursor-pointer ${getStatusColor(order.status)}`}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex gap-1">
                      <button 
                        onClick={() => handleViewOrder(order)}
                        className="p-1.5 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition"
                      >
                        <Eye size={14} />
                      </button>
                      <button 
                        onClick={() => handleMoreActions(order)}
                        className="p-1.5 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition"
                      >
                        <MoreVertical size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className={`p-3 sm:p-4 border-t flex flex-col sm:flex-row justify-between items-center gap-2 text-xs ${border} ${textSecondary}`}>
          <span>Showing 5 of 120 orders</span>
          <div className="flex gap-2">
            <button className={`px-2 sm:px-3 py-1 rounded hover:bg-opacity-80 text-xs ${border} ${textSecondary}`}>Previous</button>
            <button className="px-2 sm:px-3 py-1 bg-red-600 text-white rounded font-bold text-xs">1</button>
            <button className={`px-2 sm:px-3 py-1 rounded hover:bg-opacity-80 text-xs ${border} ${textSecondary}`}>Next</button>
          </div>
        </div>
      </div>

      {/* View Order Modal */}
      {isViewOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/80 backdrop-blur-sm">
          <div className={`w-full max-w-sm sm:max-w-md rounded-xl shadow-2xl ${cardBg} ${border}`}>
            <div className="bg-red-600 p-3 flex justify-between items-center text-white">
              <h2 className="font-black uppercase tracking-widest text-xs">Order Details</h2>
              <button onClick={() => setIsViewOpen(false)} className="hover:rotate-90 transition-transform">×</button>
            </div>
            <div className="p-3 sm:p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-gray-500">Order ID:</span> <span className="text-red-500 font-bold">{selectedOrder.id}</span></div>
                <div><span className={textSecondary}>Date:</span> <span className={text}>{selectedOrder.date}</span></div>
                <div><span className={textSecondary}>Customer:</span> <span className={text}>{selectedOrder.customer}</span></div>
                <div><span className={textSecondary}>Total:</span> <span className={`font-bold ${text}`}>{selectedOrder.total}</span></div>
              </div>
              <div className="text-xs">
                <span className={textSecondary}>Product:</span> <span className={text}>{selectedOrder.product}</span>
              </div>
              <div className="text-xs">
                <span className={textSecondary}>Address:</span> <span className={text}>{selectedOrder.address}</span>
              </div>
              <div className="text-xs">
                <span className={textSecondary}>Status:</span> 
                <span className={`ml-2 px-2 py-1 rounded text-[10px] font-bold ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;