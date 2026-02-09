import { supabase } from '../../supabaseClient';
import { Database } from '../../database.types';

export type Scholarship = Database['public']['Tables']['scholarships']['Row'];

export const getPublishedScholarships = async () => {
  const { data, error } = await supabase
    .from('scholarships')
    .select('*')
    .eq('status', 'PUBLISHED')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[Scholarships API] Error fetching published scholarships:', error.message);
    throw new Error(`Failed to load scholarships: ${error.message}`);
  }

  return data as Scholarship[];
};

export const getScholarshipById = async (id: string) => {
  const { data, error } = await supabase
    .from('scholarships')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Scholarship;
};

export const updateScholarship = async (id: string, updates: Partial<Scholarship>) => {
  const { error } = await supabase
    .from('scholarships')
    .update(updates)
    .eq('id', id);

  if (error) throw error;
};
