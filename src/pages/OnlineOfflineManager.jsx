import React, { useState } from "react";
import { Wifi, WifiOff, Plus, Download, Trash2, Printer, Edit, Search } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useTheme } from '../context/ThemeContext';
import Logo from '../assets/logo.png';

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
    payment: "",
    dateTime: new Date().toISOString().slice(0, 16)
  });
  const [editingOrder, setEditingOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const productList = [
    "Gaming PC - RTX 4060",
    "Gaming PC - RTX 4070",
    "Gaming PC - RTX 4080",
    "AI/ML Workstation - RTX 4090",
    "Architecture PC - Quadro RTX",
    "Video Editing PC - RTX 4070 Ti",
    "Trading PC - Multi Monitor",
    "Office PC - Basic",
    "Custom Build PC",
    "Monitor - 24 inch",
    "Monitor - 27 inch",
    "Mechanical Keyboard",
    "Gaming Mouse",
    "Headset - Gaming",
    "Racing Simulator"
  ];

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

  /* Add offline order */
  const addOfflineOrder = () => {
    if (!formData.customer || !formData.email || !formData.product || !formData.amount || !formData.payment) return;

    // Calculate total quantity from all products
    let totalQty = 0;
    Object.values(formData.productDetails).forEach(detail => {
      totalQty += parseFloat(detail.qty) || 0;
    });

    if (editingOrder) {
      const updatedOrders = offlineOrders.map(order => 
        order.id === editingOrder.id 
          ? { ...formData, id: editingOrder.id, qty: totalQty, dateTime: editingOrder.dateTime }
          : order
      );
      setOfflineOrders(updatedOrders);
      localStorage.setItem('offlineOrders', JSON.stringify(updatedOrders));
      setEditingOrder(null);
    } else {
      const newOrders = [
        ...offlineOrders,
        {
          id: `OFF-${offlineOrders.length + 1}`,
          ...formData,
          qty: totalQty,
          dateTime: new Date().toLocaleString('en-IN', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          })
        }
      ];
      setOfflineOrders(newOrders);
      localStorage.setItem('offlineOrders', JSON.stringify(newOrders));
    }

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
      payment: "", 
      dateTime: new Date().toLocaleString('en-IN', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }) 
    });
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
    const newOrders = offlineOrders.filter((o) => o.id !== id);
    setOfflineOrders(newOrders);
    localStorage.setItem('offlineOrders', JSON.stringify(newOrders));
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
    <div className={`min-h-screen p-6 transition-colors duration-300 ${isDark ? 'bg-[#0a0a0a] text-white' : 'bg-gray-50 text-black'}`}>
      <h1 className={`text-2xl font-black uppercase tracking-tighter ${text}`}>
            OFFLINE ORDER <span className="text-red-600">MANAGER</span>
          </h1>
      
      {/* Theme Test Button */}
       

      {/* Add Form */}
          <div className={`p-6 rounded-2xl mt-10 ${cardBg} ${border}`}>
            <h2 className={`text-lg font-semibold mb-4 ${text}`}>
              Add Offline Order
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className={`block text-xs mb-1 ${textSecondary}`}>Customer Name</label>
                <input
                  type="text"
                  name="customer"
                  value={formData.customer}
                  onChange={handleChange}
                  placeholder="Customer Name"
                  className={`p-3 rounded-lg w-full ${cardBg} ${border} ${text}`}
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
                  className={`p-3 rounded-lg w-full ${cardBg} ${border} ${text}`}
                />
              </div>

              <div>
                <label className={`block text-xs mb-1 ${textSecondary}`}>Payment Mode</label>
                <select
                  name="payment"
                  value={formData.payment}
                  onChange={handleChange}
                  className={`p-3 rounded-lg w-full ${cardBg} ${border} ${text}`}
                >
                  <option value="">Select Payment Mode</option>
                  {paymentModes.map((mode, index) => (
                    <option key={index} value={mode}>{mode}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Product Selection Section */}
            <div className="mt-6">
              <label className={`block text-sm mb-3 ${textSecondary}`}>Select Products with Quantity & Amount</label>
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto p-4 rounded-lg ${cardBg} ${border}`}>
                {productList.map((product, index) => {
                  const isSelected = formData.productDetails[product];
                  return (
                    <div key={index} className={`rounded-lg p-3 ${cardBg} ${border}`}>
                      <label className="flex items-center space-x-2 cursor-pointer mb-2">
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
                          className="text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                        />
                        <span className={`text-sm font-medium ${text}`}>{product}</span>
                      </label>
                      {isSelected && (
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <input
                            type="number"
                            placeholder="Qty"
                            value={isSelected.qty || ''}
                            onChange={(e) => {
                              const newDetails = {...formData.productDetails};
                              newDetails[product] = {...newDetails[product], qty: e.target.value};
                              
                              // Calculate total amount from all products
                              let totalAmount = 0;
                              Object.values(newDetails).forEach(detail => {
                                const qty = parseFloat(detail.qty) || 0;
                                const amount = parseFloat(detail.amount) || 0;
                                totalAmount += qty * amount;
                              });
                              
                              setFormData({...formData, productDetails: newDetails, amount: totalAmount.toFixed(2)});
                            }}
                            className={`p-2 rounded border text-sm ${cardBg} ${border} ${text}`}
                          />
                          <input
                            type="number"
                            placeholder="Amount"
                            value={isSelected.amount || ''}
                            onChange={(e) => {
                              const newDetails = {...formData.productDetails};
                              newDetails[product] = {...newDetails[product], amount: e.target.value};
                              
                              // Calculate total amount from all products
                              let totalAmount = 0;
                              Object.values(newDetails).forEach(detail => {
                                const qty = parseFloat(detail.qty) || 0;
                                const amount = parseFloat(detail.amount) || 0;
                                totalAmount += qty * amount;
                              });
                              
                              setFormData({...formData, productDetails: newDetails, amount: totalAmount.toFixed(2)});
                            }}
                            className={`p-2 rounded border text-sm ${cardBg} ${border} ${text}`}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {formData.product && (
                <div className="mt-2 p-2 bg-green-900/20 border border-green-700 rounded">
                  <span className="text-green-400 text-sm">Selected: {formData.product}</span>
                </div>
              )}
            </div>

            {/* Order Details */}
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-4 mt-6">
              <div>
                <label className={`block text-xs mb-1 ${textSecondary}`}>Total Amount (Auto)</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  readOnly
                  placeholder="Total Amount (Auto)"
                  className={`p-3 rounded-lg border w-full opacity-60 font-bold text-blue-400 ${cardBg} ${border}`}
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
                  className={`p-3 rounded-lg border w-full ${cardBg} ${border} ${text}`}
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
                  className={`p-3 rounded-lg border w-full ${cardBg} ${border} ${text}`}
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
                  className={`p-3 rounded-lg border opacity-60 w-full font-bold text-green-400 ${cardBg} ${border}`}
                />
              </div>

              <div>
                <label className={`block text-xs mb-1 ${textSecondary}`}>Date & Time (Auto)</label>
                <input
                  type="text"
                  name="dateTime"
                  value={new Date().toLocaleString('en-IN', { 
                    year: 'numeric', 
                    month: '2-digit', 
                    day: '2-digit', 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                  readOnly
                  className={`p-3 rounded-lg border w-full opacity-60 ${cardBg} ${border} ${text}`}
                />
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <button
                onClick={addOfflineOrder}
                className="bg-red-600 px-5 py-2 rounded-lg flex gap-2"
              >
                <Plus size={18} /> {editingOrder ? 'Update Order' : 'Add Order'}
              </button>
              
              <button
                onClick={() => offlineOrders.length > 0 && printOrder(offlineOrders[offlineOrders.length - 1])}
                className="bg-blue-600 px-5 py-2 rounded-lg flex gap-2"
                disabled={offlineOrders.length === 0}
              >
                <Printer size={18} /> Print Last Order
              </button>
            </div>
          </div>

          {/* Table */}
          <div className={`p-6 rounded-2xl ${cardBg} ${border}`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
              <h2 className={`text-lg font-semibold ${text}`}>Offline Orders</h2>
              <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`pl-10 pr-4 py-2 rounded-lg text-sm w-full md:w-64 ${cardBg} ${border} ${text}`}
                  />
                </div>
                <button
                  onClick={exportToExcel}
                  className="bg-green-600 px-4 py-2 rounded-lg flex gap-2 items-center justify-center"
                >
                  <Download size={18} /> Export Excel
                </button>
              </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block">
              <table className="w-full text-sm">
                <thead className={`border-b ${border} ${textSecondary}`}>
                  <tr>
                    <th className="text-left py-2">ID</th>
                    <th className="text-left py-2">Customer</th>
                    <th className="text-left py-2">Email</th>
                    <th className="text-left py-2">Product</th>
                    <th className="text-left py-2">Qty</th>
                    <th className="text-left py-2">Amount</th>
                    <th className="text-left py-2">Discount</th>
                    <th className="text-left py-2">GST</th>
                    <th className="text-left py-2">Date & Time</th>
                    <th className="text-left py-2">Payment</th>
                    <th className="text-left py-2">Action</th>
                    <th className="text-left py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {offlineOrders.filter(o => 
                    o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    o.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    o.product.toLowerCase().includes(searchTerm.toLowerCase())
                  ).length === 0 && (
                    <tr>
                      <td colSpan="12" className={`py-4 text-center ${textSecondary}`}>
                        {searchTerm ? 'No orders found matching your search' : 'No offline orders added'}
                      </td>
                    </tr>
                  )}

                  {offlineOrders.filter(o => 
                    o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    o.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    o.product.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map((o) => (
                    <tr key={o.id} className={`border-b ${border}`}>
                      <td className={`py-2 ${text}`}>{o.id}</td>
                      <td className={text}>{o.customer}</td>
                      <td className={textSecondary}>{o.email}</td>
                      <td className={textSecondary}>{o.product}</td>
                      <td className={text}>{o.qty}</td>
                      <td className={text}>₹ {o.amount}</td>
                      <td className={textSecondary}>{o.discount || 0}%</td>
                      <td className={textSecondary}>{o.gst || 0}%</td>
                      <td className={textSecondary}>{new Date(o.dateTime).toLocaleString('en-IN', { 
                        year: 'numeric', 
                        month: '2-digit', 
                        day: '2-digit', 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: true 
                      })}</td>
                      <td className={textSecondary}>{o.payment}</td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            onClick={() => editOrder(o)}
                            className="text-yellow-500 hover:text-yellow-600"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => printOrder(o)}
                            className="text-blue-500 hover:text-blue-600"
                          >
                            <Printer size={18} />
                          </button>
                          <button
                            onClick={() => deleteOrder(o.id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                      <td className={`font-bold text-lg ${text}`}>₹ {o.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {offlineOrders.filter(o => 
                o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                o.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                o.product.toLowerCase().includes(searchTerm.toLowerCase())
              ).length === 0 && (
                <div className={`py-4 text-center ${textSecondary}`}>
                  {searchTerm ? 'No orders found matching your search' : 'No offline orders added'}
                </div>
              )}
              
              {offlineOrders.filter(o => 
                o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                o.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                o.product.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((o) => (
                <div key={o.id} className={`p-4 rounded-lg ${cardBg} ${border}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className={`font-bold text-lg ${text}`}>{o.id}</h3>
                      <p className={`text-sm ${textSecondary}`}>{o.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-lg ${isDark ? 'text-green-400' : 'text-green-600'}`}>₹ {o.total}</p>
                      <p className={`text-xs ${textSecondary}`}>{o.payment}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <p className={textSecondary}><span>Email:</span> <span className={text}>{o.email}</span></p>
                    <p className={textSecondary}><span>Product:</span> <span className={text}>{o.product}</span></p>
                    <p className={textSecondary}><span>Qty:</span> <span className={text}>{o.qty}</span> | <span>Amount:</span> <span className={text}>₹{o.amount}</span></p>
                    <p className={textSecondary}><span>Discount:</span> <span className={text}>{o.discount || 0}%</span> | <span>GST:</span> <span className={text}>{o.gst || 0}%</span></p>
                    <p className={`text-xs ${textSecondary}`}>{new Date(o.dateTime).toLocaleString('en-IN', { 
                      year: 'numeric', 
                      month: '2-digit', 
                      day: '2-digit', 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: true 
                    })}</p>
                  </div>
                  
                  <div className={`flex gap-2 mt-3 pt-3 border-t ${border}`}>
                    <button
                      onClick={() => editOrder(o)}
                      className="flex-1 bg-yellow-600 px-3 py-2 rounded text-sm flex items-center justify-center gap-1"
                    >
                      <Edit size={16} /> Edit
                    </button>
                    <button
                      onClick={() => printOrder(o)}
                      className="flex-1 bg-blue-600 px-3 py-2 rounded text-sm flex items-center justify-center gap-1"
                    >
                      <Printer size={16} /> Print
                    </button>
                    <button
                      onClick={() => deleteOrder(o.id)}
                      className="flex-1 bg-red-600 px-3 py-2 rounded text-sm flex items-center justify-center gap-1"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
    </div>
  );
};

export default OfflineOnlineData;
