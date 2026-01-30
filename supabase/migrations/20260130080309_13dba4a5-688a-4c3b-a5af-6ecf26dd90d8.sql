-- Создаём enum для ролей
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Создаём enum для статусов заявок
CREATE TYPE public.lead_status AS ENUM ('new', 'in_progress', 'closed');

-- Создаём enum для стилей домов
CREATE TYPE public.house_style AS ENUM ('modern', 'classic', 'scandinavian', 'minimalist', 'chalet');

-- Таблица домов
CREATE TABLE public.houses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  area NUMERIC NOT NULL,
  floors INTEGER NOT NULL DEFAULT 1,
  bedrooms INTEGER NOT NULL DEFAULT 3,
  bathrooms INTEGER NOT NULL DEFAULT 2,
  style house_style NOT NULL DEFAULT 'modern',
  price_from NUMERIC NOT NULL,
  construction_days INTEGER DEFAULT 120,
  images TEXT[] DEFAULT '{}',
  floor_plans TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Таблица заявок
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  comment TEXT,
  house_id UUID REFERENCES public.houses(id) ON DELETE SET NULL,
  source TEXT DEFAULT 'website',
  status lead_status DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Таблица ролей пользователей
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Таблица логов чата
CREATE TABLE public.chat_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  language TEXT DEFAULT 'ru',
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Таблица настроек сайта
CREATE TABLE public.settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Включаем RLS на всех таблицах
ALTER TABLE public.houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Функция проверки роли (security definer для избежания рекурсии)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS для houses: публичное чтение опубликованных, полный доступ для админов
CREATE POLICY "Anyone can view published houses" ON public.houses
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can do anything with houses" ON public.houses
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS для leads: только админы видят и управляют
CREATE POLICY "Admins can view all leads" ON public.leads
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can create leads" ON public.leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update leads" ON public.leads
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete leads" ON public.leads
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS для user_roles: пользователи видят свои роли, админы - все
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS для chat_logs: только админы
CREATE POLICY "Admins can view chat logs" ON public.chat_logs
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can create chat logs" ON public.chat_logs
  FOR INSERT WITH CHECK (true);

-- RLS для settings: только админы
CREATE POLICY "Admins can manage settings" ON public.settings
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view settings" ON public.settings
  FOR SELECT USING (true);

-- Триггер обновления updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_houses_updated_at
  BEFORE UPDATE ON public.houses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON public.settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Вставляем начальные настройки
INSERT INTO public.settings (key, value) VALUES
  ('ai_enabled', 'true'),
  ('supported_languages', '["ru", "kz", "en", "cn"]'),
  ('company_phone', '"+7 (777) 123-45-67"'),
  ('company_email', '"info@bbbokeeb.kz"'),
  ('company_address', '"г. Алматы, ул. Строительная, 1"');

-- Seed данные: 10 домов
INSERT INTO public.houses (slug, name, description, area, floors, bedrooms, bathrooms, style, price_from, construction_days, images, floor_plans, features) VALUES
('alpine-residence', 'Alpine Residence', 'Современный дом в альпийском стиле с панорамными окнами и террасой. Идеальное сочетание комфорта и природной красоты.', 180, 2, 4, 2, 'chalet', 45000000, 150, ARRAY['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'], ARRAY['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600'], ARRAY['Панорамные окна', 'Терраса 40 м²', 'Камин', 'Гараж на 2 авто', 'Тёплый пол']),

('modern-cube', 'Modern Cube', 'Минималистичный дом с плоской кровлей и большими окнами. Современная архитектура для ценителей простоты.', 150, 2, 3, 2, 'modern', 38000000, 120, ARRAY['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800'], ARRAY['https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=600'], ARRAY['Плоская кровля', 'Витражное остекление', 'Умный дом', 'Гараж']),

('scandinavian-dream', 'Scandinavian Dream', 'Уютный скандинавский дом с натуральными материалами. Светлые интерьеры и функциональная планировка.', 120, 1, 3, 1, 'scandinavian', 28000000, 90, ARRAY['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800'], ARRAY['https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600'], ARRAY['Натуральное дерево', 'Панорамные окна', 'Открытая планировка']),

('classic-estate', 'Classic Estate', 'Классический особняк с колоннами и благородной отделкой. Вечная элегантность для большой семьи.', 280, 2, 5, 3, 'classic', 72000000, 200, ARRAY['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800'], ARRAY['https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=600'], ARRAY['Колонны', 'Мраморный холл', 'Бассейн', 'Гараж на 3 авто', 'Гостевой дом']),

('minimalist-box', 'Minimalist Box', 'Компактный дом в стиле минимализм. Максимум пространства при минимуме площади.', 90, 1, 2, 1, 'minimalist', 18000000, 75, ARRAY['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'], ARRAY['https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600'], ARRAY['Компактная планировка', 'Терраса', 'Студия']),

('family-comfort', 'Family Comfort', 'Просторный семейный дом с продуманной планировкой. Отдельные зоны для детей и взрослых.', 220, 2, 5, 3, 'modern', 52000000, 160, ARRAY['https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800', 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800'], ARRAY['https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=600'], ARRAY['Детская игровая', 'Кабинет', 'Гардеробная', '2 санузла', 'Гараж']),

('eco-house', 'Eco House', 'Энергоэффективный дом с солнечными панелями. Забота о природе и экономия на коммунальных услугах.', 160, 2, 4, 2, 'scandinavian', 42000000, 140, ARRAY['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'], ARRAY['https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=600'], ARRAY['Солнечные панели', 'Тепловой насос', 'Рекуперация', 'Умный дом']),

('lake-view', 'Lake View', 'Дом с панорамным видом на озеро. Большие террасы и открытая планировка для любителей природы.', 200, 2, 4, 2, 'modern', 58000000, 170, ARRAY['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800'], ARRAY['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600'], ARRAY['Панорамный вид', 'Терраса 60 м²', 'Причал', 'Баня']),

('urban-loft', 'Urban Loft', 'Стильный лофт с индустриальными элементами. Открытое пространство и высокие потолки.', 130, 2, 2, 1, 'minimalist', 32000000, 100, ARRAY['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800'], ARRAY['https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600'], ARRAY['Высокие потолки', 'Открытая планировка', 'Второй свет', 'Лофт-стиль']),

('garden-villa', 'Garden Villa', 'Вилла с ландшафтным садом и зоной барбекю. Идеальное место для семейных встреч.', 250, 2, 5, 3, 'classic', 65000000, 180, ARRAY['https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800', 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800'], ARRAY['https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=600'], ARRAY['Ландшафтный сад', 'Зона барбекю', 'Бассейн', 'Беседка', 'Гараж на 2 авто']);