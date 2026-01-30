import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight, Shield, Clock, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-house.jpg';

const trustBadges = [
  { icon: Shield, text: '5 лет гарантии', subtext: 'на все работы' },
  { icon: Clock, text: '12+ лет', subtext: 'опыта работы' },
  { icon: Award, text: '200+ домов', subtext: 'построено' },
];

export const HeroSection = () => {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Современный частный дом"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-background/30" />
      </div>

      {/* Blueprint Grid Overlay */}
      <div className="absolute inset-0 blueprint-grid opacity-30 z-[1]" />

      {/* Content */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-24 lg:pt-0">
        <div className="max-w-3xl">
          {/* Preheader */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="h-px w-12 bg-accent" />
            <span className="text-accent font-body text-sm tracking-widest uppercase">
              BB BOKEEB — Строительная компания
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display text-4xl sm:text-5xl lg:text-7xl font-semibold text-foreground leading-tight mb-6"
          >
            Строим дома,
            <br />
            <span className="text-primary">в которых хочется жить</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg lg:text-xl text-muted-foreground max-w-xl mb-10 font-body leading-relaxed"
          >
            Проектируем и возводим частные дома премиум-класса с полным контролем
            качества на каждом этапе. От фундамента до чистовой отделки.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            <Button
              size="lg"
              onClick={() => scrollToSection('#contacts')}
              className="group bg-primary text-primary-foreground hover:bg-forest-light px-8 py-6 text-base font-medium shadow-xl shadow-primary/25 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/30"
            >
              Рассчитать стоимость дома
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection('#catalog')}
              className="border-2 border-primary/30 text-foreground hover:border-primary hover:bg-primary/5 px-8 py-6 text-base font-medium transition-all duration-300"
            >
              Смотреть каталог
            </Button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap gap-8 lg:gap-12"
          >
            {trustBadges.map((badge, index) => (
              <motion.div
                key={badge.text}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <badge.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-display text-xl font-semibold text-foreground">
                    {badge.text}
                  </div>
                  <div className="text-sm text-muted-foreground">{badge.subtext}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.button
          onClick={() => scrollToSection('#trust')}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="text-xs uppercase tracking-widest">Узнать больше</span>
          <ArrowDown className="w-5 h-5" />
        </motion.button>
      </motion.div>

      {/* Decorative Elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute right-0 top-1/4 w-96 h-96 bg-accent rounded-full blur-3xl z-0"
      />
    </section>
  );
};
