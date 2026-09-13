import React, { useState, useEffect } from 'react';
import { ArrowUpDown } from 'lucide-react';
import { useI18n } from './i18n/LanguageContext';
import { LanguageToggle } from './components/LanguageToggle';

const LandingPage: React.FC = () => {
  const { t } = useI18n();
  const [sourceAmount, setSourceAmount] = useState<string>('');
  const [targetAmount, setTargetAmount] = useState<string>('');
  const [isSolesToDollars, setIsSolesToDollars] = useState(true);

  const baseRate = 3.80; 
  const buyRate = baseRate - 0.1;
  const sellRate = baseRate + 0.1;

  useEffect(() => {
    const sourceValue = parseFloat(sourceAmount) || 0;
    if (sourceValue === 0) {
      setTargetAmount('');
      return;
    }
    
    if (isSolesToDollars) {
      setTargetAmount((sourceValue / sellRate).toFixed(2));
    } else {
      setTargetAmount((sourceValue * buyRate).toFixed(2));
    }
  }, [sourceAmount, isSolesToDollars]);

  const handleSwitch = () => {
    setIsSolesToDollars(!isSolesToDollars);
    setTargetAmount('');
  };

  const handleLoginRedirect = () => {
    window.location.href = '/Transactions/HomeMoney/Login';
  };

  return (
    <div className="min-h-screen lg:h-screen w-full bg-[#f8fafc] flex flex-col lg:flex-row font-sans relative">
      
      {/* Floating Language Switcher */}
      <div className="absolute top-6 right-6 z-50">
        <LanguageToggle />
      </div>

      {/* LEFT SIDE: Hero Text */}
      <div className="w-full lg:w-1/2 bg-primary flex flex-col justify-center px-8 py-16 lg:px-16 xl:px-24 text-white">
        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-6">
          {t('landing.hero_title')}
        </h1>
        <p className="text-lg text-blue-100 font-medium mb-8 max-w-md">
          {t('landing.hero_subtitle')}
        </p>
        
        <div className="flex gap-8">
          <div>
            <p className="text-blue-200 text-sm font-semibold uppercase tracking-wider mb-1">{t('landing.buy')}</p>
            <p className="text-3xl font-bold">{buyRate.toFixed(3)}</p>
          </div>
          <div>
            <p className="text-blue-200 text-sm font-semibold uppercase tracking-wider mb-1">{t('landing.sell')}</p>
            <p className="text-3xl font-bold">{sellRate.toFixed(3)}</p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Calculator */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 py-12 lg:py-8">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl shadow-gray-200/50 p-8 border border-gray-100 relative">
          
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">{t('landing.calc_title')}</h2>

          <div className="space-y-4 relative">
            {/* ENVÍAS */}
            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">{t('landing.you_send')}</label>
              <div className="flex items-center justify-between">
                <input
                  type="number"
                  min="0"
                  placeholder="0.00"
                  className="bg-transparent text-2xl font-bold text-gray-900 w-full outline-none"
                  value={sourceAmount}
                  onChange={(e) => setSourceAmount(e.target.value)}
                />
                <span className="text-sm font-bold text-gray-700 bg-gray-200 px-2 py-1 rounded-md ml-3">
                  {isSolesToDollars ? 'PEN' : 'USD'}
                </span>
              </div>
            </div>

            {/* SWITCH BUTTON */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center pointer-events-none mt-1">
              <button 
                aria-label="Invertir moneda origen y destino"
                onClick={handleSwitch}
                className="w-12 h-12 bg-white rounded-full shadow-md border border-gray-200 flex items-center justify-center text-primary hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all hover:scale-110 pointer-events-auto"
              >
                <ArrowUpDown className="w-5 h-5" />
              </button>
            </div>

            {/* RECIBES */}
            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">{t('landing.you_receive')}</label>
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  readOnly
                  placeholder="0.00"
                  className="bg-transparent text-2xl font-bold text-gray-900 w-full outline-none"
                  value={targetAmount}
                />
                <span className="text-sm font-bold text-gray-700 bg-gray-200 px-2 py-1 rounded-md ml-3">
                  {!isSolesToDollars ? 'PEN' : 'USD'}
                </span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleLoginRedirect}
            className="w-full mt-8 bg-primary hover:bg-blue-700 text-white font-bold text-lg py-3 rounded-xl shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5"
          >
            {t('landing.start_op')}
          </button>

          <p className="text-center text-xs font-medium text-gray-400 mt-4">
            {t('landing.rate_note')}
          </p>
        </div>
      </div>

    </div>
  );
};

export default LandingPage;
