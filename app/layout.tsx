import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: "আমার ঔষধ (Amar Owshodh) — ব্যক্তিগত ঔষধ রিমাইন্ডার ও ট্র্যাকিং",
  description: "আপনার ঔষধ গ্রহণের সঠিক সময়সূচী পরিচালনা করুন এবং ট্র্যাক রাখুন। Personal Medicine Reminder & Tracking System.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-[#1E293B]">
        <LanguageProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
