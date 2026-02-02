
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
