"use client";

import Link from "next/link";
import { Lock, Mail, ArrowRight, AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { loginAction, guestLoginAction, resendVerificationEmailAction } from "@/app/actions/auth";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function LoginPage() {
  const { t, language } = useLanguage();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState<string | null>(null);
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [guestRestricted, setGuestRestricted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("verified") === "true") {
        setIsVerified(true);
      }
      if (params.get("message") === "guest_restricted") {
        setGuestRestricted(true);
      }
      // Clear guest cookie upon landing on login page
      if (document.cookie.includes("amar_owshodh_guest=true")) {
        document.cookie = "amar_owshodh_guest=; Max-Age=0; path=/;";
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setResendSuccess(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const emailEntered = (formData.get("email") as string) || "";

    try {
      const res = await loginAction(formData);
      if (res && !res.success) {
        setError(res.error || (language === "bn" ? "লগইন করতে ব্যর্থ হয়েছে" : "Failed to log in"));
        if (res.emailNotConfirmed) {
          setUnconfirmedEmail(res.email || emailEntered);
        } else {
          setUnconfirmedEmail(null);
        }
      }
    } catch {
      // In case Next.js redirect occurs or network error
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setError(null);
    setResendSuccess(null);
    setIsGuestLoading(true);
    try {
      await guestLoginAction();
    } catch {
      setError(language === "bn" ? "গেস্ট লগইন করতে সমস্যা হয়েছে।" : "Failed to sign in as guest.");
    } finally {
      setIsGuestLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!unconfirmedEmail) return;
    setIsResending(true);
    setResendSuccess(null);
    try {
      const res = await resendVerificationEmailAction(unconfirmedEmail);
      if (res.success) {
        setResendSuccess(t.auth.verificationSentSuccess);
      } else {
        setError(res.error || (language === "bn" ? "ইমেইল পাঠাতে সমস্যা হয়েছে।" : "Failed to send verification email."));
      }
    } catch {
      setError(language === "bn" ? "ইমেইল পাঠাতে সমস্যা হয়েছে।" : "Failed to send verification email.");
    } finally {
      setIsResending(false);
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
          {/* Guest Restriction Notice */}
          {guestRestricted && (
            <div className="mb-4 p-3.5 bg-blue-50 border border-blue-200 text-blue-900 rounded-lg text-xs flex items-center gap-2.5 shadow-2xs">
              <AlertCircle className="w-5 h-5 text-[#2563EB] shrink-0" />
              <span className="font-medium">
                {language === "bn"
                  ? "এই সুবিধাটি ব্যবহার করতে অনুগ্রহ করে লগইন করুন বা একটি নতুন অ্যাকাউন্ট তৈরি করুন।"
                  : "Please login or create an account to use this feature."}
              </span>
            </div>
          )}

          {/* Verified Success Banner */}
          {isVerified && (
            <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0" />
              <span>{t.auth.emailVerifiedSuccess}</span>
            </div>
          )}

          {/* Resend Verification Success */}
          {resendSuccess && (
            <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0" />
              <span>{resendSuccess}</span>
            </div>
          )}

          {/* Unconfirmed Email Notice & Resend Action */}
          {unconfirmedEmail && (
            <div className="mb-4 p-3.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-xs space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">{t.auth.emailNotVerifiedTitle}</strong>
                  <span>{t.auth.emailNotVerifiedDesc}</span>
                </div>
              </div>
              <div className="pt-1 flex items-center justify-between border-t border-amber-200/60">
                <span className="font-mono text-[11px] text-amber-800 truncate max-w-[180px]">{unconfirmedEmail}</span>
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={isResending}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-md text-[11px] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isResending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                  <span>{isResending ? t.auth.resending : t.auth.resendVerification}</span>
                </button>
              </div>
            </div>
          )}

          {/* General Error Message */}
          {error && !unconfirmedEmail && (
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
                disabled={isLoading || isGuestLoading}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-xs text-sm font-medium text-white bg-[#2563EB] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2563EB] transition-colors disabled:opacity-70 cursor-pointer"
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

            {/* Working Guest Login Action */}
            <div className="mt-4">
              <button
                type="button"
                onClick={handleGuestLogin}
                disabled={isLoading || isGuestLoading}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-[#CBD5E1] rounded-lg text-xs font-semibold text-[#1E293B] hover:bg-slate-50 transition-colors shadow-2xs disabled:opacity-70 cursor-pointer"
              >
                {isGuestLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#2563EB]" />
                    <span>{t.auth.guestSigningIn}</span>
                  </>
                ) : (
                  <span>{t.auth.guestDemo}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
