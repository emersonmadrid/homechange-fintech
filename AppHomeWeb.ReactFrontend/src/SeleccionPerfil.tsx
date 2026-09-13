import React, { useState, useEffect } from 'react';
import { Building2, User, Plus, ChevronRight, X, Loader2, LogOut } from 'lucide-react';

interface Perfil {
  id_usuario_perfil: string;
  nombre_perfil: string;
}

export default function SeleccionPerfil() {
  const [perfiles, setPerfiles] = useState<Perfil[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Form state
  const [razonSocial, setRazonSocial] = useState('');
  const [ruc, setRuc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const idUsuario = sessionStorage.getItem("idusuario");

  const fetchPerfiles = async () => {
    if (!idUsuario) {
      window.location.href = '/Transactions/HomeMoney/Login';
      return;
    }
    try {
      setLoading(true);
      const token = document.querySelector<HTMLInputElement>('input[name="__RequestVerificationToken"]')?.value || '';
      const response = await fetch('/Transactions/HomeMoney/GetPerfilUsuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'RequestVerificationToken': token, 'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({ strIdUsuario: idUsuario }),
      });
      const data = await response.json();
      if (data?.data?.ListPerfilUsuario) {
        const perfilesObtenidos = data.data.ListPerfilUsuario;
        setPerfiles(perfilesObtenidos);
        
        // Auto-redirect for single profile, unless forced via URL
        const urlParams = new URLSearchParams(window.location.search);
        if (perfilesObtenidos.length === 1 && !urlParams.has('force')) {
            const perfil = perfilesObtenidos[0];
            sessionStorage.setItem('idusuarioperfil', perfil.id_usuario_perfil);
            if (idUsuario) { sessionStorage.setItem('idusuario', idUsuario); }
            const nombre = (perfil.nombre_perfil || '').toLowerCase();
            if (nombre.includes('gerente') || nombre.includes('admin')) {
              window.location.href = '/Transactions/HomeMoney/PanelGerente?idperfilusuario=' + perfil.id_usuario_perfil;
            } else {
              window.location.href = '/Transactions/HomeMoney/Transacciones?idperfilusuario=' + perfil.id_usuario_perfil;
            }
        }
      }
    } catch (error) {
      console.error("Error fetching profiles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerfiles();
  }, []);

  const handleSelect = (perfil: Perfil) => {
    sessionStorage.setItem('idusuarioperfil', perfil.id_usuario_perfil);
    if (idUsuario) { sessionStorage.setItem('idusuario', idUsuario); }
    
    // Role-based routing (Fase 1)
    const nombre = perfil.nombre_perfil.toLowerCase();
    if (nombre.includes('gerente') || nombre.includes('admin')) {
      window.location.href = '/Transactions/HomeMoney/PanelGerente?idperfilusuario=' + perfil.id_usuario_perfil;
    } else {
      window.location.href = '/Transactions/HomeMoney/Transacciones?idperfilusuario=' + perfil.id_usuario_perfil;
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = '/Transactions/HomeMoney/Login';
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!razonSocial || !ruc) return;

    try {
      setIsSubmitting(true);
      const payload = {
        Ent_PerfilUsuario_BE: {
          id_usuario: idUsuario,
          nombre: razonSocial,
          usuario_registro: 1,
          razon_social: razonSocial,
          ruc: ruc,
        }
      };

      const token = document.querySelector<HTMLInputElement>('input[name="__RequestVerificationToken"]')?.value || '';
      const response = await fetch('/Transactions/HomeMoney/GetRegistrarPerfilUsuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'RequestVerificationToken': token, 'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      
      if (data.data > 0) {
        setShowModal(false);
        setRazonSocial('');
        setRuc('');
        fetchPerfiles();
      }
    } catch (error) {
      console.error("Error registering profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 font-sans selection:bg-blue-100">
      {/* Logout Button */}
      <div className="w-full max-w-4xl flex justify-end mb-8">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:text-red-600 hover:border-red-200 transition-all shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </button>
      </div>

      <div className="max-w-4xl w-full space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
            ¿Con qué perfil operarás hoy?
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
            Selecciona tu perfil personal o de empresa para continuar a tu panel de control.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {perfiles.map((perfil) => (
              <button
                key={perfil.id_usuario_perfil}
                onClick={() => handleSelect(perfil)}
                className="group relative bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all duration-300 text-left flex flex-col items-center justify-center gap-4 hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
                
                <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-2 relative z-10">
                  {(perfil.nombre_perfil || '').toLowerCase().includes('empresa') || (perfil.nombre_perfil || '').toLowerCase().includes('sac') || (perfil.nombre_perfil || '').toLowerCase().includes('eirl') ? (
                    <Building2 className="w-10 h-10" />
                  ) : (
                    <User className="w-10 h-10" />
                  )}
                </div>
                
                <div className="text-center relative z-10">
                  <h3 className="text-sm font-semibold text-blue-600 tracking-wide uppercase mb-1">
                    Bienvenido
                  </h3>
                  <h2 className="text-xl font-bold text-gray-900">
                    {perfil.nombre_perfil}
                  </h2>
                </div>

                <div className="mt-4 flex items-center text-sm font-bold text-gray-400 group-hover:text-blue-600 transition-colors relative z-10">
                  Ingresar <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}

            {perfiles.length < 4 && (
              <button
                onClick={() => setShowModal(true)}
                className="group bg-transparent p-8 rounded-3xl border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-300 flex flex-col items-center justify-center gap-4 min-h-[300px]"
              >
                <div className="w-16 h-16 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-colors">
                  <Plus className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                    Agregar Perfil
                  </h2>
                  <p className="text-sm text-gray-500 font-medium mt-1">
                    Registrar nueva empresa
                  </p>
                </div>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setShowModal(false)}
          ></div>
          
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Registrar Empresa</h3>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleRegister} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Razón Social
                  </label>
                  <input
                    type="text"
                    value={razonSocial}
                    onChange={(e) => setRazonSocial(e.target.value)}
                    placeholder="Nombre de la empresa"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    RUC
                  </label>
                  <input
                    type="text"
                    value={ruc}
                    onChange={(e) => setRuc(e.target.value)}
                    placeholder="Ej. 20123456789"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
                    required
                  />
                </div>

                <div className="pt-4 mt-6 border-t border-gray-100 flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2.5 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !razonSocial || !ruc}
                    className="px-6 py-2.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center gap-2"
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    Registrar Perfil
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
