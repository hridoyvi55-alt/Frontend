import BottomNav from '../components/BottomNav';
import { motion } from 'framer-motion';
import { Moon, Sun, Globe, Bell, Shield, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { logout } = useAuth();
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState('English');
  const [notifications, setNotifications] = useState(true);

  const languages = [
    { name: 'English', code: 'en' },
    { name: 'العربية', code: 'ar' },
    { name: 'বাংলা', code: 'bn' },
    { name: 'हिन्दी', code: 'hi' },
    { name: 'Urdu', code: 'ur' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a1f] pb-20">
      {/* Header */}
      <div className="pt-8 px-6">
        <h1 className="text-4xl font-bold">Settings</h1>
        <p className="text-gray-400 mt-2">Customize your experience</p>
      </div>

      <div className="px-6 mt-10 space-y-8">
        {/* Appearance */}
        <div className="glass rounded-3xl p-7">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-3">
            <Sun className="text-yellow-400" size={26} /> Appearance
          </h2>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {darkMode ? <Moon size={28} /> : <Sun size={28} />}
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-gray-400">Eye friendly theme</p>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setDarkMode(!darkMode)}
              className={`w-14 h-8 rounded-full relative transition-all ${darkMode ? 'bg-cyan-500' : 'bg-gray-600'}`}
            >
              <motion.div
                animate={{ x: darkMode ? 28 : 4 }}
                className="w-6 h-6 bg-white rounded-full absolute top-1 shadow-md"
              />
            </motion.button>
          </div>
        </div>

        {/* Language */}
        <div className="glass rounded-3xl p-7">
          <h2 className="text-lg font-semibold mb-5 flex items-center gap-3">
            <Globe size={26} className="text-purple-400" /> Language
          </h2>
          
          <div className="grid grid-cols-2 gap-3">
            {languages.map((lang) => (
              <motion.button
                key={lang.code}
                whileTap={{ scale: 0.95 }}
                onClick={() => setLanguage(lang.name)}
                className={`py-4 rounded-2xl font-medium transition-all ${
                  language === lang.name 
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white' 
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                {lang.name}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="glass rounded-3xl p-7">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Bell size={28} className="text-emerald-400" />
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-gray-400">Task rewards & updates</p>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setNotifications(!notifications)}
              className={`w-14 h-8 rounded-full relative transition-all ${notifications ? 'bg-emerald-500' : 'bg-gray-600'}`}
            >
              <motion.div
                animate={{ x: notifications ? 28 : 4 }}
                className="w-6 h-6 bg-white rounded-full absolute top-1 shadow-md"
              />
            </motion.button>
          </div>
        </div>

        {/* Security */}
        <div className="glass rounded-3xl p-7">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-3">
            <Shield size={26} className="text-cyan-400" /> Security
          </h2>
          <div className="space-y-5 text-sm">
            <div className="flex justify-between items-center">
              <span>Firebase 2FA Enabled</span>
              <span className="text-emerald-400">✓ Active</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Login Sessions</span>
              <span className="text-cyan-400 cursor-pointer hover:underline">Manage</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Device Fingerprint</span>
              <span className="text-emerald-400">Protected</span>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="glass rounded-3xl p-7 text-center">
          <p className="text-gray-400">EarnAED v1.0</p>
          <p className="text-xs text-gray-500 mt-2">Made with ❤️ for real earners</p>
        </div>

        {/* Logout */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={logout}
          className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 py-6 rounded-3xl font-bold flex items-center justify-center gap-3 transition-all"
        >
          <LogOut size={26} />
          Logout from Account
        </motion.button>
      </div>

      <BottomNav />
    </div>
  );
};

export default Settings;
