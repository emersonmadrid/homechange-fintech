import React from 'react';
import { useI18n } from '../i18n/LanguageContext';
import { Globe } from 'lucide-react';

export const LanguageToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { lang, setLang } = useI18n();

  return (
    <div className={`inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-2 py-1 rounded-full border border-gray-200 shadow-sm text-xs font-semibold ${className}`}>
      <Globe className="w-3.5 h-3.5 text-gray-400 ml-1" />
      <button
        type="button"
        onClick={() => setLang('es')}
        className={`px-2 py-0.5 rounded-full transition-all ${
          lang === 'es'
            ? 'bg-blue-600 text-white shadow-xs font-bold'
            : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        ES
      </button>
      <button
        type="button"
        onClick={() => setLang('en')}
        className={`px-2 py-0.5 rounded-full transition-all ${
          lang === 'en'
            ? 'bg-blue-600 text-white shadow-xs font-bold'
            : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageToggle;
