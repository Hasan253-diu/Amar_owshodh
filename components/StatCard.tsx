import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "primary" | "accent" | "warning" | "success" | "destructive" | "default";
}

const colorMap = {
  primary: "text-[#2563EB] bg-blue-50 border-blue-100",
  accent: "text-[#0D9488] bg-teal-50 border-teal-100",
  warning: "text-[#F97316] bg-amber-50 border-amber-100",
  success: "text-[#16A34A] bg-emerald-50 border-emerald-100",
  destructive: "text-[#DC2626] bg-rose-50 border-rose-100",
  default: "text-[#64748B] bg-slate-50 border-slate-100",
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "default",
}) => {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-[#64748B] mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-[#1E293B]">{value}</h3>
        {subtitle && <p className="text-xs text-[#64748B] mt-1">{subtitle}</p>}
      </div>
      <div className={cn("p-3 rounded-lg border flex items-center justify-center", colorMap[variant])}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};
