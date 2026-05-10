const methods = ['bKash', 'Nagad', 'PayPal', 'Binance'];

export default function Withdrawal() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24 md:pb-10 p-4">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-black">Withdrawal</h1>
        <p className="mt-2 text-white/60">Request payout through your preferred method.</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {methods.map((m) => (
            <div key={m} className="rounded-[2rem] border border-white/10 bg-white/6 p-6">
              <div className="text-2xl font-black">{m}</div>
              <button className="mt-5 w-full rounded-2xl bg-white text-slate-950 py-3 font-bold">
                Request
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-[2rem] border border-white/10 bg-white/6 p-6">
          <h2 className="text-2xl font-bold">Withdrawal Leaderboard</h2>
          <p className="mt-2 text-white/60">Approved withdrawal users will appear here.</p>
        </div>
      </div>
    </div>
  );
}
