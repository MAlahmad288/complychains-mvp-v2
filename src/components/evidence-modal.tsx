"use client";

import { useState, useRef, useCallback } from "react";
import {
  X,
  UploadCloud,
  FileText,
  Trash2,
  Lightbulb,
  Sparkles,
  AlertTriangle,
  Check,
  Eye,
} from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";
import { ProgressRing } from "./progress-ring";
import { AIThinking } from "./ai-thinking";
import { Control, EvidenceState, AIResult } from "@/types";
import { evaluateEvidence } from "@/lib/ai-service";
import { generateId } from "@/lib/utils";
import { saveControlState } from "@/lib/storage";

interface EvidenceModalProps {
  control: Control & {
    subdomainName: string;
    domainName: string;
    frameworkId: string;
    frameworkName: string;
  };
  existingState?: EvidenceState;
  onClose: () => void;
  onSave: (state: EvidenceState) => void;
}

export function EvidenceModal({ control, existingState, onClose }: EvidenceModalProps) {
  const [evidenceText, setEvidenceText] = useState(existingState?.evidenceText || "");
  const [files, setFiles] = useState<{ id: string; name: string; size: number; type: string }[]>(
    existingState?.files || []
  );
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [aiResult, setAiResult] = useState<AIResult | undefined>(existingState?.aiResult);
  const [activeTab, setActiveTab] = useState<"upload" | "results">("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newFiles = Array.from(e.target.files || []).map((f) => ({
        name: f.name,
        size: f.size,
        type: f.type,
        id: generateId(),
      }));
      setFiles((prev) => [...prev, ...newFiles]);
    },
    []
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const runAIEvaluation = async () => {
    if (!evidenceText.trim() && files.length === 0) return;
    setIsEvaluating(true);
    const result = await evaluateEvidence(control, evidenceText, files);
    setAiResult(result);
    setIsEvaluating(false);
    setActiveTab("results");
  };

  const handleSave = () => {
    if (!aiResult) return;
    const state: EvidenceState = {
      controlId: control.id,
      evidenceText,
      files,
      aiResult,
      date: new Date().toISOString(),
      frameworkId: control.frameworkId,
      frameworkName: control.frameworkName,
      controlTitle: control.title,
    };
    saveControlState(control.id, state);
    onClose();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const ringColor =
    (aiResult?.score || 0) >= 80
      ? "#10b981"
      : (aiResult?.score || 0) >= 60
      ? "#f59e0b"
      : "#ef4444";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Evidence Upload & AI Evaluation</h2>
            <p className="text-sm text-slate-500">
              {control.id} — {control.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center"
          >
            <X className="w-[18px] h-[18px] text-slate-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 shrink-0">
          {(["upload", "results"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "text-sky-600 border-b-2 border-sky-600 bg-sky-50/50"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab === "upload" ? "Upload Evidence" : "AI Results"}
              {tab === "results" && aiResult && (
                <span className="ml-2">({aiResult.score}%)</span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "upload" ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Evidence Description
                </label>
                <textarea
                  value={evidenceText}
                  onChange={(e) => setEvidenceText(e.target.value)}
                  placeholder="Describe how this control is implemented. Be specific about technologies, policies, and procedures..."
                  className="w-full h-40 px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-slate-400">
                    Be specific — AI analyzes keywords, coverage, and depth
                  </span>
                  <span className="text-xs text-slate-400">{evidenceText.length} chars</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Supporting Files
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-sky-400 hover:bg-sky-50/30 transition-colors cursor-pointer"
                >
                  <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-700">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    PDF, DOCX, XLSX, PNG, JPG up to 50MB
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
                {files.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center gap-3 bg-slate-50 rounded-lg px-3 py-2"
                      >
                        <FileText className="w-4 h-4 text-sky-500 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-slate-700 truncate">
                            {file.name}
                          </div>
                          <div className="text-xs text-slate-400">
                            {formatFileSize(file.size)}
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(file.id)}
                          className="w-6 h-6 rounded hover:bg-red-50 flex items-center justify-center"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-[18px] h-[18px] text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-amber-800">AI Evaluation Tips</div>
                    <ul className="text-xs text-amber-700 mt-1 space-y-0.5">
                      <li>• Include specific technology names, policy references, and dates</li>
                      <li>• Mention roles, responsibilities, and approval authorities</li>
                      <li>• Reference audit dates, test results, and metrics where possible</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {isEvaluating ? (
                <AIThinking message="AI is analyzing your evidence against control requirements..." />
              ) : aiResult ? (
                <div className="space-y-6 fade-in">
                  <div className="flex items-center gap-6">
                    <ProgressRing
                      progress={aiResult.score}
                      size={100}
                      stroke={8}
                      color={ringColor}
                    />
                    <div>
                      <div className="text-2xl font-bold text-slate-900">{aiResult.score}%</div>
                      <div
                        className={`text-sm font-medium ${
                          aiResult.score >= 80
                            ? "text-emerald-600"
                            : aiResult.score >= 60
                            ? "text-amber-600"
                            : "text-red-600"
                        }`}
                      >
                        {aiResult.status === "compliant"
                          ? "Compliant"
                          : aiResult.status === "partially-compliant"
                          ? "Partially Compliant"
                          : aiResult.status === "in-progress"
                          ? "In Progress"
                          : "Non-Compliant"}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        AI Confidence: {aiResult.aiConfidence}%
                      </div>
                    </div>
                  </div>

                  {aiResult.gaps.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-red-800 mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" /> Gaps Identified
                      </h4>
                      <ul className="space-y-1.5">
                        {aiResult.gaps.map((gap, i) => (
                          <li key={i} className="text-sm text-red-700 flex items-start gap-2">
                            <span className="text-red-400 mt-1">•</span>
                            {gap}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-sky-800 mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" /> AI Recommendations
                    </h4>
                    <ul className="space-y-1.5">
                      {aiResult.recommendations.map((rec, i) => (
                        <li key={i} className="text-sm text-sky-700 flex items-start gap-2">
                          <span className="text-sky-400 mt-1">→</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-slate-700 mb-2">Evidence Summary</h4>
                    <p className="text-sm text-slate-600">{aiResult.evidenceSummary}</p>
                    <div className="mt-3">
                      <div className="text-xs text-slate-500 mb-1">Matched keywords:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {aiResult.matchedKeywords.map((k, i) => (
                          <span
                            key={i}
                            className="text-xs bg-white text-sky-700 px-2 py-1 rounded-md border border-sky-200"
                          >
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400">
                  <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p>No AI evaluation yet. Upload evidence and run analysis.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between shrink-0">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <div className="flex gap-2">
            {activeTab === "upload" && (
              <Button
                onClick={runAIEvaluation}
                disabled={isEvaluating || (!evidenceText.trim() && files.length === 0)}
                icon={Sparkles}
              >
                {isEvaluating ? "Analyzing..." : "Run AI Evaluation"}
              </Button>
            )}
            {aiResult && (
              <Button variant="success" onClick={handleSave} icon={Check}>
                Save Results
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
