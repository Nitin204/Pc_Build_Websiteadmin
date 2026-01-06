import React from 'react';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const { cardBg, border, text, textSecondary, isDark } = useTheme();

  if (cartItems.length === 0) {
    return (
      <div className={`min-h-screen p-4 ${isDark ? 'bg-[#0a0a0a]' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto">
          <h1 className={`text-2xl font-black uppercase tracking-tighter ${text} mb-8`}>
            Your <span className="text-red-600">Cart</span>
          </h1>
          <div className={`p-8 rounded-2xl text-center ${cardBg} ${border}`}>
            <ShoppingCart size={64} className="mx-auto mb-4 text-gray-400" />
            <h2 className={`text-xl font-bold ${text} mb-2`}>Your cart is empty</h2>
            <p className={`${textSecondary}`}>Add some products to get started</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 ${isDark ? 'bg-[#0a0a0a]' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-2xl font-black uppercase tracking-tighter ${text}`}>
            Your <span className="text-red-600">Cart</span>
          </h1>
          <button
            onClick={clearCart}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold transition-colors"
          >
            <Trash2 size={16} /> Clear Cart
          </button>
        </div>

        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className={`p-6 rounded-2xl ${cardBg} ${border}`}>
              <div className="flex flex-col sm:flex-row gap-4">
                <img
                  src={item.image || '/placeholder-pc.jpg'}
                  alt={item.name}
                  className="w-full sm:w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className={`font-bold text-lg ${text}`}>{item.name}</h3>
                  <p className={`text-sm ${textSecondary} mt-1`}>₹{item.discountPrice || item.price}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-700 rounded"
                      >
                        <Minus size={16} />
                      </button>
                      <span className={`px-3 py-1 rounded ${cardBg} ${border} ${text}`}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-700 rounded"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="flex items-center gap-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-lg ${text}`}>
                    ₹{((item.discountPrice || item.price) * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={`mt-8 p-6 rounded-2xl ${cardBg} ${border}`}>
          <div className="flex justify-between items-center mb-4">
            <span className={`text-xl font-bold ${text}`}>Total:</span>
            <span className={`text-2xl font-black text-red-600`}>
              ₹{getCartTotal().toLocaleString()}
            </span>
          </div>
          <button className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold text-lg transition-colors">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;