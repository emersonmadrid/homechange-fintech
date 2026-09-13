import React, { useState, useEffect, useRef } from 'react';
import { ArrowDownUp, Building2, UploadCloud, CheckCircle2 } from 'lucide-react';

interface CuentaBancaria {
  id_cuenta_cliente: string;
  numero_cuenta: string;
  nombre_titular: string;
  banco: string;
  tipomoneda: string;
}

export default function CambiarAhora() {
  const [montoSoles, setMontoSoles] = useState<string>('');
  const [montoDolares, setMontoDolares] = useState<string>('');
  const [isSolesToDolares, setIsSolesToDolares] = useState<boolean>(true);
  const [tipoCambio, setTipoCambio] = useState({ compra: 3.75, venta: 3.78 });
  const [cuentas, setCuentas] = useState<CuentaBancaria[]>([]);
  const [selectedCuenta, setSelectedCuenta] = useState<string>('');
  
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const idPerfil = document.querySelector<HTMLInputElement>('#hdidPerfilUsuario')?.value || new URLSearchParams(window.location.search).get('idperfilusuario') || '1';
        
        // Fetch Rate
        const resTC = await fetch('/Transactions/HomeMoney/GetTipoCambioApp?idperfilusuario=' + idPerfil);
        const dataTC = await resTC.json();
        if (dataTC?.data?.length > 0) {
          setTipoCambio({
            compra: parseFloat(dataTC.data[0].monto_compra.replace(',', '.')),
            venta: parseFloat(dataTC.data[0].monto_venta.replace(',', '.')),
          });
        }

        // Fetch Cuentas
        const token = document.querySelector<HTMLInputElement>('input[name="__RequestVerificationToken"]')?.value || '';
        const resCB = await fetch('/Transactions/HomeMoney/GetCuentaBancaria', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'RequestVerificationToken': token, 'X-Requested-With': 'XMLHttpRequest' },
          body: JSON.stringify({ Ent_Cuenta_Bancaria_BE: { id_usuario_perfil: idPerfil } })
        });
        const dataCB = await resCB.json();
        if (dataCB?.data?.ListCuentaBancaria) {
          setCuentas(dataCB.data.ListCuentaBancaria);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSolesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      setMontoSoles(val);
      if (val !== '' && !isNaN(Number(val))) setMontoDolares((Number(val) / tipoCambio.venta).toFixed(2));
      else setMontoDolares('');
    }
  };

  const handleDolaresChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      setMontoDolares(val);
      if (val !== '' && !isNaN(Number(val))) setMontoSoles((Number(val) * tipoCambio.compra).toFixed(2));
      else setMontoSoles('');
    }
  };

  const toggleCurrency = () => {
    setIsSolesToDolares(!isSolesToDolares);
    setMontoSoles('');
    setMontoDolares('');
  };

  const handleSubmit = async () => {
    const monto = isSolesToDolares ? montoSoles : montoDolares;
    if (!monto || Number(monto) <= 0) {
      showNotification("Ingrese el monto a cambiar.", "error");
      return;
    }
    if (!selectedCuenta) {
      showNotification("Por favor, selecciona una cuenta bancaria destino donde recibirás tu dinero.", "error");
      return;
    }
    if (!file) {
      showNotification("Por favor, adjunta el voucher (comprobante) de tu transferencia.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const token = document.querySelector<HTMLInputElement>('input[name="__RequestVerificationToken"]')?.value || '';
      const idPerfil = document.querySelector<HTMLInputElement>('#hdidPerfilUsuario')?.value || new URLSearchParams(window.location.search).get('idperfilusuario') || '1';
      
      // 1. Upload voucher
      const formData = new FormData();
      formData.append('file', file);
      
      const resFile = await fetch('/Transactions/HomeMoney/SubirVoucher', {
        method: 'POST',
        headers: {
          'RequestVerificationToken': token,
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: formData
      });
      
      const dataFile = await resFile.json();
      if (!dataFile.success) {
        showNotification("Error: " + (dataFile.mensaje || "No se pudo subir el voucher."), "error");
        setSubmitting(false);
        return;
      }

      // 2. Register order
      const payload = {
        Ent_Orden_BE: {
          id_usuario_perfil: parseInt(idPerfil),
          monto_envio: (isSolesToDolares ? montoSoles : montoDolares).toString(),
          monto_recibido: (isSolesToDolares ? montoDolares : montoSoles).toString(),
          tipo_cambio: (isSolesToDolares ? tipoCambio.venta : tipoCambio.compra).toString(),
          id_cuenta_bancaria: parseInt(selectedCuenta),
          ruta_voucher: dataFile.mensaje,
          estado_orden: "Pendiente"
        }
      };

      const res = await fetch('/Transactions/HomeMoney/GetRegistrarOrden', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'RequestVerificationToken': token,
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (data && data.data) {
        setSuccess(true);
      } else {
        showNotification("Error: No se pudo procesar tu orden.", "error");
      }
    } catch (e) {
      showNotification("Ocurrió un error al procesar tu orden. Verifica tu conexión.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center border border-gray-100">
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Operación Recibida!</h2>
          <p className="text-gray-500 mb-8">
            Hemos recibido tu orden y tu comprobante de pago. Nuestro equipo está verificando la transferencia y te enviaremos tu dinero a tu cuenta en unos minutos.
          </p>
          <a href={"/Transactions/HomeMoney/Transacciones?idperfilusuario=" + (document.querySelector<HTMLInputElement>('#hdidPerfilUsuario')?.value || '1')} className="block w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors">
            Volver al Inicio
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] shadow-xl p-8 max-w-2xl w-full border border-gray-100">
        
        {/* Toast Notification */}
        {notification && (
          <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 ${notification.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            <span>{notification.type === 'success' ? '✓' : '⚠'}</span>
            {notification.message}
          </div>
        )}

        <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">Nueva Operación</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* CALCULATOR SIDE */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-700 flex items-center gap-2 mb-4">
              <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span> 
              Calcula tu cambio
            </h2>
            
            <div className="bg-gray-50 rounded-3xl p-5 border border-gray-100 focus-within:ring-2 focus-within:ring-blue-500/20">
              <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Envías</label>
              <div className="flex items-center justify-between gap-4">
                <input type="text" value={isSolesToDolares ? montoSoles : montoDolares} onChange={isSolesToDolares ? handleSolesChange : handleDolaresChange} placeholder="0.00" className="w-full text-3xl font-bold text-gray-900 bg-transparent outline-none" />
                <span className="font-bold text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">{isSolesToDolares ? 'PEN' : 'USD'}</span>
              </div>
            </div>

            <div className="flex justify-center -my-3 relative z-10">
              <button onClick={toggleCurrency} className="bg-white p-3 rounded-full shadow-md border border-gray-100 hover:bg-gray-50 hover:scale-110 transition-all text-blue-600">
                <ArrowDownUp size={20} />
              </button>
            </div>

            <div className="bg-blue-50/50 rounded-3xl p-5 border border-blue-100 focus-within:ring-2 focus-within:ring-blue-500/20">
              <label className="block text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wider">Recibes</label>
              <div className="flex items-center justify-between gap-4">
                <input type="text" value={isSolesToDolares ? montoDolares : montoSoles} onChange={isSolesToDolares ? handleDolaresChange : handleSolesChange} placeholder="0.00" className="w-full text-3xl font-bold text-blue-700 bg-transparent outline-none" />
                <span className="font-bold text-blue-700 bg-white px-3 py-1 rounded-full shadow-sm border border-blue-200">{isSolesToDolares ? 'USD' : 'PEN'}</span>
              </div>
            </div>
            
            <div className="text-center text-sm text-gray-500 mt-2">
              Tipo de cambio: <strong className="text-gray-900">{isSolesToDolares ? tipoCambio.venta : tipoCambio.compra}</strong>
            </div>
          </div>

          {/* CHECKOUT SIDE */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-700 flex items-center gap-2 mb-4">
              <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span> 
              Completa la Orden
            </h2>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">¿Dónde deseas recibir el dinero?</label>
              <select value={selectedCuenta} onChange={e => setSelectedCuenta(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-0 focus:border-blue-500 outline-none text-gray-700 bg-white">
                <option value="">-- Selecciona tu cuenta --</option>
                {cuentas.map(c => (
                  <option key={c.id_cuenta_cliente} value={c.id_cuenta_cliente}>
                    {c.banco} - {c.numero_cuenta}
                  </option>
                ))}
              </select>
              {cuentas.length === 0 && !loading && (
                <p className="text-xs text-red-500 mt-1">No tienes cuentas. Ve a "Mis Cuentas Bancarias" para agregar una.</p>
              )}
            </div>

            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
              <h3 className="text-sm font-bold text-amber-800 flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4" /> Realiza la transferencia a:
              </h3>
              <p className="text-amber-900 text-sm">Banco: <strong>BCP (Cuenta Corriente)</strong></p>
              <p className="text-amber-900 text-sm">Moneda: <strong>{isSolesToDolares ? 'Soles (PEN)' : 'Dólares (USD)'}</strong></p>
              <p className="text-amber-900 text-sm">Número: <strong>191-1234567-0-12</strong></p>
              <p className="text-amber-900 text-sm">Monto exacto: <strong>{isSolesToDolares ? montoSoles : montoDolares}</strong></p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sube tu Voucher (Comprobante)</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${file ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'}`}>
                {file ? (
                  <div className="text-green-700 font-medium flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> {file.name}
                  </div>
                ) : (
                  <div className="text-gray-500 flex flex-col items-center">
                    <UploadCloud className="w-8 h-8 mb-2 text-gray-400" />
                    <span className="text-sm">Haz clic para subir tu imagen</span>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
                  className="hidden" 
                  accept="image/*,.pdf" 
                />
              </div>
            </div>

            <button 
              onClick={handleSubmit}
              disabled={submitting || loading || !selectedCuenta || !file || !montoSoles}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? 'Procesando...' : 'Confirmar y Enviar'}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
