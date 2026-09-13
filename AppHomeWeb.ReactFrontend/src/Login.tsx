import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useI18n } from './i18n/LanguageContext';
import { LanguageToggle } from './components/LanguageToggle';

const Login: React.FC = () => {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(false);

    try {
      const payload = {
        Ent_Usuario_BE: {
          usuario: email,
          clave: password
        }
      };

      const response = await fetch('/Transactions/HomeMoney/GetValidarUsuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      
      if (data.data > 0) {
        sessionStorage.setItem('idusuario', data.data.toString());
        sessionStorage.setItem('idusuarioperfil', '');
        window.location.href = '/Transactions/HomeMoney/SeleccionPerfil';
      } else {
        setError(true);
        setTimeout(() => setError(false), 5000);
      }
    } catch (err) {
      console.error(err);
      setError(true);
      setTimeout(() => setError(false), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans selection:bg-blue-100 relative">
      {/* Floating Language Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <LanguageToggle />
      </div>

      <div className="max-w-md w-full relative">
        {/* Background glow effects */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20 relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">{t('login.title')}</h2>
            <p className="text-gray-500 font-medium">{t('login.subtitle')}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                <span className="w-2 h-2 rounded-full bg-red-600"></span>
                {t('login.error_msg')}
              </div>
            )}

            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                  placeholder={t('login.user_placeholder')}
                  required
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                  placeholder={t('login.pass_placeholder')}
                  required
                />
              </div>
            </div>

            <div className="pt-2 space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold transition-all active:scale-[0.98] disabled:opacity-70 shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)]"
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    {t('login.btn_submit')}
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <span className="text-sm text-gray-500">{t('login.no_account')} </span>
                <a
                  href="/Transactions/HomeMoney/RegistrarCliente"
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-all"
                >
                  {t('login.register_here')}
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
