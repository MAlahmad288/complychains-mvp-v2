"use client";

import { useRouter } from "next/navigation";
import { ClipboardCheck, Upload } from "lucide-react";
import { Button } from "@/components/button";
import { Sidebar } from "@/components/sidebar";

export default function ServiceProviderPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role="service-provider" />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-5xl mx-auto fade-in">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Service Provider Portal</h1>
            <p className="text-slate-500 mt-1">Manage your regulator compliance submission</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="text-sm text-slate-500 mb-1">Assigned Framework</div>
              <div className="text-lg font-bold text-slate-900">NCA ECC</div>
              <div className="text-xs text-slate-400 mt-1">Essential Cybersecurity Controls</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="text-sm text-slate-500 mb-1">Submission Deadline</div>
              <div className="text-lg font-bold text-slate-900">March 31, 2025</div>
              <div className="text-xs text-slate-400 mt-1">45 days remaining</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="text-sm text-slate-500 mb-1">Completion</div>
              <div className="text-lg font-bold text-slate-900">34%</div>
              <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                <div className="bg-sky-500 h-2 rounded-full" style={{ width: "34%" }} />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={() => router.push("/assessment")} icon={ClipboardCheck}>Continue Assessment</Button>
            <Button variant="secondary" onClick={() => router.push("/evidence")} icon={Upload}>Upload Evidence</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
