import React, { useState, useEffect } from "react";
import { Wifi, WifiOff, Plus, Download, Trash2, Printer, Edit, Search } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useTheme } from '../context/ThemeContext';
import Logo from '../assets/logo.png';
import axios from "axios";

const API_URL = "http://localhost:8181/api";

const OfflineOnlineData = () => {
  const { cardBg, border, text, textSecondary, isDark } = useTheme();
  const [mode, setMode] = useState("offline");
  const [offlineOrders, setOfflineOrders] = useState(() => {
    const saved = localStorage.getItem('offlineOrders');
    return saved ? JSON.parse(saved) : [];
  });
  const [formData, setFormData] = useState({
    customer: "",
    email: "",
    product: "",
    productDetails: {},
    qty: "",
    amount: "",
    discount: "",
    gst: "",
    total: "",
    payment: ""
  });
  const [editingOrder, setEditingOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newProduct, setNewProduct] = useState("");
  const [productList, setProductList] = useState([]);

  // Fetch products and offline orders from backend
  useEffect(() => {
    // Fetch products
    axios.get(`${API_URL}/products`)
      .then(res => {
        setProductList(res.data.map(p => p.name));
      })
      .catch(err => {
        console.error("Failed to fetch products:", err);
        // Fallback to default products
        setProductList(["RTX 4090", "Intel i9-13900K", "32GB DDR5 RAM", "1TB NVMe SSD"]);
      });

    // Fetch offline orders
    axios.get(`${API_URL}/offline-orders`)
      .then(res => {
        console.log('Backend data:', res.data); // Debug log
        setOfflineOrders(res.data);
      })
      .catch(err => {
        console.error("Failed to fetch offline orders:", err);
        // Keep localStorage data as fallback
      });
  }, []);

  const addProduct = () => {
    if (!newProduct.trim()) {
      alert("Enter product name");
      return;
    }

    axios.post(`${API_URL}/products`, { name: newProduct.trim() })
      .then(res => {
        setProductList(prev => [...prev, res.data.name]);
        setNewProduct("");
        alert("Product added successfully");
      })
      .catch(err => {
        console.error(err);
        // Fallback to local storage
        setProductList(prev => [...prev, newProduct.trim()]);
        setNewProduct("");
        alert("Product added locally (server unavailable)");
      });
  };

  const deleteProduct = (productName) => {
    if (!window.confirm(`Delete ${productName}?`)) return;

    axios.delete(`${API_URL}/products/${encodeURIComponent(productName)}`)
      .then(() => {
        setProductList(prev => prev.filter(p => p !== productName));
        const newDetails = { ...formData.productDetails };
        delete newDetails[productName];
        setFormData({
          ...formData,
          productDetails: newDetails,
          product: Object.keys(newDetails).join(", "),
        });
      })
      .catch(err => {
        console.error(err);
        // Fallback to local deletion
        setProductList(prev => prev.filter(p => p !== productName));
        const newDetails = { ...formData.productDetails };
        delete newDetails[productName];
        setFormData({
          ...formData,
          productDetails: newDetails,
          product: Object.keys(newDetails).join(", "),
        });
        alert("Product deleted locally (server unavailable)");
      });
  };

  const paymentModes = [
    "Cash",
    "UPI",
    "Credit Card",
    "Debit Card",
    "Net Banking",
    "Cheque",
    "Bank Transfer",
    "EMI"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'product' && e.target.multiple) {
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
      setFormData({ ...formData, [name]: selectedOptions.join(', ') });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Auto-calculate total when amount, discount, qty, or GST changes
    if (name === 'amount' || name === 'discount' || name === 'gst' || name === 'qty') {
      const amount = parseFloat(name === 'amount' ? value : formData.amount) || 0;
      const qty = parseFloat(name === 'qty' ? value : formData.qty) || 1;
      const discountPercent = parseFloat(name === 'discount' ? value : formData.discount) || 0;
      const gst = parseFloat(name === 'gst' ? value : formData.gst) || 0;
      
      const totalAmount = amount * qty;
      const discountAmount = (totalAmount * discountPercent) / 100;
      const discountedAmount = totalAmount - discountAmount;
      const gstAmount = (discountedAmount * gst) / 100;
      const total = discountedAmount + gstAmount;
      
      setFormData(prev => ({ ...prev, [name]: value, total: total.toFixed(2) }));
    }
  };

  const resetForm = () => {
    setFormData({
      customer: "",
      email: "",
      product: "",
      productDetails: {},
      qty: "",
      amount: "",
      discount: "",
      gst: "",
      total: "",
      payment: ""
    });
    setEditingOrder(null);
  };

  /* Add offline order */
  const addOfflineOrder = () => {
    if (!formData.customer || !formData.email || !formData.product || !formData.amount || !formData.payment) {
      alert("Fill all required fields");
      return;
    }

    let totalQty = 0;
    if (formData.productDetails) {
      Object.values(formData.productDetails).forEach(detail => {
        totalQty += parseFloat(detail.qty) || 0;
      });
    }

    const orderData = {
      ...formData,
      qty: totalQty,
      dateTime: new Date().toLocaleString('en-IN')
    };

    // UPDATE (PUT)
    if (editingOrder) {
      axios
        .put(`${API_URL}/offline-orders/${editingOrder.id}`, orderData)
        .then(res => {
          setOfflineOrders(prev =>
            prev.map(o => (o.id === editingOrder.id ? res.data : o))
          );
          resetForm();
          alert("Order updated successfully");
        })
        .catch(err => {
          console.error(err);
          alert("Update failed");
        });
    }
    // ADD (POST)
    else {
      axios
        .post(`${API_URL}/offline-orders`, orderData)
        .then(res => {
          setOfflineOrders(prev => [...prev, res.data]);
          resetForm();
          alert("Order added successfully");
        })
        .catch(err => {
          console.error(err);
          alert("Add failed");
        });
    }
  };

  /* Edit order */
  const editOrder = (order) => {
    setFormData(order);
    setEditingOrder(order);
  };

  /* Print order */
  const printOrder = (order) => {
    const totalAmount = parseFloat(order.amount);
    const discountAmount = (totalAmount * parseFloat(order.discount || 0)) / 100;
    const discountedAmount = totalAmount - discountAmount;
    const gstAmount = (discountedAmount * parseFloat(order.gst || 0)) / 100;
    
    // Generate product rows from productDetails if available
    let productRows = '';
    if (order.productDetails && Object.keys(order.productDetails).length > 0) {
      Object.entries(order.productDetails).forEach(([product, details]) => {
        const qty = parseFloat(details.qty) || 0;
        const unitPrice = parseFloat(details.amount) || 0;
        const lineTotal = qty * unitPrice;
        productRows += `
          <tr>
            <td>${product}</td>
            <td>${qty}</td>
            <td>₹${unitPrice.toFixed(2)}</td>
            <td>₹${lineTotal.toFixed(2)}</td>
          </tr>
        `;
      });
    } else {
      // Fallback for old orders without productDetails
      const unitPrice = parseFloat(order.amount) / parseFloat(order.qty || 1);
      productRows = `
        <tr>
          <td>${order.product}</td>
          <td>${order.qty}</td>
          <td>₹${unitPrice.toFixed(2)}</td>
          <td>₹${order.amount}</td>
        </tr>
      `;
    }
    
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Order Receipt</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
          .logo { font-size: 32px; font-weight: bold; color: black; margin-bottom: 5px; }
          .shop-name { font-size: 24px; font-weight: bold; color: #333; }
          .address { font-size: 14px; color: #666; margin-top: 10px; }
          .receipt-title { font-size: 18px; margin: 15px 0; background: #f5f5f5; padding: 10px; }
          .customer-info { margin: 20px 0; }
          .info-row { margin: 8px 0; }
          .label { font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
          th { background-color: #f5f5f5; font-weight: bold; }
          .total-row { font-weight: bold; background-color: #f9f9f9; }
          .grand-total { font-size: 18px; font-weight: bold; text-decoration: underline; text-align: center; background: white; color: black; border: 1px solid black; }
          .footer { text-align: center; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
        <img src=${Logo} alt="System Builders Logo" style="width: 100px; height: auto; margin-right: 10px;">
          <div class="logo">SYSTEM BUILDERS</div>
          <div class="address">
            123 Tech Street, Electronics Plaza<br>
            Mumbai, Maharashtra - 400001<br>
            Phone: +91 98765 43210 | Email: info@systembuilders.com
          </div>
        </div>
        
        <div class="customer-info">
          <div class="info-row"><span class="label">Order ID:</span> ${order.id}</div>
          <div class="info-row"><span class="label">Customer:</span> ${order.customer}</div>
          <div class="info-row"><span class="label">Email:</span> ${order.email}</div>
          <div class="info-row"><span class="label">Date & Time:</span> ${order.dateTime}</div>
          <div class="info-row"><span class="label">Payment Mode:</span> ${order.payment}</div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${productRows}
            <tr>
              <td colspan="3" class="label">Subtotal</td>
              <td>₹${totalAmount.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3" class="label">Discount (${order.discount || 0}%)</td>
              <td>-₹${discountAmount.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3" class="label">After Discount</td>
              <td>₹${discountedAmount.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3" class="label">GST (${order.gst || 0}%)</td>
              <td>₹${gstAmount.toFixed(2)}</td>
            </tr>
            <tr class="grand-total">
              <td colspan="3">TOTAL AMOUNT</td>
              <td>₹${order.total}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="footer">
          <p><strong>Thank you for your business!</strong></p>
          <p>Visit us again for all your computer needs!</p>
          <p style="font-size: 12px; color: #666;">This is a computer generated receipt.</p>
        </div>
      </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  /* Delete offline order */
  const deleteOrder = (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    
    axios.delete(`${API_URL}/offline-orders/${id}`)
      .then(() => {
        setOfflineOrders(prev => prev.filter(o => o.id !== id));
        alert("Order deleted successfully");
      })
      .catch(err => {
        console.error(err);
        // Fallback to localStorage
        const newOrders = offlineOrders.filter(o => o.id !== id);
        setOfflineOrders(newOrders);
        localStorage.setItem('offlineOrders', JSON.stringify(newOrders));
        alert("Order deleted locally (server unavailable)");
      });
  };

  /* Export to Excel */
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(offlineOrders);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "OfflineOrders");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    const file = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });

    saveAs(file, "Offline_Orders.xlsx");
  };

  return (
    <div className="min-w-[320px] space-y-6">
      <h1 className={`text-xs sm:text-base lg:text-xl font-black uppercase tracking-tighter ${text} mb-4`}>
        OFFLINE ORDER <span className="text-red-600">MANAGER</span>
      </h1>

      {/* Add Form */}
      <div className={`p-2 sm:p-4 lg:p-6 rounded-xl ${cardBg} ${border}`}>
        <h2 className={`text-xs sm:text-sm lg:text-base font-semibold mb-4 ${text}`}>
          Add Offline Order
        </h2>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          <div>
            <label className={`block text-xs mb-1 ${textSecondary}`}>Customer Name</label>
            <input
              type="text"
              name="customer"
              value={formData.customer}
              onChange={handleChange}
              placeholder="Customer Name"
              className={`p-1.5 sm:p-3 rounded-lg w-full text-xs sm:text-sm ${cardBg} ${border} ${text}`}
            />
          </div>

          <div>
            <label className={`block text-xs mb-1 ${textSecondary}`}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className={`p-1.5 sm:p-3 rounded-lg w-full text-xs sm:text-sm ${cardBg} ${border} ${text}`}
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <label className={`block text-xs mb-1 ${textSecondary}`}>Payment Mode</label>
            <select
              name="payment"
              value={formData.payment}
              onChange={handleChange}
              className={`p-1.5 sm:p-3 rounded-lg w-full text-xs sm:text-sm ${cardBg} ${border} ${text}`}
            >
              <option value="">Select Payment Mode</option>
              {paymentModes.map((mode, index) => (
                <option key={index} value={mode}>{mode}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Add Product Section */}
        <div className="mb-4 mt-4 max-w-sm">
          <h3 className={`text-sm font-semibold mb-2 ${text}`}>Add New Product</h3>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newProduct}
              onChange={(e) => setNewProduct(e.target.value)}
              placeholder="Enter product name"
              className={`flex-1 px-3 py-2 text-sm rounded-lg border ${border} ${cardBg} ${text}`}
            />
            <button
              onClick={addProduct}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 whitespace-nowrap"
            >
              Add Product
            </button>
          </div>
        </div>

        {/* Product Selection Section */}
        <div className="mt-4">
          <label className={`block text-sm mb-3 ${textSecondary}`}>Select Products with Quantity & Amount</label>
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-80 overflow-y-auto p-4 rounded-lg ${cardBg} ${border}`}>
            {productList.map((product, index) => {
              const isSelected = formData.productDetails?.[product];
              return (
                <div key={index} className={`rounded-lg p-3 sm:p-4 ${cardBg} ${border} transition-all hover:shadow-md`}>
                  <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center space-x-2 sm:space-x-3 cursor-pointer flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={!!isSelected}
                        onChange={(e) => {
                          const newDetails = {...formData.productDetails};
                          if (e.target.checked) {
                            newDetails[product] = {qty: 1, amount: 0};
                          } else {
                            delete newDetails[product];
                          }
                          const selectedProducts = Object.keys(newDetails).join(', ');
                          setFormData({...formData, productDetails: newDetails, product: selectedProducts});
                        }}
                        className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500 focus:ring-2 flex-shrink-0"
                      />
                      <span className={`text-sm sm:text-base font-medium ${text} truncate`} title={product}>{product}</span>
                    </label>
                    <button
                      onClick={() => deleteProduct(product)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-lg transition-colors flex-shrink-0 ml-2"
                      title="Delete product"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  {isSelected && (
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-3">
                      <div>
                        <label className={`block text-xs mb-1 ${textSecondary}`}>Quantity</label>
                        <input
                          type="number"
                          placeholder="Qty"
                          value={isSelected?.qty || ''}
                          onChange={(e) => {
                            const newDetails = {...formData.productDetails};
                            newDetails[product] = {...(newDetails[product] || {}), qty: e.target.value};
                            
                            let totalAmount = 0;
                            Object.values(newDetails).forEach(detail => {
                              const qty = parseFloat(detail.qty) || 0;
                              const amount = parseFloat(detail.amount) || 0;
                              totalAmount += qty * amount;
                            });
                            
                            // Calculate final total with discount and GST
                            const discountPercent = parseFloat(formData.discount) || 0;
                            const gst = parseFloat(formData.gst) || 0;
                            const discountAmount = (totalAmount * discountPercent) / 100;
                            const discountedAmount = totalAmount - discountAmount;
                            const gstAmount = (discountedAmount * gst) / 100;
                            const finalTotal = discountedAmount + gstAmount;
                            
                            setFormData({...formData, productDetails: newDetails, amount: totalAmount.toFixed(2), total: finalTotal.toFixed(2)});
                          }}
                          className={`p-2 sm:p-2.5 rounded-lg border text-sm w-full ${cardBg} ${border} ${text} focus:ring-2 focus:ring-red-500`}
                        />
                      </div>
                      <div>
                        <label className={`block text-xs mb-1 ${textSecondary}`}>Amount</label>
                        <input
                          type="number"
                          placeholder="Amount"
                          value={isSelected?.amount || ''}
                          onChange={(e) => {
                            const newDetails = {...formData.productDetails};
                            newDetails[product] = {...(newDetails[product] || {}), amount: e.target.value};
                            
                            let totalAmount = 0;
                            Object.values(newDetails).forEach(detail => {
                              const qty = parseFloat(detail.qty) || 0;
                              const amount = parseFloat(detail.amount) || 0;
                              totalAmount += qty * amount;
                            });
                            
                            // Calculate final total with discount and GST
                            const discountPercent = parseFloat(formData.discount) || 0;
                            const gst = parseFloat(formData.gst) || 0;
                            const discountAmount = (totalAmount * discountPercent) / 100;
                            const discountedAmount = totalAmount - discountAmount;
                            const gstAmount = (discountedAmount * gst) / 100;
                            const finalTotal = discountedAmount + gstAmount;
                            
                            setFormData({...formData, productDetails: newDetails, amount: totalAmount.toFixed(2), total: finalTotal.toFixed(2)});
                          }}
                          className={`p-2 sm:p-2.5 rounded-lg border text-sm w-full ${cardBg} ${border} ${text} focus:ring-2 focus:ring-red-500`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {formData.product && (
            <div className="mt-3 p-3 bg-green-900/20 border border-green-700 rounded-lg">
              <span className="text-green-400 text-sm sm:text-base break-words block">Selected: {formData.product}</span>
            </div>
          )}
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mt-4">
          <div>
            <label className={`block text-xs mb-1 ${textSecondary}`}>Total Amount (Auto)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              readOnly
              placeholder="Total Amount (Auto)"
              className={`p-3 rounded-lg border w-full opacity-60 font-bold text-blue-400 text-sm ${cardBg} ${border}`}
            />
          </div>

          <div>
            <label className={`block text-xs mb-1 ${textSecondary}`}>Discount %</label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              placeholder="Discount %"
              className={`p-3 rounded-lg border w-full text-sm ${cardBg} ${border} ${text}`}
            />
          </div>

          <div>
            <label className={`block text-xs mb-1 ${textSecondary}`}>GST %</label>
            <input
              type="number"
              name="gst"
              value={formData.gst}
              onChange={handleChange}
              placeholder="GST %"
              className={`p-3 rounded-lg border w-full text-sm ${cardBg} ${border} ${text}`}
            />
          </div>

          <div>
            <label className={`block text-xs mb-1 ${textSecondary}`}>Final Total (Auto)</label>
            <input
              type="number"
              name="total"
              value={formData.total}
              readOnly
              placeholder="Final Total (Auto)"
              className={`p-3 rounded-lg border opacity-60 w-full font-bold text-green-400 text-sm ${cardBg} ${border}`}
            />
          </div>

          <div>
            <label className={`block text-xs mb-1 ${textSecondary}`}>Date & Time (Auto)</label>
            <input
              type="text"
              value={new Date().toLocaleString('en-IN')}
              readOnly
              placeholder="Current Date & Time"
              className={`p-3 rounded-lg border opacity-60 w-full font-bold text-blue-400 text-sm ${cardBg} ${border}`}
            />
          </div>
        </div>



        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <button
            onClick={addOfflineOrder}
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg flex gap-2 items-center justify-center text-sm font-medium transition-colors"
          >
            <Plus size={18} /> {editingOrder ? 'Update Order' : 'Add Order'}
          </button>
          
          <button
            onClick={() => offlineOrders.length > 0 && printOrder(offlineOrders[offlineOrders.length - 1])}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg flex gap-2 items-center justify-center text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={offlineOrders.length === 0}
          >
            <Printer size={18} /> Print Last Order
          </button>
        </div>
      </div>

      {/* Table */}
      <div className={`p-4 sm:p-6 rounded-xl ${cardBg} ${border}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className={`text-base sm:text-lg font-semibold ${text}`}>Offline Orders</h2>
          <div className="flex flex-col sm:flex-row gap-3  sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2.5 rounded-lg text-sm w-full sm:w-64 lg:w-80 ${cardBg} ${border} ${text} focus:ring-2 focus:ring-red-500`}
              />
            </div>
            <button
              onClick={exportToExcel}
              className="bg-green-600 hover:bg-green-700 px-4 py-2.5 rounded-lg flex gap-2 items-center justify-center text-sm whitespace-nowrap transition-colors"
            >
              <Download size={18} /> Export Excel
            </button>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-xs max-w-4xl table-fixed">
            <thead className={`border-b ${border} ${textSecondary}`}>
              <tr>
                <th className="text-left py-1 px-0.5 font-semibold w-12">ID</th>
                <th className="text-left py-1 px-0.5 font-semibold w-20">Customer</th>
                <th className="text-left py-1 px-0.5 font-semibold w-24">Email</th>
                <th className="text-left py-1 px-0.5 font-semibold w-32">Product</th>
                <th className="text-left py-1 px-0.5 font-semibold w-8">Qty</th>
                <th className="text-left py-1 px-0.5 font-semibold w-16">Amount</th>
                <th className="text-left py-1 px-0.5 font-semibold w-12">Disc</th>
                <th className="text-left py-1 px-0.5 font-semibold w-8">GST</th>
                <th className="text-left py-1 px-0.5 font-semibold w-16">Payment</th>
                <th className="text-left py-1 px-0.5 font-semibold w-24">Date & Time</th>

                <th className="text-center py-1 px-0.5 font-semibold w-20">Actions</th>
                <th className="text-right py-1 px-0.5 font-semibold w-16">Total</th>
              </tr>
            </thead>
            <tbody>
              {offlineOrders.filter(o => 
                (o.customer?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (o.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (o.id?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (o.product?.toLowerCase().includes(searchTerm.toLowerCase()))
              ).length === 0 && (
                <tr>
                  <td colSpan="12" className={`py-8 text-center ${textSecondary}`}>
                    {searchTerm ? 'No orders found matching your search' : 'No offline orders added'}
                  </td>
                </tr>
              )}

              {offlineOrders.filter(o => 
                (o.customer?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (o.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (o.id?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (o.product?.toLowerCase().includes(searchTerm.toLowerCase()))
              ).map((o) => (
                <tr key={o.id} className={`border-b ${border} hover:bg-opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}>
                  <td className={`py-1 px-0.5 ${text} font-medium truncate`}>{o.id}</td>
                  <td className={`py-1 px-0.5 ${text} font-medium truncate`}>{o.customer}</td>
                  <td className={`py-1 px-0.5 ${textSecondary} truncate`} title={o.email}>{o.email}</td>
                  <td className={`py-1 px-0.5 ${textSecondary} truncate`} title={o.product}>{o.product}</td>
                  <td className={`py-1 px-0.5 ${text} text-center`}>{o.qty}</td>
                  <td className={`py-1 px-0.5 ${text} truncate`}>₹{o.amount}</td>
                  <td className={`py-1 px-0.5 ${textSecondary} text-center`}>{o.discount || 0}%</td>
                  <td className={`py-1 px-0.5 ${textSecondary} text-center`}>{o.gst || 0}%</td>
                  <td className={`py-1 px-0.5 ${textSecondary} truncate`}>{o.payment}</td>
                  <td className={`py-1 px-0.5 ${textSecondary} truncate text-xs`} title={o.dateTime || ''}>{o.dateTime || ''}</td>

                  <td className="py-1 px-0.5">
                    <div className="flex gap-0.5 justify-center">
                      <button
                        onClick={() => editOrder(o)}
                        className="text-yellow-500 hover:text-yellow-600 p-0.5 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit size={10} />
                      </button>
                      <button
                        onClick={() => printOrder(o)}
                        className="text-blue-500 hover:text-blue-600 p-0.5 rounded transition-colors"
                        title="Print"
                      >
                        <Printer size={10} />
                      </button>
                      <button
                        onClick={() => deleteOrder(o.id)}
                        className="text-red-500 hover:text-red-600 p-0.5 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  </td>
                  <td className={`py-1 px-0.5 font-bold ${text} text-right truncate`}>₹{o.total}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className={`border-t-2 ${border} bg-green-900/20`}>
                <td colSpan="11" className={`py-2 px-1 font-bold text-right ${text}`}>Grand Total:</td>
                <td className={`py-2 px-1 font-bold text-right text-green-400 text-sm`}>
                  ₹{offlineOrders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0).toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4">
          {offlineOrders.filter(o => 
            (o.customer?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (o.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (o.id?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (o.product?.toLowerCase().includes(searchTerm.toLowerCase()))
          ).length === 0 && (
            <div className={`py-4 text-center ${textSecondary}`}>
              {searchTerm ? 'No orders found matching your search' : 'No offline orders added'}
            </div>
          )}
          
          {offlineOrders.filter(o => 
            (o.customer?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (o.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (o.id?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (o.product?.toLowerCase().includes(searchTerm.toLowerCase()))
          ).map((o) => (
            <div key={o.id} className={`p-3 sm:p-4 rounded-xl ${cardBg} ${border} shadow-sm`}>
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <div className="flex-1 min-w-0 pr-3">
                  <h3 className={`font-bold text-base sm:text-lg ${text} truncate`}>{o.id}</h3>
                  <p className={`text-sm sm:text-base ${textSecondary} truncate`}>{o.customer}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`font-bold text-lg sm:text-xl ${isDark ? 'text-green-400' : 'text-green-600'}`}>₹ {o.total}</p>
                  <p className={`text-xs sm:text-sm ${textSecondary}`}>{o.payment}</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm sm:text-base">
                <div className={`${textSecondary} flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2`}>
                  <span className="font-medium">Email:</span> 
                  <span className={`${text} break-all text-xs sm:text-sm`}>{o.email}</span>
                </div>
                <div className={`${textSecondary} flex flex-col gap-1`}>
                  <span className="font-medium">Product:</span> 
                  <span className={`${text} break-words text-xs sm:text-sm`}>{o.product}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  <div className={textSecondary}>
                    <span className="font-medium">Qty:</span> <span className={text}>{o.qty}</span>
                  </div>
                  <div className={textSecondary}>
                    <span className="font-medium">Amount:</span> <span className={text}>₹{o.amount}</span>
                  </div>
                  <div className={textSecondary}>
                    <span className="font-medium">Discount:</span> <span className={text}>{o.discount || 0}%</span>
                  </div>
                  <div className={textSecondary}>
                    <span className="font-medium">GST:</span> <span className={text}>{o.gst || 0}%</span>
                  </div>
                </div>
                {o.dateTime && (
                  <div className={`${textSecondary} flex flex-col gap-1 mt-2`}>
                    <span className="font-medium">Date & Time:</span> 
                    <span className={`${text} text-xs sm:text-sm`}>{o.dateTime}</span>
                  </div>
                )}
              </div>
              
              <div className={`flex gap-2 sm:gap-3 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t ${border}`}>
                <button
                  onClick={() => editOrder(o)}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2 transition-colors"
                >
                  <Edit size={14} className="sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Edit</span>
                </button>
                <button
                  onClick={() => printOrder(o)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2 transition-colors"
                >
                  <Printer size={14} className="sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Print</span>
                </button>
                <button
                  onClick={() => deleteOrder(o.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2 transition-colors"
                >
                  <Trash2 size={14} className="sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Delete</span>
                </button>
              </div>
            </div>
          ))}
          
          {/* Mobile Total */}
          {offlineOrders.length > 0 && (
            <div className={`mt-4 p-4 rounded-xl bg-green-900/20 border border-green-700`}>
              <div className="flex justify-between items-center">
                <span className={`font-bold text-lg ${text}`}>Grand Total:</span>
                <span className="font-bold text-xl text-green-400">
                  ₹{offlineOrders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0).toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfflineOnlineData;
