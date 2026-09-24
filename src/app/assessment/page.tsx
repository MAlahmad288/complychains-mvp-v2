"use client";

import { useState, useMemo, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, ChevronRight, Paperclip, Upload, Eye } from "lucide-react";
import { Button } from "@/components/button";
import { Badge } from "@/components/badge";
import { ProgressRing } from "@/components/progress-ring";
import { EvidenceModal } from "@/components/evidence-modal";
import { Sidebar } from "@/components/sidebar";
import { frameworks, getFrameworkById } from "@/lib/frameworks";
import { getControlState, saveControlState } from "@/lib/storage";
import { Control, Domain, Subdomain, EvidenceState } from "@/types";

interface ControlWithMeta extends Control {
  domainName: string;
  subdomainName: string;
  domainIndex: number;
  subdomainIndex: number;
  frameworkId: string;
  frameworkName: string;
  status: { status: string; score: number; label: string; color: string };
}

export default function AssessmentPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500">Loading assessment...</div>}>
      <AssessmentContent />
    </Suspense>
  );
}

function AssessmentContent() {
  const searchParams = useSearchParams();
  const fwId = searchParams.get("fw") || "nca-ecc";
  const framework = getFrameworkById(fwId) || frameworks[0];

  const [activeDomain, setActiveDomain] = useState(0);
  const [activeSubdomain, setActiveSubdomain] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [activeControl, setActiveControl] = useState<ControlWithMeta | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [, forceUpdate] = useState(0);

  const getControlStatus = useCallback((controlId: string) => {
    const state = getControlState(controlId);
    if (!state) return { status: "not-started", score: 0, label: "Not Started", color: "slate" };
    if (state.aiResult?.status === "compliant") return { status: "compliant", score: state.aiResult.score, label: "Compliant", color: "green" };
    if (state.aiResult?.status === "partially-compliant") return { status: "partial", score: state.aiResult.score, label: "Partial", color: "amber" };
    if (state.aiResult?.status === "in-progress") return { status: "in-progress", score: state.aiResult.score, label: "In Progress", color: "blue" };
    return { status: "non-compliant", score: state.aiResult?.score || 0, label: "Non-Compliant", color: "red" };
  }, []);

  const filteredControls = useMemo(() => {
    const controls: ControlWithMeta[] = [];
    framework.domains.forEach((d, di) => {
      d.subdomains.forEach((sd, sdi) => {
        sd.controls.forEach((c) => {
          const status = getControlStatus(c.id);
          const matchesSearch = !searchQuery || c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.description.toLowerCase().includes(searchQuery.toLowerCase()) || c.id.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesFilter = filterStatus === "all" || status.status === filterStatus;
          if (matchesSearch && matchesFilter) {
            controls.push({ ...c, domainIndex: di, subdomainIndex: sdi, domainName: d.name, subdomainName: sd.name, frameworkId: framework.id, frameworkName: framework.name, status });
          }
        });
      });
    });
    return controls;
  }, [framework, searchQuery, filterStatus, getControlStatus]);

  const domainProgress = useMemo(() => {
    return framework.domains.map((d) => {
      const allControls = d.subdomains.flatMap((sd) => sd.controls);
      const evaluated = allControls.filter((c) => getControlState(c.id)?.aiResult).length;
      const score = evaluated > 0 ? Math.round(allControls.filter((c) => getControlState(c.id)?.aiResult).reduce((s, c) => s + (getControlState(c.id)?.aiResult?.score || 0), 0) / evaluated) : 0;
      return { ...d, total: allControls.length, evaluated, progress: allControls.length > 0 ? Math.round((evaluated / allControls.length) * 100) : 0, score };
    });
  }, [framework]);

  const openEvidenceModal = (control: Control, subdomain: Subdomain, domain: Domain) => {
    setActiveControl({ ...control, domainIndex: 0, subdomainIndex: 0, domainName: domain.name, subdomainName: subdomain.name, frameworkId: framework.id, frameworkName: framework.name, status: getControlStatus(control.id) });
    setShowModal(true);
  };

  const handleSave = (state: EvidenceState) => {
    saveControlState(state.controlId, state);
    forceUpdate((n) => n + 1);
    setShowModal(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role="enterprise" />
      <main className="flex-1 flex overflow-hidden">
        {/* Domain Sidebar */}
        <div className="w-72 bg-white border-r border-slate-200 overflow-y-auto scrollbar-thin shrink-0">
          <div className="p-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">{framework.name}</h2>
            <p className="text-xs text-slate-500">{framework.totalControls} controls • {framework.domains.length} domains</p>
          </div>
          <div className="p-3">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input type="text" placeholder="Search controls..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 mb-3">
              <option value="all">All Statuses</option>
              <option value="compliant">Compliant</option>
              <option value="partially-compliant">Partial</option>
              <option value="in-progress">In Progress</option>
              <option value="non-compliant">Non-Compliant</option>
              <option value="not-started">Not Started</option>
            </select>
          </div>

          {searchQuery ? (
            <div className="px-3 pb-4">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Search Results ({filteredControls.length})</div>
              {filteredControls.map((c) => (
                <button key={c.id} onClick={() => { setActiveDomain(c.domainIndex); setActiveSubdomain(c.subdomainIndex); setSearchQuery(""); }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 mb-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full bg-${c.status.color}-500`} />
                    <span className="text-xs font-mono text-slate-400">{c.id}</span>
                  </div>
                  <div className="text-sm text-slate-800 truncate ml-4">{c.title}</div>
                </button>
              ))}
            </div>
          ) : (
            framework.domains.map((domain, di) => (
              <div key={domain.id} className="mb-1">
                <button onClick={() => { setActiveDomain(di); setActiveSubdomain(0); }} className={`w-full px-4 py-3 flex items-center justify-between text-left transition-colors ${activeDomain === di ? "bg-sky-50 border-r-2 border-sky-600" : "hover:bg-slate-50"}`}>
                  <div>
                    <div className={`text-sm font-semibold ${activeDomain === di ? "text-sky-700" : "text-slate-700"}`}>{domain.number}. {domain.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{domainProgress[di].evaluated}/{domainProgress[di].total} evaluated • {domainProgress[di].score}% avg</div>
                  </div>
                  <ProgressRing progress={domainProgress[di].progress} size={40} stroke={4} />
                </button>
                {activeDomain === di && (
                  <div className="bg-slate-50 py-1">
                    {domain.subdomains.map((sd, sdi) => {
                      const sdControls = sd.controls;
                      const sdEvaluated = sdControls.filter((c) => getControlState(c.id)?.aiResult).length;
                      return (
                        <button key={sd.id} onClick={() => setActiveSubdomain(sdi)} className={`w-full px-6 py-2.5 text-left text-sm transition-colors flex items-center justify-between ${activeSubdomain === sdi ? "bg-white border-r-2 border-sky-400 text-sky-700 font-medium" : "text-slate-600 hover:bg-white"}`}>
                          <span className="truncate">{sd.id} {sd.name}</span>
                          <span className="text-xs text-slate-400 shrink-0 ml-2">{sdEvaluated}/{sdControls.length}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto bg-slate-50 p-8">
          {!searchQuery && (
            <>
              <div className="mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                  <span>{framework.name}</span><ChevronRight className="w-3.5 h-3.5" />
                  <span>{framework.domains[activeDomain].name}</span><ChevronRight className="w-3.5 h-3.5" />
                  <span className="text-slate-800 font-medium">{framework.domains[activeDomain].subdomains[activeSubdomain].name}</span>
                </div>
                <h1 className="text-2xl font-bold text-slate-900">{framework.domains[activeDomain].subdomains[activeSubdomain].id} {framework.domains[activeDomain].subdomains[activeSubdomain].name}</h1>
                <p className="text-slate-500 mt-1">{framework.domains[activeDomain].subdomains[activeSubdomain].controls.length} controls</p>
              </div>

              <div className="space-y-4">
                {framework.domains[activeDomain].subdomains[activeSubdomain].controls.map((control) => {
                  const status = getControlStatus(control.id);
                  const state = getControlState(control.id);
                  return (
                    <div key={control.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{control.id}</span>
                            <Badge color={status.color as any}>{status.label}</Badge>
                            {state?.aiResult && <span className="text-xs text-slate-500">AI Confidence: {state.aiResult.aiConfidence}%</span>}
                          </div>
                          <h3 className="text-base font-semibold text-slate-900 mb-1">{control.title}</h3>
                          <p className="text-sm text-slate-600 mb-3">{control.description}</p>

                          {state?.aiResult && (
                            <div className="bg-slate-50 rounded-lg p-3 mb-3">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-semibold text-slate-700">AI Analysis</span>
                                <span className="text-xs text-slate-400">{new Date(state.aiResult.analysisDate).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-3 mb-2">
                                <ProgressRing progress={state.aiResult.score} size={50} stroke={5} color={state.aiResult.score >= 80 ? "#10b981" : state.aiResult.score >= 60 ? "#f59e0b" : "#ef4444"} />
                                <div className="flex-1">
                                  <div className="text-xs text-slate-500 mb-1">Matched keywords:</div>
                                  <div className="flex flex-wrap gap-1">
                                    {state.aiResult.matchedKeywords.slice(0, 5).map((k, i) => (
                                      <span key={i} className="text-xs bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded">{k}</span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              {state.aiResult.gaps.length > 0 && (
                                <div className="mt-2">
                                  <div className="text-xs font-medium text-red-600 mb-1">Gaps identified:</div>
                                  <ul className="text-xs text-slate-600 space-y-0.5">{state.aiResult.gaps.map((g, i) => <li key={i}>• {g}</li>)}</ul>
                                </div>
                              )}
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Paperclip className="w-3 h-3" />
                            <span>Expected evidence: {control.evidenceType.join(", ")}</span>
                            <span className="text-slate-300">|</span>
                            <span>Weight: {control.weight}/5</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                          <Button size="sm" onClick={() => openEvidenceModal(control, framework.domains[activeDomain].subdomains[activeSubdomain], framework.domains[activeDomain])} icon={Upload}>
                            {state?.evidenceText ? "Update Evidence" : "Upload Evidence"}
                          </Button>
                          {state?.aiResult && (
                            <Button variant="secondary" size="sm" onClick={() => openEvidenceModal(control, framework.domains[activeDomain].subdomains[activeSubdomain], framework.domains[activeDomain])} icon={Eye}>View Details</Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>

      {showModal && activeControl && (
        <EvidenceModal
          control={activeControl}
          existingState={getControlState(activeControl.id)}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
