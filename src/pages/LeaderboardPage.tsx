import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { ChevronLeft, Trophy, Medal, Crown } from 'lucide-react';

interface LeaderboardUser {
  rank: number;
  name: string;
  photoURL: string;
  totalEarnings: number;
  referralCount: number;
}

export default function LeaderboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const result = await api.getLeaderboard();
      if (result.success) {
        setLeaderboard(result.data.leaderboard);

        // Find current user's rank
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const rank = result.data.leaderboard.findIndex(
          (u: LeaderboardUser) => u.name === currentUser.displayName
        );
        if (rank !== -1) {
          setUserRank(rank + 1);
        }
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown size={24} className="text-[#ffd700]" />;
      case 2:
        return <Medal size={24} className="text-[#c0c0c0]" />;
      case 3:
        return <Medal size={24} className="text-[#cd7f32]" />;
      default:
        return <span className="text-lg font-bold text-gray-400">#{rank}</span>;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-[#ffd700]/20 to-[#ffd700]/5 border-[#ffd700]/50';
      case 2:
        return 'bg-gradient-to-r from-[#c0c0c0]/20 to-[#c0c0c0]/5 border-[#c0c0c0]/50';
      case 3:
        return 'bg-gradient-to-r from-[#cd7f32]/20 to-[#cd7f32]/5 border-[#cd7f32]/50';
      default:
        return 'glass';
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
        <h1 className="text-2xl font-bold neon-text flex items-center gap-2">
          <Trophy size={24} className="text-[#ffd700]" />
          {t('leaderboard')}
        </h1>
      </motion.div>

      {/* Top 3 Podium */}
      {leaderboard.length >= 3 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-end justify-center gap-3 mb-8"
        >
          {/* 2nd Place */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#c0c0c0] mb-2">
              {leaderboard[1].photoURL ? (
                <img src={leaderboard[1].photoURL} alt={leaderboard[1].name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#c0c0c0]/50 to-gray-700 flex items-center justify-center">
                  <span className="text-xl font-bold">{leaderboard[1].name.charAt(0)}</span>
                </div>
              )}
            </div>
            <div className="card-gradient p-3 text-center w-24">
              <p className="text-sm font-bold">{leaderboard[1].name}</p>
              <p className="text-xs text-[#ffd700]">{leaderboard[1].totalEarnings.toFixed(2)} AED</p>
            </div>
            <div className="w-24 h-24 glass rounded-t-xl flex items-center justify-center">
              <Medal size={40} className="text-[#c0c0c0]" />
            </div>
          </motion.div>

          {/* 1st Place */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center"
          >
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#ffd700] mb-2 neon-border-gold">
              {leaderboard[0].photoURL ? (
                <img src={leaderboard[0].photoURL} alt={leaderboard[0].name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full gradient-gold flex items-center justify-center">
                  <span className="text-2xl font-bold text-black">{leaderboard[0].name.charAt(0)}</span>
                </div>
              )}
            </div>
            <div className="card-gradient p-4 text-center w-28">
              <p className="text-sm font-bold">{leaderboard[0].name}</p>
              <p className="text-sm text-[#ffd700]">{leaderboard[0].totalEarnings.toFixed(2)} AED</p>
            </div>
            <div className="w-28 h-32 gradient-gold rounded-t-xl flex items-center justify-center relative">
              <Crown size={48} className="text-black" />
              <div className="absolute -top-1 left-1/2 -translate-x-1/2">
                <span className="text-4xl">👑</span>
              </div>
            </div>
          </motion.div>

          {/* 3rd Place */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#cd7f32] mb-2">
              {leaderboard[2].photoURL ? (
                <img src={leaderboard[2].photoURL} alt={leaderboard[2].name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#cd7f32]/50 to-gray-700 flex items-center justify-center">
                  <span className="text-xl font-bold">{leaderboard[2].name.charAt(0)}</span>
                </div>
              )}
            </div>
            <div className="card-gradient p-3 text-center w-24">
              <p className="text-sm font-bold">{leaderboard[2].name}</p>
              <p className="text-xs text-[#ffd700]">{leaderboard[2].totalEarnings.toFixed(2)} AED</p>
            </div>
            <div className="w-24 h-20 glass rounded-t-xl flex items-center justify-center">
              <Medal size={32} className="text-[#cd7f32]" />
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Your Rank */}
      {userRank && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card-gradient p-4 mb-6 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full glass flex items-center justify-center">
              <Trophy size={20} className="text-[#00ff88]" />
            </div>
            <div>
              <p className="text-sm text-gray-400">{t('yourRank')}</p>
              <p className="text-xl font-bold">#{userRank}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Full Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-3"
      >
        {leaderboard.slice(3).map((user, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.05 }}
            className={`card-gradient p-4 flex items-center gap-4 ${getRankStyle(user.rank)}`}
          >
            <div className="w-10 text-center">{getRankIcon(user.rank)}</div>

            <div className="w-12 h-12 rounded-full overflow-hidden">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full gradient-primary flex items-center justify-center">
                  <span className="text-sm font-bold text-black">{user.name.charAt(0)}</span>
                </div>
              )}
            </div>

            <div className="flex-1">
              <p className="font-semibold">{user.name}</p>
              <p className="text-xs text-gray-400">{user.referralCount} referrals</p>
            </div>

            <div className="text-right">
              <p className="text-lg font-bold text-[#00ff88]">{user.totalEarnings.toFixed(2)}</p>
              <p className="text-xs text-gray-400">AED</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom Navigation */}
      <div className="nav-bar">
        <div className="flex justify-around items-center">
          {[
            { icon: '🏠', label: t('home'), path: '/home' },
            { icon: '📋', label: t('tasks'), path: '/tasks' },
            { icon: '🏆', label: t('leaderboard'), path: '/leaderboard', active: true },
            { icon: '💰', label: t('withdraw'), path: '/withdraw' },
            { icon: '👤', label: t('profile'), path: '/profile' },
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
