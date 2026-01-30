import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  MessageSquare, 
  PenTool, 
  FileText, 
  HardHat, 
  Hammer, 
  Key,
  CheckCircle,
  ArrowRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const steps = [
  {
    number: '01',
    icon: MessageSquare,
    title: 'Консультация',
    duration: '1-2 дня',
    description: 'Обсуждаем ваши пожелания, бюджет и сроки. Подбираем оптимальный проект или создаём индивидуальный.',
    details: ['Бесплатный выезд на участок', 'Анализ грунта', 'Предварительная смета'],
  },
  {
    number: '02',
    icon: PenTool,
    title: 'Проектирование',
    duration: '2-4 недели',
    description: 'Разрабатываем архитектурный проект с учётом всех ваших пожеланий и особенностей участка.',
    details: ['3D-визуализация', 'Инженерные сети', 'Согласование'],
  },
  {
    number: '03',
    icon: FileText,
    title: 'Договор и смета',
    duration: '3-5 дней',
    description: 'Фиксируем все условия, сроки и стоимость работ в детальном договоре.',
    details: ['Прозрачное ценообразование', 'Фиксированная стоимость', 'Поэтапная оплата'],
  },
  {
    number: '04',
    icon: HardHat,
    title: 'Подготовка',
    duration: '1-2 недели',
    description: 'Подготавливаем участок, заливаем фундамент и организуем строительную площадку.',
    details: ['Геодезия', 'Фундамент', 'Коммуникации'],
  },
  {
    number: '05',
    icon: Hammer,
    title: 'Строительство',
    duration: '3-6 месяцев',
    description: 'Возводим дом с ежедневным контролем качества. Регулярно отчитываемся о прогрессе.',
    details: ['Фотоотчёты', 'Контроль качества', 'Авторский надзор'],
  },
  {
    number: '06',
    icon: Key,
    title: 'Сдача объекта',
    duration: '1 неделя',
    description: 'Передаём ключи от готового дома с полным пакетом документов и гарантией.',
    details: ['Акт приёмки', 'Документация', 'Гарантия 5 лет'],
  },
];

export const ProcessSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const scrollToContacts = () => {
    const element = document.querySelector('#contacts');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="process" ref={ref} className="py-24 lg:py-32 bg-secondary/30 relative overflow-hidden">
      {/* Blueprint Background */}
      <div className="absolute inset-0 blueprint-grid opacity-50" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
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
              Как мы строим
            </span>
            <div className="h-px w-12 bg-accent" />
          </div>
          <h2 className="font-display text-3xl lg:text-5xl font-semibold text-foreground mb-6">
            Прозрачный процесс строительства
          </h2>
          <p className="text-muted-foreground text-lg font-body">
            От первой встречи до передачи ключей — вы всегда знаете, что происходит
            с вашим будущим домом.
          </p>
        </motion.div>

        {/* Process Steps */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />

          <div className="space-y-12 lg:space-y-0">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className={`relative lg:grid lg:grid-cols-2 lg:gap-16 items-center ${
                  index % 2 === 0 ? '' : 'lg:[direction:rtl]'
                }`}
              >
                {/* Timeline Node */}
                <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 bg-primary rounded-full items-center justify-center z-10">
                  <CheckCircle className="w-6 h-6 text-primary-foreground" />
                </div>

                {/* Content Card */}
                <div className={`lg:[direction:ltr] ${index % 2 === 0 ? 'lg:pr-16' : 'lg:pl-16'}`}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="p-8 bg-card rounded-xl shadow-sm border border-border/50"
                  >
                    {/* Step Header */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-primary/10">
                        <step.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="text-xs text-accent font-body tracking-widest uppercase mb-1">
                          Этап {step.number}
                        </div>
                        <h3 className="font-display text-xl font-semibold text-foreground">
                          {step.title}
                        </h3>
                      </div>
                      <div className="ml-auto px-3 py-1 bg-secondary rounded-full text-xs font-body text-muted-foreground">
                        {step.duration}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground font-body mb-4 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Details */}
                    <div className="flex flex-wrap gap-2">
                      {step.details.map((detail) => (
                        <span
                          key={detail}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/5 rounded-full text-xs font-body text-primary"
                        >
                          <span className="w-1 h-1 bg-primary rounded-full" />
                          {detail}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Empty Column for Alternating Layout */}
                <div className="hidden lg:block" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center mt-16"
        >
          <Button
            size="lg"
            onClick={scrollToContacts}
            className="bg-primary text-primary-foreground hover:bg-forest-light px-10 py-6 shadow-xl shadow-primary/20"
          >
            Начать строительство
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
