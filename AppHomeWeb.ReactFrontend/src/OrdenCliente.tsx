import { useState, useEffect } from 'react';
import { ListFilter, Loader2 } from 'lucide-react';

interface Orden {
  numero_orden: string;
  fecha_registro: string;
  monto_envio: string;
  monto_recibido: string;
  tipo_cambio: string;
  estado_orden: 'Realizado' | 'Pendiente' | 'Anulado' | string;
}

export default function OrdenCliente() {
  const [filter, setFilter] = useState<'Todos' | 'Realizado' | 'Pendiente' | 'Anulado'>('Todos');
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        const idPerfil = document.querySelector<HTMLInputElement>('#hdidPerfilUsuario')?.value || new URLSearchParams(window.location.search).get('idperfilusuario') || '1';
        const body = {
          Ent_Orden_BE: {
            id_usuario_perfil: idPerfil
          }
        };

        const token = document.querySelector<HTMLInputElement>('input[name="__RequestVerificationToken"]')?.value || '';
        const response = await fetch('/Transactions/HomeMoney/GetOrdenCliente', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'RequestVerificationToken': token, 'X-Requested-With': 'XMLHttpRequest'
          },
          body: JSON.stringify(body)
        });

        const json = await response.json();
        if (json?.data?.ListOrdenCliente) {
          setOrdenes(json.data.ListOrdenCliente);
        }
      } catch (error) {
        console.error("Error fetching ordenes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdenes();
  }, []);

  const filteredOrdenes = filter === 'Todos' 
    ? ordenes 
    : ordenes.filter(o => o.estado_orden === filter);

  return (
    <div className="h-full bg-gray-50 py-6 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Historial de órdenes</h1>
            <p className="text-gray-500 mt-2">Revisa el estado de todas tus transacciones.</p>
          </div>
          
          <div className="flex bg-gray-100 p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto">
            <button 
              onClick={() => setFilter('Todos')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors whitespace-nowrap ${filter === 'Todos' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Todos
            </button>
            <button 
              onClick={() => setFilter('Realizado')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors whitespace-nowrap ${filter === 'Realizado' ? 'bg-green-500 text-white shadow-sm' : 'text-gray-500 hover:text-green-600'}`}
            >
              Realizado
            </button>
            <button 
              onClick={() => setFilter('Pendiente')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors whitespace-nowrap ${filter === 'Pendiente' ? 'bg-yellow-500 text-white shadow-sm' : 'text-gray-500 hover:text-yellow-600'}`}
            >
              Pendiente
            </button>
            <button 
              onClick={() => setFilter('Anulado')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors whitespace-nowrap ${filter === 'Anulado' ? 'bg-red-500 text-white shadow-sm' : 'text-gray-500 hover:text-red-600'}`}
            >
              Anulado
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="text-center py-20 flex flex-col items-center">
              <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
              <p className="text-gray-500 font-medium">Cargando órdenes...</p>
            </div>
          ) : filteredOrdenes.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <ListFilter className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No hay órdenes</h3>
              <p className="text-gray-500 mt-2 font-medium">No se encontraron órdenes con el estado seleccionado.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="py-5 px-6 text-sm font-bold text-gray-600 uppercase tracking-wider text-center">N° Orden</th>
                    <th className="py-5 px-6 text-sm font-bold text-gray-600 uppercase tracking-wider text-center">Fecha y hora</th>
                    <th className="py-5 px-6 text-sm font-bold text-gray-600 uppercase tracking-wider text-center">Envías</th>
                    <th className="py-5 px-6 text-sm font-bold text-gray-600 uppercase tracking-wider text-center">Recibes</th>
                    <th className="py-5 px-6 text-sm font-bold text-gray-600 uppercase tracking-wider text-center">Tipo Cambio</th>
                    <th className="py-5 px-6 text-sm font-bold text-gray-600 uppercase tracking-wider text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrdenes.map((orden, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 font-semibold text-gray-900 text-center">{orden.numero_orden}</td>
                      <td className="py-4 px-6 text-gray-500 text-sm text-center">{orden.fecha_registro}</td>
                      <td className="py-4 px-6 text-gray-900 font-medium text-center">{orden.monto_envio}</td>
                      <td className="py-4 px-6 text-blue-600 font-bold text-center">{orden.monto_recibido}</td>
                      <td className="py-4 px-6 text-gray-500 font-mono text-center">{orden.tipo_cambio}</td>
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold ${
                          orden.estado_orden === 'Realizado' ? 'bg-green-100 text-green-700' :
                          orden.estado_orden === 'Pendiente' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {orden.estado_orden}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
