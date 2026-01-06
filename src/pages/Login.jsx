// import React, { useState } from 'react';
// import { Eye, EyeOff, Lock, User } from 'lucide-react';
// import { useTheme } from '../context/ThemeContext';

// const Login = ({ onLogin }) => {
//   const { cardBg, border, text, textSecondary, isDark } = useTheme();
//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     username: '',
//     password: ''
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (formData.username && formData.password) {
//       onLogin();
//     }
//   };

//   return (
//     <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${isDark ? 'bg-[#0a0a0a]' : 'bg-gray-50'}`}>
//       <div className={`w-full max-w-md p-8 rounded-2xl shadow-2xl ${cardBg} ${border}`}>
//         <div className="text-center mb-8">
//           <h1 className={`text-3xl font-black uppercase tracking-tighter ${text}`}>
//             System <span className="text-red-600">Builders</span>
//           </h1>
//           <p className={`text-sm mt-2 ${textSecondary}`}>Admin Login</p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label className={`block text-sm mb-2 ${textSecondary}`}>Username</label>
//             <div className="relative">
//               <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${textSecondary}`} size={18} />
//               <input
//                 type="text"
//                 name="username"
//                 value={formData.username}
//                 onChange={handleChange}
//                 placeholder="Enter username"
//                 className={`w-full pl-10 pr-4 py-3 rounded-lg ${cardBg} ${border} ${text} focus:border-red-600 outline-none`}
//                 required
//               />
//             </div>
//           </div>

//           <div>
//             <label className={`block text-sm mb-2 ${textSecondary}`}>Password</label>
//             <div className="relative">
//               <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${textSecondary}`} size={18} />
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 placeholder="Enter password"
//                 className={`w-full pl-10 pr-12 py-3 rounded-lg ${cardBg} ${border} ${text} focus:border-red-600 outline-none`}
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${textSecondary} hover:${text}`}
//               >
//                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold uppercase tracking-wider transition-all"
//           >
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;




import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Login = ({ onLogin }) => {
  const { cardBg, border, text, textSecondary, isDark } = useTheme();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(
        'http://localhost:8181/api/admin/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }
      );

      if (!response.ok) {
        throw new Error('Invalid Admin Credentials');
      }

      const adminData = await response.json();

      // 🔐 Store admin info
      localStorage.setItem('admin', JSON.stringify(adminData));

      // Show success popup
      alert('Login Successful! Welcome to System Builders Admin Panel');

      // ✅ Redirect to dashboard
      onLogin();

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isDark ? 'bg-[#0a0a0a]' : 'bg-gray-50'}`}>
      <div className={`w-full max-w-md p-8 rounded-2xl shadow-2xl ${cardBg} ${border}`}>
        
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-black uppercase ${text}`}>
            System <span className="text-red-600">Builders</span>
          </h1>
          <p className={`text-sm mt-2 ${textSecondary}`}>Admin Login</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Username */}
          <div>
            <label className={`block text-sm mb-2 ${textSecondary}`}>Username</label>
            <div className="relative">
              <User className={`absolute left-3 top-1/2 -translate-y-1/2 ${textSecondary}`} size={18} />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className={`w-full pl-10 pr-4 py-3 rounded-lg ${cardBg} ${border} ${text}`}
                placeholder="Enter username"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className={`block text-sm mb-2 ${textSecondary}`}>Password</label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 ${textSecondary}`} size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`w-full pl-10 pr-12 py-3 rounded-lg ${cardBg} ${border} ${text}`}
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${textSecondary}`}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold uppercase"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default Login;
