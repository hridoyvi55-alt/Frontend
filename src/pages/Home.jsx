import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';

const cards = [
  { title: 'Ads Income', desc: 'Watch verified ads and earn AED.', icon: '📺', color: 'from-indigo-500 to-cyan-400', to: '/tasks' },
  { title: 'Survey Income', desc: 'Complete surveys from trusted partners.', icon: '📝', color: 'from-purple-500 to-pink-500', to: '/tasks' },
  { title: 'Game Install', desc: 'Install and verify partner apps.', icon: '🎮', color: 'from-emerald-500 to-teal-400', to: '/tasks' },
  { title: 'Invite Friends', desc: 'Share your link and earn 2 AED per invite.', icon: '👥', color: 'from-amber-500 to-orange-400', to: '/invite' },
  { title: 'Withdraw', desc: 'Request payout in bKash, Nagad, PayPal or Binance.', icon: '💸', color: 'from-sky-500 to-blue-500', to: '/withdrawal' },
  { title: 'Leaderboard', desc: 'See top earners and total income ranks.', icon: '🏆', color: 'from-fuchsia-500 to-pink-500', to: '/leaderboard' }
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24 md:pb-10 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.20),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.20),_transparent_28%)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-6">
        <div className="rounded-[2rem] border border-white/10 bg-white/6 backdrop-blur-2xl p-6 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <p className="text-white/55">Welcome back</p>
              <h1 className="mt-2 text-4xl font-black tracking-tight">
                {user?.displayName || 'User'}
              </h1>
              <p className="mt-3 max-w-2xl text-white/65">
                Premium verified earning dashboard for tasks, invites, withdrawals, leaderboard and settings.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-3xl bg-slate-900/75 p-5 border border-white/10 min-w-[160px]">
                <div className="text-white/45 text-sm">Balance</div>
                <div className="mt-2 text-3xl font-black">0.00 AED</div>
              </div>
              <div className="rounded-3xl bg-slate-900/75 p-5 border border-white/10 min-w-[160px]">
                <div className="text-white/45 text-sm">UID</div>
                <div className="mt-2 text-xs font-mono break-all">{user?.uid}</div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <StatCard label="Today Earnings" value="0.00 AED" icon="⚡" />
            <StatCard label="Total Income" value="0.00 AED" icon="💎" />
            <StatCard label="Referral Bonus" value="2 AED" icon="👥" />
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.title}
              to={card.to}
              className="group rounded-[2rem] border border-white/10 bg-white/6 p-5 hover:bg-white/10 transition shadow-lg"
            >
              <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${card.color} grid place-items-center text-2xl shadow-lg`}>
                {card.icon}
              </div>
              <h3 className="mt-4 text-xl font-bold">{card.title}</h3>
              <p className="mt-2 text-white/65">{card.desc}</p>
            </Link>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Task', '⚡'],
            ['Invite', '👥'],
            ['Withdraw', '💸'],
            ['Leaderboard', '🏆']
          ].map(([name, icon]) => (
            <Link key={name} to={`/${name.toLowerCase()}`} className="rounded-3xl border border-white/10 bg-white/6 p-5 text-center hover:bg-white/10 transition">
              <div className="text-3xl mb-2">{icon}</div>
              <div className="font-bold">{name}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
