import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24 md:pb-10 p-4 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.18),_transparent_30%)]" />
      <div className="relative mx-auto max-w-2xl">
        <div className="rounded-[2rem] border border-white/10 bg-white/6 backdrop-blur-2xl p-6 shadow-2xl">
          <div className="flex flex-col items-center text-center">
            <img
              src={user?.photoURL || 'https://i.pravatar.cc/160'}
              alt="profile"
              className="h-28 w-28 rounded-[2rem] object-cover ring-4 ring-white/10 shadow-2xl"
            />
            <h1 className="mt-4 text-3xl font-black">{user?.displayName || 'No name'}</h1>
            <p className="text-white/60">{user?.email}</p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-900/75 p-5 border border-white/10">
              <div className="text-white/45 text-sm">UID</div>
              <div className="mt-2 break-all text-sm font-mono">{user?.uid}</div>
            </div>
            <div className="rounded-3xl bg-slate-900/75 p-5 border border-white/10">
              <div className="text-white/45 text-sm">Credit</div>
              <div className="mt-2 text-3xl font-black">0.00 AED</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
