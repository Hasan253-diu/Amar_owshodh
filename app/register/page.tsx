"use client";

import Link from "next/link";
import { Pill, Lock, Mail, User, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { registerAction } from "@/app/actions/auth";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function RegisterPage() {
  const { t, language } = useLanguage();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await registerAction(formData);
      if (res && !res.success) {
        setError(res.error || (language === 'bn' ? "নিবন্ধন সম্পন্ন হতে ব্যর্থ হয়েছে" : "Failed to create account"));
      }
    } catch {
      // In case redirect occurs or network error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center justify-center mb-5">
          <img
            src="/logo.png"
            alt="আমার ঔষধ (Amar Owshodh)"
            className="w-[180px] sm:w-[220px] h-auto max-h-[80px] object-contain"
          />
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-[#1E293B]">
          {t.auth.registerTitle}
        </h2>
        <p className="mt-2 text-sm text-[#64748B]">
          {t.auth.alreadyHaveAccount}{" "}
          <Link href="/login" className="font-medium text-[#2563EB] hover:underline">
            {t.auth.signIn}
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xs sm:rounded-xl sm:px-10 border border-[#E2E8F0]">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-[#DC2626] rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-[#1E293B]">{t.auth.fullName}</label>
              <div className="mt-1 relative rounded-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
                  <User className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder={t.auth.fullNamePlaceholder}
                  className="block w-full pl-10 pr-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent bg-white text-[#1E293B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1E293B]">{t.auth.email}</label>
              <div className="mt-1 relative rounded-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder={t.auth.emailPlaceholder}
                  className="block w-full pl-10 pr-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent bg-white text-[#1E293B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1E293B]">{t.auth.password}</label>
              <div className="mt-1 relative rounded-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder={t.auth.passwordPlaceholder}
                  className="block w-full pl-10 pr-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent bg-white text-[#1E293B]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-xs text-sm font-medium text-white bg-[#2563EB] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2563EB] transition-colors disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t.auth.submitting}</span>
                  </>
                ) : (
                  <>
                    <span>{t.common.register}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 border-t border-[#E2E8F0] pt-4">
            <p className="text-xs text-[#64748B] text-center leading-normal">
              {t.auth.registerAgreement}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
