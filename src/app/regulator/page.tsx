"use client";

import { LayoutDashboard, Building2, Eye, BarChart3 } from "lucide-react";
import { Badge } from "@/components/badge";
import { Sidebar } from "@/components/sidebar";

const entities = [
  { name: "Saudi National Bank", sector: "Banking", score: 87, status: "compliant", frameworks: ["SAMA CSF", "NCA ECC"] },
  { name: "STC Solutions", sector: "Telecom", score: 72, status: "partial", frameworks: ["STC Security Pass", "NCA ECC"] },
  { name: "Aramco Drilling", sector: "Energy", score: 91, status: "compliant", frameworks: ["Aramco SACS-210", "NCA ECC"] },
  { name: "Riyad Bank", sector: "Banking", score: 45, status: "at-risk", frameworks: ["SAMA CSF"] },
];

const stats = [
  { label: "Regulated Entities", value: "24" },
  { label: "Avg Compliance", value: "74%" },
  { label: "At Risk", value: "3" },
  { label: "Pending Reviews", value: "12" },
];

export default function RegulatorPage() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role="regulator" />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto fade-in">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Regulator Oversight Dashboard</h1>
            <p className="text-slate-500 mt-1">Monitor compliance across regulated entities</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {stats.map((s, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="text-3xl font-bold text-slate-900 mb-1">{s.value}</div>
                <div className="text-sm text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900">Regulated Entities</h3>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-3 text-left">Entity</th>
                  <th className="px-6 py-3">Sector</th>
                  <th className="px-6 py-3">Frameworks</th>
                  <th className="px-6 py-3">Score</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {entities.map((e, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{e.name}</td>
                    <td className="px-6 py-4 text-slate-600">{e.sector}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {e.frameworks.map((f) => (
                          <Badge key={f} color="blue" className="!text-xs">{f}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold">{e.score}%</td>
                    <td className="px-6 py-4">
                      <Badge color={e.status === "compliant" ? "green" : e.status === "partial" ? "amber" : "red"}>{e.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
