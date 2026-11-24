'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language, translations, Translations } from '@/lib/i18n/translations';

interface LanguageContextType {
  language: Language;
  lang: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  formatNumber: (num: number | string) => string;
  formatDate: (date: Date | string) => string;
  formatTime: (timeStr: string) => string;
}

const bnDigits: Record<string, string> = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'bn',
  lang: 'bn',
  setLanguage: () => {},
  t: translations.bn,
  formatNumber: (n) => String(n),
  formatDate: (d) => String(d),
  formatTime: (t) => t,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('bn');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('amar_owshodh_lang') as Language | null;
      if (savedLang === 'bn' || savedLang === 'en') {
        setLanguageState(savedLang);
      }
    } catch {
      // LocalStorage access fallback
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('amar_owshodh_lang', lang);
      document.documentElement.lang = lang;
    } catch {
      // Fallback
    }
  };

  const formatNumber = (num: number | string): string => {
    const str = String(num);
    if (language === 'en') return str;
    return str.replace(/[0-9]/g, (digit) => bnDigits[digit] || digit);
  };

  const formatDate = (dateInput: Date | string): string => {
    const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return String(dateInput);

    if (language === 'en') {
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }

    return d.toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeStr: string): string => {
    if (!timeStr) return '';
    const cleanTime = timeStr.slice(0, 5); // HH:MM
    if (language === 'en') return cleanTime;
    return cleanTime.replace(/[0-9]/g, (digit) => bnDigits[digit] || digit);
  };

  const currentTranslations = translations[language] || translations.bn;

  return (
    <LanguageContext.Provider
      value={{
        language,
        lang: language,
        setLanguage,
        t: currentTranslations,
        formatNumber,
        formatDate,
        formatTime,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
