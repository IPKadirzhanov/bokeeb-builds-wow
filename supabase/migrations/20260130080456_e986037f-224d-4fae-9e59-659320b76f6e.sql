-- Исправляем search_path для функции update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Удаляем слишком permissive политики и создаём более строгие
DROP POLICY IF EXISTS "Anyone can create leads" ON public.leads;
DROP POLICY IF EXISTS "Anyone can create chat logs" ON public.chat_logs;

-- Для leads: разрешаем INSERT только с валидными данными (имя и телефон не пустые)
CREATE POLICY "Anyone can create leads with valid data" ON public.leads
  FOR INSERT WITH CHECK (
    name IS NOT NULL AND 
    name <> '' AND 
    phone IS NOT NULL AND 
    phone <> ''
  );

-- Для chat_logs: разрешаем INSERT только с валидными данными
CREATE POLICY "Anyone can create chat logs with valid data" ON public.chat_logs
  FOR INSERT WITH CHECK (
    session_id IS NOT NULL AND 
    session_id <> '' AND 
    question IS NOT NULL AND 
    question <> '' AND
    answer IS NOT NULL AND
    answer <> ''
  );