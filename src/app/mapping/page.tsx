"use client";

import { Badge } from "@/components/badge";
import { Sidebar } from "@/components/sidebar";
import { frameworks } from "@/lib/frameworks";

export default function MappingPage() {
  const ncaEcc = frameworks.find((f) => f.id === "nca-ecc")!;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role="enterprise" />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto fade-in">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Cross-Framework Control Mapping</h1>
            <p className="text-slate-500 mt-1">See how controls map across frameworks</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-semibold text-slate-700">NCA ECC Mappings</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {ncaEcc.domains.map((d) =>
                d.subdomains.map((sd) => (
                  <div key={sd.id} className="px-6 py-4 flex items-start gap-4 hover:bg-slate-50">
                    <div className="w-24 shrink-0">
                      <span className="text-xs font-mono text-slate-500">{sd.id}</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-900">{sd.name}</div>
                      <div className="text-xs text-slate-500">{sd.controls.length} controls</div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {frameworks
                        .filter((f) => f.id !== "nca-ecc")
                        .map((fw) => {
                          const mapped = fw.mappings?.["nca-ecc"]?.includes(sd.id);
                          return mapped ? <Badge key={fw.id} color="purple" className="!text-xs">{fw.name}</Badge> : null;
                        })}
                    </div>
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
