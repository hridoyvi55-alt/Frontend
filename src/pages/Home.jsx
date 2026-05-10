import { useAuth } from '../context/AuthContext';
import BottomNav from '../components/BottomNav';
import { motion } from 'framer-motion';
import { Gift, Users, Trophy, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="min-h-screen bg-[#0a0a1f] pb-20">
      {/* Header */}
      <div className="pt-8 px-6 flex items-center justify-between">
        <div>
          <p className="text-cyan-400 text-sm font-medium">{greeting()},</p>
          <h1 className="text-3xl font-bold text-white">
            {user?.displayName?.split(" ")[0] || "Champion"}
          </h1>
        </div>
        <div 
          onClick={() => navigate('/profile')}
          className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-cyan-400 cursor-pointer"
        >
          <img 
            src={user?.photoURL || "https://via.placeholder.com/150"} 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Balance Card */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mx-6 mt-8 glass rounded-3xl p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-cyan-400 to-purple-600 opacity-10 rounded-full -mr-10 -mt-10"></div>
        
        <p className="text-gray-400 text-sm">Total Balance</p>
        <div className="flex items-baseline mt-2">
          <span className="text-6xl font-bold text-white">0.00</span>
          <span className="text-3xl ml-2 text-cyan-400">AED</span>
        </div>
        <p className="text-emerald-400 text-sm mt-3 flex items-center gap-1">
          +12.50 AED today
        </p>
      </motion.div>

      {/* Quick Actions */}
      <div className="px-6 mt-10">
        <h2 className="text-xl font-semibold mb-5 text-white">Earn Now</h2>
        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/tasks')}
            className="glass rounded-3xl p-6 cursor-pointer border border-white/10 hover:border-cyan-400/50 transition-all"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4">
              <Gift size={32} />
            </div>
            <h3 className="font-bold text-xl">Complete Tasks</h3>
            <p className="text-gray-400 text-sm mt-1">Ads • Survey • Games</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/invite')}
            className="glass rounded-3xl p-6 cursor-pointer border border-white/10 hover:border-cyan-400/50 transition-all"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4">
              <Users size={32} />
            </div>
            <h3 className="font-bold text-xl">Invite Friends</h3>
            <p className="text-gray-400 text-sm mt-1">2 AED per referral</p>
          </motion.div>
        </div>
      </div>

      {/* Leaderboard Teaser */}
      <div className="px-6 mt-8">
        <div 
          onClick={() => navigate('/leaderboard')}
          className="glass rounded-3xl p-6 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-all"
        >
          <div className="flex items-center gap-4">
            <Trophy className="text-yellow-400" size={36} />
            <div>
              <p className="font-semibold">Top Earners</p>
              <p className="text-sm text-gray-400">See who is leading</p>
            </div>
          </div>
          <div className="text-cyan-400">→</div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Home;
