import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { en } from './en';
import { de } from './de';
import type { TranslationKeys } from './en';

export type Lang = 'en' | 'de';

const TRANSLATIONS: Record<Lang, TranslationKeys> = { en, de };

const LS_KEY = 'snapsell-lang';

function getInitialLang(): Lang {
  try {
    const stored = localStorage.getItem(LS_KEY);
    if (stored === 'en' || stored === 'de') return stored;
    const browser = navigator.language.slice(0, 2).toLowerCase();
    if (browser === 'de') return 'de';
  } catch {
    // ignore
  }
  return 'en';
}

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: TranslationKeys;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  setLang: () => {},
  t: en,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(LS_KEY, l); } catch { /* ignore */ }
  };

  // Sync html[lang] attribute
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: TRANSLATIONS[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
