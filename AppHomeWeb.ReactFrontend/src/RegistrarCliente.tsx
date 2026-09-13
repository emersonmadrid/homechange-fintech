import { useState } from 'react';
import { UserPlus, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';

export default function RegistrarCliente() {
  const [activeTab, setActiveTab] = useState<'personales' | 'cuenta'>('personales');
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };
  
  const [datos, setDatos] = useState({
    id_tipo_documento: '1',
    numero_documento: '',
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    id_ocupacion: '1',
    telefono: '',
    persona_publica: 'No',
    email: '',
    clave: '',
    confirmar_clave: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (datos.clave !== datos.confirmar_clave) {
      showNotification("Las contraseñas no coinciden", "error");
      return;
    }
    setSubmitting(true);
    try {
      const body = {
        Ent_Cliente_BE: {
          id_ocupacion: parseInt(datos.id_ocupacion),
          id_tipo_documento: parseInt(datos.id_tipo_documento),
          id_tipo_cliente: 1,
          nombre: datos.nombre,
          apellido_paterno: datos.apellido_paterno,
          apellido_materno: datos.apellido_materno,
          email: datos.email,
          telefono: datos.telefono,
          numero_documento: datos.numero_documento,
          usuario_registro: 0,
          usuario: datos.email,
          clave: datos.clave,
          razon_social: "",
          ruc: ""
        }
      };

      const token = document.querySelector<HTMLInputElement>('input[name="__RequestVerificationToken"]')?.value || '';
      
      const response = await fetch('/Transactions/HomeMoney/GetRegistrarCliente', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'RequestVerificationToken': token, 'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(body)
      });
      const json = await response.json();
      if (json && json.data > 0) {
        showNotification("Se registró correctamente", "success");
        setTimeout(() => {
          window.location.href = '/Transactions/HomeMoney/Login';
        }, 1500);
      } else if (json && json.data === -1) {
        showNotification("El correo electrónico o nombre de usuario ya se encuentra registrado.", "error");
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

  return (
    <div className="h-full bg-gray-50 py-6 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Crea tu cuenta</h1>
          <p className="text-gray-500 mt-4 text-xl">Únete a Home Money y comienza a cambiar divisas con la mejor tasa del mercado.</p>
        </div>

        {notification && (
          <div className={`p-4 rounded-xl text-sm font-medium border ${notification.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
            {notification.message}
          </div>
        )}

        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100 p-2 gap-2 bg-gray-50/50">
            <button
              onClick={() => setActiveTab('personales')}
              className={`flex-1 py-4 px-6 text-center font-bold text-sm transition-all rounded-2xl flex items-center justify-center gap-2 ${
                activeTab === 'personales' 
                  ? 'bg-white text-blue-600 shadow-sm border border-gray-200/50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
              }`}
            >
              <UserPlus className="w-5 h-5" />
              Datos Personales
            </button>
            <button
              onClick={() => setActiveTab('cuenta')}
              className={`flex-1 py-4 px-6 text-center font-bold text-sm transition-all rounded-2xl flex items-center justify-center gap-2 ${
                activeTab === 'cuenta' 
                  ? 'bg-white text-blue-600 shadow-sm border border-gray-200/50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
              Datos de Cuenta
            </button>
          </div>

          <div className="p-8 sm:p-12">
            {activeTab === 'personales' ? (
              <form className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo Documento</label>
                    <select name="id_tipo_documento" value={datos.id_tipo_documento} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium text-gray-900">
                      <option value="1">DNI</option>
                      <option value="2">CE</option>
                      <option value="3">Pasaporte</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Número Documento</label>
                    <input type="text" name="numero_documento" value={datos.numero_documento} onChange={handleChange} placeholder="Ej. 70123456" className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium text-gray-900" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nombres Completos</label>
                    <input type="text" name="nombre" value={datos.nombre} onChange={handleChange} placeholder="Ingrese Nombres" className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Apellido Paterno</label>
                    <input type="text" name="apellido_paterno" value={datos.apellido_paterno} onChange={handleChange} placeholder="Ingrese Apellido Paterno" className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Apellido Materno</label>
                    <input type="text" name="apellido_materno" value={datos.apellido_materno} onChange={handleChange} placeholder="Ingrese Apellido Materno" className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Ocupación</label>
                    <select name="id_ocupacion" value={datos.id_ocupacion} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium text-gray-900">
                      <option value="">Seleccione Ocupación</option>
                      <option value="1">Empleado</option>
                      <option value="2">Independiente</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Número Celular</label>
                    <input type="text" name="telefono" value={datos.telefono} onChange={handleChange} placeholder="Ej. 987654321" className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium text-gray-900" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">¿Es usted una persona políticamente expuesta?</label>
                    <select name="persona_publica" value={datos.persona_publica} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium text-gray-900">
                      <option value="No">No</option>
                      <option value="Si">Sí</option>
                    </select>
                  </div>
                </div>
                <div className="pt-8 flex justify-end">
                  <button 
                    type="button" 
                    onClick={() => setActiveTab('cuenta')}
                    className="px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold transition-all shadow-sm active:scale-95 flex items-center gap-2"
                  >
                    Siguiente: Datos de Cuenta
                  </button>
                </div>
              </form>
            ) : (
              <form className="max-w-lg mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Correo Electrónico</label>
                  <input type="email" name="email" value={datos.email} onChange={handleChange} placeholder="correo@ejemplo.com" className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Contraseña</label>
                  <input type="password" name="clave" value={datos.clave} onChange={handleChange} placeholder="••••••••" className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Confirmar Contraseña</label>
                  <input type="password" name="confirmar_clave" value={datos.confirmar_clave} onChange={handleChange} placeholder="••••••••" className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium text-gray-900" />
                </div>
                
                <div className="pt-8 text-center">
                  <button type="button" onClick={handleSubmit} disabled={submitting} className="flex items-center justify-center gap-2 w-full px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-all active:scale-95 shadow-md disabled:opacity-50">
                    {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <CheckCircle2 className="w-6 h-6" />}
                    {submitting ? 'Procesando...' : 'Completar Registro'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setActiveTab('personales')}
                    className="mt-4 text-sm font-semibold text-gray-500 hover:text-gray-800"
                  >
                    Volver a Datos Personales
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
