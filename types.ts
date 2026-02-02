
export interface FormData {
  ci: string;
  cliente: string;
  producto: string;
  analista: string;
  equipo: string;
  agente: string;
  fechaAprobacion: string;
  impugnaciones: string;
  seguimiento: string;
  inversion: number;
  solicitud: number;
  totalDevolver: number;
  pagare: number;
  utilidadAgente: number;
  utilidadGfv: number;
  inversor: string;
  utilidadInversor: number;
  destino: string;
  // Fields for the tracking table
  cantidadBcp: number;
  cantidadInformconf: number;
  sucursal: string;
  status?: 'COMPLETO' | 'PENDIENTE' | 'OBSERVADO';
}

export type SidebarSegment = 
  | 'INICIO' 
  | 'CARGA' 
  | 'COMERCIAL 1' 
  | 'COMERCIAL 2' 
  | 'INTEGRA CAPITAL' 
  | 'CAPTACIÓN' 
  | 'INTERLUDIO' 
  | 'DASHBOARD GENERAL';
