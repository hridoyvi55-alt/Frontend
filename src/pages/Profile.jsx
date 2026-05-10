import { useAuth } from '../context/AuthContext';
import BottomNav from '../components/BottomNav';
import { motion } from 'framer-motion';
import { LogOut, Edit3, Copy, Award, Calendar } from 'lucide-react';
import { useState } from 'react';

const Profile = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || "User");

  const handleLogout = () => {
    logout();
  };

  const copyUID = () => {
    navigator.clipboard.writeText(user?.uid);
    alert("UID Copied!");
  };

  return (
    <div className="min-h-screen bg-[#0a0a1f] pb-20">
      {/* Header */}
      <div className="pt-8 px-6 text-center">
        <h1 className="text-4xl font-bold">My Profile</h1>
      </div>

      {/* Profile Picture */}
      <div className="flex justify-center mt-8">
        <motion.div 
          whileHover={{ scale: 1.08 }}
          className="relative"
        >
          <div className="w-36 h-36 rounded-3xl overflow-hidden border-4 border-cyan-400 shadow-2xl shadow-cyan-500/30">
            <img 
              src={user?.photoURL || "https://via.placeholder.com/300"} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="absolute bottom-2 right-2 bg-cyan-500 p-3 rounded-2xl shadow-lg"
          >
            <Edit3 size={20} />
          </button>
        </motion.div>
      </div>

      {/* Name & Edit */}
      <div className="text-center mt-6 px-6">
        {isEditing ? (
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="bg-white/10 border border-cyan-400 text-center text-2xl font-bold rounded-2xl py-3 w-full max-w-xs mx-auto focus:outline-none"
            onBlur={() => setIsEditing(false)}
          />
        ) : (
          <h2 className="text-3xl font-bold text-white">{displayName}</h2>
        )}
        <p className="text-gray-400 mt-1 text-sm">{user?.email}</p>
      </div>

      {/* UID */}
      <div className="mx-6 mt-8 glass rounded-3xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Your Unique ID</p>
            <p className="font-mono text-lg text-cyan-300 break-all">{user?.uid}</p>
          </div>
          <button 
            onClick={copyUID}
            className="bg-white/10 hover:bg-white/20 p-3 rounded-2xl transition-colors"
          >
            <Copy size={22} />
          </button>
        </div>
      </div>

      {/* Balance & Stats */}
      <div className="grid grid-cols-2 gap-4 mx-6 mt-6">
        <motion.div 
          whileHover={{ y: -5 }}
          className="glass rounded-3xl p-6 text-center"
        >
          <p className="text-gray-400">Total Earned</p>
          <p className="text-4xl font-bold text-emerald-400 mt-3">248.75 <span className="text-xl">AED</span></p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="glass rounded-3xl p-6 text-center"
        >
          <p className="text-gray-400">Rank</p>
          <p className="text-4xl font-bold text-yellow-400 mt-3">#12</p>
          <p className="text-sm text-gray-400">Global</p>
        </motion.div>
      </div>

      {/* Extra Info */}
      <div className="mx-6 mt-6 glass rounded-3xl p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center">
            <Award className="text-purple-400" size={28} />
          </div>
          <div>
            <p className="font-semibold">Total Tasks Completed</p>
            <p className="text-2xl font-bold text-white">87</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-cyan-500/20 rounded-2xl flex items-center justify-center">
            <Calendar className="text-cyan-400" size={28} />
          </div>
          <div>
            <p className="font-semibold">Member Since</p>
            <p className="text-white">May 2026</p>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="mx-6 mt-10">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 py-5 rounded-3xl font-bold flex items-center justify-center gap-3 transition-all"
        >
          <LogOut size={24} />
          Logout
        </motion.button>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
