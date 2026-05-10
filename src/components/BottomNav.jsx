import { NavLink } from 'react-router-dom';

const itemClass = ({ isActive }) =>
  `flex flex-col items-center justify-center gap-1 py-2 rounded-2xl transition ${
    isActive ? 'text-white bg-white/10' : 'text-white/55'
  }`;

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-slate-950/90 backdrop-blur-2xl md:hidden">
      <div className="grid grid-cols-5 gap-1 px-3 py-2">
        <NavLink to="/home" className={itemClass}>
          <span className="text-lg">🏠</span>
          <span className="text-[11px]">Home</span>
        </NavLink>
        <NavLink to="/tasks" className={itemClass}>
          <span className="text-lg">⚡</span>
          <span className="text-[11px]">Tasks</span>
        </NavLink>
        <NavLink to="/invite" className={itemClass}>
          <span className="text-lg">👥</span>
          <span className="text-[11px]">Invite</span>
        </NavLink>
        <NavLink to="/withdrawal" className={itemClass}>
          <span className="text-lg">💸</span>
          <span className="text-[11px]">Withdraw</span>
        </NavLink>
        <NavLink to="/profile" className={itemClass}>
          <span className="text-lg">👤</span>
          <span className="text-[11px]">Profile</span>
        </NavLink>
      </div>
    </div>
  );
}
