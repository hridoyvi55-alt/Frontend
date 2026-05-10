import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navClass = ({ isActive }) =>
  `rounded-xl px-4 py-2 text-sm font-semibold transition ${
    isActive ? 'bg-white text-slate-950' : 'text-white/70 hover:text-white hover:bg-white/10'
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    nav('/');
  };

  return (
    <div className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-2xl text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 font-black shadow-lg">
            R
          </div>
          <div>
            <div className="font-black leading-none">RealEarn</div>
            <div className="text-xs text-white/45">Real income platform</div>
          </div>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <NavLink to="/home" className={navClass}>Home</NavLink>
          <NavLink to="/tasks" className={navClass}>Tasks</NavLink>
          <NavLink to="/invite" className={navClass}>Invite</NavLink>
          <NavLink to="/leaderboard" className={navClass}>Leaderboard</NavLink>
          <NavLink to="/withdrawal" className={navClass}>Withdraw</NavLink>
          <NavLink to="/settings" className={navClass}>Settings</NavLink>
          <NavLink to="/profile" className={navClass}>Profile</NavLink>
        </div>

        <div className="flex items-center gap-3">
          <img
            src={user.photoURL || 'https://i.pravatar.cc/100'}
            alt="profile"
            className="h-10 w-10 rounded-2xl object-cover ring-2 ring-white/10"
          />
          <button
            onClick={handleLogout}
            className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/15"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
