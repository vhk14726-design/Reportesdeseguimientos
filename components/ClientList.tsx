
import React, { useState } from 'react';
import { FormData } from '../types';

interface ClientListProps {
  title: string;
  clients: FormData[];
}

const ClientList: React.FC<ClientListProps> = ({ title, clients }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<FormData | null>(null);

  const filteredClients = clients.filter(c => 
    c.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.ci.includes(searchTerm) ||
    c.analista.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: 'Cartera Total', count: clients.length, icon: 'fa-users', color: 'bg-slate-900' },
    { label: 'En BCP', count: clients.reduce((acc, c) => acc + (c.cantidadBcp > 0 ? 1 : 0), 0), icon: 'fa-building-columns', color: 'bg-emerald-600' },
    { label: 'Sucursales', count: new Set(clients.map(c => c.sucursal)).size, icon: 'fa-map-location-dot', color: 'bg-indigo-600' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">{title}</h2>
          <p className="text-slate-400 text-sm font-medium">Gestión de seguimientos comerciales y financieros.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors"></i>
            <input 
              type="text" 
              placeholder="Buscar cliente o CI..."
              className="pl-12 pr-6 py-3 border border-slate-200 rounded-2xl bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none w-80 text-sm transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="h-11 px-6 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-slate-900/10 active:scale-95">
            <i className="fa-solid fa-file-excel"></i>
            Exportar
          </button>
        </div>
      </header>

      {/* Stats recreating the image icons style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 ${s.color} rounded-2xl flex items-center justify-center text-white text-xl shadow-lg`}>
              <i className={`fa-solid ${s.icon}`}></i>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
              <p className="text-3xl font-black text-slate-900">{s.count}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Robust Table */}
      <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Analista</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Agente</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cliente</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">CI</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">BCP</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Infconf</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sucursal</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Inversión</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">GFV</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredClients.map((client, idx) => (
                <tr key={idx} className="hover:bg-emerald-50/30 transition-colors group">
                  <td className="px-6 py-4 text-xs font-bold text-slate-500">{client.analista}</td>
                  <td className="px-6 py-4 text-xs text-slate-600">{client.agente}</td>
                  <td className="px-6 py-4 text-sm font-black text-slate-900">{client.cliente}</td>
                  <td className="px-6 py-4 text-xs font-mono text-slate-400">{client.ci}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black">{client.cantidadBcp}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black">{client.cantidadInformconf}</span>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-500">{client.sucursal}</td>
                  <td className="px-6 py-4 text-right font-black text-slate-700 text-xs">
                    {client.inversion > 0 ? `Gs. ${client.inversion.toLocaleString()}` : '-'}
                  </td>
                  <td className="px-6 py-4 text-right font-black text-emerald-600 text-xs">
                    {client.utilidadGfv > 0 ? `Gs. ${client.utilidadGfv.toLocaleString()}` : '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedClient(client)}
                      className="p-2 bg-slate-100 text-slate-500 rounded-xl hover:bg-emerald-600 hover:text-white transition-all active:scale-90"
                    >
                      <i className="fa-solid fa-eye text-sm"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Client Detail Modal - Shows ALL data from Carga form */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <header className="p-8 bg-slate-900 text-white flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Detalle de Operación</p>
                <h3 className="text-3xl font-black tracking-tighter uppercase">{selectedClient.cliente}</h3>
                <div className="flex gap-4 mt-2">
                   <span className="text-xs font-bold bg-white/10 px-3 py-1 rounded-full border border-white/20">CI: {selectedClient.ci}</span>
                   <span className="text-xs font-bold bg-white/10 px-3 py-1 rounded-full border border-white/20">Sucursal: {selectedClient.sucursal}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedClient(null)}
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </header>
            
            <div className="flex-1 overflow-y-auto p-10 grid grid-cols-2 gap-12">
               <div className="space-y-6">
                 <h4 className="text-sm font-black text-slate-900 border-l-4 border-emerald-500 pl-3 uppercase">Información Comercial</h4>
                 <dl className="grid grid-cols-1 gap-y-3">
                   {[
                     { l: 'Producto', v: selectedClient.producto },
                     { l: 'Analista', v: selectedClient.analista },
                     { l: 'Equipo', v: selectedClient.equipo },
                     { l: 'Agente', v: selectedClient.agente },
                     { l: 'Aprobación', v: selectedClient.fechaAprobacion },
                     { l: 'Impugnaciones', v: selectedClient.impugnaciones },
                   ].map((item, i) => (
                     <div key={i} className="flex justify-between border-b border-slate-100 pb-2">
                       <dt className="text-xs font-bold text-slate-400 italic">{item.l}</dt>
                       <dd className="text-xs font-black text-slate-900">{item.v || '-'}</dd>
                     </div>
                   ))}
                   <div className="pt-2">
                     <dt className="text-xs font-bold text-slate-400 italic mb-1">Seguimiento</dt>
                     <dd className="text-xs font-medium text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        {selectedClient.seguimiento || 'Sin observaciones registradas.'}
                     </dd>
                   </div>
                 </dl>
               </div>

               <div className="space-y-6">
                 <h4 className="text-sm font-black text-slate-900 border-l-4 border-emerald-500 pl-3 uppercase">Análisis Financiero</h4>
                 <dl className="grid grid-cols-1 gap-y-3">
                   {[
                     { l: 'Inversión', v: selectedClient.inversion, color: 'text-slate-900' },
                     { l: 'Solicitud', v: selectedClient.solicitud, color: 'text-slate-900' },
                     { l: 'Total a Devolver', v: selectedClient.totalDevolver, color: 'text-slate-900' },
                     { l: 'Pagaré', v: selectedClient.pagare, color: 'text-blue-600' },
                     { l: 'Utilidad Agente', v: selectedClient.utilidadAgente, color: 'text-slate-900' },
                     { l: 'Utilidad GFV', v: selectedClient.utilidadGfv, color: 'text-emerald-600 font-black' },
                     { l: 'Inversor', v: selectedClient.inversor, color: 'text-slate-900' },
                     { l: 'Utilidad Inversor', v: selectedClient.utilidadInversor, color: 'text-slate-900' },
                   ].map((item, i) => (
                     <div key={i} className="flex justify-between border-b border-slate-100 pb-2">
                       <dt className="text-xs font-bold text-slate-400 italic">{item.l}</dt>
                       <dd className={`text-sm font-bold ${item.color}`}>
                         {typeof item.v === 'number' ? `Gs. ${item.v.toLocaleString()}` : item.v || '-'}
                       </dd>
                     </div>
                   ))}
                 </dl>
               </div>
            </div>
            
            <footer className="p-8 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
              <button className="px-6 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-100 transition-colors">Editar Ficha</button>
              <button onClick={() => setSelectedClient(null)} className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-colors">Cerrar</button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientList;
