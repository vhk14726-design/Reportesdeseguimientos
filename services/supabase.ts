
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { FormData } from '../types';

const supabaseUrl = process.env.SUPABASE_URL || 'https://uvhyhestymujycybvekc.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2aHloZXN0eW11anljeWJ2ZWtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNTI5ODcsImV4cCI6MjA4NTYyODk4N30.UQhacA5mt-EBU-2oJONLHRhZxNwlXQeFHRqSRfiDI3M';

export const supabase: SupabaseClient | null = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// Helpers para mapear entre CamelCase (JS) y SnakeCase (DB)
const toSnakeCase = (obj: any) => {
  const n: any = {};
  for (const key in obj) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    n[snakeKey] = obj[key];
  }
  return n;
};

const toCamelCase = (obj: any) => {
  const n: any = {};
  for (const key in obj) {
    const camelKey = key.replace(/([-_][a-z])/ig, ($1) => $1.toUpperCase().replace('-', '').replace('_', ''));
    n[camelKey] = obj[key];
  }
  return n;
};

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
    
    if (error) throw error;
    return (data || []).map(toCamelCase) as FormData[];
  },

  async insert(operacion: Partial<FormData>) {
    if (!checkConfig()) throw new Error("Configuración de Supabase faltante.");

    const { id, ...payload } = operacion;
    const dbPayload = toSnakeCase(payload);
    
    const { data, error } = await supabase!
      .from('operaciones')
      .insert([dbPayload])
      .select();
    
    if (error) {
      console.error("Detalle error Supabase:", error);
      throw error;
    }
    return toCamelCase(data[0]) as FormData;
  },

  async update(id: string, updates: Partial<FormData>) {
    if (!checkConfig()) throw new Error("Configuración de Supabase faltante.");

    const { id: _, ...payload } = updates;
    const dbPayload = toSnakeCase(payload);
    
    const { data, error } = await supabase!
      .from('operaciones')
      .update(dbPayload)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return toCamelCase(data[0]) as FormData;
  }
};
