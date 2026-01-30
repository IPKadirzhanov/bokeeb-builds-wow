import { motion } from 'framer-motion';
import { Layout } from '@/components/Layout';
import { ProcessSection } from '@/components/ProcessSection';

export default function HowWeBuildPage() {
  return (
    <Layout>
      <div className="pt-24">
        {/* Hero */}
        <div className="container mx-auto px-4 lg:px-8 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-12 bg-accent" />
              <span className="text-accent font-body text-sm tracking-widest uppercase">
                Наш подход
              </span>
            </div>
            <h1 className="font-display text-3xl lg:text-5xl font-semibold text-foreground mb-6">
              Как мы строим дома
            </h1>
            <p className="text-muted-foreground font-body text-lg leading-relaxed">
              Мы разработали прозрачный и эффективный процесс строительства, 
              который гарантирует качество на каждом этапе. От первой консультации 
              до сдачи ключей — вы всегда в курсе происходящего.
            </p>
          </motion.div>
        </div>

        {/* Process Section (reused from main page) */}
        <ProcessSection />

        {/* Additional Content */}
        <div className="container mx-auto px-4 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                title: 'Контроль качества',
                description: 'На каждом этапе работ проводится проверка соответствия строительным нормам и стандартам.',
              },
              {
                title: 'Фото и видеоотчёты',
                description: 'Еженедельно отправляем вам фото и видео с объекта, чтобы вы видели прогресс.',
              },
              {
                title: 'Фиксированные сроки',
                description: 'Все сроки прописаны в договоре. За просрочку предусмотрена неустойка.',
              },
              {
                title: 'Прозрачная смета',
                description: 'Детальная смета без скрытых платежей. Вы знаете, за что платите.',
              },
              {
                title: 'Гарантия 5 лет',
                description: 'Полное гарантийное обслуживание и бесплатное устранение недостатков.',
              },
              {
                title: 'Один менеджер',
                description: 'Персональный менеджер ведёт ваш проект от начала до конца.',
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="p-6 bg-card rounded-xl"
              >
                <h3 className="font-display text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm font-body">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
