import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { AdminLayout } from '@/components/AdminLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

interface Settings {
  ai_enabled: boolean;
  supported_languages: string[];
  company_phone: string;
  company_email: string;
  company_address: string;
}

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('*');
      
      if (error) throw error;
      
      const settingsMap: Settings = {
        ai_enabled: true,
        supported_languages: ['ru', 'kz', 'en', 'cn'],
        company_phone: '+7 (777) 123-45-67',
        company_email: 'info@bbbokeeb.kz',
        company_address: 'г. Алматы, ул. Строительная, 1',
      };
      
      data?.forEach((item: { key: string; value: any }) => {
        const key = item.key as keyof Settings;
        if (key in settingsMap) {
          const parsed = typeof item.value === 'string' ? JSON.parse(item.value) : item.value;
          (settingsMap as any)[key] = parsed;
        }
      });
      
      return settingsMap;
    },
  });

  const [form, setForm] = useState<Settings>({
    ai_enabled: true,
    supported_languages: ['ru', 'kz', 'en', 'cn'],
    company_phone: '+7 (777) 123-45-67',
    company_email: 'info@bbbokeeb.kz',
    company_address: 'г. Алматы, ул. Строительная, 1',
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm(settings);
    }
  }, [settings]);

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      const updates = Object.entries(form).map(([key, value]) => ({
        key,
        value: JSON.stringify(value),
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('settings')
          .upsert(
            { key: update.key, value: update.value },
            { onConflict: 'key' }
          );
        
        if (error) throw error;
      }

      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast({ title: 'Настройки сохранены' });
    } catch (err) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить настройки',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleLanguage = (lang: string) => {
    setForm((prev) => ({
      ...prev,
      supported_languages: prev.supported_languages.includes(lang)
        ? prev.supported_languages.filter((l) => l !== lang)
        : [...prev.supported_languages, lang],
    }));
  };

  const languages = [
    { code: 'ru', name: 'Русский' },
    { code: 'kz', name: 'Қазақша' },
    { code: 'en', name: 'English' },
    { code: 'cn', name: '中文' },
  ];

  return (
    <ProtectedRoute requireAdmin>
      <AdminLayout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-2xl font-semibold">Настройки</h1>
              <p className="text-muted-foreground text-sm">
                Конфигурация сайта и AI-консультанта
              </p>
            </div>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          ) : (
            <div className="space-y-8">
              {/* AI Settings */}
              <div className="bg-card rounded-xl p-6 border border-border">
                <div className="flex items-center gap-3 mb-6">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-lg font-semibold">AI-консультант</h2>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Включить AI-консультанта</h3>
                      <p className="text-sm text-muted-foreground">
                        Чат-виджет будет отображаться на сайте
                      </p>
                    </div>
                    <Switch
                      checked={form.ai_enabled}
                      onCheckedChange={(checked) => setForm((f) => ({ ...f, ai_enabled: checked }))}
                    />
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Поддерживаемые языки</h3>
                    <div className="flex flex-wrap gap-2">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => toggleLanguage(lang.code)}
                          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                            form.supported_languages.includes(lang.code)
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                          }`}
                        >
                          {lang.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Info */}
              <div className="bg-card rounded-xl p-6 border border-border">
                <h2 className="font-display text-lg font-semibold mb-6">Контактная информация</h2>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Телефон</label>
                    <Input
                      value={form.company_phone}
                      onChange={(e) => setForm((f) => ({ ...f, company_phone: e.target.value }))}
                      placeholder="+7 (777) 123-45-67"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Email</label>
                    <Input
                      type="email"
                      value={form.company_email}
                      onChange={(e) => setForm((f) => ({ ...f, company_email: e.target.value }))}
                      placeholder="info@bbbokeeb.kz"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Адрес</label>
                    <Input
                      value={form.company_address}
                      onChange={(e) => setForm((f) => ({ ...f, company_address: e.target.value }))}
                      placeholder="г. Алматы, ул. Строительная, 1"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
