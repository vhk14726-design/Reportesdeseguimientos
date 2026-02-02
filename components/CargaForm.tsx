
import React, { useState } from 'react';
import { FormData } from '../types';
import { analyzeFinancialData } from '../services/geminiService';

const CargaForm: React.FC = () => {
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
  });

  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const analysis = await analyzeFinancialData(formData);
    setAiAnalysis(analysis);
    setLoading(false);
    console.log("Form Submitted:", formData);
  };

  const inputClass = "w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none";
  const labelClass = "block text-sm font-semibold text-slate-700 mb-1";
  const sectionTitle = "text-xl font-bold text-slate-800 border-b-2 border-emerald-500 pb-2 mb-6 flex items-center gap-2";

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">CARGA <span className="text-emerald-600 font-light italic">SEGUIMIENTOS</span></h2>
          <p className="text-slate-500 mt-1">Registro y administración de nuevas operaciones financieras.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors font-medium">Cancelar</button>
          <button 
            onClick={handleSubmit}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold shadow-lg shadow-emerald-600/20 flex items-center gap-2"
          >
            {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-save"></i>}
            Guardar Operación
          </button>
        </div>
      </header>

      <form className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        {/* Columna Izquierda: Información General */}
        <div className="space-y-6">
          <h3 className={sectionTitle}><i className="fa-solid fa-user-tie text-emerald-500"></i> Información del Cliente</h3>
          
          <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 mb-6">
            <label className={`${labelClass} text-emerald-800`}>¿A dónde quieres cargar el cliente?</label>
            <select 
              name="destino" 
              value={formData.destino} 
              onChange={handleInputChange} 
              className={`${inputClass} border-emerald-200 bg-white font-medium`}
            >
              <option value="">Seleccione un destino...</option>
              <option value="COMERCIAL 1">COMERCIAL 1</option>
              <option value="COMERCIAL 2">COMERCIAL 2</option>
              <option value="INTEGRA CAPITAL">INTEGRA CAPITAL</option>
              <option value="INTERLUDIO">INTERLUDIO</option>
              <option value="CAPTACIÓN">CAPTACIÓN</option>
            </select>
            <p className="text-[11px] text-emerald-600 mt-2 italic">* Define en qué segmento se guardará este registro.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>CI</label>
              <input type="text" name="ci" value={formData.ci} onChange={handleInputChange} className={inputClass} placeholder="Ej. 1.234.567" />
            </div>
            <div>
              <label className={labelClass}>¿Cliente?</label>
              <input type="text" name="cliente" value={formData.cliente} onChange={handleInputChange} className={inputClass} placeholder="Nombre completo" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>¿Producto?</label>
              <input type="text" name="producto" value={formData.producto} onChange={handleInputChange} className={inputClass} placeholder="Tipo de crédito" />
            </div>
            <div>
              <label className={labelClass}>¿Analista?</label>
              <input type="text" name="analista" value={formData.analista} onChange={handleInputChange} className={inputClass} placeholder="Analista asignado" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>¿Equipo?</label>
              <input type="text" name="equipo" value={formData.equipo} onChange={handleInputChange} className={inputClass} placeholder="Equipo comercial" />
            </div>
            <div>
              <label className={labelClass}>¿Agente?</label>
              <input type="text" name="agente" value={formData.agente} onChange={handleInputChange} className={inputClass} placeholder="Agente comercial" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Fecha de aprobación</label>
              <input type="date" name="fechaAprobacion" value={formData.fechaAprobacion} onChange={handleInputChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>¿Impugnaciones?</label>
              <input type="text" name="impugnaciones" value={formData.impugnaciones} onChange={handleInputChange} className={inputClass} placeholder="0" />
            </div>
          </div>

          <div>
            <label className={labelClass}>Seguimiento</label>
            <textarea name="seguimiento" rows={3} value={formData.seguimiento} onChange={handleInputChange} className={`${inputClass} resize-none`} placeholder="Observaciones del seguimiento..."></textarea>
          </div>
        </div>

        {/* Columna Derecha: Información Financiera */}
        <div className="space-y-6">
          <h3 className={sectionTitle}><i className="fa-solid fa-money-bill-transfer text-emerald-500"></i> Detalle Financiero</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Inversión (Gs.)</label>
              <input type="number" name="inversion" value={formData.inversion} onChange={handleInputChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Solicitud (Gs.)</label>
              <input type="number" name="solicitud" value={formData.solicitud} onChange={handleInputChange} className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Total a devolver (Gs.)</label>
              <input type="number" name="totalDevolver" value={formData.totalDevolver} onChange={handleInputChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Pagaré (Gs.)</label>
              <input type="number" name="pagare" value={formData.pagare} onChange={handleInputChange} className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Utilidad [AGENTE] (Gs.)</label>
              <input type="number" name="utilidadAgente" value={formData.utilidadAgente} onChange={handleInputChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Utilidad [GFV] (Gs.)</label>
              <input type="number" name="utilidadGfv" value={formData.utilidadGfv} onChange={handleInputChange} className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>¿Inversor?</label>
              <input type="text" name="inversor" value={formData.inversor} onChange={handleInputChange} className={inputClass} placeholder="Nombre inversor" />
            </div>
            <div>
              <label className={labelClass}>Utilidad [INVERSOR] (Gs.)</label>
              <input type="number" name="utilidadInversor" value={formData.utilidadInversor} onChange={handleInputChange} className={inputClass} />
            </div>
          </div>
        </div>
      </form>

      {/* AI Analysis Result */}
      {aiAnalysis && (
        <div className="bg-emerald-900 text-white p-8 rounded-2xl shadow-xl border border-emerald-700 mt-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center animate-pulse">
              <i className="fa-solid fa-brain text-white text-xl"></i>
            </div>
            <div>
              <h3 className="text-xl font-bold">Análisis Inteligente (Gemini)</h3>
              <p className="text-emerald-300 text-sm">Evaluación automatizada de riesgos y oportunidades</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm font-semibold uppercase tracking-widest text-emerald-400">Score de Riesgo:</span>
              <span className={`text-3xl font-black ${aiAnalysis.scoreRiesgo > 7 ? 'text-red-400' : 'text-emerald-400'}`}>
                {aiAnalysis.scoreRiesgo}/10
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-bold text-emerald-300 uppercase tracking-wider text-xs flex items-center gap-2">
                <i className="fa-solid fa-align-left"></i> Resumen Ejecutivo
              </h4>
              <p className="text-emerald-50/90 leading-relaxed text-sm">{aiAnalysis.resumen}</p>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-red-300 uppercase tracking-wider text-xs flex items-center gap-2 mb-2">
                  <i className="fa-solid fa-triangle-exclamation"></i> Riesgos Identificados
                </h4>
                <ul className="space-y-2">
                  {aiAnalysis.riesgos.map((r: string, idx: number) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <i className="fa-solid fa-circle-chevron-right text-red-400 mt-1"></i>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-blue-300 uppercase tracking-wider text-xs flex items-center gap-2 mb-2">
                  <i className="fa-solid fa-lightbulb"></i> Recomendaciones
                </h4>
                <ul className="space-y-2">
                  {aiAnalysis.recomendaciones.map((r: string, idx: number) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <i className="fa-solid fa-check text-blue-400 mt-1"></i>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CargaForm;
