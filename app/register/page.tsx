"use client";

import Link from "next/link";
import { Lock, Mail, User, ArrowRight, AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { registerAction, guestLoginAction, resendVerificationEmailAction } from "@/app/actions/auth";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function RegisterPage() {
  const { t, language } = useLanguage();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (typeof document !== "undefined" && document.cookie.includes("amar_owshodh_guest=true")) {
      document.cookie = "amar_owshodh_guest=; Max-Age=0; path=/;";
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
      const res = await registerAction(formData);
      if (res && !res.success) {
        setError(res.error || (language === "bn" ? "নিবন্ধন সম্পন্ন হতে ব্যর্থ হয়েছে" : "Failed to create account"));
      } else if (res && res.emailVerificationRequired) {
        setRegisteredEmail(res.email || emailEntered);
      }
    } catch {
      // In case redirect occurs or network error
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setError(null);
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
    if (!registeredEmail) return;
    setIsResending(true);
    setResendSuccess(null);
    try {
      const res = await resendVerificationEmailAction(registeredEmail);
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
          {registeredEmail ? t.auth.registrationSuccessTitle : t.auth.registerTitle}
        </h2>
        <p className="mt-2 text-sm text-[#64748B]">
          {registeredEmail ? (
            <span>{t.auth.registrationSuccessDesc}</span>
          ) : (
            <>
              {t.auth.alreadyHaveAccount}{" "}
              <Link href="/login" className="font-medium text-[#2563EB] hover:underline">
                {t.auth.signIn}
              </Link>
            </>
          )}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xs sm:rounded-xl sm:px-10 border border-[#E2E8F0]">
          {/* Registration Verification Required Screen */}
          {registeredEmail ? (
            <div className="text-center space-y-5">
              <div className="w-14 h-14 bg-emerald-50 text-[#16A34A] border border-emerald-200 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-[#1E293B]">
                  {t.auth.emailNotVerifiedTitle}
                </h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  {t.auth.checkInboxInstruction}
                </p>
                <div className="p-2.5 bg-slate-50 border border-[#E2E8F0] rounded-lg font-mono text-xs text-[#1E293B] font-semibold break-all">
                  {registeredEmail}
                </div>
              </div>

              {resendSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-[#16A34A]" />
                  <span>{resendSuccess}</span>
                </div>
              )}

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-[#DC2626] rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-3 pt-3">
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={isResending}
                  className="w-full flex justify-center items-center gap-2 py-2.5 px-4 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isResending ? (
                    <Loader2 className="w-4 h-4 animate-spin text-amber-700" />
                  ) : (
                    <Send className="w-4 h-4 text-amber-700" />
                  )}
                  <span>{isResending ? t.auth.resending : t.auth.resendVerification}</span>
                </button>

                <Link
                  href="/login"
                  className="w-full flex justify-center items-center gap-2 py-2.5 px-4 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-2xs"
                >
                  <span>{t.auth.signIn}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            /* Regular Registration Form */
            <>
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
                        <span>{t.common.register}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-6 border-t border-[#E2E8F0] pt-4">
                <p className="text-xs text-[#64748B] text-center leading-normal mb-4">
                  {t.auth.registerAgreement}
                </p>

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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
