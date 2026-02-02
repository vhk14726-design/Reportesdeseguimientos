
import React, { useState } from 'react';
import { FormData } from '../types';
import { analyzeFinancialData } from '../services/geminiService';

interface CargaFormProps {
  onSave: (data: FormData) => void;
}

const CargaForm: React.FC<CargaFormProps> = ({ onSave }) => {
  const [formData, setFormData] = useState<FormData>({
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
  });

  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
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
    
    // Strict validation for "obligatoriamente todos los datos"
    const requiredFields = [
      'destino', 'ci', 'cliente', 'producto', 'analista', 
      'equipo', 'agente', 'fechaAprobacion', 'sucursal'
    ];
    
    const missing = requiredFields.filter(f => !formData[f as keyof FormData]);
    
    if (missing.length > 0) {
      setError(`Faltan campos obligatorios: ${missing.join(', ').toUpperCase()}`);
      return;
    }

    if (formData.inversion <= 0 || formData.solicitud <= 0) {
      setError("Los valores financieros (Inversión/Solicitud) deben ser mayores a cero.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Gemini analysis for better decision making
      const analysis = await analyzeFinancialData(formData);
      setAiAnalysis(analysis);
      
      // Save to global state (this will automatically route the user to the destination in App.tsx)
      onSave(formData);
    } catch (err) {
      console.error(err);
      setError("Error al procesar la operación. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const inputContainerClass = "flex items-center gap-4 group";
  const labelClass = "w-40 text-sm font-bold text-slate-700 italic text-right shrink-0";
  const inputClass = "flex-1 bg-white border border-slate-200 rounded px-3 py-1.5 text-sm text-slate-900 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm group-hover:border-slate-300";

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-20">
      <header className="flex justify-between items-center border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase flex items-center gap-3">
            <i className="fa-solid fa-file-circle-plus text-emerald-600"></i>
            Panel de Carga <span className="text-emerald-500 font-light italic text-xl lowercase tracking-normal">nueva operación</span>
          </h2>
          {error && (
            <div className="mt-2 text-red-500 text-xs font-bold bg-red-50 px-3 py-1 rounded-lg border border-red-100 flex items-center gap-2">
              <i className="fa-solid fa-triangle-exclamation"></i>
              {error}
            </div>
          )}
        </div>
        <div className="flex gap-4">
          <button 
            type="button"
            onClick={() => setFormData({
              ci: '', cliente: '', producto: '', analista: '', equipo: '', agente: '',
              fechaAprobacion: '', impugnaciones: '', seguimiento: '', inversion: 0,
              solicitud: 0, totalDevolver: 0, pagare: 0, utilidadAgente: 0,
              utilidadGfv: 0, inversor: '', utilidadInversor: 0, destino: '',
              cantidadBcp: 0, cantidadInformconf: 0, sucursal: 'MATRIZ',
            })}
            className="px-6 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors font-bold text-sm uppercase tracking-wider"
          >
            Limpiar
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all font-bold text-sm uppercase tracking-wider shadow-lg shadow-emerald-600/20 flex items-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-cloud-arrow-up"></i>}
            Cargar al Sistema
          </button>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="bg-slate-100/50 p-10 rounded-3xl border border-slate-200 shadow-inner grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12">
        {/* Left Column: Client Info */}
        <div className="space-y-4">
          <div className="bg-white/80 p-6 rounded-2xl border border-emerald-100 mb-8 shadow-sm">
             <div className={inputContainerClass}>
                <label className="w-40 text-sm font-black text-emerald-700 uppercase tracking-tighter text-right italic">Destino Final</label>
                <select 
                  name="destino" 
                  required
                  value={formData.destino} 
                  onChange={handleInputChange} 
                  className="flex-1 bg-white border-2 border-emerald-200 rounded-xl px-4 py-2 text-sm font-bold text-emerald-900 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
                >
                  <option value="">Seleccione Segmento...</option>
                  <option value="COMERCIAL 1">COMERCIAL 1</option>
                  <option value="COMERCIAL 2">COMERCIAL 2</option>
                  <option value="INTEGRA CAPITAL">INTEGRA CAPITAL</option>
                  <option value="INTERLUDIO">INTERLUDIO</option>
                  <option value="CAPTACIÓN">CAPTACIÓN</option>
                </select>
             </div>
             <p className="text-[10px] text-emerald-600 font-bold mt-2 text-center uppercase tracking-widest italic">La operación se guardará automáticamente en este destino</p>
          </div>

          <div className={inputContainerClass}>
            <label className={labelClass}>CI *</label>
            <input type="text" name="ci" required value={formData.ci} onChange={handleInputChange} className={inputClass} placeholder="1.234.567" />
          </div>
          <div className={inputContainerClass}>
            <label className={labelClass}>¿Cliente? *</label>
            <input type="text" name="cliente" required value={formData.cliente} onChange={handleInputChange} className={inputClass} placeholder="Pedro Gonzalez" />
          </div>
          <div className={inputContainerClass}>
            <label className={labelClass}>¿Producto? *</label>
            <input type="text" name="producto" required value={formData.producto} onChange={handleInputChange} className={inputClass} placeholder="Credito Puente" />
          </div>
          <div className={inputContainerClass}>
            <label className={labelClass}>¿Analista? *</label>
            <input type="text" name="analista" required value={formData.analista} onChange={handleInputChange} className={inputClass} placeholder="Carlos Garay" />
          </div>
          <div className={inputContainerClass}>
            <label className={labelClass}>¿Equipo? *</label>
            <input type="text" name="equipo" required value={formData.equipo} onChange={handleInputChange} className={inputClass} placeholder="Comercial 1" />
          </div>
          <div className={inputContainerClass}>
            <label className={labelClass}>¿Agente? *</label>
            <input type="text" name="agente" required value={formData.agente} onChange={handleInputChange} className={inputClass} placeholder="Federico Espadin" />
          </div>
          <div className={inputContainerClass}>
            <label className={labelClass}>Fecha de aprobación *</label>
            <input type="date" name="fechaAprobacion" required value={formData.fechaAprobacion} onChange={handleInputChange} className={inputClass} />
          </div>
          <div className={inputContainerClass}>
            <label className={labelClass}>¿Impugnaciones?</label>
            <input type="text" name="impugnaciones" value={formData.impugnaciones} onChange={handleInputChange} className={inputClass} placeholder="2" />
          </div>
          <div className={inputContainerClass}>
            <label className={labelClass}>Seguimiento</label>
            <textarea name="seguimiento" rows={2} value={formData.seguimiento} onChange={handleInputChange} className={`${inputClass} resize-none`} placeholder="Observación"></textarea>
          </div>

          <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-4">
             <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 italic">Cant. BCP</label>
                <input type="number" name="cantidadBcp" value={formData.cantidadBcp} onChange={handleInputChange} className={inputClass} />
             </div>
             <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 italic">Cant. Informconf</label>
                <input type="number" name="cantidadInformconf" value={formData.cantidadInformconf} onChange={handleInputChange} className={inputClass} />
             </div>
          </div>
        </div>

        {/* Right Column: Financial Details */}
        <div className="space-y-4">
          <div className={inputContainerClass}>
            <label className={labelClass}>Inversión *</label>
            <input type="number" name="inversion" required value={formData.inversion} onChange={handleInputChange} className={inputClass} />
          </div>
          <div className={inputContainerClass}>
            <label className={labelClass}>Solicitud *</label>
            <input type="number" name="solicitud" required value={formData.solicitud} onChange={handleInputChange} className={inputClass} />
          </div>
          <div className={inputContainerClass}>
            <label className={labelClass}>Total a devolver</label>
            <input type="number" name="totalDevolver" value={formData.totalDevolver} onChange={handleInputChange} className={inputClass} />
          </div>
          <div className="h-4"></div>
          <div className={inputContainerClass}>
            <label className={labelClass}>Pagaré</label>
            <input type="number" name="pagare" value={formData.pagare} onChange={handleInputChange} className={inputClass} />
          </div>
          <div className="h-4"></div>
          <div className={inputContainerClass}>
            <label className={labelClass}>Utilidad [AGENTE]</label>
            <input type="number" name="utilidadAgente" value={formData.utilidadAgente} onChange={handleInputChange} className={inputClass} />
          </div>
          <div className={inputContainerClass}>
            <label className={labelClass}>Utilidad [GFV]</label>
            <input type="number" name="utilidadGfv" value={formData.utilidadGfv} onChange={handleInputChange} className={inputClass} />
          </div>
          <div className={inputContainerClass}>
            <label className={labelClass}>¿Inversor?</label>
            <input type="text" name="inversor" value={formData.inversor} onChange={handleInputChange} className={inputClass} />
          </div>
          <div className={inputContainerClass}>
            <label className={labelClass}>Utilidad [INVERSOR]</label>
            <input type="number" name="utilidadInversor" value={formData.utilidadInversor} onChange={handleInputChange} className={inputClass} />
          </div>
          <div className={inputContainerClass}>
            <label className={labelClass}>Sucursal *</label>
            <input type="text" name="sucursal" required value={formData.sucursal} onChange={handleInputChange} className={inputClass} placeholder="MATRIZ" />
          </div>
          <p className="text-[10px] text-slate-400 font-bold mt-4 uppercase tracking-widest text-right">* CAMPOS OBLIGATORIOS PARA EL REGISTRO</p>
        </div>
      </form>

      {aiAnalysis && (
        <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-4 duration-500">
           <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-robot text-white"></i>
              </div>
              <h3 className="text-lg font-bold">Operación Cargada con éxito - Análisis Gemini</h3>
           </div>
           <p className="text-slate-400 text-sm leading-relaxed mb-6">{aiAnalysis.resumen}</p>
           <div className="flex gap-10">
              <div>
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Puntuación</p>
                <p className="text-3xl font-black">{aiAnalysis.scoreRiesgo}/10</p>
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2">Recomendación Principal</p>
                <p className="text-sm font-medium">{aiAnalysis.recomendaciones[0]}</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default CargaForm;
