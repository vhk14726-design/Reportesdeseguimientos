
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { FormData } from '../types';

// Usando las credenciales proporcionadas por el usuario
const supabaseUrl = process.env.SUPABASE_URL || 'https://uvhyhestymujycybvekc.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2aHloZXN0eW11anljeWJ2ZWtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNTI5ODcsImV4cCI6MjA4NTYyODk4N30.UQhacA5mt-EBU-2oJONLHRhZxNwlXQeFHRqSRfiDI3M';

// Inicialización segura del cliente
export const supabase: SupabaseClient | null = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

const checkConfig = () => {
  if (!supabase) {
    console.error("Supabase Error: SUPABASE_URL y SUPABASE_ANON_KEY no están configuradas.");
    return false;
  }
  return true;
};

export const db = {
  async getAll() {
    if (!checkConfig()) return [] as FormData[];

    const { data, error } = await supabase!
      .from('operaciones')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error al obtener datos:", error);
      throw error;
    }
    
    // Mapeo simple para asegurar que los nombres de campos coincidan si el snake_case de SQL difiere del camelCase de TS
    // En el SQL proporcionado anteriormente usamos snake_case, aquí ajustamos si es necesario.
    // Si la tabla se creó con los nombres exactos de la interfaz (camelCase), no hace falta mapeo.
    return data as FormData[];
  },

  async insert(operacion: Partial<FormData>) {
    if (!checkConfig()) throw new Error("Configuración de Supabase faltante.");

    const { id, ...payload } = operacion;
    const { data, error } = await supabase!
      .from('operaciones')
      .insert([payload])
      .select();
    
    if (error) {
      console.error("Error al insertar:", error);
      throw error;
    }
    return data[0] as FormData;
  },

  async update(id: string, updates: Partial<FormData>) {
    if (!checkConfig()) throw new Error("Configuración de Supabase faltante.");

    // No actualizamos el ID ni el created_at
    const { id: _, ...payload } = updates;
    
    const { data, error } = await supabase!
      .from('operaciones')
      .update(payload)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error("Error al actualizar:", error);
      throw error;
    }
    return data[0] as FormData;
  }
};
