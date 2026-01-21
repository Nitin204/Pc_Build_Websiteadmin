
import React, { useEffect, useState } from 'react';
import { User, Save, Camera } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SettingsPage = () => {
  const { cardBg, border, text, textSecondary } = useTheme();

  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const [confirmPassword, setConfirmPassword] = useState('');

  // 🔹 Logged-in admin
  const admin = JSON.parse(localStorage.getItem('admin'));
  const username = admin?.username || '';

  // 🔹 Fetch admin profile
  useEffect(() => {
    if (!username) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`https://pc-build-websiteabackend-2.onrender.com/api/admin/${username}`);
        if (!res.ok) throw new Error();

        const data = await res.json();
        setProfile({
          fullName: data.username,
          email: data.username + '@systembuilders.com',
          password: ''
        });
      } catch {
        toast.error('Failed to fetch profile ❌');
      }
    };

    fetchProfile();
  }, [username]);

  // 🔹 Save username + password
  const handleSave = async () => {
    if (!profile.password || profile.password !== confirmPassword) {
      toast.error('Passwords do not match or are empty ❌');
      return;
    }

    try {
      let updatedUsername = username;

      // 🟢 UPDATE USERNAME
      if (profile.fullName !== username) {
        const resUsername = await fetch(
          `https://pc-build-websiteabackend-2.onrender.com/api/admin/update-username?oldUsername=${username}&newUsername=${profile.fullName}`,
          { method: 'PUT' }
        );

        if (!resUsername.ok) {
          const msg = await resUsername.text();
          toast.error(msg);
          return;
        }

        const updatedAdmin = await resUsername.json();
        localStorage.setItem('admin', JSON.stringify(updatedAdmin));
        updatedUsername = updatedAdmin.username;
      }

      // 🟢 UPDATE PASSWORD
      const resPassword = await fetch(
        `https://pc-build-websiteabackend-2.onrender.com/api/admin/update/${updatedUsername}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: profile.password })
        }
      );

      if (resPassword.ok) {
        toast.success('Profile Updated Successfully ✅');
        setProfile({ ...profile, password: '' });
        setConfirmPassword('');
      } else {
        const errMsg = await resPassword.text();
        toast.error(errMsg);
      }

    } catch {
      toast.error('Update failed ❌');
    }
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <ToastContainer position="top-right" />

      <div>
        <h1 className={`text-2xl font-black uppercase tracking-tighter ${text}`}>Settings</h1>
        <p className={`text-sm ${textSecondary}`}>
          Manage your account and dashboard preferences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="space-y-2">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-600 text-white font-bold">
            <User size={18} /> <span>Profile</span>
          </div>
        </div>

        {/* Form */}
        <div className="md:col-span-2 space-y-6">
          <div className={`p-6 rounded-2xl space-y-6 ${cardBg} ${border}`}>
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="w-20 h-20 bg-red-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black">
                  {profile.fullName
                    .split(' ')
                    .map(n => n[0])
                    .join('')}
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                  <Camera size={20} className="text-white" />
                </div>
              </div>
              <div>
                <h3 className={`font-bold ${text}`}>{profile.fullName}</h3>
                <p className={`text-xs uppercase tracking-widest ${textSecondary}`}>
                  Administrator
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Username */}
              <div className="space-y-2">
                <label className={`text-xs font-bold uppercase ${textSecondary}`}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={e => setProfile({ ...profile, fullName: e.target.value })}
                  className={`w-full rounded-xl px-4 py-2.5 text-sm ${cardBg} ${border} ${text}`}
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className={`text-xs font-bold uppercase ${textSecondary}`}>
                  Email Address
                </label>
                <input
                  type="email"
                  readOnly
                  value={profile.email}
                  className={`w-full rounded-xl px-4 py-2.5 text-sm cursor-not-allowed ${border} ${text}`}
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className={`text-xs font-bold uppercase ${textSecondary}`}>
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={profile.password}
                  onChange={e => setProfile({ ...profile, password: e.target.value })}
                  className={`w-full rounded-xl px-4 py-2.5 text-sm ${cardBg} ${border} ${text}`}
                />
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className={`text-xs font-bold uppercase ${textSecondary}`}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className={`w-full rounded-xl px-4 py-2.5 text-sm ${cardBg} ${border} ${text}`}
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg active:scale-95"
            >
              <Save size={18} /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
