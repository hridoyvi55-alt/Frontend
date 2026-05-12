import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { toast } from 'sonner';
import {
  ChevronLeft,
  Moon,
  Sun,
  Globe,
  Shield,
  Info,
  ChevronRight,
  LogOut,
  Star,
} from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰' },
];

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') !== 'false'
  );
  const [showLanguage, setShowLanguage] = useState(false);

  const toggleDarkMode = async () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));

    try {
      await api.updateSettings({ darkMode: newMode });
    } catch (error) {
      console.error('Error saving settings:', error);
    }

    if (newMode) {
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
    }
  };

  const changeLanguage = async (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('language', langCode);

    try {
      await api.updateSettings({ language: langCode });
    } catch (error) {
      console.error('Error saving language:', error);
    }

    setShowLanguage(false);
    toast.success(`Language changed to ${languages.find((l) => l.code === langCode)?.name}`);
  };

  const handleLogout = async () => {
    const { logOut } = await import('../lib/firebase');
    try {
      await logOut();
      api.clearToken();
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0];

  return (
    <div className="min-h-screen p-4 pb-24 animated-bg">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-8"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/home')}
          className="w-10 h-10 rounded-full glass flex items-center justify-center"
        >
          <ChevronLeft size={20} />
        </motion.button>
        <h1 className="text-2xl font-bold neon-text">{t('settings')}</h1>
      </motion.div>

      {/* Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">
          Appearance
        </h2>

        <div className="card-gradient">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
              {darkMode ? (
                <Moon size={22} className="text-[#ffd700]" />
              ) : (
                <Sun size={22} className="text-[#ffd700]" />
              )}
              <div>
                <p className="font-semibold">{darkMode ? t('darkMode') : t('lightMode')}</p>
                <p className="text-xs text-gray-400">
                  {darkMode ? 'Dark theme enabled' : 'Light theme enabled'}
                </p>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleDarkMode}
              className={`w-14 h-8 rounded-full p-1 transition-colors ${
                darkMode ? 'bg-[#00ff88]' : 'bg-gray-600'
              }`}
            >
              <motion.div
                animate={{ x: darkMode ? 24 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="w-6 h-6 rounded-full bg-white shadow-lg"
              />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Language */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <h2 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">
          Language
        </h2>

        <div className="card-gradient">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowLanguage(!showLanguage)}
            className="w-full flex items-center justify-between p-4"
          >
            <div className="flex items-center gap-3">
              <Globe size={22} className="text-[#00d4ff]" />
              <div>
                <p className="font-semibold">{t('language')}</p>
                <p className="text-xs text-gray-400">
                  {currentLang.flag} {currentLang.name}
                </p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-500" />
          </motion.button>

          {showLanguage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="px-4 pb-4 space-y-2"
            >
              {languages.map((lang) => (
                <motion.button
                  key={lang.code}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                    i18n.language === lang.code
                      ? 'bg-[#00ff88]/20 border border-[#00ff88]'
                      : 'bg-black/20 hover:bg-white/5'
                  }`}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span className="flex-1 text-left">{lang.name}</span>
                  {i18n.language === lang.code && (
                    <div className="w-2 h-2 rounded-full bg-[#00ff88]" />
                  )}
                </motion.button>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* About */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <h2 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">
          About
        </h2>

        <div className="card-gradient divide-y divide-gray-800">
          <div className="flex items-center gap-3 p-4">
            <Shield size={22} className="text-[#00ff88]" />
            <div className="flex-1">
              <p className="font-semibold">Privacy Policy</p>
            </div>
            <ChevronRight size={20} className="text-gray-500" />
          </div>

          <div className="flex items-center gap-3 p-4">
            <Info size={22} className="text-[#00d4ff]" />
            <div className="flex-1">
              <p className="font-semibold">App Version</p>
            </div>
            <span className="text-gray-400 text-sm">1.0.0</span>
          </div>

          <div className="flex items-center gap-3 p-4">
            <Star size={22} className="text-[#ffd700]" />
            <div className="flex-1">
              <p className="font-semibold">Rate App</p>
            </div>
            <ChevronRight size={20} className="text-gray-500" />
          </div>
        </div>
      </motion.div>

      {/* Logout */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleLogout}
        className="w-full btn-ghost text-red-400 border-red-400/50 hover:border-red-400 flex items-center justify-center gap-2"
      >
        <LogOut size={20} />
        {t('logout')}
      </motion.button>

      {/* Bottom Navigation */}
      <div className="nav-bar">
        <div className="flex justify-around items-center">
          {[
            { icon: '🏠', label: t('home'), path: '/home' },
            { icon: '📋', label: t('tasks'), path: '/tasks' },
            { icon: '🏆', label: t('leaderboard'), path: '/leaderboard' },
            { icon: '💰', label: t('withdraw'), path: '/withdraw' },
            { icon: '👤', label: t('profile'), path: '/profile' },
          ].map((item) => (
            <motion.div
              key={item.path}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="nav-item"
              onClick={() => navigate(item.path)}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-xs">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
