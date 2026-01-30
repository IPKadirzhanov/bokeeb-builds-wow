import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCreateLead } from '@/hooks/useLeads';
import { useToast } from '@/hooks/use-toast';

const leadSchema = z.object({
  name: z.string().trim().min(2, 'Введите ваше имя').max(100, 'Имя слишком длинное'),
  phone: z.string().trim().min(10, 'Введите корректный телефон').max(20, 'Телефон слишком длинный'),
  comment: z.string().trim().max(1000, 'Комментарий слишком длинный').optional(),
});

interface LeadFormProps {
  houseId?: string;
  houseName?: string;
  source?: string;
  onClose?: () => void;
}

export function LeadForm({ houseId, houseName, source = 'website', onClose }: LeadFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createLead = useCreateLead();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = leadSchema.safeParse({ name, phone, comment: comment || undefined });
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      await createLead.mutateAsync({
        name: result.data.name,
        phone: result.data.phone,
        comment: result.data.comment,
        house_id: houseId,
        source,
      });

      navigate('/thank-you');
    } catch (err) {
      console.error('Failed to create lead:', err);
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить заявку. Попробуйте позже.',
        variant: 'destructive',
      });
    }
  };

  const content = (
    <form onSubmit={handleSubmit} className="space-y-6">
      {houseName && (
        <div className="p-3 bg-secondary/50 rounded-lg">
          <p className="text-sm text-muted-foreground">Проект:</p>
          <p className="font-medium">{houseName}</p>
        </div>
      )}

      <div>
        <label className="text-sm font-body text-muted-foreground mb-2 block">
          Ваше имя *
        </label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Как к вам обращаться?"
          className={errors.name ? 'border-destructive' : ''}
        />
        {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="text-sm font-body text-muted-foreground mb-2 block">
          Телефон *
        </label>
        <Input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+7 (___) ___-__-__"
          className={errors.phone ? 'border-destructive' : ''}
        />
        {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
      </div>

      <div>
        <label className="text-sm font-body text-muted-foreground mb-2 block">
          Комментарий
        </label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Расскажите о ваших пожеланиях..."
          rows={3}
        />
        {errors.comment && <p className="text-sm text-destructive mt-1">{errors.comment}</p>}
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={createLead.isPending}
        className="w-full bg-primary text-primary-foreground hover:bg-forest-light"
      >
        {createLead.isPending ? 'Отправка...' : 'Отправить заявку'}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        Нажимая кнопку, вы соглашаетесь с{' '}
        <a href="/policy" className="text-primary hover:underline">
          политикой конфиденциальности
        </a>
      </p>
    </form>
  );

  // If onClose is provided, render as modal
  if (onClose) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-foreground/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-2xl shadow-2xl w-full max-w-md p-6 relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-secondary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="font-display text-xl font-semibold mb-6">
              Получить план и смету
            </h3>
            
            {content}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Otherwise render as inline form
  return content;
}
