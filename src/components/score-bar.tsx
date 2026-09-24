"use client";

interface ScoreBarProps {
  score: number;
  label: string;
  className?: string;
}

export function ScoreBar({ score, label, className = "" }: ScoreBarProps) {
  let color = "bg-red-500";
  if (score >= 80) color = "bg-emerald-500";
  else if (score >= 60) color = "bg-amber-500";
  else if (score >= 40) color = "bg-orange-500";

  return (
    <div className={className}>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="text-sm font-semibold text-slate-900">{score}%</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2.5">
        <div
          className={`${color} h-2.5 rounded-full transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
