import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { toast } from 'sonner';
import { Play, Clock, CheckCircle, ChevronLeft, Star, Zap, PlayCircle } from 'lucide-react';

interface Task {
  _id: string;
  type: string;
  title: string;
  description: string;
  reward: number;
  requiredCount: number;
  countdownSeconds: number;
  platform: string;
  externalUrl: string;
}

export default function TasksPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'ads' | 'survey' | 'gameInstall'>('ads');

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
        <h1 className="text-2xl font-bold neon-text">{t('tasks')}</h1>
      </motion.div>

      {/* Category Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-2 mb-6 overflow-x-auto pb-2"
      >
        {[
          { id: 'ads', icon: <Play size={18} />, label: t('ads') },
          { id: 'survey', icon: <Star size={18} />, label: t('surveys') },
          { id: 'gameInstall', icon: <Zap size={18} />, label: t('games') },
        ].map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'gradient-primary text-black font-semibold'
                : 'glass text-gray-400'
            }`}
          >
            {tab.icon}
            {tab.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Task Content */}
      {activeTab === 'ads' && <AdsTasks />}
      {activeTab === 'survey' && <SurveyTasks />}
      {activeTab === 'gameInstall' && <GameInstallTasks />}

      {/* Bottom Navigation */}
      <div className="nav-bar">
        <div className="flex justify-around items-center">
          {[
            { icon: '🏠', label: t('home'), path: '/home' },
            { icon: '📋', label: t('tasks'), path: '/tasks', active: true },
            { icon: '🏆', label: t('leaderboard'), path: '/leaderboard' },
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

function AdsTasks() {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [watchingAd, setWatchingAd] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [adsWatched, setAdsWatched] = useState(0);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const result = await api.getTasks('ads');
      if (result.success) {
        setTasks(result.data.tasks);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const startWatchingAd = () => {
    setWatchingAd(true);
    setCountdown(30);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setWatchingAd(false);
          setAdsWatched((prev) => prev + 1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const submitTask = async () => {
    if (adsWatched < 5) {
      toast.error('Watch at least 5 ads to complete this task!');
      return;
    }

    try {
      const fingerprint = await generateFingerprint();
      const result = await api.completeTask(tasks[0]?._id || '', fingerprint);
      if (result.success) {
        toast.success(`${t('taskCompleted')} You earned ${result.data.reward} AED!`);
        setAdsWatched(0);
      }
    } catch (error: any) {
      toast.error(error.message || 'Task submission failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner" />
      </div>
    );
  }

  if (watchingAd) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="card-gradient p-8 text-center"
      >
        <div className="w-32 h-32 mx-auto mb-6 relative">
          <svg className="w-full h-full animate-spin" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(countdown / 30) * 283} 283`}
              transform="rotate(-90 50 50)"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00ff88" />
                <stop offset="100%" stopColor="#00d4ff" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold neon-text">{countdown}</span>
          </div>
        </div>
        <p className="text-xl font-semibold mb-2">Watching Ad...</p>
        <p className="text-gray-400">Please wait for the ad to complete</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="card-gradient p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-semibold">Watch 5 Ads</h3>
            <p className="text-sm text-gray-400">Earn 0.50 AED per completion</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-[#00ff88]">{adsWatched}/5</span>
          </div>
        </div>

        <div className="h-3 bg-black/30 rounded-full overflow-hidden mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(adsWatched / 5) * 100}%` }}
            className="h-full gradient-primary rounded-full"
          />
        </div>

        <div className="grid grid-cols-5 gap-2 mb-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-lg flex items-center justify-center ${
                i < adsWatched
                  ? 'bg-[#00ff88]/20 border border-[#00ff88]'
                  : 'bg-black/30 border border-gray-700'
              }`}
            >
              {i < adsWatched ? (
                <CheckCircle className="text-[#00ff88]" size={20} />
              ) : (
                <PlayCircle className="text-gray-600" size={20} />
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={startWatchingAd}
            className="btn-neon flex-1 flex items-center justify-center gap-2"
          >
            <Play size={18} />
            Watch Ad
          </button>
          {adsWatched >= 5 && (
            <button
              onClick={submitTask}
              className="btn-ghost flex-1 flex items-center justify-center gap-2"
            >
              <CheckCircle size={18} />
              Complete
            </button>
          )}
        </div>
      </div>

      {/* Sample Tasks */}
      {tasks.map((task, index) => (
        <motion.div
          key={task._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="card-gradient p-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#00ff88]/20 flex items-center justify-center">
              <Play size={24} className="text-[#00ff88]" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{task.title}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock size={14} />
                <span>{task.countdownSeconds}s</span>
                <span>•</span>
                <span>{task.platform}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-[#00ff88]">{task.reward * 0.7} AED</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function SurveyTasks() {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [surveysCompleted, setSurveysCompleted] = useState(0);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const result = await api.getTasks('survey');
      if (result.success) {
        setTasks(result.data.tasks);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitSurvey = async () => {
    if (surveysCompleted < 3) {
      toast.error('Complete at least 3 surveys!');
      return;
    }

    try {
      const fingerprint = await generateFingerprint();
      const result = await api.completeTask(tasks[0]?._id || '', fingerprint);
      if (result.success) {
        toast.success(`Survey task completed! You earned ${result.data.reward} AED!`);
        setSurveysCompleted(0);
      }
    } catch (error: any) {
      toast.error(error.message || 'Task submission failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="card-gradient p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-semibold">Complete 3 Surveys</h3>
            <p className="text-sm text-gray-400">Earn 1.00 AED per completion</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-[#00d4ff]">{surveysCompleted}/3</span>
          </div>
        </div>

        <div className="h-3 bg-black/30 rounded-full overflow-hidden mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(surveysCompleted / 3) * 100}%` }}
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setSurveysCompleted((prev) => prev + 1)}
            className="btn-neon flex-1 flex items-center justify-center gap-2"
          >
            <Star size={18} />
            Mark Survey Done
          </button>
          {surveysCompleted >= 3 && (
            <button
              onClick={submitSurvey}
              className="btn-ghost flex-1 flex items-center justify-center gap-2"
            >
              <CheckCircle size={18} />
              Complete
            </button>
          )}
        </div>
      </div>

      {tasks.map((task, index) => (
        <motion.div
          key={task._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="card-gradient p-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#00d4ff]/20 flex items-center justify-center">
              <Star size={24} className="text-[#00d4ff]" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{task.title}</h3>
              <p className="text-sm text-gray-400">{task.platform}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-[#00d4ff]">{task.reward * 0.7} AED</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function GameInstallTasks() {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [gamesInstalled, setGamesInstalled] = useState(0);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const result = await api.getTasks('gameInstall');
      if (result.success) {
        setTasks(result.data.tasks);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitGameInstall = async () => {
    if (gamesInstalled < 2) {
      toast.error('Install at least 2 games!');
      return;
    }

    try {
      const fingerprint = await generateFingerprint();
      const result = await api.completeTask(tasks[0]?._id || '', fingerprint);
      if (result.success) {
        toast.success(`Game task completed! You earned ${result.data.reward} AED!`);
        setGamesInstalled(0);
      }
    } catch (error: any) {
      toast.error(error.message || 'Task submission failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="card-gradient p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-semibold">Install 2 Games</h3>
            <p className="text-sm text-gray-400">Earn 2.00 AED per completion</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-[#ff00ff]">{gamesInstalled}/2</span>
          </div>
        </div>

        <div className="h-3 bg-black/30 rounded-full overflow-hidden mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(gamesInstalled / 2) * 100}%` }}
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setGamesInstalled((prev) => prev + 1)}
            className="btn-neon flex-1 flex items-center justify-center gap-2"
          >
            <Zap size={18} />
            Mark Installed
          </button>
          {gamesInstalled >= 2 && (
            <button
              onClick={submitGameInstall}
              className="btn-ghost flex-1 flex items-center justify-center gap-2"
            >
              <CheckCircle size={18} />
              Complete
            </button>
          )}
        </div>
      </div>

      {tasks.map((task, index) => (
        <motion.div
          key={task._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="card-gradient p-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#ff00ff]/20 flex items-center justify-center">
              <Zap size={24} className="text-[#ff00ff]" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{task.title}</h3>
              <p className="text-sm text-gray-400">{task.platform}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-[#ff00ff]">{task.reward * 0.7} AED</p>
            </div>
          </div>
        </motion.div>
      ))}
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
