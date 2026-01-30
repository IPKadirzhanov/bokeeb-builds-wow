import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/Layout';

export default function ThankYouPage() {
  return (
    <Layout showChat={false}>
      <div className="pt-24 pb-16 min-h-[80vh] flex items-center">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <CheckCircle className="w-10 h-10 text-primary" />
            </motion.div>

            <h1 className="font-display text-3xl lg:text-4xl font-semibold text-foreground mb-4">
              Спасибо за заявку!
            </h1>

            <p className="text-muted-foreground font-body text-lg mb-8 leading-relaxed">
              Мы получили вашу заявку и свяжемся с вами в ближайшее время. 
              Обычно это занимает не более 30 минут в рабочее время.
            </p>

            <div className="bg-card rounded-xl p-6 mb-8 text-left">
              <h3 className="font-display font-semibold mb-3">Что будет дальше?</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs flex-shrink-0">1</span>
                  <span>Наш менеджер свяжется с вами для уточнения деталей</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs flex-shrink-0">2</span>
                  <span>Мы подготовим предварительный расчёт стоимости</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs flex-shrink-0">3</span>
                  <span>При желании организуем встречу или видеозвонок</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="outline">
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" />
                  На главную
                </Link>
              </Button>
              <Button asChild className="bg-primary text-primary-foreground hover:bg-forest-light">
                <Link to="/catalog">
                  Смотреть каталог
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
