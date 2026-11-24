"use client";

import Link from "next/link";
import { Pill, Lock, Mail, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { loginAction } from "@/app/actions/auth";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function LoginPage() {
  const { t, language } = useLanguage();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await loginAction(formData);
      if (res && !res.success) {
        setError(res.error || (language === 'bn' ? "লগইন করতে ব্যর্থ হয়েছে" : "Failed to log in"));
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
          {t.auth.loginTitle}
        </h2>
        <p className="mt-2 text-sm text-[#64748B]">
          {t.auth.newUser}{" "}
          <Link href="/register" className="font-medium text-[#2563EB] hover:underline">
            {t.auth.createAccount}
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

          <form className="space-y-5" onSubmit={handleSubmit}>
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#2563EB] focus:ring-[#2563EB] border-[#E2E8F0] rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs text-[#64748B]">
                  {t.auth.rememberMe}
                </label>
              </div>

              <div className="text-xs">
                <a href="#" className="font-medium text-[#2563EB] hover:underline">
                  {t.auth.forgotPassword}
                </a>
              </div>
            </div>

            <div>
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
                    <span>{t.auth.signIn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E2E8F0]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-[#64748B]">{t.common.or}</span>
              </div>
            </div>

            <div className="mt-4">
              <Link
                href="/dashboard"
                className="w-full flex justify-center items-center py-2 px-4 border border-[#E2E8F0] rounded-lg text-xs font-medium text-[#64748B] hover:bg-slate-50 transition-colors"
              >
                {t.auth.guestDemo}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
