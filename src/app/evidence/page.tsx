"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
import { Badge } from "@/components/badge";
import { Sidebar } from "@/components/sidebar";
import { getAllAssessments } from "@/lib/storage";

export default function EvidenceVaultPage() {
  const [filter, setFilter] = useState("all");
  const assessments = getAllAssessments();
  const filtered = assessments.filter((a) => filter === "all" || a.aiResult?.status === filter);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role="enterprise" />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto fade-in">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Evidence Vault</h1>
              <p className="text-slate-500 mt-1">All submitted evidence and AI evaluations</p>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-3 py-2 text-sm border border-slate-200 rounded-lg">
                <option value="all">All Statuses</option>
                <option value="compliant">Compliant</option>
                <option value="partially-compliant">Partial</option>
                <option value="non-compliant">Non-Compliant</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium">
                <tr>
                  <th className="px-6 py-3">Control</th>
                  <th className="px-6 py-3">Framework</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Score</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">No evidence found.</td></tr>
                ) : (
                  filtered.map((a, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{a.controlTitle}</div>
                        <div className="text-xs text-slate-500">{a.controlId}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{a.frameworkName}</td>
                      <td className="px-6 py-4 text-slate-500">{new Date(a.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 font-semibold">{a.aiResult?.score}%</td>
                      <td className="px-6 py-4">
                        <Badge color={a.aiResult?.status === "compliant" ? "green" : a.aiResult?.status === "partially-compliant" ? "amber" : "red"}>{a.aiResult?.status}</Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
