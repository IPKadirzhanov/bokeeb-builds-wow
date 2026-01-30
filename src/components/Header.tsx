import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Grid3X3, Building2, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { name: 'Главная', href: '#hero', icon: Home },
  { name: 'Каталог домов', href: '#catalog', icon: Grid3X3 },
  { name: 'Как мы строим', href: '#process', icon: Building2 },
  { name: 'Контакты', href: '#contacts', icon: Phone },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-md shadow-lg shadow-primary/5'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <nav className="flex items-center justify-between h-20 lg:h-24">
          {/* Logo */}
          <motion.a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('#hero');
            }}
            className="flex items-center gap-3 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-primary rounded flex items-center justify-center">
              <span className="text-primary-foreground font-display text-lg lg:text-xl font-bold">
                BB
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl lg:text-2xl font-semibold text-foreground tracking-tight">
                BB BOKEEB
              </span>
              <span className="text-xs text-muted-foreground tracking-widest uppercase hidden sm:block">
                Строительство домов
              </span>
            </div>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.href);
                }}
                className="flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors duration-300 underline-hover font-body text-sm"
                whileHover={{ y: -2 }}
              >
                <link.icon className="w-4 h-4" />
                {link.name}
              </motion.a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => scrollToSection('#ai-consultant')}
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Консультация
            </Button>
            <Button
              onClick={() => scrollToSection('#contacts')}
              className="bg-primary text-primary-foreground hover:bg-forest-light transition-all duration-300 shadow-lg shadow-primary/20"
            >
              Рассчитать стоимость
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-foreground"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-background/98 backdrop-blur-lg border-t border-border"
          >
            <div className="container mx-auto px-4 py-6 space-y-4">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(link.href);
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 py-3 text-foreground/80 hover:text-foreground transition-colors"
                >
                  <link.icon className="w-5 h-5" />
                  {link.name}
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="pt-4 space-y-3"
              >
                <Button
                  onClick={() => scrollToSection('#contacts')}
                  className="w-full bg-primary text-primary-foreground"
                >
                  Рассчитать стоимость
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
