export default function Settings() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24 md:pb-10 p-4">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-black">Settings</h1>
        <p className="mt-2 text-white/60">Theme and language preferences.</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-[2rem] border border-white/10 bg-white/6 p-6">
            <div className="font-bold">Theme</div>
            <div className="mt-4 flex gap-3">
              <button className="rounded-2xl bg-white text-slate-950 px-4 py-2 font-semibold">Dark</button>
              <button className="rounded-2xl bg-white/10 px-4 py-2 font-semibold">Light</button>
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/6 p-6">
            <div className="font-bold">Language</div>
            <select className="mt-4 w-full rounded-2xl bg-slate-900 border border-white/10 px-4 py-3">
              <option>English</option>
              <option>বাংলা</option>
              <option>Arabic</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
