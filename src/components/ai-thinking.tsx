"use client";

import { Sparkles } from "lucide-react";

interface AIThinkingProps {
  message?: string;
}

export function AIThinking({
  message = "AI is analyzing your evidence...",
}: AIThinkingProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full bg-sky-100 animate-ping opacity-75" />
        <div className="relative w-16 h-16 rounded-full bg-sky-600 flex items-center justify-center">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
      </div>
      <p className="text-sm text-slate-600 font-medium animate-pulse">{message}</p>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-sky-400 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
