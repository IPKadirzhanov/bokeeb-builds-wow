import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUp, Phone, Mail, MapPin } from 'lucide-react';

const navLinks = [
  { name: 'Главная', href: '/' },
  { name: 'Каталог домов', href: '/catalog' },
  { name: 'Как мы строим', href: '/how-we-build' },
  { name: 'О компании', href: '/about' },
  { name: 'Контакты', href: '/contacts' },
];

const services = [
  'Проектирование домов',
  'Строительство под ключ',
  'Ремонт и реконструкция',
  'Ландшафтный дизайн',
  'Инженерные системы',
];

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-primary text-primary-foreground relative overflow-hidden">
      {/* Blueprint Background */}
      <div className="absolute inset-0 blueprint-grid opacity-5" />

      <div className="container mx-auto px-4 lg:px-8 py-16 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary-foreground rounded flex items-center justify-center">
                <span className="text-primary font-display text-lg font-bold">BB</span>
              </div>
              <div>
                <span className="font-display text-xl font-semibold">BB BOKEEB</span>
              </div>
            </div>
            <p className="text-primary-foreground/70 font-body text-sm leading-relaxed mb-6">
              Строим дома, в которых хочется жить. Более 12 лет опыта в премиальном
              строительстве частных домов.
            </p>
            <div className="flex gap-4">
              {/* Social placeholders */}
              {['Instagram', 'YouTube', 'WhatsApp'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                >
                  <span className="text-xs font-body">{social[0]}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6">Навигация</h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors font-body text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6">Услуги</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <span className="text-primary-foreground/70 font-body text-sm">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6">Контакты</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:+77771234567"
                  className="flex items-center gap-3 text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span className="font-body text-sm">+7 (777) 123-45-67</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@bbbokeeb.kz"
                  className="flex items-center gap-3 text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span className="font-body text-sm">info@bbbokeeb.kz</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-primary-foreground/70">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  <span className="font-body text-sm">г. Алматы, ул. Строителей, 15</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <Link
            to="/admin/login"
            className="text-primary-foreground/50 hover:text-primary-foreground/70 font-body text-sm transition-colors cursor-default"
          >
            © 2024 BB BOKEEB. Все права защищены.
          </Link>
          <motion.button
            onClick={scrollToTop}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors font-body text-sm"
          >
            Наверх
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
};
