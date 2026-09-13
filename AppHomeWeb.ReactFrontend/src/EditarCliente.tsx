import React, { useState, useEffect } from 'react';
import { User, Save, Loader2, ShieldCheck, Mail, Phone } from 'lucide-react';

export default function EditarCliente() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [datos, setDatos] = useState({
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    email: '',
    telefono: '',
    numero_documento: '',
    id_tipo_documento: '',
    id_ocupacion: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    actual: '',
    nueva: '',
    confirmar: ''
  });

  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const idUsuario = sessionStorage.getItem('idusuario');
        if (!idUsuario) {
          window.location.href = '/Transactions/HomeMoney/Login';
          return;
        }
        const body = { strIdUsuario: idUsuario };

        const token = document.querySelector<HTMLInputElement>('input[name="__RequestVerificationToken"]')?.value || '';
        const response = await fetch('/Transactions/HomeMoney/GetDatoCliente', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'RequestVerificationToken': token, 'X-Requested-With': 'XMLHttpRequest'
          },
          body: JSON.stringify(body)
        });

        const json = await response.json();
        if (json?.data?.ListDatoCliente?.length > 0) {
          const d = json.data.ListDatoCliente[0];
          setDatos({
            nombre: d.nombre || '',
            apellido_paterno: d.apellido_paterno || '',
            apellido_materno: d.apellido_materno || '',
            email: d.email || '',
            telefono: d.telefono || '',
            numero_documento: d.numero_documento || '',
            id_tipo_documento: d.id_tipo_documento || '',
            id_ocupacion: d.id_ocupacion || ''
          });
        }
      } catch (error) {
        console.error("Error fetching datos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDatos();
  }, []);

  const handleDatosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleGuardarDatos = async () => {
    if (!datos.telefono || !datos.email) {
      showNotification("Email y teléfono son obligatorios", "error");
      return;
    }
    
    setSubmitting(true);
    try {
      const idUsuario = sessionStorage.getItem('idusuario') || '';
      const token = document.querySelector<HTMLInputElement>('input[name="__RequestVerificationToken"]')?.value || '';
      
      const bodyDatos = {
        Ent_Cliente_BE: {
          id_cliente: parseInt(idUsuario) || 0,
          email: datos.email,
          telefono: datos.telefono,
          usuario_modificacion: parseInt(idUsuario) || 0
        }
      };

      const responseDatos = await fetch('/Transactions/HomeMoney/GetEditarCliente', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'RequestVerificationToken': token, 'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(bodyDatos)
      });
      const jsonDatos = await responseDatos.json();

      let successPassword = true;
      if (passwordData.actual && passwordData.nueva) {
        if (passwordData.nueva !== passwordData.confirmar) {
          showNotification("Las contraseñas no coinciden", "error");
          setSubmitting(false);
          return;
        }
        
        const bodyPassword = {
          Ent_Usuario_BE: {
            id_usuario: parseInt(idUsuario) || 0,
            clave: passwordData.actual,
            nueva_clave: passwordData.nueva
          }
        };

        const responsePassword = await fetch('/Transactions/HomeMoney/GetCambiarContraseña', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'RequestVerificationToken': token, 'X-Requested-With': 'XMLHttpRequest'
          },
          body: JSON.stringify(bodyPassword)
        });
        const jsonPassword = await responsePassword.json();
        if (!(jsonPassword && jsonPassword.data > 0)) {
           successPassword = false;
        }
      }

      if (jsonDatos && jsonDatos.data > 0 && successPassword) {
        showNotification("Se guardaron los cambios exitosamente.", "success");
        setPasswordData({ actual: '', nueva: '', confirmar: '' });
      } else {
        showNotification("No se pudo registrar, favor intente nuevamente.", "error");
      }
    } catch (err) {
      console.error(err);
      showNotification("Error de conexión", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 h-full py-4 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Configuración de Cuenta</h1>
          <p className="text-gray-500 mt-2 text-base">Administra tu información personal y la seguridad de tu perfil.</p>
        </div>

        {notification && (
          <div className={`p-4 mb-8 rounded-xl text-sm font-medium border ${notification.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
            {notification.message}
          </div>
        )}

        <div className="space-y-12">
          
          {/* SECTION 1: Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Perfil Personal
              </h2>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                Esta información es confidencial. Asegúrate de que tus datos coincidan con tu documento de identidad para evitar problemas en tus operaciones.
              </p>
            </div>
            
            <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 sm:p-8 space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Read-only fields (usually names shouldn't change easily) */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Nombres</label>
                    <input 
                      type="text" 
                      value={datos.nombre} 
                      disabled
                      className="w-full bg-gray-50 border border-gray-200 text-gray-500 rounded-xl px-4 py-3 text-sm font-medium cursor-not-allowed" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Apellidos</label>
                    <input 
                      type="text" 
                      value={`${datos.apellido_paterno} ${datos.apellido_materno}`} 
                      disabled
                      className="w-full bg-gray-50 border border-gray-200 text-gray-500 rounded-xl px-4 py-3 text-sm font-medium cursor-not-allowed" 
                    />
                  </div>
                </div>

                <hr className="border-gray-100 my-6" />

                {/* Editable Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Correo Electrónico</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-gray-400" />
                      </div>
                      <input 
                        type="email" 
                        name="email"
                        value={datos.email}
                        onChange={handleDatosChange}
                        className="w-full bg-white border border-gray-300 text-gray-900 rounded-xl pl-11 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Teléfono Móvil</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone className="h-4 w-4 text-gray-400" />
                      </div>
                      <input 
                        type="tel" 
                        name="telefono"
                        value={datos.telefono}
                        onChange={handleDatosChange}
                        className="w-full bg-white border border-gray-300 text-gray-900 rounded-xl pl-11 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* SECTION 2: Security */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Seguridad
              </h2>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                Actualiza tu contraseña regularmente para mantener tu cuenta segura. Usa combinaciones alfanuméricas.
              </p>
            </div>
            
            <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 sm:p-8 space-y-6">
                
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Contraseña Actual</label>
                  <input 
                    type="password" 
                    name="actual"
                    placeholder="••••••••"
                    value={passwordData.actual}
                    onChange={handlePasswordChange}
                    className="w-full sm:w-2/3 bg-white border border-gray-300 text-gray-900 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Nueva Contraseña</label>
                    <input 
                      type="password" 
                      name="nueva"
                      placeholder="Nueva clave"
                      value={passwordData.nueva}
                      onChange={handlePasswordChange}
                      className="w-full bg-white border border-gray-300 text-gray-900 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Confirmar Contraseña</label>
                    <input 
                      type="password" 
                      name="confirmar"
                      placeholder="Repite tu nueva clave"
                      value={passwordData.confirmar}
                      onChange={handlePasswordChange}
                      className="w-full bg-white border border-gray-300 text-gray-900 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" 
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* FLOATING ACTION BAR EQUIVALENT */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              onClick={handleGuardarDatos}
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {submitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Guardando...</>
              ) : (
                <><Save className="w-5 h-5" /> Guardar Cambios</>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
