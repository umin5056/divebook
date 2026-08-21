export default function ProgressBar({ current, max, unit }) {
  const progressText = `${current}/${max}${unit}`;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
        <div
          className={`h-full rounded-full ${current === max ? "bg-[red]" : "bg-[#008080]"}`}
          style={{ width: `${(current / max) * 100}%` }}
        />
      </div>
      <span className="text-sm font-bold text-gray-500">{progressText}</span>
    </div>
  );
}
