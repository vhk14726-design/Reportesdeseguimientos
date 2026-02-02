
import React from 'react';
import { SidebarSegment } from '../types';

interface SidebarProps {
  activeSegment: SidebarSegment;
  onSegmentChange: (segment: SidebarSegment) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSegment, onSegmentChange }) => {
  const segments: { name: SidebarSegment; icon: string }[] = [
    { name: 'INICIO', icon: 'fa-house' },
    { name: 'CARGA', icon: 'fa-file-invoice-dollar' },
    { name: 'COMERCIAL 1', icon: 'fa-chart-line' },
    { name: 'COMERCIAL 2', icon: 'fa-chart-area' },
    { name: 'INTEGRA CAPITAL', icon: 'fa-building-columns' },
    { name: 'CAPTACIÓN', icon: 'fa-handshake' },
    { name: 'INTERLUDIO', icon: 'fa-clock' },
    { name: 'DASHBOARD GENERAL', icon: 'fa-gauge-high' },
  ];

  return (
    <aside className="w-72 bg-slate-900 h-screen sticky top-0 flex flex-col shadow-2xl overflow-y-auto">
      <div className="p-8 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <h1 className="text-white font-black text-3xl tracking-tighter uppercase">GFV</h1>
        </div>
        <p className="text-slate-500 text-xs mt-2 uppercase tracking-widest font-semibold">Sistema de Gestión</p>
      </div>

      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-1">
          {segments.map((segment) => (
            <li key={segment.name}>
              <button
                onClick={() => onSegmentChange(segment.name)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  activeSegment === segment.name
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <i className={`fa-solid ${segment.icon} text-lg w-6 ${
                  activeSegment === segment.name ? 'text-emerald-500' : 'text-slate-500 group-hover:text-slate-300'
                }`}></i>
                <span className="font-medium text-sm">{segment.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-6 bg-slate-800/50">
        <div className="flex items-center gap-3">
          <img src="https://picsum.photos/40/40?random=1" alt="Avatar" className="w-10 h-10 rounded-full border-2 border-slate-700" />
          <div>
            <p className="text-white text-sm font-semibold">Admin Usuario</p>
            <p className="text-slate-500 text-xs">Administrador</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
