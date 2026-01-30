import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Bed, Bath, Maximize, Clock, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/Layout';
import { useHouse } from '@/hooks/useHouses';
import { styleLabels } from '@/types/database';
import { Skeleton } from '@/components/ui/skeleton';
import { LeadForm } from '@/components/LeadForm';

const formatPrice = (price: number) => {
  if (price >= 1000000) {
    return `от ${(price / 1000000).toFixed(1)} млн ₸`;
  }
  return `от ${price.toLocaleString()} ₸`;
};

const constructionSteps = [
  { title: 'Проектирование', duration: '2-4 недели', description: 'Разработка проекта и документации' },
  { title: 'Фундамент', duration: '2-3 недели', description: 'Заливка и выдержка фундамента' },
  { title: 'Стены и кровля', duration: '4-8 недель', description: 'Возведение каркаса дома' },
  { title: 'Инженерные системы', duration: '2-4 недели', description: 'Электрика, сантехника, отопление' },
  { title: 'Отделка', duration: '4-8 недель', description: 'Внутренняя и внешняя отделка' },
  { title: 'Сдача объекта', duration: '1 неделя', description: 'Финальная проверка и передача ключей' },
];

export default function HouseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: house, isLoading, error } = useHouse(slug || '');
  const [currentImage, setCurrentImage] = useState(0);
  const [showForm, setShowForm] = useState(false);

  if (isLoading) {
    return (
      <Layout>
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 lg:px-8">
            <Skeleton className="h-8 w-32 mb-8" />
            <div className="grid lg:grid-cols-2 gap-12">
              <Skeleton className="h-[500px] rounded-2xl" />
              <div>
                <Skeleton className="h-10 w-3/4 mb-4" />
                <Skeleton className="h-6 w-1/2 mb-8" />
                <Skeleton className="h-24 w-full mb-8" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !house) {
    return (
      <Layout>
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 lg:px-8 text-center py-16">
            <h1 className="text-2xl font-display font-semibold mb-4">Проект не найден</h1>
            <p className="text-muted-foreground mb-6">Возможно, этот проект был удалён или перемещён.</p>
            <Button onClick={() => navigate('/catalog')}>Вернуться в каталог</Button>
          </div>
        </div>
      </Layout>
    );
  }

  const allImages = [...house.images, ...house.floor_plans];

  return (
    <Layout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/catalog')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад в каталог
          </motion.button>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative rounded-2xl overflow-hidden mb-4">
                <img
                  src={allImages[currentImage] || '/placeholder.svg'}
                  alt={house.name}
                  className="w-full h-[500px] object-cover"
                />
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImage((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setCurrentImage((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
              
              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {allImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        currentImage === index ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-secondary rounded-full text-xs font-body">
                  {styleLabels[house.style]}
                </span>
                <span className="text-accent font-body text-sm">
                  {formatPrice(house.price_from)}
                </span>
              </div>

              <h1 className="font-display text-3xl lg:text-4xl font-semibold text-foreground mb-4">
                {house.name}
              </h1>

              <p className="text-muted-foreground font-body mb-8 leading-relaxed">
                {house.description}
              </p>

              {/* Specs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="p-4 bg-secondary/50 rounded-xl text-center">
                  <Maximize className="w-5 h-5 mx-auto mb-2 text-primary" />
                  <div className="font-display text-xl font-semibold">{house.area}</div>
                  <div className="text-xs text-muted-foreground">м²</div>
                </div>
                <div className="p-4 bg-secondary/50 rounded-xl text-center">
                  <Bed className="w-5 h-5 mx-auto mb-2 text-primary" />
                  <div className="font-display text-xl font-semibold">{house.bedrooms}</div>
                  <div className="text-xs text-muted-foreground">спальни</div>
                </div>
                <div className="p-4 bg-secondary/50 rounded-xl text-center">
                  <Bath className="w-5 h-5 mx-auto mb-2 text-primary" />
                  <div className="font-display text-xl font-semibold">{house.bathrooms}</div>
                  <div className="text-xs text-muted-foreground">санузлы</div>
                </div>
                <div className="p-4 bg-secondary/50 rounded-xl text-center">
                  <Clock className="w-5 h-5 mx-auto mb-2 text-primary" />
                  <div className="font-display text-xl font-semibold">{house.construction_days || 120}</div>
                  <div className="text-xs text-muted-foreground">дней</div>
                </div>
              </div>

              {/* Features */}
              <div className="mb-8">
                <h3 className="font-display text-lg font-semibold mb-4">Особенности проекта</h3>
                <div className="grid grid-cols-2 gap-2">
                  {house.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm font-body">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <Button
                size="lg"
                onClick={() => setShowForm(true)}
                className="w-full bg-primary text-primary-foreground hover:bg-forest-light"
              >
                Получить план и смету
              </Button>
            </motion.div>
          </div>

          {/* Blueprint Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative rounded-2xl overflow-hidden bg-card p-8 lg:p-12 mb-16"
          >
            <div className="absolute inset-0 blueprint-grid opacity-50" />
            <div className="relative z-10">
              <h2 className="font-display text-2xl lg:text-3xl font-semibold text-foreground mb-8 text-center">
                Этапы строительства
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {constructionSteps.map((step, index) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                    className="relative p-6 bg-background/80 backdrop-blur-sm rounded-xl border border-border"
                  >
                    <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display font-bold text-sm">
                      {index + 1}
                    </div>
                    <h4 className="font-display text-lg font-semibold mb-1">{step.title}</h4>
                    <p className="text-accent text-sm mb-2">{step.duration}</p>
                    <p className="text-muted-foreground text-sm font-body">{step.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Floor Plans if available */}
          {house.floor_plans.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mb-16"
            >
              <h2 className="font-display text-2xl lg:text-3xl font-semibold text-foreground mb-8 text-center">
                Планировки
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {house.floor_plans.map((plan, index) => (
                  <div key={index} className="rounded-2xl overflow-hidden border border-border">
                    <img src={plan} alt={`Планировка ${index + 1}`} className="w-full" />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Lead Form Modal */}
      {showForm && (
        <LeadForm
          houseId={house.id}
          houseName={house.name}
          onClose={() => setShowForm(false)}
        />
      )}
    </Layout>
  );
}
