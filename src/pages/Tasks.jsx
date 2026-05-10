const taskCats = [
  ['Ads Income', '📺', 'Watch verified ads'],
  ['Survey Income', '📝', 'Complete surveys'],
  ['Game Install', '🎮', 'Install partner apps']
];

export default function Tasks() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24 md:pb-10 p-4">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-black">Tasks</h1>
        <p className="mt-2 text-white/60">Choose a earning category and start verified work.</p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {taskCats.map(([title, icon, desc]) => (
            <div key={title} className="rounded-[2rem] border border-white/10 bg-white/6 p-6">
              <div className="text-4xl">{icon}</div>
              <h2 className="mt-4 text-2xl font-bold">{title}</h2>
              <p className="mt-2 text-white/60">{desc}</p>
              <button className="mt-5 w-full rounded-2xl bg-white text-slate-950 py-3 font-bold">
                Open {title}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
