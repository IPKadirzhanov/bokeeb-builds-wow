import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { LeadForm } from '@/components/LeadForm';

export default function ContactsPage() {
  return (
    <Layout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mb-16"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-12 bg-accent" />
              <span className="text-accent font-body text-sm tracking-widest uppercase">
                Контакты
              </span>
            </div>
            <h1 className="font-display text-3xl lg:text-5xl font-semibold text-foreground mb-6">
              Свяжитесь с нами
            </h1>
            <p className="text-muted-foreground font-body text-lg leading-relaxed">
              Готовы обсудить ваш будущий дом? Свяжитесь с нами любым удобным способом 
              или оставьте заявку — мы перезвоним в течение 30 минут.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="space-y-8 mb-12">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold mb-1">Телефон</h3>
                    <a href="tel:+77771234567" className="text-muted-foreground hover:text-primary transition-colors">
                      +7 (777) 123-45-67
                    </a>
                    <p className="text-sm text-muted-foreground mt-1">Звоните с 9:00 до 20:00</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold mb-1">WhatsApp</h3>
                    <a href="https://wa.me/77771234567" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                      +7 (777) 123-45-67
                    </a>
                    <p className="text-sm text-muted-foreground mt-1">Отвечаем в течение часа</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold mb-1">Email</h3>
                    <a href="mailto:info@bbbokeeb.kz" className="text-muted-foreground hover:text-primary transition-colors">
                      info@bbbokeeb.kz
                    </a>
                    <p className="text-sm text-muted-foreground mt-1">Для официальных запросов</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold mb-1">Офис</h3>
                    <p className="text-muted-foreground">
                      г. Алматы, ул. Строительная, 1
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Приём по предварительной записи</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold mb-1">Режим работы</h3>
                    <p className="text-muted-foreground">Пн-Пт: 9:00 — 18:00</p>
                    <p className="text-muted-foreground">Сб: 10:00 — 15:00</p>
                    <p className="text-sm text-muted-foreground mt-1">Вс — выходной</p>
                  </div>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="rounded-xl overflow-hidden bg-secondary h-64 flex items-center justify-center">
                <p className="text-muted-foreground">Карта скоро будет добавлена</p>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="bg-card rounded-2xl p-8 shadow-lg">
                <h2 className="font-display text-xl font-semibold mb-6">
                  Оставить заявку
                </h2>
                <LeadForm source="contacts_page" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
