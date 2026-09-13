import { ArrowRightLeft, FileText, UserCircle, Landmark, ChevronRight } from 'lucide-react';

export default function Transacciones() {
  const searchParams = new URLSearchParams(window.location.search);
  const idPerfilUsuario = searchParams.get('idperfilusuario') || sessionStorage.getItem("idusuarioperfil") || '';

  const cards = [
    {
      title: 'Cambiar ahora',
      subtitle: 'Realiza una nueva operación',
      icon: ArrowRightLeft,
      color: 'blue',
      url: `/Transactions/HomeMoney/CambiarAhora?idperfilusuario=${idPerfilUsuario}`
    },
    {
      title: 'Mis órdenes',
      subtitle: 'Revisa tu historial',
      icon: FileText,
      color: 'emerald',
      url: `/Transactions/HomeMoney/OrdenCliente?idperfilusuario=${idPerfilUsuario}`
    },
    {
      title: 'Mis datos',
      subtitle: 'Actualiza tu información',
      icon: UserCircle,
      color: 'purple',
      url: `/Transactions/HomeMoney/EditarCliente?idperfilusuario=${idPerfilUsuario}`
    },
    {
      title: 'Mis cuentas bancarias',
      subtitle: 'Administra tus cuentas',
      icon: Landmark,
      color: 'amber',
      url: `/Transactions/HomeMoney/MisCuentasBancarias?idperfilusuario=${idPerfilUsuario}`
    }
  ];

  const getColorClasses = (color: string) => {
    switch(color) {
      case 'blue': return 'bg-blue-50 text-blue-600 group-hover:bg-blue-100 group-hover:text-blue-700';
      case 'emerald': return 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 group-hover:text-emerald-700';
      case 'purple': return 'bg-purple-50 text-purple-600 group-hover:bg-purple-100 group-hover:text-purple-700';
      case 'amber': return 'bg-amber-50 text-amber-600 group-hover:bg-amber-100 group-hover:text-amber-700';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="h-full bg-gray-50 py-6 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Alert banner */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500"></div>
          <h4 className="text-gray-800 font-medium text-lg m-0">
            Seguimos operando con normalidad, no te arriesgues y <span className="font-bold text-blue-600">#QuedateEnCasa</span>
          </h4>
        </div>

        <div className="text-center mb-12 mt-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Panel de Control</h1>
          <p className="text-gray-500 mt-2 font-medium">¿Qué deseas hacer hoy?</p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <a 
                key={index}
                href={card.url}
                className="group bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-blue-100 transition-all duration-300 flex flex-col items-center text-center text-decoration-none hover:-translate-y-1"
              >
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors duration-300 ${getColorClasses(card.color)}`}>
                  <Icon className="w-10 h-10" strokeWidth={1.5} />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-sm text-gray-500 font-medium mb-6 flex-grow">{card.subtitle}</p>
                
                <div className="w-full py-3 px-4 bg-gray-50 rounded-xl group-hover:bg-blue-600 group-hover:text-white text-gray-700 font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2">
                  Ingresar
                  <ChevronRight className="w-4 h-4" />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
