import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { logOut } from '../lib/firebase';
import { toast } from 'sonner';
import { Camera, Edit2, LogOut, ChevronRight, Shield, Award } from 'lucide-react';

interface UserData {
  uid: string;
  displayName: string;
  photoURL: string;
  email: string;
  balance: number;
  totalEarnings: number;
  withdrawableBalance: number;
  referralCode: string;
  referralCount: number;
  referralEarnings: number;
  tasksCompleted: {
    ads: number;
    survey: number;
    gameInstall: number;
  };
  createdAt: string;
}

export default function ProfilePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [uploading, setUploading] = useState(false);

  useState(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setNewName(JSON.parse(storedUser).displayName);
    }
  });

  const handleLogout = async () => {
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

  const handleUpdateProfile = async () => {
    if (!newName.trim()) return;
    setUploading(true);
    try {
      const result = await api.updateProfile({ displayName: newName });
      if (result.success) {
        const updatedUser = { ...user, displayName: newName };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        toast.success('Profile updated!');
        setEditing(false);
      }
    } catch (error) {
      toast.error('Update failed');
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pb-24 animated-bg">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-2xl font-bold neon-text">{t('profile')}</h1>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-gradient p-6 mb-6"
      >
        <div className="flex flex-col items-center">
          {/* Profile Picture */}
          <div className="relative mb-4">
            <div className="w-32 h-32 rounded-full overflow-hidden neon-border-cyan">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full gradient-primary flex items-center justify-center">
                  <span className="text-5xl font-bold text-black">
                    {user.displayName?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute bottom-0 right-0 w-10 h-10 rounded-full gradient-primary flex items-center justify-center"
            >
              <Camera className="text-black" size={20} />
            </motion.button>
          </div>

          {/* Name Section */}
          <div className="text-center w-full">
            {editing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="input-neon text-center"
                  placeholder="Enter your name"
                />
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => setEditing(false)}
                    className="btn-ghost px-6 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateProfile}
                    disabled={uploading}
                    className="btn-neon px-6 py-2"
                  >
                    {uploading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-2xl font-bold">{user.displayName}</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setEditing(true)}
                  className="p-2 rounded-full hover:bg-white/10"
                >
                  <Edit2 size={18} className="text-gray-400" />
                </motion.button>
              </div>
            )}
          </div>

          {/* User ID */}
          <div className="mt-4 w-full">
            <div className="glass p-3 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">{t('userId')}</p>
                <p className="font-mono text-sm">{user.uid}</p>
              </div>
              <Shield className="text-green-500" size={20} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-gradient p-6 mb-6"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Award className="text-[#ffd700]" size={20} />
          Statistics
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <StatItem
            label={t('balance')}
            value={`${user.withdrawableBalance?.toFixed(2)} AED`}
            color="green"
          />
          <StatItem
            label={t('totalEarnings')}
            value={`${user.totalEarnings?.toFixed(2)} AED`}
            color="gold"
          />
          <StatItem
            label={t('invites')}
            value={user.referralCount?.toString()}
            color="cyan"
          />
          <StatItem
            label="Referral Earnings"
            value={`${user.referralEarnings?.toFixed(2)} AED`}
            color="purple"
          />
        </div>
      </motion.div>

      {/* Tasks Completed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card-gradient p-6 mb-6"
      >
        <h3 className="text-lg font-semibold mb-4">Tasks Completed</h3>

        <div className="space-y-3">
          <TaskProgress label="Ads Watched" value={user.tasksCompleted?.ads || 0} color="#00ff88" />
          <TaskProgress label="Surveys Completed" value={user.tasksCompleted?.survey || 0} color="#00d4ff" />
          <TaskProgress label="Games Installed" value={user.tasksCompleted?.gameInstall || 0} color="#ff00ff" />
        </div>
      </motion.div>

      {/* Referral Code */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card-gradient p-6 mb-6"
      >
        <h3 className="text-lg font-semibold mb-4">{t('referralCode')}</h3>
        <div className="glass p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="font-mono text-xl font-bold neon-text">{user.referralCode}</p>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(user.referralCode);
              toast.success('Copied to clipboard!');
            }}
            className="btn-neon py-2 px-4 text-sm"
          >
            {t('copyCode')}
          </button>
        </div>
      </motion.div>

      {/* Logout Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
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
            { icon: '👤', label: t('profile'), path: '/profile', active: true },
          ].map((item) => (
            <motion.div
              key={item.path}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`nav-item ${item.active ? 'active' : ''}`}
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

function StatItem({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  const colors: Record<string, string> = {
    green: 'text-[#00ff88]',
    gold: 'text-[#ffd700]',
    cyan: 'text-[#00d4ff]',
    purple: 'text-[#ff00ff]',
  };

  return (
    <div className="glass p-3 rounded-xl">
      <p className="text-xs text-gray-400">{label}</p>
      <p className={`text-xl font-bold ${colors[color]}`}>{value}</p>
    </div>
  );
}

function TaskProgress({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm text-gray-400">{label}</span>
        <span className="text-sm font-bold" style={{ color }}>{value}</span>
      </div>
      <div className="h-2 bg-black/30 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(value * 10, 100)}%` }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
    </div>
  );
}
