import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-white">
            💰 RealEarn
          </Link>
          
          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img
                  src={user.photoURL || '/default-avatar.png'}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
                <span className="text-white font-medium hidden md:block">
                  {user.displayName || user.email}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Bottom Navigation */}
      {user && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
          <div className="grid grid-cols-4 gap-2 px-4 py-2 max-w-7xl mx-auto">
            <Link to="/home" className="flex flex-col items-center text-xs text-gray-600 hover:text-indigo-600">
              <span>🏠</span>
              <span>Home</span>
            </Link>
            <Link to="/tasks" className="flex flex-col items-center text-xs text-gray-600 hover:text-indigo-600">
              <span>📱</span>
              <span>Tasks</span>
            </Link>
            <Link to="/leaderboard" className="flex flex-col items-center text-xs text-gray-600 hover:text-indigo-600">
              <span>🏆</span>
              <span>Rank</span>
            </Link>
            <Link to="/profile" className="flex flex-col items-center text-xs text-gray-600 hover:text-indigo-600">
              <span>👤</span>
              <span>Profile</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
