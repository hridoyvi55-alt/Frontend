import BottomNav from '../components/BottomNav';
import { motion } from 'framer-motion';
import { Wallet, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useState } from 'react';

const Withdrawal = () => {
  const [activeMethod, setActiveMethod] = useState('bKash');
  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const balance = 248.75; // Demo balance

  const methods = [
    { id: 'bKash', name: 'bKash', icon: '🇧🇩', color: 'bg-pink-500' },
    { id: 'nagad', name: 'Nagad', icon: '🇧🇩', color: 'bg-green-500' },
    { id: 'paypal', name: 'PayPal', icon: '💰', color: 'bg-blue-500' },
    { id: 'binance', name: 'Binance', icon: '₿', color: 'bg-yellow-500' },
  ];

  const recentWithdrawals = [
    { id: 1, method: 'bKash', amount: '150.00', status: 'Approved', date: 'Today' },
    { id: 2, method: 'PayPal', amount: '85.50', status: 'Pending', date: 'Yesterday' },
    { id: 3, method: 'Nagad', amount: '200.00', status: 'Paid', date: '2 days ago' },
  ];

  const handleWithdraw = () => {
    if (!amount || !accountNumber) return;
    if (parseFloat(amount) > balance) return alert("Insufficient Balance!");

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setAmount('');
      setAccountNumber('');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#0a0a1f] pb-20">
      {/* Header */}
      <div className="pt-8 px-6">
        <h1 className="text-4xl font-bold flex items-center gap-3">
          <Wallet className="text-cyan-400" size={40} />
          Withdrawal
        </h1>
        <p className="text-gray-400 mt-2">Instant & Secure Payouts</p>
      </div>

      {/* Current Balance */}
      <div className="mx-6 mt-8 glass rounded-3xl p-8 text-center">
        <p className="text-gray-400">Available Balance</p>
        <p className="text-6xl font-bold text-white mt-3">{balance} <span className="text-3xl text-cyan-400">AED</span></p>
      </div>

      {/* Payment Methods */}
      <div className="px-6 mt-10">
        <h2 className="text-xl font-semibold mb-5">Select Payment Method</h2>
        <div className="grid grid-cols-2 gap-4">
          {methods.map((method) => (
            <motion.div
              key={method.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveMethod(method.id)}
              className={`glass rounded-3xl p-6 cursor-pointer transition-all border-2 ${
                activeMethod === method.id 
                  ? 'border-cyan-400 shadow-cyan-400/30' 
                  : 'border-transparent'
              }`}
            >
              <div className={`w-14 h-14 ${method.color} rounded-2xl flex items-center justify-center text-3xl mb-4`}>
                {method.icon}
              </div>
              <p className="font-bold text-xl">{method.name}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Withdrawal Form */}
      <div className="mx-6 mt-8 glass rounded-3xl p-8">
        <h3 className="font-semibold text-lg mb-6">Withdraw via {methods.find(m => m.id === activeMethod)?.name}</h3>
        
        <div className="space-y-6">
          <div>
            <label className="text-sm text-gray-400 block mb-2">Amount (AED)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Minimum 50 AED"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-2xl focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 block mb-2">
              {activeMethod === 'paypal' ? 'PayPal Email' : 'Account Number / Wallet ID'}
            </label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder={activeMethod === 'paypal' ? 'example@paypal.com' : '01XXXXXXXXX'}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleWithdraw}
            disabled={!amount || !accountNumber}
            className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 py-6 rounded-3xl font-bold text-xl disabled:opacity-50 transition-all"
          >
            Request Withdrawal
          </motion.button>

          <p className="text-center text-xs text-gray-500">
            Processing time: 30 min - 24 hours
          </p>
        </div>
      </div>

      {/* Recent Withdrawals */}
      <div className="px-6 mt-10">
        <h2 className="text-xl font-semibold mb-5">Recent Requests</h2>
        
        <div className="space-y-4">
          {recentWithdrawals.map((wd) => (
            <div key={wd.id} className="glass rounded-3xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-2xl">{methods.find(m => m.name.toLowerCase().includes(wd.method.toLowerCase()))?.icon}</div>
                <div>
                  <p className="font-medium">{wd.method}</p>
                  <p className="text-sm text-gray-400">{wd.date}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold text-emerald-400">+{wd.amount} AED</p>
                <div className={`text-xs flex items-center gap-1 justify-end mt-1
                  ${wd.status === 'Approved' || wd.status === 'Paid' ? 'text-emerald-400' : 'text-yellow-400'}`}>
                  {wd.status === 'Approved' || wd.status === 'Paid' ? <CheckCircle size={16} /> : <Clock size={16} />}
                  {wd.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <motion.div 
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass rounded-3xl p-10 text-center max-w-xs mx-6"
          >
            <CheckCircle className="mx-auto text-emerald-400" size={80} />
            <h3 className="text-2xl font-bold mt-6">Request Submitted!</h3>
            <p className="text-gray-400 mt-3">Your withdrawal request has been sent successfully. You will be notified once it's processed.</p>
          </motion.div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Withdrawal;
