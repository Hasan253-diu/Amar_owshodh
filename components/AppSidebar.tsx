"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Pill,
  CalendarDays,
  Clock,
  History,
  BarChart3,
  Settings,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export const AppSidebar: React.FC = () => {
  const pathname = usePathname();
  const { profile, signOut, isGuest, exitGuestMode } = useAuth();
  const { t, language } = useLanguage();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const isAdmin = profile?.role === "admin";

  const navigation = [
    { name: t.navigation.dashboard, href: "/dashboard", icon: LayoutDashboard },
    { name: t.navigation.medicines, href: "/medicines", icon: Pill },
    { name: t.navigation.schedule, href: "/schedule", icon: Clock },
    { name: t.navigation.calendar, href: "/calendar", icon: CalendarDays },
    { name: t.navigation.history, href: "/history", icon: History },
    { name: t.navigation.reports, href: "/reports", icon: BarChart3 },
    { name: t.navigation.profile, href: "/profile", icon: User },
    { name: t.navigation.settings, href: "/settings", icon: Settings },
  ];

  if (isAdmin) {
    navigation.push({ name: t.navigation.adminPanel, href: "/admin", icon: ShieldAlert });
  }

  const NavContent = () => (
    <div className="flex flex-col h-full justify-between">
      <div>
        <div className="min-h-[74px] sm:min-h-[82px] flex items-center justify-between px-4 border-b border-[#E2E8F0]">
          <Link href="/dashboard" className="flex items-center justify-center py-1">
            <img
              src="/logo.png"
              alt="আমার ঔষধ (Amar Owshodh)"
              className="w-[155px] h-[55px] sm:w-[210px] sm:h-[70px] max-w-full object-contain"
            />
          </Link>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-1.5 text-[#64748B] hover:text-[#1E293B] rounded-lg shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-[#2563EB]"
                    : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1E293B]"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-[#2563EB]" : "text-[#64748B]")} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-[#E2E8F0]">
        {isGuest ? (
          <button
            onClick={() => exitGuestMode()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors cursor-pointer shadow-2xs"
          >
            <LogOut className="w-5 h-5 text-amber-700" />
            <span>{t.common.exitGuestMode}</span>
          </button>
        ) : (
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#DC2626] transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span>{t.common.logout}</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E2E8F0] min-h-screen hidden md:block shrink-0">
        <NavContent />
      </aside>

      {/* Mobile Trigger Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed bottom-4 right-4 z-40 bg-[#2563EB] text-white p-3.5 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
        title="Menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[80%] bg-white h-full shadow-xl flex flex-col z-10">
            <NavContent />
          </div>
        </div>
      )}
    </>
  );
};
