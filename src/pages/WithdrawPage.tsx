import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { toast } from 'sonner';
import { ChevronLeft, Wallet, Clock, CheckCircle, XCircle, CreditCard } from 'lucide-react';

type PaymentMethod = 'bkash' | 'nagad' | 'paypal' | 'binance';
type WithdrawStatus = 'pending' | 'approved' | 'rejected' | 'paid';

interface WithdrawalRequest {
  _id: string;
  amount: number;
  method: PaymentMethod;
  status: WithdrawStatus;
  createdAt: string;
  adminNote?: string;
}

export default function WithdrawPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<WithdrawalRequest[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleSubmit = async () => {
    if (!method || !accountNumber) {
      toast.error('Please fill all fields');
      return;
    }

    const withdrawAmount = parseFloat(amount);
    if (withdrawAmount < 10) {
      toast.error('Minimum withdrawal is 10 AED');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.withdrawableBalance < withdrawAmount) {
      toast.error('Insufficient balance');
      return;
    }

    setLoading(true);
    try {
      const fingerprint = await generateFingerprint();
      const result = await api.requestWithdrawal({
        amount: withdrawAmount,
        method,
        paymentDetails: { number: accountNumber },
        fingerprint,
      });

      if (result.success) {
        toast.success('Withdrawal request submitted!');
        setAmount('');
        setAccountNumber('');
        loadHistory();
      }
    } catch (error: any) {
      toast.error(error.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      const result = await api.getWithdrawalHistory();
      if (result.success) {
        setHistory(result.data.withdrawals);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const getStatusColor = (status: WithdrawStatus) => {
    switch (status) {
      case 'approved':
      case 'paid':
        return 'text-[#00ff88]';
      case 'rejected':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
  };

  const getStatusIcon = (status: WithdrawStatus) => {
    switch (status) {
      case 'approved':
      case 'paid':
        return <CheckCircle size={16} className="text-[#00ff88]" />;
      case 'rejected':
        return <XCircle size={16} className="text-red-400" />;
      default:
        return <Clock size={16} className="text-yellow-400" />;
    }
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
        <h1 className="text-2xl font-bold neon-text">{t('withdrawal')}</h1>
      </motion.div>

      {!showHistory ? (
        <>
          {/* Withdrawal Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-gradient p-6 mb-6"
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Wallet size={20} className="text-[#00ff88]" />
              {t('requestWithdrawal')}
            </h2>

            {/* Amount Input */}
            <div className="mb-6">
              <label className="text-sm text-gray-400 mb-2 block">{t('amount')} (AED)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="input-neon text-2xl text-center"
              />
              <p className="text-xs text-gray-500 mt-2">{t('minWithdraw')}</p>
            </div>

            {/* Payment Methods */}
            <div className="mb-6">
              <label className="text-sm text-gray-400 mb-3 block">{t('selectMethod')}</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'bkash', name: 'bKash', color: '#e2136b' },
                  { id: 'nagad', name: 'Nagad', color: '#f05a1a' },
                  { id: 'paypal', name: 'PayPal', color: '#003087' },
                  { id: 'binance', name: 'Binance', color: '#f3ba2f' },
                ].map((pm) => (
                  <motion.button
                    key={pm.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setMethod(pm.id as PaymentMethod)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      method === pm.id
                        ? 'border-[#00ff88] bg-[#00ff88]/10'
                        : 'border-gray-700 bg-black/20'
                    }`}
                  >
                    <span className="text-lg font-semibold">{pm.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Account Number */}
            <div className="mb-6">
              <label className="text-sm text-gray-400 mb-2 block">{t('accountNumber')}</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter account number"
                className="input-neon"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading || !method || !amount}
              className="btn-neon w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="spinner w-5 h-5" />
              ) : (
                <>
                  <CreditCard size={18} />
                  {t('submit')}
                </>
              )}
            </button>
          </motion.div>

          {/* History Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setShowHistory(true);
              loadHistory();
            }}
            className="w-full btn-ghost flex items-center justify-center gap-2"
          >
            <Clock size={18} />
            {t('history')}
          </motion.button>
        </>
      ) : (
        <>
          {/* History View */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Withdrawal History</h2>
              <button
                onClick={() => setShowHistory(false)}
                className="btn-ghost py-2 px-4 text-sm"
              >
                Back
              </button>
            </div>

            {history.length === 0 ? (
              <div className="card-gradient p-8 text-center">
                <p className="text-gray-400">No withdrawal history yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="card-gradient p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-lg">{item.amount} AED</p>
                        <p className="text-sm text-gray-400 capitalize">{item.method}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <span className={`font-semibold capitalize ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                    {item.adminNote && (
                      <p className="text-xs text-gray-500 mt-2">Note: {item.adminNote}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </>
      )}

      {/* Bottom Navigation */}
      <div className="nav-bar">
        <div className="flex justify-around items-center">
          {[
            { icon: '🏠', label: t('home'), path: '/home' },
            { icon: '📋', label: t('tasks'), path: '/tasks' },
            { icon: '🏆', label: t('leaderboard'), path: '/leaderboard' },
            { icon: '💰', label: t('withdraw'), path: '/withdraw', active: true },
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

async function generateFingerprint(): Promise<string> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = "14px 'Arial'";
    ctx.fillText('fingerprint', 2, 2);
  }
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    canvas.toDataURL(),
  ].join('|');
  return btoa(fingerprint);
}
