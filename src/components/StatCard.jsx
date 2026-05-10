export default function StatCard({ label, value, icon }) {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/6 p-5 backdrop-blur-2xl shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-white/45 text-sm">{label}</div>
          <div className="mt-2 text-2xl font-black">{value}</div>
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-2xl">
          {icon}
        </div>
      </div>
    </div>
  );
}
