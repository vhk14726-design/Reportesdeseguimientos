
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import CargaForm from './components/CargaForm';
import Dashboard from './components/Dashboard';
import { SidebarSegment } from './types';

const App: React.FC = () => {
  const [activeSegment, setActiveSegment] = useState<SidebarSegment>('CARGA');

  const renderContent = () => {
    switch (activeSegment) {
      case 'CARGA':
        return <CargaForm />;
      case 'INICIO':
      case 'DASHBOARD GENERAL':
      case 'COMERCIAL 1':
      case 'COMERCIAL 2':
      case 'INTEGRA CAPITAL':
      case 'CAPTACIÓN':
      case 'INTERLUDIO':
        return <Dashboard title={activeSegment} />;
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
    <div className="flex min-h-screen bg-slate-50 font-inter">
      <Sidebar 
        activeSegment={activeSegment} 
        onSegmentChange={setActiveSegment} 
      />
      
      <main className="flex-1 overflow-x-hidden p-10 max-w-7xl mx-auto">
        {/* Top Header/Alert Area */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <span className="font-bold">GFV</span>
            <i className="fa-solid fa-chevron-right text-[10px]"></i>
            <span className="text-slate-900 font-semibold">{activeSegment}</span>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative text-slate-500 hover:text-slate-900 transition-colors">
              <i className="fa-solid fa-bell text-lg"></i>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="text-slate-500 hover:text-slate-900 transition-colors">
              <i className="fa-solid fa-magnifying-glass text-lg"></i>
            </button>
          </div>
        </div>

        <div className="bg-transparent">
          {renderContent()}
        </div>

        {/* Floating AI Helper Toggle */}
        <div className="fixed bottom-8 right-8">
          <button className="w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group">
            <i className="fa-solid fa-comment-dots text-xl group-hover:hidden"></i>
            <i className="fa-solid fa-robot text-xl hidden group-hover:block animate-bounce"></i>
          </button>
        </div>
      </main>
    </div>
  );
};

export default App;
