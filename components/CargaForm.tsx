
import React, { useState } from 'react';
import { FormData } from '../types';
import { analyzeFinancialData } from '../services/geminiService';

interface CargaFormProps {
  onSave: (data: FormData) => void;
}

const CargaForm: React.FC<CargaFormProps> = ({ onSave }) => {
  const [formData, setFormData] = useState<FormData>({
    id: '',
    ci: '',
    cliente: '',
    producto: '',
    analista: '',
    equipo: '',
    agente: '',
    fechaAprobacion: '',
    impugnaciones: '',
    seguimiento: '',
    inversion: 0,
    solicitud: 0,
    totalDevolver: 0,
    pagare: 0,
    utilidadAgente: 0,
    utilidadGfv: 0,
    inversor: '',
    utilidadInversor: 0,
    destino: '',
    cantidadBcp: 0,
    cantidadInformconf: 0,
    sucursal: 'MATRIZ',
    desembolsador: '',
    experienciaSuc: '',
    masOMenos: 'IGUAL',
    motivo: '',
    montoDado: 0,
    posibleDesembolso: '',
    rebotes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const requiredFields = ['destino', 'ci', 'cliente', 'producto', 'analista', 'agente'];
    const missing = requiredFields.filter(f => !formData[f as keyof FormData]);
    
    if (missing.length > 0) {
      setError(`Campos requeridos pendientes: ${missing.join(', ').toUpperCase()}`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSave(formData);
      alert("✅ Operación procesada y guardada correctamente.");
    } catch (err: any) {
      setError(`Error crítico: ${err.message || "Fallo en la conexión con el servidor"}`);
    } finally {
      setLoading(false);
    }
  };

  const labelClass = "block text-[11px] font-black uppercase tracking-tighter text-slate-500 mb-1.5 ml-1 italic";
  const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 outline-none transition-all shadow-sm placeholder:text-slate-300";
  const financialInputClass = "w-full bg-emerald-50/30 border border-emerald-100 rounded-xl px-4 py-2.5 text-sm font-black text-emerald-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 outline-none transition-all shadow-sm";
  const currencyBadge = <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 italic pointer-events-none">GS.</span>;

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="max-w-6xl mx-auto">
        
        {/* Superior: Título y Selector de Destino */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div className="space-y-1">
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
              Nueva <span className="text-emerald-600">Operación</span>
            </h1>
            <div className="flex items-center gap-2">
              <span className="w-8 h-1 bg-slate-900 rounded-full"></span>
              <p className="text-slate-500 font-bold italic text-sm">Registro Centralizado de Inversiones GFV</p>
            </div>
          </div>

          <div className="bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="flex items-center gap-3 px-4">
              <i className="fa-solid fa-layer-group text-slate-400"></i>
              <select 
                name="destino" 
                required
                value={formData.destino} 
                onChange={handleInputChange} 
                className="bg-transparent py-2.5 pr-8 text-sm font-black text-slate-900 focus:outline-none cursor-pointer uppercase italic"
              >
                <option value="">Seleccionar Segmento...</option>
                <option value="COMERCIAL 1">COMERCIAL 1</option>
                <option value="COMERCIAL 2">COMERCIAL 2</option>
                <option value="INTEGRA CAPITAL">INTEGRA CAPITAL</option>
                <option value="INTERLUDIO">INTERLUDIO</option>
                <option value="CAPTACIÓN">CAPTACIÓN</option>
              </select>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COLUMNA 1: Datos de Identificación (6 col) */}
          <div className="lg:col-span-7 bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
                <i className="fa-solid fa-id-card"></i>
              </div>
              <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-tighter">Ficha del Cliente</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="group">
                <label className={labelClass}>Documento CI</label>
                <input type="text" name="ci" value={formData.ci} onChange={handleInputChange} className={inputClass} placeholder="Ej: 1.234.567" />
              </div>
              <div className="group">
                <label className={labelClass}>Nombre del Cliente</label>
                <input type="text" name="cliente" value={formData.cliente} onChange={handleInputChange} className={inputClass} placeholder="Nombre y Apellido" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Producto Solicitado</label>
                <input type="text" name="producto" value={formData.producto} onChange={handleInputChange} className={inputClass} placeholder="Ej: Crédito Puente" />
              </div>
              <div>
                <label className={labelClass}>Analista Asignado</label>
                <input type="text" name="analista" value={formData.analista} onChange={handleInputChange} className={inputClass} placeholder="Responsable de Análisis" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Equipo / Departamento</label>
                <input type="text" name="equipo" value={formData.equipo} onChange={handleInputChange} className={inputClass} placeholder="Ej: Comercial A" />
              </div>
              <div>
                <label className={labelClass}>Agente de Cierre</label>
                <input type="text" name="agente" value={formData.agente} onChange={handleInputChange} className={inputClass} placeholder="Agente Comercial" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Fecha de Aprobación</label>
                <input type="date" name="fechaAprobacion" value={formData.fechaAprobacion} onChange={handleInputChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Impugnaciones / Notas</label>
                <input type="text" name="impugnaciones" value={formData.impugnaciones} onChange={handleInputChange} className={inputClass} placeholder="0" />
              </div>
            </div>

            <div>
              <label className={labelClass}>Seguimiento Detallado</label>
              <textarea 
                name="seguimiento" 
                value={formData.seguimiento} 
                onChange={handleInputChange} 
                rows={3}
                className={`${inputClass} resize-none py-4`} 
                placeholder="Escriba aquí cualquier observación o seguimiento relevante..."
              ></textarea>
            </div>
          </div>

          {/* COLUMNA 2: Datos Financieros (5 col) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-emerald-600 p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-emerald-200/50 border border-emerald-500 relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl group-hover:bg-emerald-400/30 transition-all duration-700"></div>
              
              <div className="flex items-center gap-3 mb-8 relative">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/30 shadow-lg">
                  <i className="fa-solid fa-coins"></i>
                </div>
                <h3 className="text-lg font-black text-white uppercase italic tracking-tighter">Cifras de Operación</h3>
              </div>

              <div className="space-y-4 relative">
                <div>
                  <label className={`${labelClass} text-emerald-100`}>Monto de Inversión</label>
                  <div className="relative">
                    <input type="number" name="inversion" value={formData.inversion} onChange={handleInputChange} className={`${financialInputClass} bg-white/10 border-white/20 text-white placeholder:text-white/40`} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-emerald-200 italic pointer-events-none">GS.</span>
                  </div>
                </div>

                <div>
                  <label className={`${labelClass} text-emerald-100`}>Monto de Solicitud</label>
                  <div className="relative">
                    <input type="number" name="solicitud" value={formData.solicitud} onChange={handleInputChange} className={`${financialInputClass} bg-white/10 border-white/20 text-white placeholder:text-white/40`} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-emerald-200 italic pointer-events-none">GS.</span>
                  </div>
                </div>

                <div>
                  <label className={`${labelClass} text-emerald-100`}>Total a Devolver</label>
                  <div className="relative">
                    <input type="number" name="totalDevolver" value={formData.totalDevolver} onChange={handleInputChange} className={`${financialInputClass} bg-white/10 border-white/20 text-white placeholder:text-white/40`} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-emerald-200 italic pointer-events-none">GS.</span>
                  </div>
                </div>

                <div>
                  <label className={`${labelClass} text-emerald-100`}>Monto Pagaré</label>
                  <div className="relative">
                    <input type="number" name="pagare" value={formData.pagare} onChange={handleInputChange} className={`${financialInputClass} bg-white/10 border-white/20 text-white placeholder:text-white/40`} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-emerald-200 italic pointer-events-none">GS.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Utilidades e Inversor */}
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <i className="fa-solid fa-chart-pie"></i>
                </div>
                <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-tighter">Distribución de Utilidad</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Utilidad Agente</label>
                  <div className="relative">
                    <input type="number" name="utilidadAgente" value={formData.utilidadAgente} onChange={handleInputChange} className={inputClass} />
                    {currencyBadge}
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Utilidad GFV</label>
                  <div className="relative">
                    <input type="number" name="utilidadGfv" value={formData.utilidadGfv} onChange={handleInputChange} className={inputClass} />
                    {currencyBadge}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-4 items-end">
                  <div>
                    <label className={labelClass}>Ident. Inversor</label>
                    <input type="text" name="inversor" value={formData.inversor} onChange={handleInputChange} className={inputClass} placeholder="Ej: SIX" />
                  </div>
                  <div>
                    <label className={labelClass}>Utilidad Inversor</label>
                    <div className="relative">
                      <input type="number" name="utilidadInversor" value={formData.utilidadInversor} onChange={handleInputChange} className={inputClass} />
                      {currencyBadge}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Acciones Finales */}
        <div className="mt-12 flex flex-col md:flex-row justify-center items-center gap-6">
          <button 
            type="button" 
            onClick={() => window.location.reload()}
            className="w-full md:w-auto px-12 py-4 bg-slate-200 text-slate-600 font-black italic uppercase text-[10px] tracking-widest rounded-full hover:bg-slate-300 transition-all active:scale-95"
          >
            Limpiar Datos
          </button>
          
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="w-full md:w-auto px-20 py-5 bg-[#0f172a] text-white font-black italic uppercase text-[11px] tracking-[0.25em] rounded-full hover:bg-black transition-all shadow-2xl shadow-slate-900/40 flex items-center justify-center gap-6 active:scale-95 disabled:opacity-50 group border border-white/5"
          >
            {loading ? (
              <i className="fa-solid fa-spinner fa-spin"></i>
            ) : (
              <>
                <span>cargar cliente</span>
                <i className="fa-solid fa-arrow-right-long group-hover:translate-x-1.5 transition-transform text-xs"></i>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-8 bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-4 animate-bounce">
            <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center text-white shrink-0">
              <i className="fa-solid fa-circle-exclamation"></i>
            </div>
            <p className="text-red-700 font-bold text-sm">{error}</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default CargaForm;
