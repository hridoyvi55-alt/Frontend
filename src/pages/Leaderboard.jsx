import BottomNav from '../components/BottomNav';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award } from 'lucide-react';

const Leaderboard = () => {
  const leaders = [
    {
      rank: 1,
      name: "Ahmed Khan",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      earnings: "1248.75",
      country: "🇦🇪"
    },
    {
      rank: 2,
      name: "Sara Al-Mansoori",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      earnings: "987.40",
      country: "🇦🇪"
    },
    {
      rank: 3,
      name: "Mohammed Rashid",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      earnings: "874.25",
      country: "🇸🇦"
    },
    {
      rank: 4,
      name: "Fatima Hassan",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      earnings: "765.80",
      country: "🇦🇪"
    },
    {
      rank: 5,
      name: "Omar Khalid",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
      earnings: "654.00",
      country: "🇮🇳"
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a1f] pb-20">
      {/* Header */}
      <div className="pt-8 px-6">
        <div className="flex items-center gap-3">
          <Trophy className="text-yellow-400" size={42} />
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
              Leaderboard
            </h1>
            <p className="text-gray-400">Top Earners This Month</p>
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="px-6 mt-8">
        <div className="flex justify-center items-end gap-4">
          {/* 2nd Place */}
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center flex-1"
          >
            <div className="relative mx-auto w-20 h-20 rounded-2xl overflow-hidden border-4 border-gray-400">
              <img src={leaders[1].avatar} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="mt-3 bg-white/5 rounded-2xl py-4">
              <p className="text-2xl font-bold text-gray-300">#{leaders[1].rank}</p>
              <p className="text-sm truncate font-medium">{leaders[1].name}</p>
              <p className="text-emerald-400 font-bold">{leaders[1].earnings} AED</p>
            </div>
            <Medal className="mx-auto mt-2 text-gray-400" size={28} />
          </motion.div>

          {/* 1st Place */}
          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center flex-1 -mt-6"
          >
            <div className="relative mx-auto w-24 h-24 rounded-3xl overflow-hidden border-4 border-yellow-400 shadow-2xl shadow-yellow-500/50">
              <img src={leaders[0].avatar} alt="" className="w-full h-full object-cover" />
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center">👑</div>
            </div>
            <div className="mt-3 bg-gradient-to-b from-yellow-500/10 to-transparent border border-yellow-400/30 rounded-3xl py-5">
              <p className="text-3xl font-bold text-yellow-400">#{leaders[0].rank}</p>
              <p className="font-medium">{leaders[0].name}</p>
              <p className="text-2xl font-bold text-emerald-400">{leaders[0].earnings} AED</p>
            </div>
          </motion.div>

          {/* 3rd Place */}
          <motion.div 
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center flex-1"
          >
            <div className="relative mx-auto w-20 h-20 rounded-2xl overflow-hidden border-4 border-amber-700">
              <img src={leaders[2].avatar} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="mt-3 bg-white/5 rounded-2xl py-4">
              <p className="text-2xl font-bold text-amber-700">#{leaders[2].rank}</p>
              <p className="text-sm truncate font-medium">{leaders[2].name}</p>
              <p className="text-emerald-400 font-bold">{leaders[2].earnings} AED</p>
            </div>
            <Medal className="mx-auto mt-2 text-amber-700" size={28} />
          </motion.div>
        </div>
      </div>

      {/* Full Leaderboard List */}
      <div className="px-6 mt-12">
        <h2 className="text-xl font-semibold mb-5 px-2">Global Ranking</h2>
        
        <div className="space-y-3">
          {leaders.map((user, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass flex items-center justify-between rounded-3xl px-6 py-5 border border-white/10 hover:border-yellow-400/30 transition-all"
            >
              <div className="flex items-center gap-5">
                <div className={`w-10 h-10 flex items-center justify-center rounded-2xl font-bold text-xl
                  ${user.rank === 1 ? 'bg-yellow-400 text-black' : 
                    user.rank === 2 ? 'bg-gray-400 text-black' : 
                    user.rank === 3 ? 'bg-amber-700 text-white' : 'bg-white/10 text-white'}`}>
                  {user.rank}
                </div>
                
                <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/20">
                  <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                </div>

                <div>
                  <p className="font-semibold text-lg">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.country}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-emerald-400 font-bold text-xl">{user.earnings}</p>
                <p className="text-xs text-gray-500">AED</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Leaderboard;
