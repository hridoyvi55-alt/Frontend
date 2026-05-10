const rows = [
  ['#1', 'Alex', '1200 AED'],
  ['#2', 'Mila', '980 AED'],
  ['#3', 'Noah', '760 AED']
];

export default function Leaderboard() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24 md:pb-10 p-4">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-black">Leaderboard</h1>
        <p className="mt-2 text-white/60">Top earners by total income.</p>

        <div className="mt-6 overflow-hidden rounded-[2rem] border border-white/10 bg-white/6">
          {rows.map(([rank, name, amount], i) => (
            <div key={rank} className={`flex items-center justify-between px-5 py-4 ${i !== rows.length - 1 ? 'border-b border-white/10' : ''}`}>
              <div className="flex items-center gap-4">
                <div className="h-11 w-11 rounded-2xl bg-white/10 grid place-items-center font-bold">{rank}</div>
                <div>
                  <div className="font-bold">{name}</div>
                  <div className="text-white/45 text-sm">Verified user</div>
                </div>
              </div>
              <div className="font-black">{amount}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
