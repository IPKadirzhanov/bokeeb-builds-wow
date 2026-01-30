import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { MessageCircle, Send, Bot, User, Sparkles, Clock, Globe, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const features = [
  {
    icon: Clock,
    title: 'Работает 24/7',
    description: 'Получите ответ на любой вопрос в любое время суток.',
  },
  {
    icon: Globe,
    title: 'Многоязычность',
    description: 'Общайтесь на русском, английском или казахском языке.',
  },
  {
    icon: Zap,
    title: 'Мгновенные ответы',
    description: 'ИИ отвечает за секунды, экономя ваше время.',
  },
];

const sampleMessages = [
  { role: 'bot', text: 'Здравствуйте! Я ИИ-консультант BB BOKEEB. Чем могу помочь?' },
  { role: 'user', text: 'Сколько стоит построить дом 150 м²?' },
  { role: 'bot', text: 'Стоимость дома 150 м² начинается от 6.5 млн ₽ за стандартную комплектацию. Финальная цена зависит от выбранных материалов и особенностей проекта. Хотите получить детальную смету?' },
];

export const AIConsultant = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [message, setMessage] = useState('');

  const scrollToContacts = () => {
    const element = document.querySelector('#contacts');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="ai-consultant" ref={ref} className="py-24 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-12 bg-accent" />
              <span className="text-accent font-body text-sm tracking-widest uppercase">
                ИИ-Консультант
              </span>
            </div>
            <h2 className="font-display text-3xl lg:text-5xl font-semibold text-foreground mb-6">
              Ваш персональный
              <br />
              <span className="text-primary">помощник 24/7</span>
            </h2>
            <p className="text-muted-foreground text-lg font-body mb-10 leading-relaxed">
              Наш ИИ-менеджер ответит на любые вопросы о строительстве, поможет выбрать
              проект и рассчитает предварительную стоимость. Работает круглосуточно
              без выходных.
            </p>

            {/* Features */}
            <div className="space-y-6 mb-10">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-display text-lg font-semibold text-foreground mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-muted-foreground text-sm font-body">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button
              size="lg"
              onClick={scrollToContacts}
              className="bg-primary text-primary-foreground hover:bg-forest-light px-8 py-6 shadow-lg shadow-primary/20"
            >
              <MessageCircle className="mr-2 w-5 h-5" />
              Начать консультацию
            </Button>
          </motion.div>

          {/* Right - Chat Widget Demo */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            {/* Decorative Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-xl opacity-50" />
            
            {/* Chat Widget */}
            <div className="relative bg-card rounded-2xl shadow-2xl shadow-primary/10 overflow-hidden border border-border/50">
              {/* Header */}
              <div className="p-4 bg-primary text-primary-foreground flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-body font-medium">BB BOKEEB Ассистент</div>
                  <div className="text-xs text-primary-foreground/70 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    Онлайн
                  </div>
                </div>
                <Sparkles className="ml-auto w-5 h-5 text-accent" />
              </div>

              {/* Messages */}
              <div className="p-4 space-y-4 min-h-[300px] bg-secondary/20">
                {sampleMessages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.2 }}
                    className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
                  >
                    {msg.role === 'bot' && (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-2xl font-body text-sm ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-sm'
                          : 'bg-card text-foreground rounded-bl-sm shadow-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border/50 flex gap-3">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Введите ваш вопрос..."
                  className="flex-1 bg-secondary/50 border-none focus-visible:ring-1 focus-visible:ring-primary"
                />
                <Button
                  size="icon"
                  className="bg-primary text-primary-foreground hover:bg-forest-light"
                  onClick={scrollToContacts}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
