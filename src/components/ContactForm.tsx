import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Send, Phone, Mail, MapPin, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const contactInfo = [
  {
    icon: Phone,
    label: 'Телефон',
    value: '+7 (777) 123-45-67',
    href: 'tel:+77771234567',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'info@bbbokeeb.kz',
    href: 'mailto:info@bbbokeeb.kz',
  },
  {
    icon: MapPin,
    label: 'Адрес',
    value: 'г. Алматы, ул. Строителей, 15',
    href: '#',
  },
];

export const ContactForm = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: 'Заявка отправлена!',
      description: 'Мы свяжемся с вами в ближайшее время.',
    });

    setFormData({ name: '', phone: '', email: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <section id="contacts" ref={ref} className="py-24 lg:py-32 bg-secondary/30 relative overflow-hidden">
      {/* Blueprint Background */}
      <div className="absolute inset-0 blueprint-grid opacity-30" />

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
              Свяжитесь с нами
            </span>
            <div className="h-px w-12 bg-accent" />
          </div>
          <h2 className="font-display text-3xl lg:text-5xl font-semibold text-foreground mb-6">
            Готовы обсудить ваш проект?
          </h2>
          <p className="text-muted-foreground text-lg font-body">
            Оставьте заявку, и мы свяжемся с вами в течение 30 минут
            для бесплатной консультации.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="p-8 lg:p-10 bg-card rounded-2xl shadow-lg">
              <h3 className="font-display text-2xl font-semibold text-foreground mb-8">
                Рассчитать стоимость дома
              </h3>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-body text-muted-foreground mb-2">
                    Ваше имя *
                  </label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Иван Иванов"
                    className="bg-secondary/50 border-border focus-visible:ring-primary h-12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-body text-muted-foreground mb-2">
                    Телефон *
                  </label>
                  <Input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+7 (___) ___-__-__"
                    className="bg-secondary/50 border-border focus-visible:ring-primary h-12"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-body text-muted-foreground mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="example@email.com"
                  className="bg-secondary/50 border-border focus-visible:ring-primary h-12"
                />
              </div>

              <div className="mb-8">
                <label className="block text-sm font-body text-muted-foreground mb-2">
                  Расскажите о вашем проекте
                </label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Площадь дома, количество этажей, особые пожелания..."
                  rows={4}
                  className="bg-secondary/50 border-border focus-visible:ring-primary resize-none"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full bg-primary text-primary-foreground hover:bg-forest-light py-6 text-base shadow-lg shadow-primary/20 transition-all duration-300"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                    />
                    Отправка...
                  </span>
                ) : (
                  <>
                    Отправить заявку
                    <Send className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4 font-body">
                Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
              </p>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Quick Response Promise */}
            <div className="p-6 bg-primary rounded-xl text-primary-foreground">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 className="w-6 h-6" />
                <h4 className="font-display text-lg font-semibold">Быстрый ответ</h4>
              </div>
              <p className="text-primary-foreground/80 font-body text-sm">
                Мы перезвоним вам в течение 30 минут в рабочее время или утром следующего дня.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-body uppercase tracking-widest mb-1">
                      {item.label}
                    </div>
                    <div className="font-body text-foreground font-medium">{item.value}</div>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Working Hours */}
            <div className="p-6 bg-card rounded-xl shadow-sm">
              <h4 className="font-display text-lg font-semibold text-foreground mb-4">
                Время работы
              </h4>
              <div className="space-y-2 text-sm font-body">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Пн — Пт</span>
                  <span className="text-foreground">9:00 — 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Суббота</span>
                  <span className="text-foreground">10:00 — 15:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Воскресенье</span>
                  <span className="text-foreground">Выходной</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
