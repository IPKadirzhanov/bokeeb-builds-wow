import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ArrowRight, Bed, Bath, Maximize, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import house1 from '@/assets/house-1.jpg';
import house2 from '@/assets/house-2.jpg';
import house3 from '@/assets/house-3.jpg';

const houses = [
  {
    id: 1,
    name: 'Проект "Скандинавия"',
    style: 'Современный минимализм',
    area: 185,
    bedrooms: 4,
    bathrooms: 2,
    price: 'от 8.5 млн ₽',
    image: house1,
    features: ['Панорамные окна', 'Терраса', 'Гараж на 2 авто'],
  },
  {
    id: 2,
    name: 'Проект "Средиземноморье"',
    style: 'Средиземноморский модерн',
    area: 280,
    bedrooms: 5,
    bathrooms: 3,
    price: 'от 14.2 млн ₽',
    image: house2,
    features: ['Бассейн', 'Патио', 'Второй свет'],
  },
  {
    id: 3,
    name: 'Проект "Усадьба"',
    style: 'Современная классика',
    area: 320,
    bedrooms: 6,
    bathrooms: 4,
    price: 'от 18.5 млн ₽',
    image: house3,
    features: ['Каминный зал', 'Мансарда', 'Гостевой дом'],
  },
];

export const CatalogSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const scrollToContacts = () => {
    const element = document.querySelector('#contacts');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="catalog" ref={ref} className="py-24 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-12 bg-accent" />
              <span className="text-accent font-body text-sm tracking-widest uppercase">
                Каталог проектов
              </span>
            </div>
            <h2 className="font-display text-3xl lg:text-5xl font-semibold text-foreground">
              Выберите свой идеальный дом
            </h2>
          </div>
          <p className="text-muted-foreground font-body max-w-md">
            Более 50 готовых проектов на любой вкус. Каждый можно адаптировать
            под ваши пожелания.
          </p>
        </motion.div>

        {/* Houses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {houses.map((house, index) => (
            <motion.div
              key={house.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
              onMouseEnter={() => setHoveredCard(house.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className="group relative bg-card rounded-xl overflow-hidden shadow-sm card-hover"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <motion.img
                  src={house.image}
                  alt={house.name}
                  className="w-full h-full object-cover"
                  animate={{
                    scale: hoveredCard === house.id ? 1.05 : 1,
                  }}
                  transition={{ duration: 0.6 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
                
                {/* Price Tag */}
                <div className="absolute top-4 right-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-body text-sm font-medium">
                  {house.price}
                </div>

                {/* Style Tag */}
                <div className="absolute bottom-4 left-4 px-3 py-1 bg-background/90 backdrop-blur-sm rounded-full text-xs font-body">
                  {house.style}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {house.name}
                </h3>

                {/* Specs */}
                <div className="flex items-center gap-4 mb-4 text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Maximize className="w-4 h-4" />
                    <span className="text-sm font-body">{house.area} м²</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Bed className="w-4 h-4" />
                    <span className="text-sm font-body">{house.bedrooms}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Bath className="w-4 h-4" />
                    <span className="text-sm font-body">{house.bathrooms}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {house.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-3 py-1 bg-secondary rounded-full text-xs font-body text-muted-foreground"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <Button
                  onClick={scrollToContacts}
                  variant="outline"
                  className="w-full group/btn border-primary/30 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
                >
                  Получить план и смету
                  <ArrowUpRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <Button
            size="lg"
            onClick={scrollToContacts}
            className="bg-primary text-primary-foreground hover:bg-forest-light px-10 py-6"
          >
            Смотреть все проекты
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
