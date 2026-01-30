import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { House, HouseStyle } from '@/types/database';

interface HouseFilters {
  minArea?: number;
  maxArea?: number;
  floors?: number;
  style?: HouseStyle;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export function useHouses(filters?: HouseFilters) {
  return useQuery({
    queryKey: ['houses', filters],
    queryFn: async (): Promise<House[]> => {
      let query = supabase
        .from('houses')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (filters?.minArea) {
        query = query.gte('area', filters.minArea);
      }
      if (filters?.maxArea) {
        query = query.lte('area', filters.maxArea);
      }
      if (filters?.floors) {
        query = query.eq('floors', filters.floors);
      }
      if (filters?.style) {
        query = query.eq('style', filters.style);
      }
      if (filters?.minPrice) {
        query = query.gte('price_from', filters.minPrice);
      }
      if (filters?.maxPrice) {
        query = query.lte('price_from', filters.maxPrice);
      }
      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return (data || []) as House[];
    },
  });
}

export function useHouse(slug: string) {
  return useQuery({
    queryKey: ['house', slug],
    queryFn: async (): Promise<House | null> => {
      const { data, error } = await supabase
        .from('houses')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();
      
      if (error) throw error;
      return data as House | null;
    },
    enabled: !!slug,
  });
}

export function useAllHouses() {
  return useQuery({
    queryKey: ['houses', 'all'],
    queryFn: async (): Promise<House[]> => {
      const { data, error } = await supabase
        .from('houses')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []) as House[];
    },
  });
}
