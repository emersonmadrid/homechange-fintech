import { useState, useEffect } from 'react';
import { Landmark, Plus, Trash2, X, Loader2 } from 'lucide-react';

interface Cuenta {
  id_cuenta_cliente: number;
  banco: string;
  numero_cuenta: string;
  nombre_titular: string;
  tipomoneda: string;
}

export default function MisCuentasBancarias() {
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isPropia, setIsPropia] = useState(true);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // Form State
  const [numeroCuenta, setNumeroCuenta] = useState('');
  const [nombreTitular, setNombreTitular] = useState('');
  const [documento, setDocumento] = useState('');
  const [banco, setBanco] = useState('BCP');
  const [tipoMoneda, setTipoMoneda] = useState('PEN');
  const [saving, setSaving] = useState(false);
  
  const idPerfilUsuario = sessionStorage.getItem("idusuarioperfil") || '1';

  const fetchCuentas = async () => {
    try {
      setLoading(true);
      const payload = {
        Ent_Cuenta_Bancaria_BE: {
          id_usuario_perfil: idPerfilUsuario
        }
      };

      const token = document.querySelector<HTMLInputElement>('input[name="__RequestVerificationToken"]')?.value || '';
      const response = await fetch('/Transactions/HomeMoney/GetCuentaBancaria', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'RequestVerificationToken': token, 'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      
      if (data?.data?.ListCuentaBancaria) {
        setCuentas(data.data.ListCuentaBancaria);
      } else {
        setCuentas([]);
      }
    } catch (error) {
      console.error("Error fetching bank accounts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCuentas();
  }, []);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleAddCuenta = async () => {
    if (!numeroCuenta) {
      showNotification('El número de cuenta es obligatorio', 'error');
      return;
    }
    if (!isPropia && (!nombreTitular || !documento)) {
      showNotification('Nombre de titular y documento son obligatorios para cuentas de terceros', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        Ent_Cuenta_Bancaria_BE: {
          id_usuario_perfil: parseInt(idPerfilUsuario),
          banco: banco,
          numero_cuenta: numeroCuenta,
          nombre_titular: nombreTitular,
          id_tipo_documento: parseInt(documento) || 0,
          tipomoneda: tipoMoneda,
          cuenta_propia: isPropia ? "1" : "0",
          id_banco: 1,
          id_tipo_moneda: tipoMoneda === 'PEN' ? 1 : 2
        }
      };

      const token = document.querySelector<HTMLInputElement>('input[name="__RequestVerificationToken"]')?.value || '';
      const response = await fetch('/Transactions/HomeMoney/GetRegistrarCuentaBancaria', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'RequestVerificationToken': token, 'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      
      if (data && data.data > 0) {
        showNotification('Cuenta agregada exitosamente', 'success');
        setShowModal(false);
        setNumeroCuenta('');
        setNombreTitular('');
        setDocumento('');
        fetchCuentas();
      } else {
        showNotification('Ocurrió un error al agregar la cuenta', 'error');
      }
    } catch (error) {
      console.error("Error adding bank account:", error);
      showNotification('Error de conexión', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta cuenta?')) return;

    try {
      const payload = {
        id_cuenta: id
      };

      const token = document.querySelector<HTMLInputElement>('input[name="__RequestVerificationToken"]')?.value || '';
      const response = await fetch('/Transactions/HomeMoney/GetEliminarCuentaBancaria', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'RequestVerificationToken': token, 'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      
      if (data && data.data > 0) {
        showNotification('Cuenta eliminada exitosamente', 'success');
        fetchCuentas();
      } else {
        showNotification('Ocurrió un error al eliminar la cuenta', 'error');
      }
    } catch (error) {
      console.error("Error deleting bank account:", error);
      showNotification('Error de conexión', 'error');
    }
  };

  return (
    <div className="h-full bg-gray-50 py-6 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Mis Cuentas Bancarias</h1>
            <p className="text-gray-500 font-medium mt-1">Administra tus cuentas para enviar y recibir dinero</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold transition-all active:scale-95 shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Agregar Cuenta
          </button>
        </div>

        {notification && (
          <div className={`p-4 rounded-xl text-sm font-medium border ${notification.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
            {notification.message}
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : cuentas.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <Landmark className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No tienes cuentas registradas</h3>
              <p className="text-gray-500 mt-2 font-medium">Agrega tu primera cuenta bancaria para comenzar a operar.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="py-4 px-6 text-sm font-semibold text-gray-600">Banco</th>
                    <th className="py-4 px-6 text-sm font-semibold text-gray-600">Número de Cuenta</th>
                    <th className="py-4 px-6 text-sm font-semibold text-gray-600">Titular</th>
                    <th className="py-4 px-6 text-sm font-semibold text-gray-600">Moneda</th>
                    <th className="py-4 px-6 text-sm font-semibold text-gray-600 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cuentas.map((cuenta) => (
                    <tr key={cuenta.id_cuenta_cliente} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 font-medium text-gray-900">{cuenta.banco}</td>
                      <td className="py-4 px-6 text-gray-600 font-mono text-sm">{cuenta.numero_cuenta}</td>
                      <td className="py-4 px-6 text-gray-600">{cuenta.nombre_titular}</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                          {cuenta.tipomoneda}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button 
                          onClick={() => handleDelete(cuenta.id_cuenta_cliente)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors inline-flex"
                          title="Eliminar"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal Agregar Cuenta */}
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
                    <Landmark className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Agregar Cuenta</h3>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    ¿Es una cuenta propia?
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        checked={isPropia} 
                        onChange={() => setIsPropia(true)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-900">Sí</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        checked={!isPropia} 
                        onChange={() => setIsPropia(false)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-900">No</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Banco</label>
                    <select
                      value={banco}
                      onChange={(e) => setBanco(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium text-gray-900"
                    >
                      <option value="BCP">BCP</option>
                      <option value="Interbank">Interbank</option>
                      <option value="BBVA">BBVA</option>
                      <option value="Scotiabank">Scotiabank</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Moneda</label>
                    <select
                      value={tipoMoneda}
                      onChange={(e) => setTipoMoneda(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium text-gray-900"
                    >
                      <option value="PEN">Soles (PEN)</option>
                      <option value="USD">Dólares (USD)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Número de cuenta
                  </label>
                  <input
                    type="text"
                    value={numeroCuenta}
                    onChange={(e) => setNumeroCuenta(e.target.value)}
                    placeholder="Ej. 193-12345678-0-12"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
                  />
                </div>

                {!isPropia && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Nombre del titular
                      </label>
                      <input
                        type="text"
                        value={nombreTitular}
                        onChange={(e) => setNombreTitular(e.target.value)}
                        placeholder="Nombres completos"
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Número de documento
                      </label>
                      <input
                        type="text"
                        value={documento}
                        onChange={(e) => setDocumento(e.target.value)}
                        placeholder="Ej. 70123456"
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
                      />
                    </div>
                  </>
                )}

                <div className="pt-4 mt-6 border-t border-gray-100 flex gap-3 justify-end">
                  <button
                    onClick={() => setShowModal(false)}
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAddCuenta}
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    Guardar Cuenta
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
