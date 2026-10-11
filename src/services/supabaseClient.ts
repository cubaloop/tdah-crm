import { createClient } from '@supabase/supabase-js';
import type { Lead } from '../types/crm';
import { INITIAL_LEADS } from '../data/initialLeads';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const BASE_STORAGE_KEY = 'tdah_crm_leads_v1';

export const loadLeadsFromStorage = (userEmail?: string): Lead[] => {
  const storageKey = userEmail ? `${BASE_STORAGE_KEY}_${userEmail}` : BASE_STORAGE_KEY;
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading leads from localStorage', e);
  }

  // If user is demo, provide sample leads. If a new user registers, provide clean empty list!
  if (userEmail && userEmail.includes('demo')) {
    saveLeadsToStorage(INITIAL_LEADS, userEmail);
    return INITIAL_LEADS;
  }

  // Fresh user starts completely empty with zero exposure to other users' data
  return [];
};

export const saveLeadsToStorage = (leads: Lead[], userEmail?: string) => {
  const storageKey = userEmail ? `${BASE_STORAGE_KEY}_${userEmail}` : BASE_STORAGE_KEY;
  try {
    localStorage.setItem(storageKey, JSON.stringify(leads));
  } catch (e) {
    console.error('Error saving leads to localStorage', e);
  }
};

export const syncLeadsToSupabase = async (leads: Lead[]) => {
  if (!supabase) return { success: false, message: 'Supabase no configurado (usando modo LocalStorage)' };
  try {
    const { error } = await supabase.from('leads').upsert(leads);
    if (error) throw error;
    return { success: true, message: 'Sincronizado con Supabase con éxito' };
  } catch (e: any) {
    return { success: false, message: e.message || 'Error de sincronización con Supabase' };
  }
};
