"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
  FolderOpen,
  FileBarChart,
  GitCompare,
  Building2,
  Eye,
  BarChart3,
  Upload,
  FileCheck,
  LogOut,
  Shield,
} from "lucide-react";
import { Badge } from "./badge";
import { UserRole } from "@/types";
import { storage } from "@/lib/storage";

interface SidebarProps {
  role: UserRole;
}

const menuItems: Record<UserRole, { id: string; label: string; icon: React.ElementType; href: string }[]> = {
  enterprise: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { id: "frameworks", label: "Frameworks", icon: BookOpen, href: "/frameworks" },
    { id: "assessment", label: "Assessment", icon: ClipboardCheck, href: "/assessment" },
    { id: "evidence", label: "Evidence Vault", icon: FolderOpen, href: "/evidence" },
    { id: "reports", label: "Reports", icon: FileBarChart, href: "/reports" },
    { id: "mapping", label: "Control Mapping", icon: GitCompare, href: "/mapping" },
  ],
  regulator: [
    { id: "regulator", label: "Overview", icon: LayoutDashboard, href: "/regulator" },
    { id: "entities", label: "Regulated Entities", icon: Building2, href: "/regulator" },
    { id: "reviews", label: "Evidence Reviews", icon: Eye, href: "/evidence" },
    { id: "analytics", label: "Sector Analytics", icon: BarChart3, href: "/reports" },
  ],
  "service-provider": [
    { id: "service-provider", label: "Dashboard", icon: LayoutDashboard, href: "/service-provider" },
    { id: "frameworks", label: "My Framework", icon: BookOpen, href: "/frameworks" },
    { id: "assessment", label: "Assessment", icon: ClipboardCheck, href: "/assessment" },
    { id: "evidence", label: "Evidence Upload", icon: Upload, href: "/evidence" },
    { id: "reports", label: "Compliance Report", icon: FileCheck, href: "/reports" },
  ],
};

const roleLabels: Record<UserRole, string> = {
  enterprise: "Enterprise",
  regulator: "Regulator",
  "service-provider": "Service Provider",
};

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    storage.remove("cc_role");
    router.push("/");
    router.refresh();
  };

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen sticky top-0 shrink-0">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-lg bg-sky-600 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold">ComplyChains</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Badge color="blue" className="!text-xs">{roleLabels[role]}</Badge>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems[role].map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <button
              key={item.id}
              onClick={() => router.push(item.href)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-sky-600 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Icon className="w-[18px] h-[18px] shrink-0" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <LogOut className="w-[18px] h-[18px]" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
