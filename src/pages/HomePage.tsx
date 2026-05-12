import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import {
  Home,
  User,
  ListTodo,
  Wallet,
  Trophy,
  Settings,
  Users,
  Gift,
  TrendingUp,
  Zap,
  ChevronRight,
  Activity,
} from 'lucide-react';

interface UserData {
  uid: string;
  displayName: string;
  photoURL: string;
  balance: number;
  totalEarnings: number;
  withdrawableBalance: number;
  referralCount: number;
  tasksCompleted: {
    ads: number;
    survey: number;
    gameInstall: number;
  };
}

export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      const result = await api.getProfile();
      if (result.success) {
        setUser(result.data.user);
        localStorage.setItem('user', JSON.stringify(result.data.user));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden neon-border">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full gradient-primary flex items-center justify-center">
                <User className="text-black" size={24} />
              </div>
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold">{user?.displayName || 'User'}</h2>
            <p className="text-sm text-gray-400">@{user?.uid?.substring(0, 8)}</p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/settings')}
          className="w-10 h-10 rounded-full glass flex items-center justify-center"
        >
          <Settings className="text-gray-400" size={20} />
        </motion.button>
      </motion.div>

      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-gradient p-6 mb-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-green-500/30 to-transparent rounded-full blur-3xl" />

        <div className="relative z-10">
          <p className="text-gray-400 text-sm mb-1">{t('withdrawable')}</p>
          <h1 className="text-5xl font-bold neon-text mb-4">
            {user?.withdrawableBalance?.toFixed(2) || '0.00'}
            <span className="text-2xl ml-2 text-gray-400">AED</span>
          </h1>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass p-3 rounded-xl">
              <p className="text-xs text-gray-400">{t('totalEarnings')}</p>
              <p className="text-xl font-bold text-[#ffd700]">
                {user?.totalEarnings?.toFixed(2) || '0.00'} AED
              </p>
            </div>
            <div className="glass p-3 rounded-xl">
              <p className="text-xs text-gray-400">{t('invites')}</p>
              <p className="text-xl font-bold text-[#00d4ff]">
                {user?.referralCount || 0}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-4 mb-6"
      >
        <ActionCard
          icon={<Zap className="text-[#00ff88]" size={28} />}
          title={t('ads')}
          subtitle="Earn watching ads"
          color="green"
          onClick={() => navigate('/tasks/ads')}
        />
        <ActionCard
          icon={<ListTodo className="text-[#00d4ff]" size={28} />}
          title={t('surveys')}
          subtitle="Complete surveys"
          color="cyan"
          onClick={() => navigate('/tasks/survey')}
        />
        <ActionCard
          icon={<Activity className="text-[#ff00ff]" size={28} />}
          title={t('games')}
          subtitle="Install & earn"
          color="purple"
          onClick={() => navigate('/tasks/gameInstall')}
        />
        <ActionCard
          icon={<Gift className="text-[#ffd700]" size={28} />}
          title={t('invite')}
          subtitle="Earn 2 AED each"
          color="gold"
          onClick={() => navigate('/invite')}
        />
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-3 gap-3 mb-6"
      >
        <StatCard label="Ads Done" value={user?.tasksCompleted?.ads || 0} icon="📺" />
        <StatCard label="Surveys" value={user?.tasksCompleted?.survey || 0} icon="📋" />
        <StatCard label="Games" value={user?.tasksCompleted?.gameInstall || 0} icon="🎮" />
      </motion.div>

      {/* Bottom Navigation */}
      <div className="nav-bar">
        <div className="flex justify-around items-center">
          {[
            { icon: Home, label: t('home'), path: '/home', active: true },
            { icon: ListTodo, label: t('tasks'), path: '/tasks' },
            { icon: Trophy, label: t('leaderboard'), path: '/leaderboard' },
            { icon: Wallet, label: t('withdraw'), path: '/withdraw' },
            { icon: User, label: t('profile'), path: '/profile' },
          ].map((item, index) => (
            <motion.div
              key={item.path}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`nav-item ${item.active ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <item.icon size={24} />
              <span className="text-xs">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ActionCard({
  icon,
  title,
  subtitle,
  color,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  color: string;
  onClick: () => void;
}) {
  const colors: Record<string, string> = {
    green: 'from-green-500/20 to-green-500/5 border-green-500/30',
    cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/30',
    purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/30',
    gold: 'from-yellow-500/20 to-yellow-500/5 border-yellow-500/30',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`card-gradient p-4 bg-gradient-to-br ${colors[color]} cursor-pointer`}
    >
      <div className="flex items-start justify-between">
        <div className="p-2 rounded-xl bg-black/20">{icon}</div>
        <ChevronRight className="text-gray-500" size={20} />
      </div>
      <h3 className="font-semibold mt-3">{title}</h3>
      <p className="text-xs text-gray-400">{subtitle}</p>
    </motion.div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: string;
}) {
  return (
    <div className="glass p-3 rounded-xl text-center">
      <span className="text-2xl">{icon}</span>
      <p className="text-2xl font-bold mt-1">{value}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  );
}
