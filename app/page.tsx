'use client';

import Link from "next/link";
import { Pill, ShieldCheck, Clock, Calendar, CheckCircle2, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function HomePage() {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Header */}
      <header className="border-b border-[#E2E8F0] bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[74px] sm:min-h-[82px] flex items-center justify-between">
          <Link href="/" className="flex items-center py-1">
            <img
              src="/logo.png"
              alt="আমার ঔষধ (Amar Owshodh)"
              className="w-[155px] h-[55px] sm:w-[210px] sm:h-[70px] object-contain"
            />
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageSwitcher />
            <Link
              href="/login"
              className="text-xs sm:text-sm font-medium text-[#64748B] hover:text-[#1E293B] px-2.5 sm:px-3 py-2 rounded-md transition-colors"
            >
              {t.common.login}
            </Link>
            <Link
              href="/register"
              className="text-xs sm:text-sm font-medium bg-[#2563EB] hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors shadow-xs"
            >
              {t.common.register}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 text-[#2563EB] rounded-full text-xs font-semibold mb-6 shadow-2xs">
            <ShieldCheck className="w-4 h-4" />
            {t.home.badge}
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1E293B] tracking-tight leading-tight">
            {t.home.heroTitle1} <br className="hidden sm:inline" />
            <span className="text-[#2563EB]">{t.home.heroTitle2}</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#64748B] max-w-2xl mx-auto leading-relaxed">
            {t.home.heroSubtitle}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg shadow-sm transition-colors text-base"
            >
              {t.home.getStarted}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-[#E2E8F0] text-[#1E293B] font-medium px-6 py-3 rounded-lg transition-colors text-base"
            >
              {t.home.viewDemo}
            </Link>
          </div>

          {/* Medical Disclaimer Banner */}
          <div className="mt-12 bg-amber-50 border border-amber-200 rounded-xl p-4 text-left max-w-3xl mx-auto shadow-2xs">
            <p className="text-xs text-amber-900 leading-relaxed">
              <strong>{t.common.disclaimerTitle}</strong> {t.common.disclaimerText}
            </p>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="py-12 bg-white border-y border-[#E2E8F0]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                <div className="p-3 bg-blue-50 text-[#2563EB] rounded-lg w-fit mb-4">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#1E293B] mb-2">{t.home.feature1Title}</h3>
                <p className="text-sm text-[#64748B] leading-relaxed">
                  {t.home.feature1Desc}
                </p>
              </div>

              <div className="p-6 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                <div className="p-3 bg-teal-50 text-[#0D9488] rounded-lg w-fit mb-4">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#1E293B] mb-2">{t.home.feature2Title}</h3>
                <p className="text-sm text-[#64748B] leading-relaxed">
                  {t.home.feature2Desc}
                </p>
              </div>

              <div className="p-6 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-lg w-fit mb-4">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#1E293B] mb-2">{t.home.feature3Title}</h3>
                <p className="text-sm text-[#64748B] leading-relaxed">
                  {t.home.feature3Desc}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E2E8F0] py-8 text-center text-sm text-[#64748B]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-3">
          <img
            src="/logo.jpg"
            alt="আমার ঔষধ (Amar Owshodh)"
            className="h-10 w-auto object-contain opacity-90"
          />
          <p>{t.common.footerCopyright}</p>
        </div>
      </footer>
    </div>
  );
}
