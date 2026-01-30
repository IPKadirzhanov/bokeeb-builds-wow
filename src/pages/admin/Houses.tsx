import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminLayout } from '@/components/AdminLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAllHouses } from '@/hooks/useHouses';
import { styleLabels } from '@/types/database';
import { Skeleton } from '@/components/ui/skeleton';
import { HouseFormModal } from '@/components/HouseFormModal';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

const formatPrice = (price: number) => {
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(1)} млн ₸`;
  }
  return `${price.toLocaleString()} ₸`;
};

export default function AdminHousesPage() {
  const { data: houses, isLoading, error } = useAllHouses();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [editingHouse, setEditingHouse] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const togglePublished = async (id: string, isPublished: boolean) => {
    try {
      const { error } = await supabase
        .from('houses')
        .update({ is_published: !isPublished })
        .eq('id', id);

      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['houses'] });
      toast({ title: isPublished ? 'Дом скрыт' : 'Дом опубликован' });
    } catch (err) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус',
        variant: 'destructive',
      });
    }
  };

  const deleteHouse = async (id: string) => {
    if (!confirm('Удалить дом? Это действие нельзя отменить.')) return;
    
    try {
      const { error } = await supabase
        .from('houses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['houses'] });
      toast({ title: 'Дом удалён' });
    } catch (err) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить дом',
        variant: 'destructive',
      });
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <AdminLayout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-2xl font-semibold">Дома</h1>
              <p className="text-muted-foreground text-sm">
                Управление каталогом проектов
              </p>
            </div>
            <Button onClick={() => { setEditingHouse(null); setShowForm(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              Добавить дом
            </Button>
          </div>

          {/* List */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 w-full rounded-lg" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 text-destructive">
              Ошибка загрузки домов
            </div>
          ) : houses?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Дома не добавлены</p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Добавить первый дом
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {houses?.map((house) => (
                <motion.div
                  key={house.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`bg-card rounded-xl p-4 border border-border flex gap-4 ${
                    !house.is_published ? 'opacity-60' : ''
                  }`}
                >
                  {/* Image */}
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-secondary">
                    {house.images[0] ? (
                      <img
                        src={house.images[0]}
                        alt={house.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                        Нет фото
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{house.name}</h3>
                      {!house.is_published && (
                        <span className="px-2 py-0.5 bg-secondary rounded text-xs">
                          Скрыт
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {house.area} м² • {house.floors} эт. • {styleLabels[house.style]}
                    </p>
                    <p className="text-sm text-primary font-medium">
                      {formatPrice(house.price_from)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => togglePublished(house.id, house.is_published)}
                      title={house.is_published ? 'Скрыть' : 'Опубликовать'}
                    >
                      {house.is_published ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => { setEditingHouse(house.id); setShowForm(true); }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteHouse(house.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Form Modal */}
        {showForm && (
          <HouseFormModal
            houseId={editingHouse}
            onClose={() => { setShowForm(false); setEditingHouse(null); }}
          />
        )}
      </AdminLayout>
    </ProtectedRoute>
  );
}
