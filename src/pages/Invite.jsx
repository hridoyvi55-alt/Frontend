import BottomNav from '../components/BottomNav';
import { motion } from 'framer-motion';
import { Users, Copy, Share2, Gift, Trophy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Invite = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const referralLink = `https://realearn.app/ref/${user?.uid?.slice(0, 8)}`;
  const referralCode = user?.uid?.slice(0, 8).toUpperCase() || "XXXXXX";

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const topReferrers = [
    { name: "Rahim Khan", invites: 47, earned: "94.00" },
    { name: "Ayesha Ahmed", invites: 39, earned: "78.00" },
    { name: "Salman Faris", invites: 32, earned: "64.00" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a1f] pb-20">
      {/* Header */}
      <div className="pt-8 px-6">
        <div className="flex items-center gap-3">
          <Gift className="text-pink-400" size={40} />
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Invite Friends
            </h1>
            <p className="text-gray-400">Earn 2 AED per successful referral</p>
          </div>
        </div>
      </div>

      {/* Referral Card */}
      <div className="mx-6 mt-10 glass rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-pink-500 to-purple-600 opacity-10 rounded-full -mr-12 -mt-12"></div>
        
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-3xl mb-6">
            <Users size={42} className="text-pink-400" />
          </div>
          
          <h2 className="text-3xl font-bold">Share & Earn</h2>
          <p className="text-emerald-400 text-5xl font-bold mt-4">2 AED</p>
          <p className="text-gray-400">for every friend who joins & completes first task</p>
        </div>

        {/* Referral Code */}
        <div className="mt-10 bg-black/30 rounded-2xl p-5">
          <p className="text-xs text-gray-400 mb-2">YOUR REFERRAL CODE</p>
          <div className="flex items-center justify-between bg-white/5 rounded-xl px-5 py-4">
            <span className="font-mono text-3xl tracking-widest text-white">{referralCode}</span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={copyLink}
              className="bg-white text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-cyan-400 transition-colors"
            >
              <Copy size={20} />
              {copied ? "Copied!" : "Copy"}
            </motion.button>
          </div>
        </div>

        {/* Referral Link */}
        <div className="mt-6">
          <p className="text-xs text-gray-400 mb-2">REFERRAL LINK</p>
          <div className="bg-white/5 rounded-2xl p-4 text-sm break-all text-gray-300 font-mono">
            {referralLink}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={copyLink}
          className="mt-8 w-full bg-gradient-to-r from-pink-500 to-purple-600 py-6 rounded-3xl font-bold text-xl flex items-center justify-center gap-3"
        >
          <Share2 size={26} />
          Share Now
        </motion.button>
      </div>

      {/* How it Works */}
      <div className="mx-6 mt-10">
        <h2 className="text-xl font-semibold mb-5">How it Works</h2>
        <div className="space-y-4">
          <div className="glass rounded-3xl p-6 flex gap-5">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">1</div>
            <div>
              <p className="font-semibold">Share your link</p>
              <p className="text-sm text-gray-400">Send to friends via WhatsApp, Telegram etc.</p>
            </div>
          </div>
          <div className="glass rounded-3xl p-6 flex gap-5">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">2</div>
            <div>
              <p className="font-semibold">They Sign Up</p>
              <p className="text-sm text-gray-400">Using your referral code</p>
            </div>
          </div>
          <div className="glass rounded-3xl p-6 flex gap-5">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">3</div>
            <div>
              <p className="font-semibold">Earn 2 AED</p>
              <p className="text-sm text-gray-400">When they complete their first task</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Referrers */}
      <div className="px-6 mt-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Trophy size={24} className="text-yellow-400" /> Top Referrers
          </h2>
          <span className="text-cyan-400 text-sm">This Month</span>
        </div>

        <div className="space-y-3">
          {topReferrers.map((person, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-3xl p-5 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-xl font-bold">
                  {index + 1}
                </div>
                <div>
                  <p className="font-semibold">{person.name}</p>
                  <p className="text-sm text-gray-400">{person.invites} invites</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-emerald-400 font-bold">+{person.earned} AED</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Invite;
