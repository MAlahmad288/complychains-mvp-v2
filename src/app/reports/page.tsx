"use client";

import { Printer, Download } from "lucide-react";
import { Button } from "@/components/button";
import { ScoreBar } from "@/components/score-bar";
import { Sidebar } from "@/components/sidebar";
import { frameworks } from "@/lib/frameworks";
import { getAllAssessments } from "@/lib/storage";

export default function ReportsPage() {
  const assessments = getAllAssessments();
  const overallScore = assessments.length > 0 ? Math.round(assessments.reduce((s, a) => s + (a.aiResult?.score || 0), 0) / assessments.length) : 0;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role="enterprise" />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-5xl mx-auto fade-in">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Compliance Reports</h1>
            <p className="text-slate-500 mt-1">Generate and export audit-ready reports</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Executive Summary</h2>
                <p className="text-sm text-slate-500">Generated on {new Date().toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" icon={Printer}>Print</Button>
                <Button variant="secondary" size="sm" icon={Download}>Export PDF</Button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-4 bg-slate-50 rounded-xl">
                <div className="text-3xl font-bold text-slate-900">{overallScore}%</div>
                <div className="text-sm text-slate-500">Overall Compliance</div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-xl">
                <div className="text-3xl font-bold text-slate-900">{assessments.filter((a) => a.aiResult?.status === "compliant").length}</div>
                <div className="text-sm text-slate-500">Compliant Controls</div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-xl">
                <div className="text-3xl font-bold text-slate-900">{assessments.filter((a) => a.aiResult?.status === "partially-compliant").length}</div>
                <div className="text-sm text-slate-500">Partially Compliant</div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Framework Breakdown</h3>
              {frameworks.map((fw) => {
                const fwAssessments = assessments.filter((a) => a.frameworkId === fw.id && a.aiResult);
                const score = fwAssessments.length > 0 ? Math.round(fwAssessments.reduce((s, a) => s + a.aiResult!.score, 0) / fwAssessments.length) : 0;
                return <ScoreBar key={fw.id} score={score} label={fw.name} className="mb-3" />;
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
