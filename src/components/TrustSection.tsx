import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { CheckCircle2, Users, Hammer, FileCheck, HeartHandshake } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Опытная команда',
    description: 'Более 50 профессионалов: архитекторы, инженеры, строители с многолетним опытом.',
  },
  {
    icon: Hammer,
    title: 'Собственное производство',
    description: 'Контролируем качество материалов и сроки поставки на каждом этапе.',
  },
  {
    icon: FileCheck,
    title: 'Прозрачные сметы',
    description: 'Детальные сметы без скрытых платежей. Фиксированная цена в договоре.',
  },
  {
    icon: HeartHandshake,
    title: 'Гарантия 5 лет',
    description: 'Полное гарантийное обслуживание и поддержка после сдачи объекта.',
  },
];

const stats = [
  { value: '200+', label: 'Построенных домов' },
  { value: '12', label: 'Лет на рынке' },
  { value: '98%', label: 'Довольных клиентов' },
  { value: '0', label: 'Судебных споров' },
];

export const TrustSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="trust" ref={ref} className="py-24 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-accent" />
            <span className="text-accent font-body text-sm tracking-widest uppercase">
              Почему выбирают нас
            </span>
            <div className="h-px w-12 bg-accent" />
          </div>
          <h2 className="font-display text-3xl lg:text-5xl font-semibold text-foreground mb-6">
            Надёжность, проверенная временем
          </h2>
          <p className="text-muted-foreground text-lg font-body">
            Мы не просто строим дома — мы создаём пространство для жизни вашей мечты
            с гарантией качества на каждом этапе.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              className="text-center p-6 rounded-lg bg-card shadow-sm"
            >
              <div className="font-display text-4xl lg:text-5xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-muted-foreground text-sm font-body">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              className="flex gap-5 p-6 rounded-xl bg-card shadow-sm card-hover"
            >
              <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground font-body leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quality Promise */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 p-8 lg:p-12 rounded-2xl bg-primary text-primary-foreground relative overflow-hidden"
        >
          <div className="absolute inset-0 blueprint-grid opacity-10" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
            <CheckCircle2 className="w-16 h-16 flex-shrink-0" />
            <div className="text-center lg:text-left">
              <h3 className="font-display text-2xl lg:text-3xl font-semibold mb-3">
                Наше обещание качества
              </h3>
              <p className="text-primary-foreground/80 font-body leading-relaxed max-w-2xl">
                Каждый дом проходит многоуровневый контроль качества. Мы используем только
                сертифицированные материалы от проверенных поставщиков и гарантируем соблюдение
                всех строительных норм и сроков.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
