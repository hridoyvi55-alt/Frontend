import { Home, Trophy, Wallet, User, Settings, Gift } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: <Home size={26} />, label: 'Home', path: '/' },
    { icon: <Gift size={26} />, label: 'Tasks', path: '/tasks' },
    { icon: <Trophy size={26} />, label: 'Rank', path: '/leaderboard' },
    { icon: <Wallet size={26} />, label: 'Withdraw', path: '/withdrawal' },
    { icon: <User size={26} />, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0f0f23]/95 backdrop-blur-2xl border-t border-white/10 z-50">
      <div className="max-w-md mx-auto flex items-center justify-around py-2 px-4">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center py-2 px-3 transition-all duration-300 ${isActive ? 'text-cyan-400 scale-110' : 'text-gray-400 hover:text-gray-200'}`}
            >
              <motion.div
                whileTap={{ scale: 0.8 }}
                className={isActive ? "relative" : ""}
              >
                {item.icon}
                {isActive && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full"></div>
                )}
              </motion.div>
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
