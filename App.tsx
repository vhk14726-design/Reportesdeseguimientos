
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import CargaForm from './components/CargaForm';
import Dashboard from './components/Dashboard';
import ClientList from './components/ClientList';
import { SidebarSegment, FormData } from './types';
import { db, supabase } from './services/supabase';

const App: React.FC = () => {
  const [activeSegment, setActiveSegment] = useState<SidebarSegment>('CARGA');
  const [clientData, setClientData] = useState<FormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [configError, setConfigError] = useState(false);

  // Load data from Supabase on mount
  useEffect(() => {
    const loadData = async () => {
      if (!supabase) {
        console.warn("Supabase no está configurado. La aplicación funcionará en modo local (sin persistencia).");
        setConfigError(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await db.getAll();
        setClientData(data);
      } catch (err) {
        console.error("Error loading data from Supabase:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSaveClient = async (newClient: FormData) => {
    try {
      if (!supabase) {
        // Fallback to local state if no DB
        const mockSaved = { ...newClient, id: Date.now().toString() };
        setClientData(prev => [mockSaved, ...prev]);
        setActiveSegment(mockSaved.destino as SidebarSegment);
        return;
      }

      const savedClient = await db.insert(newClient);
      setClientData(prev => [savedClient, ...prev]);
      setActiveSegment(savedClient.destino as SidebarSegment);
    } catch (err) {
      console.error("Error saving to Supabase:", err);
      alert("Error al guardar en la base de datos. Verifique su conexión.");
    }
  };

  const handleUpdateClient = async (updatedClient: FormData) => {
    try {
      if (!supabase) {
        setClientData(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
        return;
      }
      const saved = await db.update(updatedClient.id, updatedClient);
      setClientData(prev => prev.map(c => c.id === saved.id ? saved : c));
    } catch (err) {
      console.error("Error updating in Supabase:", err);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
          <i className="fa-solid fa-spinner fa-spin text-4xl mb-4"></i>
          <p className="font-bold uppercase tracking-widest text-xs">Sincronizando con Supabase...</p>
        </div>
      );
    }

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
            <span className="text-slate-900">GFV Cloud</span>
            <i className="fa-solid fa-chevron-right text-[8px]"></i>
            <span className="text-emerald-600">{activeSegment}</span>
          </div>
          <div className="flex items-center gap-6">
            <div className={`flex items-center gap-2 px-3 py-1 ${configError ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'} rounded-full text-[9px] font-black uppercase tracking-tighter border`}>
              <span className={`w-1.5 h-1.5 rounded-full ${configError ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`}></span>
              {configError ? 'Modo Local (Sin DB)' : 'DB Conectada'}
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
                  <i className={`fa-solid ${configError ? 'fa-triangle-exclamation text-amber-400' : 'fa-database'}`}></i>
               </div>
            </div>
          </div>
        </div>

        {configError && (
          <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-2xl flex items-center gap-3 text-sm font-medium animate-in slide-in-from-top-2 duration-500">
            <i className="fa-solid fa-circle-info text-amber-500 text-lg"></i>
            Las credenciales de Supabase no están configuradas. Los datos solo se guardarán temporalmente en esta sesión.
          </div>
        )}

        <div className="bg-transparent">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
