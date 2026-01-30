import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { styleLabels, type HouseStyle, type House } from '@/types/database';

interface HouseFormModalProps {
  houseId: string | null;
  onClose: () => void;
}

export function HouseFormModal({ houseId, onClose }: HouseFormModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!houseId;

  const { data: existingHouse } = useQuery({
    queryKey: ['house', houseId],
    queryFn: async () => {
      if (!houseId) return null;
      const { data, error } = await supabase
        .from('houses')
        .select('*')
        .eq('id', houseId)
        .single();
      if (error) throw error;
      return data as House;
    },
    enabled: !!houseId,
  });

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    area: '',
    floors: '1',
    bedrooms: '3',
    bathrooms: '2',
    style: 'modern' as HouseStyle,
    price_from: '',
    construction_days: '120',
    images: [''],
    floor_plans: [''],
    features: [''],
    is_published: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (existingHouse) {
      setForm({
        name: existingHouse.name,
        slug: existingHouse.slug,
        description: existingHouse.description || '',
        area: String(existingHouse.area),
        floors: String(existingHouse.floors),
        bedrooms: String(existingHouse.bedrooms),
        bathrooms: String(existingHouse.bathrooms),
        style: existingHouse.style,
        price_from: String(existingHouse.price_from),
        construction_days: String(existingHouse.construction_days || 120),
        images: existingHouse.images.length ? existingHouse.images : [''],
        floor_plans: existingHouse.floor_plans.length ? existingHouse.floor_plans : [''],
        features: existingHouse.features.length ? existingHouse.features : [''],
        is_published: existingHouse.is_published,
      });
    }
  }, [existingHouse]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-zа-яё0-9\s-]/gi, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (name: string) => {
    setForm((prev) => ({
      ...prev,
      name,
      slug: !prev.slug || prev.slug === generateSlug(prev.name) ? generateSlug(name) : prev.slug,
    }));
  };

  const addArrayItem = (field: 'images' | 'floor_plans' | 'features') => {
    setForm((prev) => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const removeArrayItem = (field: 'images' | 'floor_plans' | 'features', index: number) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const updateArrayItem = (field: 'images' | 'floor_plans' | 'features', index: number, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      name: form.name,
      slug: form.slug || generateSlug(form.name),
      description: form.description || null,
      area: Number(form.area),
      floors: Number(form.floors),
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      style: form.style,
      price_from: Number(form.price_from),
      construction_days: Number(form.construction_days),
      images: form.images.filter(Boolean),
      floor_plans: form.floor_plans.filter(Boolean),
      features: form.features.filter(Boolean),
      is_published: form.is_published,
    };

    try {
      if (isEditing && houseId) {
        const { error } = await supabase
          .from('houses')
          .update(payload)
          .eq('id', houseId);
        if (error) throw error;
        toast({ title: 'Дом обновлён' });
      } else {
        const { error } = await supabase
          .from('houses')
          .insert(payload);
        if (error) throw error;
        toast({ title: 'Дом добавлен' });
      }

      queryClient.invalidateQueries({ queryKey: ['houses'] });
      onClose();
    } catch (err: any) {
      toast({
        title: 'Ошибка',
        description: err.message || 'Не удалось сохранить',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-foreground/50 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl my-8"
        >
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="font-display text-xl font-semibold">
              {isEditing ? 'Редактировать дом' : 'Добавить дом'}
            </h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-secondary">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Название *</label>
                <Input
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Alpine Residence"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">URL (slug)</label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder="alpine-residence"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Описание</label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Описание проекта..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Площадь (м²) *</label>
                <Input
                  type="number"
                  value={form.area}
                  onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Этажей</label>
                <Input
                  type="number"
                  value={form.floors}
                  onChange={(e) => setForm((f) => ({ ...f, floors: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Спален</label>
                <Input
                  type="number"
                  value={form.bedrooms}
                  onChange={(e) => setForm((f) => ({ ...f, bedrooms: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Санузлов</label>
                <Input
                  type="number"
                  value={form.bathrooms}
                  onChange={(e) => setForm((f) => ({ ...f, bathrooms: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Стиль</label>
                <Select
                  value={form.style}
                  onValueChange={(v) => setForm((f) => ({ ...f, style: v as HouseStyle }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(styleLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Цена от (₸) *</label>
                <Input
                  type="number"
                  value={form.price_from}
                  onChange={(e) => setForm((f) => ({ ...f, price_from: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Дней строительства</label>
                <Input
                  type="number"
                  value={form.construction_days}
                  onChange={(e) => setForm((f) => ({ ...f, construction_days: e.target.value }))}
                />
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Изображения (URL)</label>
              {form.images.map((url, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={url}
                    onChange={(e) => updateArrayItem('images', index, e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                  {form.images.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeArrayItem('images', index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('images')}
              >
                <Plus className="w-4 h-4 mr-1" />
                Добавить изображение
              </Button>
            </div>

            {/* Features */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Особенности</label>
              {form.features.map((feature, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={feature}
                    onChange={(e) => updateArrayItem('features', index, e.target.value)}
                    placeholder="Панорамные окна"
                  />
                  {form.features.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeArrayItem('features', index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('features')}
              >
                <Plus className="w-4 h-4 mr-1" />
                Добавить особенность
              </Button>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={onClose}>
                Отмена
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Сохранение...' : isEditing ? 'Сохранить' : 'Добавить'}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
