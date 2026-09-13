import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations } from './translations';

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'es',
  setLang: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('app_lang');
    return (saved === 'en' || saved === 'es') ? saved : 'es';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('app_lang', newLang);
    window.dispatchEvent(new CustomEvent('app_lang_change', { detail: newLang }));
  };

  useEffect(() => {
    const handleStorage = (e: CustomEvent<Language>) => {
      if (e.detail && (e.detail === 'en' || e.detail === 'es')) {
        setLangState(e.detail);
      }
    };
    window.addEventListener('app_lang_change' as any, handleStorage);
    return () => window.removeEventListener('app_lang_change' as any, handleStorage);
  }, []);

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations['es']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useI18n = () => useContext(LanguageContext);
