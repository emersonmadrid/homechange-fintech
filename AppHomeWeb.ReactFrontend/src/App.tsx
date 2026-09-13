import { useState } from 'react';
import { 
  ArrowRightLeft, 
  LayoutDashboard, 
  History, 
  Users, 
  Settings, 
  LogOut,
  Bell,
  Search,
  Wallet,
  ArrowRight
} from 'lucide-react';

function App() {
  const [amount, setAmount] = useState('1000');
  const exchangeRate = 3.75; // Example rate

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-surface border-r border-gray-200 flex flex-col transition-all duration-300">
        <div className="h-20 flex items-center px-8 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30">
              H
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">HomeMoney</span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-8 p-4 rounded-2xl bg-gray-50 border border-gray-100">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
              alt="User profile" 
              className="w-12 h-12 rounded-full bg-white border-2 border-white shadow-sm"
            />
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Emerson Madrid</h3>
              <p className="text-xs text-gray-500 font-medium">Cuenta Personal</p>
            </div>
          </div>

          <nav className="space-y-1.5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-3">Principal</p>
            
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 text-primary font-semibold transition-colors">
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </a>
            
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors font-medium">
              <ArrowRightLeft size={20} />
              <span>Mis Transacciones</span>
            </a>

            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors font-medium">
              <History size={20} />
              <span>Cuentas Bancarias</span>
            </a>

            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors font-medium">
              <Users size={20} />
              <span>Beneficiarios</span>
            </a>
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-gray-100">
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors font-medium">
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </a>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* TOP HEADER */}
        <header className="h-20 bg-surface border-b border-gray-100 flex items-center justify-between px-8 z-10">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Buscar operaciones..." 
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm font-medium transition-shadow"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2.5 rounded-full hover:bg-gray-100 transition-colors text-gray-600">
              <Bell size={22} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-surface"></span>
            </button>
            <button className="p-2.5 rounded-full hover:bg-gray-100 transition-colors text-gray-600">
              <Settings size={22} />
            </button>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-8">
          
          <div className="max-w-6xl mx-auto space-y-8">
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Bienvenido de vuelta, Emerson</h1>
                <p className="text-gray-500 mt-1">Aquí está el resumen de tus finanzas de hoy.</p>
              </div>
              <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
                <span className="text-sm font-medium text-gray-500">Tipo de cambio oficial:</span>
                <span className="text-lg font-bold text-green-600">S/ 3.750</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* EXCHANGE CALCULATOR (CAMBIAR AHORA) */}
              <div className="lg:col-span-2">
                <div className="glass-card p-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 transition-transform group-hover:scale-110"></div>
                  
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-blue-50 text-primary rounded-xl">
                      <ArrowRightLeft size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Cambiar Ahora</h2>
                  </div>

                  <div className="space-y-6 relative">
                    <div className="flex items-center gap-6 p-6 rounded-2xl border border-gray-200 bg-gray-50/50 hover:border-primary/30 transition-colors">
                      <div className="flex-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Tú envías</label>
                        <div className="flex items-end gap-2">
                          <span className="text-2xl font-bold text-gray-900">$</span>
                          <input 
                            type="text" 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="text-4xl font-bold bg-transparent border-none p-0 focus:ring-0 w-full text-gray-900 placeholder-gray-300"
                          />
                        </div>
                      </div>
                      <div className="h-16 w-px bg-gray-200 mx-2"></div>
                      <div className="w-32 flex flex-col items-end">
                        <span className="text-sm font-semibold text-gray-900 mb-1">Dólares</span>
                        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                          <img src="https://flagcdn.com/w20/us.png" alt="USD" className="w-5 rounded-sm" />
                          <span className="font-bold">USD</span>
                        </div>
                      </div>
                    </div>

                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                      <button className="w-12 h-12 bg-white rounded-full border-2 border-gray-100 flex items-center justify-center text-primary shadow-lg hover:rotate-180 transition-transform duration-500">
                        <ArrowRightLeft size={20} />
                      </button>
                    </div>

                    <div className="flex items-center gap-6 p-6 rounded-2xl border border-gray-200 bg-gray-50/50 hover:border-primary/30 transition-colors">
                      <div className="flex-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Tú recibes</label>
                        <div className="flex items-end gap-2">
                          <span className="text-2xl font-bold text-gray-900">S/</span>
                          <input 
                            type="text" 
                            value={(parseFloat(amount || '0') * exchangeRate).toFixed(2)}
                            readOnly
                            className="text-4xl font-bold bg-transparent border-none p-0 focus:ring-0 w-full text-gray-900"
                          />
                        </div>
                      </div>
                      <div className="h-16 w-px bg-gray-200 mx-2"></div>
                      <div className="w-32 flex flex-col items-end">
                        <span className="text-sm font-semibold text-gray-900 mb-1">Soles</span>
                        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                          <img src="https://flagcdn.com/w20/pe.png" alt="PEN" className="w-5 rounded-sm" />
                          <span className="font-bold">PEN</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/25 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95">
                      Iniciar Operación
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* SIDE WIDGETS */}
              <div className="space-y-6">
                
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-gray-900">Balance Total</h3>
                    <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                      <Wallet size={20} />
                    </div>
                  </div>
                  <div className="mb-2 text-sm font-medium text-gray-500 uppercase tracking-wider">Ahorro Estimado</div>
                  <div className="text-3xl font-bold text-gray-900 tracking-tight">S/ 1,250.00</div>
                  <div className="mt-4 flex items-center gap-2 text-sm font-medium text-green-600">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">↑</div>
                    <span>+12.5% este mes</span>
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Últimas Operaciones</h3>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-primary">
                            <ArrowRightLeft size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">Cambio a Soles</p>
                            <p className="text-xs text-gray-500 font-medium">Hace 2 horas</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-green-600">+S/ 3,750</p>
                          <p className="text-xs text-gray-500 font-medium">Completado</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 py-3 text-sm font-bold text-primary hover:bg-blue-50 rounded-xl transition-colors">
                    Ver todo el historial
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
