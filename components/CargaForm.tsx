
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
    
    const requiredFields = [
      'destino', 'ci', 'cliente', 'producto', 'analista', 
      'equipo', 'agente', 'fechaAprobacion', 'sucursal', 
      'desembolsador', 'motivo'
    ];
    
    const missing = requiredFields.filter(f => !formData[f as keyof FormData]);
    
    if (missing.length > 0) {
      setError(`Faltan campos obligatorios: ${missing.join(', ').toUpperCase()}`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const analysis = await analyzeFinancialData(formData);
      setAiAnalysis(analysis);
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
            Panel de Carga <span className="text-emerald-500 font-light italic text-xl lowercase tracking-normal">obligatorio todos los datos</span>
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
            onClick={() => window.location.reload()}
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
          </div>

          <div className={inputContainerClass}>
            <label className={labelClass}>CI *</label>
            <input type="text" name="ci" required value={formData.ci} onChange={handleInputChange} className={inputClass} placeholder="1.234.567" />
          </div>
          <div className={inputContainerClass}>
            <label className={labelClass}>¿Cliente? *</label>
            <input type="text" name="cliente" required value={formData.cliente} onChange={handleInputChange} className={inputClass} />
          </div>
          <div className={inputContainerClass}>
            <label className={labelClass}>¿Producto? *</label>
            <input type="text" name="producto" required value={formData.producto} onChange={handleInputChange} className={inputClass} />
          </div>
          <div className={inputContainerClass}>
            <label className={labelClass}>¿Analista? *</label>
            <input type="text" name="analista" required value={formData.analista} onChange={handleInputChange} className={inputClass} />
          </div>
          <div className={inputContainerClass}>
            <label className={labelClass}>¿Equipo? *</label>
            <input type="text" name="equipo" required value={formData.equipo} onChange={handleInputChange} className={inputClass} />
          </div>
          <div className={inputContainerClass}>
            <label className={labelClass}>¿Agente? *</label>
            <input type="text" name="agente" required value={formData.agente} onChange={handleInputChange} className={inputClass} />
          </div>
          <div className={inputContainerClass}>
            <label className={labelClass}>Sucursal *</label>
            <input type="text" name="sucursal" required value={formData.sucursal} onChange={handleInputChange} className={inputClass} />
          </div>
          <div className={inputContainerClass}>
            <label className={labelClass}>Fecha Aprobación *</label>
            <input type="date" name="fechaAprobacion" required value={formData.fechaAprobacion} onChange={handleInputChange} className={inputClass} />
          </div>

          <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-4">
             <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 italic">Cant. BCP</label>
                <input type="number" name="cantidadBcp" value={formData.cantidadBcp} onChange={handleInputChange} className={inputClass} />
             </div>
             <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 italic">Cant. Infconf</label>
                <input type="number" name="cantidadInformconf" value={formData.cantidadInformconf} onChange={handleInputChange} className={inputClass} />
             </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className={inputContainerClass}>
            <label className={labelClass}>Desembolsador *</label>
            <input type="text" name="desembolsador" required value={formData.desembolsador} onChange={handleInputChange} className={inputClass} />
          </div>
          <div className={inputContainerClass}>
            <label className={labelClass}>Experiencia Suc</label>
            <input type="text" name="experienciaSuc" value={formData.experienciaSuc} onChange={handleInputChange} className={inputClass} />
          </div>
          <div className={inputContainerClass}>
            <label className={labelClass}>Impugnaciones</label>
            <input type="text" name="impugnaciones" value={formData.impugnaciones} onChange={handleInputChange} className={inputClass} />
          </div>
          <div className={inputContainerClass}>
            <label className={labelClass}>¿Mas o Menos?</label>
            <select name="masOMenos" value={formData.masOMenos} onChange={handleInputChange} className={inputClass}>
              <option value="MAS">MÁS</option>
              <option value="MENOS">MENOS</option>
              <option value="IGUAL">IGUAL</option>
            </select>
          </div>
          <div className={inputContainerClass}>
            <label className={labelClass}>Motivo *</label>
            <input type="text" name="motivo" required value={formData.motivo} onChange={handleInputChange} className={inputClass} />
          </div>
          <div className={inputContainerClass}>
            <label className={labelClass}>Monto Dado</label>
            <input type="number" name="montoDado" value={formData.montoDado} onChange={handleInputChange} className={inputClass} />
          </div>
          <div className={inputContainerClass}>
            <label className={labelClass}>Posible Desemb.</label>
            <input type="text" name="posibleDesembolso" value={formData.posibleDesembolso} onChange={handleInputChange} className={inputClass} />
          </div>
          <div className={inputContainerClass}>
            <label className={labelClass}>Rebotes</label>
            <input type="text" name="rebotes" value={formData.rebotes} onChange={handleInputChange} className={inputClass} />
          </div>
          
          <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-4">
             <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 italic">Inversión</label>
                <input type="number" name="inversion" value={formData.inversion} onChange={handleInputChange} className={inputClass} />
             </div>
             <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 italic">Solicitud</label>
                <input type="number" name="solicitud" value={formData.solicitud} onChange={handleInputChange} className={inputClass} />
             </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CargaForm;
