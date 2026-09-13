import { useState, useEffect } from 'react';
import { LogOut, Activity, DollarSign, Check, X, Eye } from 'lucide-react';

interface Orden {
  id_orden_Cliente: string;
  orden: string;
  monto_envio: string;
  monto_recibido: string;
  fecha_registro: string;
  estado_orden: string;
  tipo_cambio: string;
  ruta_voucher?: string;
}

export default function PanelGerente() {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [compra, setCompra] = useState('3.750');
  const [venta, setVenta] = useState('3.780');
  const [loading, setLoading] = useState(true);
  const [toastMensaje, setToastMensaje] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = document.querySelector<HTMLInputElement>('input[name="__RequestVerificationToken"]')?.value || '';
      
      // Fetch Orders
      const resOrdenes = await fetch('/Transactions/HomeMoney/GetOrdenCliente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'RequestVerificationToken': token, 'X-Requested-With': 'XMLHttpRequest' },
        body: JSON.stringify({ Ent_Orden_BE: { id_usuario_perfil: 0 } }) // 0 = all
      });
      const dataOrdenes = await resOrdenes.json();
      if (dataOrdenes?.data?.ListOrdenCliente) {
        setOrdenes(dataOrdenes.data.ListOrdenCliente);
      }

      // Fetch Rates
      const resTasas = await fetch('/Transactions/HomeMoney/GetTipo_Cambio', { method: 'POST', headers: { 'RequestVerificationToken': token, 'X-Requested-With': 'XMLHttpRequest' }});
      const dataTasas = await resTasas.json();
      if (dataTasas?.data?.ListTipo_Cambio && dataTasas.data.ListTipo_Cambio.length > 0) {
        setCompra(dataTasas.data.ListTipo_Cambio[0].monto_compra);
        setVenta(dataTasas.data.ListTipo_Cambio[0].monto_venta);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRates = async () => {
    const token = document.querySelector<HTMLInputElement>('input[name="__RequestVerificationToken"]')?.value || '';
    const res = await fetch(`/Transactions/HomeMoney/ActualizarTipo_Cambio?compra=${compra}&venta=${venta}`, {
      method: 'POST', headers: { 'RequestVerificationToken': token, 'X-Requested-With': 'XMLHttpRequest' }
    });
    const data = await res.json();
    if (data.success) {
      setToastMensaje("✅ Tasas de cambio actualizadas con éxito"); setTimeout(() => setToastMensaje(''), 3000);
      fetchData();
    } else {
      setToastMensaje("❌ Error: " + data.message); setTimeout(() => setToastMensaje(''), 3000);
    }
  };

  const handleUpdateStatus = async (idOrden: string, nuevoEstado: string) => {
    // Eliminado el confirm() nativo feo.
    try {
      const token = document.querySelector<HTMLInputElement>('input[name="__RequestVerificationToken"]')?.value || '';
      const res = await fetch(`/Transactions/HomeMoney/ActualizarEstadoOrden?idOrden=${idOrden}&estado=${nuevoEstado}`, {
        method: 'POST', headers: { 'RequestVerificationToken': token, 'X-Requested-With': 'XMLHttpRequest' }
      });
      const data = await res.json();
      if (data.success) {
        setToastMensaje(`✅ Orden marcada como ${nuevoEstado}`);
        setTimeout(() => setToastMensaje(''), 3000);
        fetchData();
      } else {
        setToastMensaje("❌ Error: " + data.message);
        setTimeout(() => setToastMensaje(''), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = '/Transactions/HomeMoney/Login';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-blue-900">Portal Backoffice (Gerente)</h1>
            <p className="text-gray-500">Vista Global Administrativa</p>
          </div>
          <button onClick={handleLogout} className="flex items-center text-gray-600 hover:text-red-600">
            Cerrar Sesión <LogOut className="w-4 h-4 ml-2" />
          </button>
        </header>

        {toastMensaje && (
          <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
            {toastMensaje}
          </div>
        )}


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* TIPO DE CAMBIO CARD */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-1 h-fit">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Tipo de Cambio del Día</h2>
              <DollarSign className="text-blue-500" />
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio Compra (S/)</label>
                <input type="text" value={compra} onChange={e => setCompra(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio Venta (S/)</label>
                <input type="text" value={venta} onChange={e => setVenta(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500" />
              </div>
              <button onClick={handleUpdateRates} className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Publicar Nuevas Tasas
              </button>
            </div>
          </div>

          {/* ORDENES GLOBALES CARD */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 lg:col-span-2">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-blue-600" />
                Monitor Global de Órdenes ({ordenes.length})
              </h2>
              <button onClick={fetchData} className="text-sm text-blue-600 hover:underline">Actualizar</button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="p-4 border-b">Orden</th>
                    <th className="p-4 border-b">Fecha</th>
                    <th className="p-4 border-b">Monto Envía</th>
                    <th className="p-4 border-b">Monto Recibe</th>
                    <th className="p-4 border-b">Estado</th>
                    <th className="p-4 border-b">Acción</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-100">
                  {ordenes.map(o => (
                    <tr key={o.id_orden_Cliente} className="hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-900">{o.orden || o.id_orden_Cliente}</td>
                      <td className="p-4 text-gray-500">{o.fecha_registro}</td>
                      <td className="p-4 text-gray-900 font-medium">{o.monto_envio}</td>
                      <td className="p-4 text-blue-600 font-bold">{o.monto_recibido}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${o.estado_orden === 'PENDIENTE' ? 'bg-amber-100 text-amber-700' : o.estado_orden === 'RECHAZADO' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {o.estado_orden}
                        </span>
                      </td>
                      <td className="p-4 flex gap-2">
                         {o.estado_orden === 'PENDIENTE' && (
                           <>
                             <button onClick={() => handleUpdateStatus(o.id_orden_Cliente, 'COMPLETADO')} className="p-1 bg-green-100 text-green-700 rounded hover:bg-green-200"><Check size={16}/></button>
                             <button onClick={() => handleUpdateStatus(o.id_orden_Cliente, 'RECHAZADO')} className="p-1 bg-red-100 text-red-700 rounded hover:bg-red-200"><X size={16}/></button>
                           </>
                         )}
                         {o.ruta_voucher && (
                           <a href={o.ruta_voucher} target="_blank" rel="noreferrer" className="p-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200" title="Ver comprobante"><Eye size={16}/></a>
                         )}
                      </td>
                    </tr>
                  ))}
                  {ordenes.length === 0 && !loading && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-500">No hay órdenes en el sistema.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
