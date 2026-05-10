export default function Invite() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24 md:pb-10 p-4">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-black">Invite Friends</h1>
        <p className="mt-2 text-white/60">Share your link and earn 2 AED per verified invite.</p>

        <div className="mt-6 rounded-[2rem] border border-white/10 bg-white/6 p-6">
          <div className="text-white/50 text-sm">Your referral link</div>
          <div className="mt-3 rounded-2xl bg-slate-900/80 border border-white/10 p-4 break-all">
            https://yourdomain.com/?ref=UID
          </div>
          <button className="mt-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3 font-bold">
            Copy Link
          </button>
        </div>
      </div>
    </div>
  );
}
