'use client'

import React from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

export type StatusType = "taken" | "skipped" | "pending" | "active" | "archived";

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  className,
}) => {
  const { t } = useLanguage();

  const statusConfig: Record<StatusType, { bg: string; text: string; defaultLabel: string }> = {
    taken: {
      bg: "bg-emerald-50 border-emerald-200",
      text: "text-[#16A34A]",
      defaultLabel: `${t.common.taken} (Taken)`,
    },
    skipped: {
      bg: "bg-rose-50 border-rose-200",
      text: "text-[#DC2626]",
      defaultLabel: `${t.common.skipped} (Skipped)`,
    },
    pending: {
      bg: "bg-amber-50 border-amber-200",
      text: "text-[#F97316]",
      defaultLabel: `${t.common.pending} (Pending)`,
    },
    active: {
      bg: "bg-blue-50 border-blue-200",
      text: "text-[#2563EB]",
      defaultLabel: `${t.common.active} (Active)`,
    },
    archived: {
      bg: "bg-slate-50 border-slate-200",
      text: "text-[#64748B]",
      defaultLabel: `${t.common.archived} (Archived)`,
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
        config.bg,
        config.text,
        className
      )}
    >
      {label || config.defaultLabel}
    </span>
  );
};
