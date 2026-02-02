
import React, { useState } from 'react';
import { FormData } from '../types';

interface ClientListProps {
  title: string;
  clients: FormData[];
  onUpdate: (updatedClient: FormData) => void;
}

const ClientList: React.FC<ClientListProps> = ({ title, clients, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<FormData | null>(null);

  const filteredClients = clients.filter(c => 
    c.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.ci.includes(searchTerm) ||
    c.analista.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!selectedClient) return;
    const { name, value, type } = e.target;
    const updated = {
      ...selectedClient,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    };
    setSelectedClient(updated);
    onUpdate(updated); // Save changes instantly to the global state
  };

  const stats = [
    { label: 'Cartera Total', count: clients.length, icon: 'fa-users', color: 'bg-slate-900' },
    { label: 'En BCP', count: clients.reduce((acc, c) => acc + (c.cantidadBcp > 0 ? 1 : 0), 0), icon: 'fa-building-columns', color: 'bg-emerald-600' },
    { label: 'Sucursales', count: new Set(clients.map(c => c.sucursal)).size, icon: 'fa-map-location-dot', color: 'bg-indigo-600' },
  ];

  const editInputClass = "w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 transition-all outline-none";

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
        </div>
      </header>

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

      <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Analista</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cliente</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">BCP</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Infconf</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sucursal</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Desembolsador</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Monto Dado</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredClients.map((client, idx) => (
                <tr key={idx} className="hover:bg-emerald-50/30 transition-colors group">
                  <td className="px-6 py-4 text-xs font-bold text-slate-500">{client.analista}</td>
                  <td className="px-6 py-4 text-sm font-black text-slate-900">{client.cliente}</td>
                  <td className="px-6 py-4 text-center text-[10px] font-black text-slate-600">{client.cantidadBcp}</td>
                  <td className="px-6 py-4 text-center text-[10px] font-black text-slate-600">{client.cantidadInformconf}</td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-500">{client.sucursal}</td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-500">{client.desembolsador || '-'}</td>
                  <td className="px-6 py-4 text-xs font-black text-emerald-600">Gs. {(client.montoDado || 0).toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedClient(client)}
                      className="p-2 bg-slate-900 text-white rounded-xl hover:bg-emerald-600 transition-all active:scale-90 flex items-center gap-2 mx-auto"
                    >
                      <i className="fa-solid fa-pen-to-square text-sm"></i>
                      <span className="text-[10px] uppercase font-black px-1">Gestionar</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
            <header className="p-8 bg-slate-900 text-white flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1 italic">Gestión de Operación en Tiempo Real</p>
                <h3 className="text-3xl font-black tracking-tighter uppercase">{selectedClient.cliente}</h3>
                <p className="text-xs font-bold text-slate-400 mt-1 uppercase">Destino: {selectedClient.destino} | CI: {selectedClient.ci}</p>
              </div>
              <button 
                onClick={() => setSelectedClient(null)}
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </header>
            
            <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-6">
                 <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                   <h4 className="text-sm font-black text-slate-900 border-l-4 border-emerald-500 pl-3 uppercase mb-4 italic">Datos Tracking (Editables)</h4>
                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase italic">Cant. BCP</label>
                       <input type="number" name="cantidadBcp" value={selectedClient.cantidadBcp} onChange={handleFieldChange} className={editInputClass} />
                     </div>
                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase italic">Cant. Informconf</label>
                       <input type="number" name="cantidadInformconf" value={selectedClient.cantidadInformconf} onChange={handleFieldChange} className={editInputClass} />
                     </div>
                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase italic">Sucursal</label>
                       <input type="text" name="sucursal" value={selectedClient.sucursal} onChange={handleFieldChange} className={editInputClass} />
                     </div>
                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase italic">Desembolsador</label>
                       <input type="text" name="desembolsador" value={selectedClient.desembolsador} onChange={handleFieldChange} className={editInputClass} />
                     </div>
                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase italic">Experiencia Suc</label>
                       <input type="text" name="experienciaSuc" value={selectedClient.experienciaSuc} onChange={handleFieldChange} className={editInputClass} />
                     </div>
                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase italic">Impugnaciones</label>
                       <input type="text" name="impugnaciones" value={selectedClient.impugnaciones} onChange={handleFieldChange} className={editInputClass} />
                     </div>
                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase italic">¿Se dio mas o menos?</label>
                       <select name="masOMenos" value={selectedClient.masOMenos} onChange={handleFieldChange} className={editInputClass}>
                         <option value="MAS">MÁS</option>
                         <option value="MENOS">MENOS</option>
                         <option value="IGUAL">IGUAL</option>
                       </select>
                     </div>
                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase italic">Posible Desemb.</label>
                       <input type="text" name="posibleDesembolso" value={selectedClient.posibleDesembolso} onChange={handleFieldChange} className={editInputClass} />
                     </div>
                   </div>
                 </div>

                 <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <label className="text-[10px] font-black text-slate-400 uppercase italic">Rebotes</label>
                    <input type="text" name="rebotes" value={selectedClient.rebotes} onChange={handleFieldChange} className={editInputClass} />
                    <div className="mt-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase italic">Seguimiento / Observación</label>
                      <textarea name="seguimiento" rows={3} value={selectedClient.seguimiento} onChange={handleFieldChange} className={`${editInputClass} resize-none`}></textarea>
                    </div>
                 </div>
               </div>

               <div className="space-y-6">
                 <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100">
                   <h4 className="text-sm font-black text-emerald-900 border-l-4 border-emerald-500 pl-3 uppercase mb-4 italic">Resultados Finales</h4>
                   <div className="space-y-4">
                     <div>
                       <label className="text-[10px] font-black text-emerald-600 uppercase italic">Motivo de Resolución</label>
                       <input type="text" name="motivo" value={selectedClient.motivo} onChange={handleFieldChange} className={`${editInputClass} border-emerald-200`} />
                     </div>
                     <div>
                       <label className="text-[10px] font-black text-emerald-600 uppercase italic">Monto Final Otorgado (Gs.)</label>
                       <input type="number" name="montoDado" value={selectedClient.montoDado} onChange={handleFieldChange} className={`${editInputClass} border-emerald-200 text-lg font-black text-emerald-700`} />
                     </div>
                   </div>
                 </div>

                 <div className="bg-white p-6 rounded-3xl border border-slate-100 grid grid-cols-2 gap-4">
                    {[
                      { l: 'Inversión', v: selectedClient.inversion },
                      { l: 'Solicitud', v: selectedClient.solicitud },
                      { l: 'Utilidad GFV', v: selectedClient.utilidadGfv },
                      { l: 'Pagaré', v: selectedClient.pagare },
                    ].map((item, i) => (
                      <div key={i} className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 italic uppercase">{item.l}</span>
                        <span className="text-xs font-black text-slate-900">Gs. {item.v.toLocaleString()}</span>
                      </div>
                    ))}
                 </div>
               </div>
            </div>
            
            <footer className="p-8 bg-slate-900 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedClient(null)} 
                className="px-10 py-3 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg active:scale-95"
              >
                Cerrar y Finalizar Gestión
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientList;
