"use client";

import { useRouter } from "next/navigation";
import {
  Building2,
  ShieldCheck,
  Server,
  Sparkles,
  CheckCircle,
  Check,
  ArrowRight,
  Landmark,
  FileText,
  Shield,
  Brain,
} from "lucide-react";
import { storage } from "@/lib/storage";
import { UserRole } from "@/types";

const roles = [
  {
    id: "enterprise" as UserRole,
    title: "Enterprise (B2B)",
    subtitle: "Compliance & audit across multiple frameworks",
    icon: Building2,
    features: [
      "Multi-framework selection",
      "Unified control mapping",
      "Cross-framework priority scoring",
      "Evidence vault & AI mapping",
    ],
    color: "sky",
  },
  {
    id: "regulator" as UserRole,
    title: "Regulator (B2G)",
    subtitle: "Oversee service providers' compliance",
    icon: ShieldCheck,
    features: [
      "Aggregated compliance dashboards",
      "Review submitted evidence",
      "Track provider scores",
      "Regulatory oversight",
    ],
    color: "emerald",
  },
  {
    id: "service-provider" as UserRole,
    title: "Service Provider (B2G)",
    subtitle: "Comply with regulator framework",
    icon: Server,
    features: [
      "Single framework focus",
      "Streamlined evidence upload",
      "Direct regulator reporting",
      "Compliance attestation",
    ],
    color: "amber",
  },
];

const stats = [
  { value: "6", label: "Regulators", icon: Landmark },
  { value: "6", label: "Frameworks", icon: FileText },
  { value: "289", label: "Controls", icon: Shield },
  { value: "AI", label: "Evidence Evaluation", icon: Brain },
];

export default function LandingPage() {
  const router = useRouter();

  const handleSelectRole = (role: UserRole) => {
    storage.set("cc_role", role);
    if (role === "regulator") router.push("/regulator");
    else if (role === "service-provider") router.push("/service-provider");
    else router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EAE9E6] border border-slate-200 text-slate-900 text-sm font-medium">
            <Sparkles className="w-4 h-4 text-sky-300" />
            <span className="text-sm font-medium text-sky-500">
              Saudi Arabia's first AI-powered SaaS platform automating end-to-end compliance & audits journey.
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
            Automate your compliance and
            <br />
            <span className="text-sky-400">audit journey</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-4">
            Across Saudi regulatory frameworks — NCA ECC, SAMA CSF, PDPL, ISO
            27001, STC Security Pass, and Aramco SACS-210
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-slate-500 mt-8">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> 6 Frameworks
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> 289 Controls
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> AI Evidence Evaluation
            </span>
          </div>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <button
                key={role.id}
                onClick={() => handleSelectRole(role.id)}
                className="group relative bg-white backdrop-blur-sm border border-slate-200 rounded-2xl p-8 text-left hover:bg-slate-50/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-${role.color}-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
                >
                  <Icon className={`w-7 h-7 text-${role.color}-400`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{role.title}</h3>
                <p className="text-slate-500 text-sm mb-5">{role.subtitle}</p>
                <ul className="space-y-2.5">
                  {role.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex items-center gap-2 text-sm font-medium text-sky-300 group-hover:text-sky-200">
                  Get Started <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="bg-white backdrop-blur-sm rounded-xl p-6 border border-slate-200"
              >
                <Icon className="w-6 h-6 text-sky-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
