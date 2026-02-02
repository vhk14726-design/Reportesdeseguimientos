
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import CargaForm from './components/CargaForm';
import Dashboard from './components/Dashboard';
import ClientList from './components/ClientList';
import { SidebarSegment, FormData } from './types';

const MOCK_CLIENTS: FormData[] = [
  { 
    id: '1',
    ci: '2.375.630', 
    cliente: 'MARIN BARBOZA, ROBERTO', 
    analista: 'SIN INVERSION', 
    agente: 'MIGUEL GONZALEZ', 
    producto: 'CRÉDITO', 
    equipo: 'EQ1', 
    fechaAprobacion: '2024-05-10', 
    impugnaciones: '0', 
    seguimiento: 'Primer contacto realizado satisfactoriamente.', 
    inversion: 25000000, 
    solicitud: 30000000, 
    totalDevolver: 35000000, 
    pagare: 35000000, 
    utilidadAgente: 2000000, 
    utilidadGfv: 3000000, 
    inversor: 'CARLOS DIAZ', 
    utilidadInversor: 1500000, 
    destino: 'COMERCIAL 1', 
    cantidadBcp: 0, 
    cantidadInformconf: 0, 
    sucursal: 'MATRIZ',
    desembolsador: 'PEDRO BAEZ',
    experienciaSuc: 'BUENA',
    masOMenos: 'IGUAL',
    motivo: 'SCORE ALTO',
    montoDado: 30000000,
    posibleDesembolso: '2024-05-15',
    rebotes: 'NINGUNO'
  }
];

const App: React.FC = () => {
  const [activeSegment, setActiveSegment] = useState<SidebarSegment>('CARGA');
  const [clientData, setClientData] = useState<FormData[]>(MOCK_CLIENTS);

  const handleSaveClient = (newClient: FormData) => {
    setClientData(prev => [{ ...newClient, id: Date.now().toString() }, ...prev]);
    setActiveSegment(newClient.destino as SidebarSegment);
  };

  const handleUpdateClient = (updatedClient: FormData) => {
    setClientData(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
  };

  const renderContent = () => {
    const segmentClients = clientData.filter(c => c.destino === activeSegment);

    switch (activeSegment) {
      case 'CARGA':
        return <CargaForm onSave={handleSaveClient} />;
      case 'INICIO':
      case 'DASHBOARD GENERAL':
        return <Dashboard title={activeSegment} />;
      case 'COMERCIAL 1':
      case 'COMERCIAL 2':
      case 'INTEGRA CAPITAL':
      case 'CAPTACIÓN':
      case 'INTERLUDIO':
        return <ClientList title={activeSegment} clients={segmentClients} onUpdate={handleUpdateClient} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
            <i className="fa-solid fa-hammer text-6xl opacity-20"></i>
            <h2 className="text-2xl font-bold">Segmento en Construcción</h2>
            <p>Estamos trabajando para traerte esta funcionalidad pronto.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-inter">
      <Sidebar 
        activeSegment={activeSegment} 
        onSegmentChange={setActiveSegment} 
      />
      
      <main className="flex-1 overflow-x-hidden p-6 md:p-10 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
            <span className="text-slate-900">GFV</span>
            <i className="fa-solid fa-chevron-right text-[8px]"></i>
            <span className="text-emerald-600">{activeSegment}</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[9px] font-black uppercase tracking-tighter border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Conectado
            </div>
            <button className="relative text-slate-400 hover:text-slate-900 transition-colors">
              <i className="fa-solid fa-bell text-lg"></i>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-[#f8fafc]"></span>
            </button>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="flex items-center gap-3">
               <div className="text-right hidden sm:block">
                  <p className="text-xs font-black text-slate-900 uppercase">Admin</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Panel Central</p>
               </div>
               <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <i className="fa-solid fa-user-gear"></i>
               </div>
            </div>
          </div>
        </div>

        <div className="bg-transparent">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
