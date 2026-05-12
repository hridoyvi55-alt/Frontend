import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { toast } from 'sonner';
import {
  Users,
  Wallet,
  BarChart3,
  AlertTriangle,
  ChevronLeft,
  Search,
  CheckCircle,
  XCircle,
  Ban,
  Unlock,
  Eye,
} from 'lucide-react';

interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  balance: number;
  totalEarnings: number;
  isBlocked: boolean;
  fraudScore: number;
}

interface Withdrawal {
  _id: string;
  userId: string;
  userName: string;
  amount: number;
  method: string;
  status: string;
  createdAt: string;
}

interface Stats {
  totalUsers: number;
  activeUsers: number;
  totalEarnings: number;
  pendingWithdrawals: number;
  blockedUsers: number;
}

export default function AdminPanel() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'withdrawals' | 'fraud'>('dashboard');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [search, setSearch] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await api.adminLogin(password);
      if (result.success) {
        api.setAdminToken(result.data.token);
        setAuthenticated(true);
        toast.success('Admin access granted');
        loadData();
      } else {
        toast.error('Invalid password');
      }
    } catch (error) {
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    try {
      const statsResult = await api.adminGetStats();
      if (statsResult.success) {
        setStats(statsResult.data.stats);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const result = await api.adminGetUsers({ search });
      if (result.success) {
        setUsers(result.data.users);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWithdrawals = async () => {
    setLoading(true);
    try {
      const pendingResult = await api.adminGetPendingWithdrawals();
      if (pendingResult.success) {
        setWithdrawals(pendingResult.data.withdrawals);
      }
    } catch (error) {
      console.error('Error loading withdrawals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (uid: string, blocked: boolean) => {
    try {
      const result = await api.adminBlockUser(uid, blocked);
      if (result.success) {
        toast.success(`User ${blocked ? 'blocked' : 'unblocked'}`);
        loadUsers();
      }
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const handleProcessWithdrawal = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const result = await api.adminProcessWithdrawal(id, status);
      if (result.success) {
        toast.success(`Withdrawal ${status}`);
        loadWithdrawals();
      }
    } catch (error) {
      toast.error('Action failed');
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 animated-bg">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-gradient p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center">
              <BarChart3 size={40} className="text-black" />
            </div>
            <h1 className="text-2xl font-bold neon-text">Admin Panel</h1>
          </div>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="input-neon mb-4"
          />

          <button
            onClick={handleLogin}
            disabled={loading || !password}
            className="btn-neon w-full"
          >
            {loading ? 'Verifying...' : 'Access Admin Panel'}
          </button>

          <button
            onClick={() => navigate('/home')}
            className="btn-ghost w-full mt-4"
          >
            Back to App
          </button>
        </motion.div>
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
        <h1 className="text-2xl font-bold neon-text">Admin Panel</h1>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
          { id: 'users', icon: Users, label: 'Users' },
          { id: 'withdrawals', icon: Wallet, label: 'Withdrawals' },
          { id: 'fraud', icon: AlertTriangle, label: 'Fraud' },
        ].map((tab) => (
          <motion.button
            key={tab.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setActiveTab(tab.id as any);
              if (tab.id === 'users') loadUsers();
              if (tab.id === 'withdrawals') loadWithdrawals();
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'gradient-primary text-black font-semibold'
                : 'glass text-gray-400'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Dashboard */}
      {activeTab === 'dashboard' && stats && (
        <div className="grid grid-cols-2 gap-4">
          <StatCard label="Total Users" value={stats.totalUsers} color="#00ff88" />
          <StatCard label="Active Users" value={stats.activeUsers} color="#00d4ff" />
          <StatCard label="Total Earnings" value={`${stats.totalEarnings.toFixed(2)}`} color="#ffd700" />
          <StatCard label="Pending" value={stats.pendingWithdrawals} color="#ff00ff" />
        </div>
      )}

      {/* Users */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="input-neon flex-1"
            />
            <button onClick={loadUsers} className="btn-neon px-6">
              <Search size={18} />
            </button>
          </div>

          {users.map((user) => (
            <motion.div
              key={user.uid}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-gradient p-4"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full gradient-primary flex items-center justify-center">
                      <span className="font-bold text-black">{user.displayName.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{user.displayName}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
                {user.isBlocked && (
                  <span className="badge bg-red-500">Blocked</span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 text-sm mb-3">
                <div className="glass p-2 rounded-lg">
                  <p className="text-xs text-gray-400">Balance</p>
                  <p className="font-bold text-[#00ff88]">{user.balance.toFixed(2)}</p>
                </div>
                <div className="glass p-2 rounded-lg">
                  <p className="text-xs text-gray-400">Total Earned</p>
                  <p className="font-bold text-[#ffd700]">{user.totalEarnings.toFixed(2)}</p>
                </div>
                <div className="glass p-2 rounded-lg">
                  <p className="text-xs text-gray-400">Fraud Score</p>
                  <p className={`font-bold ${user.fraudScore > 50 ? 'text-red-400' : 'text-gray-400'}`}>
                    {user.fraudScore}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleBlockUser(user.uid, !user.isBlocked)}
                  className={`btn-ghost flex-1 flex items-center justify-center gap-2 ${
                    user.isBlocked ? 'text-green-400 border-green-400/50' : 'text-red-400 border-red-400/50'
                  }`}
                >
                  {user.isBlocked ? <Unlock size={16} /> : <Ban size={16} />}
                  {user.isBlocked ? 'Unblock' : 'Block'}
                </button>
                <button className="btn-ghost flex-1 flex items-center justify-center gap-2">
                  <Eye size={16} />
                  Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Withdrawals */}
      {activeTab === 'withdrawals' && (
        <div className="space-y-4">
          {withdrawals.length === 0 ? (
            <div className="card-gradient p-8 text-center">
              <Wallet size={48} className="mx-auto text-gray-500 mb-4" />
              <p className="text-gray-400">No pending withdrawals</p>
            </div>
          ) : (
            withdrawals.map((w) => (
              <motion.div
                key={w._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-gradient p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold">{w.userName}</p>
                    <p className="text-xs text-gray-400">{w.userId.substring(0, 12)}...</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-[#00ff88]">{w.amount} AED</p>
                    <p className="text-sm text-gray-400 capitalize">{w.method}</p>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mb-3">
                  {new Date(w.createdAt).toLocaleString()}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleProcessWithdrawal(w._id, 'approved')}
                    className="btn-neon flex-1 flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={16} />
                    Approve
                  </button>
                  <button
                    onClick={() => handleProcessWithdrawal(w._id, 'rejected')}
                    className="btn-ghost flex-1 flex items-center justify-center gap-2 text-red-400 border-red-400/50"
                  >
                    <XCircle size={16} />
                    Reject
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Fraud Alerts */}
      {activeTab === 'fraud' && (
        <div className="space-y-4">
          <div className="card-gradient p-4 border border-yellow-500/30">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle size={24} className="text-yellow-400" />
              <h3 className="font-semibold text-yellow-400">Fraud Detection Active</h3>
            </div>
            <p className="text-sm text-gray-400">
              The system monitors device fingerprints, IP addresses, and task completion patterns to detect fraudulent activity.
            </p>
          </div>

          {users
            .filter((u) => u.fraudScore > 30)
            .map((user) => (
              <motion.div
                key={user.uid}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-gradient p-4 border border-red-500/30"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full gradient-primary flex items-center justify-center">
                        <span className="font-bold text-black">{user.displayName.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{user.displayName}</p>
                    <p className="text-xs text-gray-400">Fraud Score: {user.fraudScore}</p>
                  </div>
                  <button
                    onClick={() => handleBlockUser(user.uid, true)}
                    className="btn-ghost text-red-400 border-red-400/50"
                  >
                    <Ban size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: any; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card-gradient p-4"
    >
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-bold" style={{ color }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
    </motion.div>
  );
}
