import { motion } from 'framer-motion';
import { Layout } from '@/components/Layout';

export default function PolicyPage() {
  return (
    <Layout showChat={false}>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="font-display text-3xl lg:text-4xl font-semibold text-foreground mb-8">
              Политика конфиденциальности
            </h1>

            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground font-body leading-relaxed mb-6">
                Последнее обновление: Январь 2024
              </p>

              <h2 className="font-display text-xl font-semibold mt-8 mb-4">1. Общие положения</h2>
              <p className="text-muted-foreground font-body leading-relaxed mb-4">
                Настоящая политика конфиденциальности регулирует порядок сбора, хранения 
                и использования персональных данных пользователей сайта BB BOKEEB 
                (далее — «Компания»).
              </p>

              <h2 className="font-display text-xl font-semibold mt-8 mb-4">2. Какие данные мы собираем</h2>
              <p className="text-muted-foreground font-body leading-relaxed mb-4">
                Мы можем собирать следующие персональные данные:
              </p>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground font-body space-y-2">
                <li>Имя и контактные данные (телефон, email)</li>
                <li>Информация о запросах и предпочтениях</li>
                <li>Данные об использовании сайта (cookies, IP-адрес)</li>
              </ul>

              <h2 className="font-display text-xl font-semibold mt-8 mb-4">3. Цели обработки данных</h2>
              <p className="text-muted-foreground font-body leading-relaxed mb-4">
                Персональные данные используются для:
              </p>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground font-body space-y-2">
                <li>Обработки заявок и консультирования</li>
                <li>Связи с клиентами по вопросам услуг</li>
                <li>Улучшения качества обслуживания</li>
                <li>Отправки информационных материалов (с согласия)</li>
              </ul>

              <h2 className="font-display text-xl font-semibold mt-8 mb-4">4. Защита данных</h2>
              <p className="text-muted-foreground font-body leading-relaxed mb-4">
                Мы принимаем все необходимые меры для защиты ваших персональных данных 
                от несанкционированного доступа, изменения, раскрытия или уничтожения.
              </p>

              <h2 className="font-display text-xl font-semibold mt-8 mb-4">5. Передача данных третьим лицам</h2>
              <p className="text-muted-foreground font-body leading-relaxed mb-4">
                Мы не передаём персональные данные третьим лицам, за исключением случаев:
              </p>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground font-body space-y-2">
                <li>Вашего явного согласия</li>
                <li>Требований законодательства</li>
                <li>Защиты прав и интересов Компании</li>
              </ul>

              <h2 className="font-display text-xl font-semibold mt-8 mb-4">6. Cookies</h2>
              <p className="text-muted-foreground font-body leading-relaxed mb-4">
                Сайт использует cookies для улучшения пользовательского опыта. 
                Вы можете отключить cookies в настройках браузера.
              </p>

              <h2 className="font-display text-xl font-semibold mt-8 mb-4">7. Ваши права</h2>
              <p className="text-muted-foreground font-body leading-relaxed mb-4">
                Вы имеете право:
              </p>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground font-body space-y-2">
                <li>Запросить информацию о хранящихся данных</li>
                <li>Потребовать исправления неточных данных</li>
                <li>Потребовать удаления ваших данных</li>
                <li>Отозвать согласие на обработку данных</li>
              </ul>

              <h2 className="font-display text-xl font-semibold mt-8 mb-4">8. Контакты</h2>
              <p className="text-muted-foreground font-body leading-relaxed mb-4">
                По вопросам, связанным с политикой конфиденциальности, 
                обращайтесь по email: <a href="mailto:info@bbbokeeb.kz" className="text-primary hover:underline">info@bbbokeeb.kz</a>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
