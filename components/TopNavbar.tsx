"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { User, BellRing } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { NotificationDropdown } from "@/components/NotificationDropdown";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import {
  getNotificationPermission,
  requestBrowserNotificationPermission,
  type NotificationPermissionStatus,
} from "@/lib/notifications";

export const TopNavbar: React.FC = () => {
  const { profile, user } = useAuth();
  const { t } = useLanguage();
  const [permStatus, setPermStatus] = useState<NotificationPermissionStatus>('default');

  useEffect(() => {
    setPermStatus(getNotificationPermission());
  }, []);

  const handleEnableNotifications = async () => {
    const res = await requestBrowserNotificationPermission();
    setPermStatus(res);
  };

  const displayName = profile?.full_name || user?.email?.split('@')[0] || t.common.user;
  const displayRole = profile?.role === "admin" ? t.common.admin : t.common.user;

  return (
    <header className="min-h-[74px] sm:min-h-[82px] bg-white border-b border-[#E2E8F0] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center">
          <img
            src="/logo.png"
            alt="আমার ঔষধ (Amar Owshodh)"
            className="w-[155px] h-[55px] sm:w-[210px] sm:h-[70px] object-contain"
          />
        </Link>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-4 ml-auto">
        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Browser notification permission trigger button if not yet enabled */}
        {permStatus === 'default' && (
          <button
            onClick={handleEnableNotifications}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-[#2563EB] border border-blue-200 rounded-lg text-xs font-semibold transition-colors"
            title={t.notifications.enableBrowser}
          >
            <BellRing className="w-3.5 h-3.5" />
            <span>{t.notifications.enableBrowser}</span>
          </button>
        )}

        {/* Dropdown for in-app notifications */}
        <NotificationDropdown />

        {/* Profile Link in Header */}
        <Link
          href="/profile"
          className="flex items-center gap-2.5 sm:gap-3 border-l border-[#E2E8F0] pl-2.5 sm:pl-4 group hover:opacity-90 transition-all cursor-pointer"
          title={t.navigation.profile}
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-50 group-hover:bg-blue-100 text-[#2563EB] border border-blue-200 rounded-full flex items-center justify-center font-bold shrink-0 transition-colors shadow-2xs">
            <User className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-105 transition-transform" />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs sm:text-sm font-semibold text-[#1E293B] group-hover:text-[#2563EB] leading-none truncate max-w-[130px] transition-colors">
              {displayName}
            </p>
            <p className="text-[11px] text-[#64748B] mt-1">{displayRole}</p>
          </div>
        </Link>
      </div>
    </header>
  );
};
