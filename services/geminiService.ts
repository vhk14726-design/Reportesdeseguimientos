
import { GoogleGenAI, Type } from "@google/genai";
import { FormData } from "../types";

export const analyzeFinancialData = async (data: FormData) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("Análisis omitido: API_KEY no configurada.");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    Analiza los siguientes datos financieros de una operación y proporciona un resumen ejecutivo, 
    identificando riesgos potenciales y sugerencias de seguimiento.
    
    Datos de la Operación:
    - Cliente: ${data.cliente}
    - Producto: ${data.producto}
    - Inversión: Gs. ${data.inversion.toLocaleString()}
    - Solicitud: Gs. ${data.solicitud.toLocaleString()}
    - Total a Devolver: Gs. ${data.totalDevolver.toLocaleString()}
    - Utilidad GFV: Gs. ${data.utilidadGfv.toLocaleString()}
    - Utilidad Agente: Gs. ${data.utilidadAgente.toLocaleString()}
    - Utilidad Inversor: Gs. ${data.utilidadInversor.toLocaleString()}
    - Seguimiento actual: ${data.seguimiento}
    
    Responde en formato JSON estructurado.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            resumen: { type: Type.STRING },
            riesgos: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            recomendaciones: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            scoreRiesgo: { type: Type.NUMBER, description: "Del 1 al 10" }
          },
          required: ["resumen", "riesgos", "recomendaciones", "scoreRiesgo"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error analyzing data with Gemini:", error);
    return null;
  }
};
