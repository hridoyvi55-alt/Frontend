import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    nav('/');
  };

  return (
    <div className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-2xl text-white">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link to="/home" className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 grid place-items-center shadow-[0_10px_35px_rgba(99,102,241,0.35)]">
            ✦
          </div>
          <div>
            <div className="font-bold leading-none">RealEarn</div>
            <div className="text-xs text-white/45">Earn verified real income</div>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <img
            src={user.photoURL || 'https://i.pravatar.cc/100'}
            alt="profile"
            className="h-10 w-10 rounded-2xl object-cover ring-2 ring-white/10"
          />
          <button
            onClick={handleLogout}
            className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/16 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
