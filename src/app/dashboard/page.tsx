"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Activity, CheckCircle, AlertCircle, XCircle, ClipboardCheck, FileBarChart, Inbox } from "lucide-react";
import { Button } from "@/components/button";
import { Badge } from "@/components/badge";
import { ProgressRing } from "@/components/progress-ring";
import { ScoreBar } from "@/components/score-bar";
import { Sidebar } from "@/components/sidebar";
import { frameworks } from "@/lib/frameworks";
import { getAllAssessments } from "@/lib/storage";

export default function DashboardPage() {
  const router = useRouter();
  const assessments = getAllAssessments();

  const stats = useMemo(() => {
    const totalControls = 289;
    const evaluated = assessments.filter((a) => a.aiResult).length;
    const compliant = assessments.filter((a) => a.aiResult?.status === "compliant").length;
    const partial = assessments.filter((a) => a.aiResult?.status === "partially-compliant").length;
    const avgScore = evaluated > 0 ? Math.round(assessments.filter((a) => a.aiResult).reduce((s, a) => s + a.aiResult!.score, 0) / evaluated) : 0;
    return { totalControls, evaluated, compliant, partial, avgScore, gap: totalControls - evaluated };
  }, [assessments]);

  const frameworkScores = useMemo(() => {
    const fwMap: Record<string, { total: number; count: number; name: string }> = {};
    assessments.filter((a) => a.aiResult).forEach((a) => {
      if (!fwMap[a.frameworkId]) fwMap[a.frameworkId] = { total: 0, count: 0, name: a.frameworkName };
      fwMap[a.frameworkId].total += a.aiResult!.score;
      fwMap[a.frameworkId].count += 1;
    });
    return Object.entries(fwMap).map(([id, d]) => ({ id, name: d.name, score: Math.round(d.total / d.count) }));
  }, [assessments]);

  const recentActivity = [...assessments].reverse().slice(0, 5);
  const ringColor = stats.avgScore >= 80 ? "#10b981" : stats.avgScore >= 60 ? "#f59e0b" : "#ef4444";

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role="enterprise" />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto fade-in">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Enterprise Compliance Dashboard</h1>
            <p className="text-slate-500 mt-1">Unified view across all frameworks and controls</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { label: "Overall Compliance", value: `${stats.avgScore}%`, sub: `${stats.evaluated} of ${stats.totalControls} controls evaluated`, icon: Activity, color: "sky" },
              { label: "Compliant Controls", value: stats.compliant, sub: `${Math.round((stats.compliant / Math.max(stats.evaluated, 1)) * 100)}% pass rate`, icon: CheckCircle, color: "emerald" },
              { label: "Partially Compliant", value: stats.partial, sub: "Needs attention", icon: AlertCircle, color: "amber" },
              { label: "Controls with Gaps", value: stats.gap, sub: "Awaiting evidence", icon: XCircle, color: "red" },
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-lg bg-${card.color}-50 flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 text-${card.color}-600`} />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-1">{card.value}</div>
                  <div className="text-sm text-slate-500">{card.label}</div>
                  <div className="text-xs text-slate-400 mt-1">{card.sub}</div>
                </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Framework Compliance Scores</h3>
              <div className="space-y-5">
                {frameworks.map((fw) => {
                  const score = frameworkScores.find((s) => s.id === fw.id)?.score || 0;
                  return <ScoreBar key={fw.id} score={score} label={`${fw.name} — ${fw.regulator}`} />;
                })}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Overall Score</h3>
              <div className="flex justify-center mb-4">
                <ProgressRing progress={stats.avgScore} size={140} stroke={10} color={ringColor} />
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-slate-700 mb-1">
                  {stats.avgScore >= 80 ? "Strong Compliance Posture" : stats.avgScore >= 60 ? "Moderate Risk — Action Needed" : "High Risk — Immediate Attention"}
                </div>
                <div className="text-xs text-slate-500">Based on {stats.evaluated} evaluated controls</div>
              </div>
              <div className="mt-6 space-y-2">
                <Button size="sm" className="w-full" onClick={() => router.push("/assessment")} icon={ClipboardCheck}>Continue Assessment</Button>
                <Button variant="secondary" size="sm" className="w-full" onClick={() => router.push("/reports")} icon={FileBarChart}>Generate Report</Button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
              <Button variant="ghost" size="sm" onClick={() => router.push("/evidence")}>View All</Button>
            </div>
            <div className="divide-y divide-slate-100">
              {recentActivity.length === 0 ? (
                <div className="px-6 py-12 text-center text-slate-400">
                  <Inbox className="w-8 h-8 mx-auto mb-3 opacity-50" />
                  <p>No evidence submitted yet. Start your assessment to see activity here.</p>
                  <Button className="mt-4" size="sm" onClick={() => router.push("/frameworks")}>Start Assessment</Button>
                </div>
              ) : (
                recentActivity.map((item, i) => (
                  <div key={i} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item.aiResult?.status === "compliant" ? "bg-emerald-100" : item.aiResult?.status === "partially-compliant" ? "bg-amber-100" : "bg-red-100"}`}>
                      {item.aiResult?.status === "compliant" ? <CheckCircle className="w-[18px] h-[18px] text-emerald-600" /> : item.aiResult?.status === "partially-compliant" ? <AlertCircle className="w-[18px] h-[18px] text-amber-600" /> : <XCircle className="w-[18px] h-[18px] text-red-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-900 truncate">{item.controlTitle}</div>
                      <div className="text-xs text-slate-500">{item.frameworkName} • {new Date(item.date).toLocaleDateString()}</div>
                    </div>
                    <Badge color={item.aiResult?.status === "compliant" ? "green" : item.aiResult?.status === "partially-compliant" ? "amber" : "red"}>{item.aiResult?.score}%</Badge>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
