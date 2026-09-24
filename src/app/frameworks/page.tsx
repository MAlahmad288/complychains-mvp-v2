"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Layers, ShieldCheck } from "lucide-react";
import { Button } from "@/components/button";
import { Badge } from "@/components/badge";
import { Sidebar } from "@/components/sidebar";
import { frameworks } from "@/lib/frameworks";

export default function FrameworksPage() {
  const router = useRouter();
  const [expandedFw, setExpandedFw] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role="enterprise" />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto fade-in">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Compliance Frameworks</h1>
            <p className="text-slate-500 mt-1">Select a framework to begin assessment</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {frameworks.map((fw) => (
              <div key={fw.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-sky-600" />
                  </div>
                  <Badge color="blue">{fw.version}</Badge>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{fw.name}</h3>
                <p className="text-sm text-slate-500 mb-1">{fw.fullName}</p>
                <p className="text-xs text-slate-400 mb-4">{fw.regulator}</p>

                <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                  <span className="flex items-center gap-1"><Layers className="w-3.5 h-3.5" /> {fw.domains.length} Domains</span>
                  <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> {fw.totalControls} Controls</span>
                </div>

                <p className="text-sm text-slate-500 mb-4 line-clamp-2">{fw.description}</p>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1" onClick={() => router.push(`/assessment?fw=${fw.id}`)}>Start Assessment</Button>
                  <Button variant="secondary" size="sm" onClick={() => setExpandedFw(expandedFw === fw.id ? null : fw.id)}>Details</Button>
                </div>

                {expandedFw === fw.id && (
                  <div className="mt-4 pt-4 border-t border-slate-100 slide-in">
                    <h4 className="text-sm font-semibold text-slate-700 mb-2">Domains & Subdomains</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
                      {fw.domains.map((d) => (
                        <div key={d.id} className="text-sm">
                          <div className="font-medium text-slate-800">{d.number}. {d.name}</div>
                          <div className="text-xs text-slate-500 ml-3">{d.subdomains.length} subdomains • {d.subdomains.reduce((s, sd) => s + sd.controls.length, 0)} controls</div>
                        </div>
                      ))}
                    </div>
                    {fw.mappings && (
                      <div className="mt-3">
                        <h4 className="text-sm font-semibold text-slate-700 mb-1">Cross-Framework Mappings</h4>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(fw.mappings).map(([target, controls]) => (
                            <Badge key={target} color="purple" className="!text-xs">{target}: {controls.length} controls</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
