import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ChevronLeft, Share2, Copy, CheckCircle, Users, Gift } from 'lucide-react';

export default function InvitePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [referralCode, setReferralCode] = useState('');
  const [referralCount, setReferralCount] = useState(0);
  const [referralEarnings, setReferralEarnings] = useState(0);
  const [codeInput, setCodeInput] = useState('');
  const [applying, setApplying] = useState(false);

  useState(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setReferralCode(user.referralCode || '');
    setReferralCount(user.referralCount || 0);
    setReferralEarnings(user.referralEarnings || 0);
  });

  const handleShare = () => {
    const shareText = `Join RealEarn and earn money! Use my referral code: ${referralCode}\nDownload: https://realearn.app`;

    if (navigator.share) {
      navigator.share({
        title: 'RealEarn - Earn Money Online',
        text: shareText,
        url: 'https://realearn.app',
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Referral link copied to clipboard!');
    }
  };

  const handleApplyCode = async () => {
    if (!codeInput.trim()) {
      toast.error('Please enter a referral code');
      return;
    }

    setApplying(true);
    try {
      const { api } = await import('../lib/api');
      const result = await api.processReferral(codeInput.toUpperCase());
      if (result.success) {
        toast.success('Referral bonus credited!');
        setReferralCount((prev) => prev + 1);
        setReferralEarnings((prev) => prev + 2);
        setCodeInput('');
      } else {
        toast.error(result.error || 'Invalid referral code');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to apply code');
    } finally {
      setApplying(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success('Code copied!');
  };

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
        <h1 className="text-2xl font-bold neon-text">{t('invite')}</h1>
      </motion.div>

      {/* Main Invite Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-gradient p-6 mb-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#ffd700]/30 to-transparent rounded-full blur-3xl" />

        <div className="relative z-10 text-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-24 h-24 mx-auto mb-4 rounded-full gradient-gold flex items-center justify-center"
          >
            <Gift size={40} className="text-black" />
          </motion.div>

          <h2 className="text-2xl font-bold mb-2">{t('inviteFriends')}</h2>
          <p className="text-gray-400 mb-6">Share your code and earn 2 AED for each friend who joins!</p>

          {/* Referral Code */}
          <div className="glass p-4 rounded-xl mb-6">
            <p className="text-sm text-gray-400 mb-2">Your Referral Code</p>
            <p className="text-3xl font-bold neon-text-gold tracking-widest">{referralCode}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="glass p-4 rounded-xl">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Users size={18} className="text-[#00d4ff]" />
                <span className="text-2xl font-bold">{referralCount}</span>
              </div>
              <p className="text-xs text-gray-400">{t('invites')}</p>
            </div>
            <div className="glass p-4 rounded-xl">
              <div className="flex items-center justify-center gap-2 mb-1">
                <CheckCircle size={18} className="text-[#00ff88]" />
                <span className="text-2xl font-bold">{referralEarnings.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-400">AED Earned</p>
            </div>
          </div>

          {/* Share Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="btn-neon w-full flex items-center justify-center gap-2"
          >
            <Share2 size={18} />
            {t('shareNow')}
          </motion.button>
        </div>
      </motion.div>

      {/* Copy Option */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-gradient p-4 mb-6"
      >
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={referralCode}
            readOnly
            className="input-neon flex-1 font-mono"
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={copyCode}
            className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center"
          >
            <Copy size={20} className="text-black" />
          </motion.button>
        </div>
      </motion.div>

      {/* Enter Referral Code */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card-gradient p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Have a Referral Code?</h3>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
            placeholder={t('enterReferralCode')}
            className="input-neon flex-1 font-mono text-center"
            maxLength={8}
          />
          <button
            onClick={handleApplyCode}
            disabled={applying || !codeInput}
            className="btn-neon py-3 px-6"
          >
            {applying ? 'Applying...' : t('apply')}
          </button>
        </div>
      </motion.div>

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
