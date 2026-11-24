'use client';

import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const LanguageSwitcher: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`inline-flex items-center rounded-lg border border-[#E2E8F0] bg-white p-0.5 shadow-2xs ${className}`}>
      <div className="flex items-center pl-2 pr-1 text-[#64748B]">
        <Globe className="w-3.5 h-3.5" />
      </div>
      <button
        type="button"
        onClick={() => setLanguage('bn')}
        className={`px-2 py-1 text-xs font-semibold rounded-md transition-all ${
          language === 'bn'
            ? 'bg-[#2563EB] text-white shadow-2xs'
            : 'text-[#64748B] hover:text-[#1E293B]'
        }`}
      >
        বাংলা
      </button>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 text-xs font-semibold rounded-md transition-all ${
          language === 'en'
            ? 'bg-[#2563EB] text-white shadow-2xs'
            : 'text-[#64748B] hover:text-[#1E293B]'
        }`}
      >
        English
      </button>
    </div>
  );
};
