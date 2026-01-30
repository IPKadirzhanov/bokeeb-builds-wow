export type HouseStyle = 'modern' | 'classic' | 'scandinavian' | 'minimalist' | 'chalet';
export type LeadStatus = 'new' | 'in_progress' | 'closed';
export type AppRole = 'admin' | 'user';

export interface House {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  area: number;
  floors: number;
  bedrooms: number;
  bathrooms: number;
  style: HouseStyle;
  price_from: number;
  construction_days: number | null;
  images: string[];
  floor_plans: string[];
  features: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  comment: string | null;
  house_id: string | null;
  source: string | null;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
  house?: House | null;
}

export interface ChatLog {
  id: string;
  session_id: string;
  language: string;
  question: string;
  answer: string;
  ip_address: string | null;
  created_at: string;
}

export interface Setting {
  id: string;
  key: string;
  value: any;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export const styleLabels: Record<HouseStyle, string> = {
  modern: 'Современный',
  classic: 'Классический',
  scandinavian: 'Скандинавский',
  minimalist: 'Минимализм',
  chalet: 'Шале',
};

export const statusLabels: Record<LeadStatus, string> = {
  new: 'Новая',
  in_progress: 'В работе',
  closed: 'Закрыта',
};

export const statusColors: Record<LeadStatus, string> = {
  new: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  closed: 'bg-green-100 text-green-800',
};
