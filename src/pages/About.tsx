import { motion } from 'framer-motion';
import { Award, Users, Home, Shield } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { TrustSection } from '@/components/TrustSection';

export default function AboutPage() {
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
                О компании
              </span>
            </div>
            <h1 className="font-display text-3xl lg:text-5xl font-semibold text-foreground mb-6">
              BB BOKEEB
            </h1>
            <p className="text-muted-foreground font-body text-lg leading-relaxed mb-8">
              Строительная компания BB BOKEEB специализируется на возведении 
              частных домов премиум-класса в Казахстане. Мы работаем с 2012 года 
              и за это время построили более 200 домов для счастливых семей.
            </p>
          </motion.div>
        </div>

        {/* Mission */}
        <div className="bg-secondary/30 py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid lg:grid-cols-2 gap-12 items-center"
            >
              <div>
                <h2 className="font-display text-2xl lg:text-3xl font-semibold mb-6">
                  Наша миссия
                </h2>
                <p className="text-muted-foreground font-body leading-relaxed mb-6">
                  Мы верим, что каждая семья заслуживает дом своей мечты. 
                  Наша цель — сделать процесс строительства прозрачным, 
                  предсказуемым и комфортным для клиента.
                </p>
                <p className="text-muted-foreground font-body leading-relaxed">
                  Мы не просто строим стены — мы создаём пространство для жизни, 
                  где будут расти ваши дети и внуки. Поэтому к каждому проекту 
                  подходим как к собственному дому.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: Home, value: '200+', label: 'Построенных домов' },
                  { icon: Users, value: '50+', label: 'Специалистов' },
                  { icon: Award, value: '12', label: 'Лет опыта' },
                  { icon: Shield, value: '5', label: 'Лет гарантии' },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 bg-card rounded-xl text-center"
                  >
                    <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                    <div className="font-display text-3xl font-bold text-primary mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Trust Section */}
        <TrustSection />

        {/* Team */}
        <div className="container mx-auto px-4 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-2xl lg:text-3xl font-semibold text-center mb-12">
              Наша команда
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { name: 'Бауыржан Бокеев', role: 'Генеральный директор', experience: '15 лет в строительстве' },
                { name: 'Асылхан Нурланов', role: 'Главный архитектор', experience: '12 лет проектирования' },
                { name: 'Динара Ахметова', role: 'Руководитель отдела продаж', experience: '8 лет работы с клиентами' },
              ].map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-24 h-24 bg-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="font-display text-2xl text-primary">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold mb-1">{member.name}</h3>
                  <p className="text-primary text-sm mb-1">{member.role}</p>
                  <p className="text-muted-foreground text-xs">{member.experience}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
