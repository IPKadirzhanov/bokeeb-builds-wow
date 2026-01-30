import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Sparkles, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const languages = [
  { code: 'ru', label: 'RU', name: 'Русский' },
  { code: 'kz', label: 'KZ', name: 'Қазақша' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'cn', label: '中', name: '中文' },
];

const quickQuestions = {
  ru: [
    'Сколько стоит построить дом?',
    'Какие сроки строительства?',
    'Какие гарантии вы даёте?',
  ],
  kz: [
    'Үй салу қанша тұрады?',
    'Құрылыс мерзімдері қандай?',
    'Қандай кепілдік бересіздер?',
  ],
  en: [
    'How much does it cost to build a house?',
    'What are the construction timelines?',
    'What guarantees do you provide?',
  ],
  cn: [
    '建房子要多少钱？',
    '施工周期是多长？',
    '你们提供什么保证？',
  ],
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
const LOG_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/log-chat`;

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<'ru' | 'kz' | 'en' | 'cn'>('ru');
  const [sessionId] = useState(() => generateSessionId());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greetings = {
        ru: 'Здравствуйте! Я ИИ-консультант BB BOKEEB. Чем могу помочь?',
        kz: 'Сәлеметсіз бе! Мен BB BOKEEB AI-кеңесшісімін. Қалай көмектесе аламын?',
        en: 'Hello! I am the BB BOKEEB AI consultant. How can I help you?',
        cn: '您好！我是BB BOKEEB的AI顾问。我能帮您什么？',
      };
      setMessages([{ role: 'assistant', content: greetings[language] }]);
    }
  }, [isOpen, language]);

  const logChat = useCallback(async (question: string, answer: string) => {
    try {
      await fetch(LOG_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          sessionId,
          language,
          question,
          answer,
        }),
      });
    } catch (err) {
      console.error('Failed to log chat:', err);
    }
  }, [sessionId, language]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: messageText.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    let assistantContent = '';

    try {
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          sessionId,
          language,
        }),
      });

      if (resp.status === 429) {
        toast({
          title: 'Слишком много запросов',
          description: 'Пожалуйста, подождите немного.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      if (!resp.ok || !resp.body) {
        throw new Error('Failed to get response');
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';

      // Add empty assistant message
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages((prev) => {
                const newMessages = [...prev];
                const lastMsg = newMessages[newMessages.length - 1];
                if (lastMsg?.role === 'assistant') {
                  lastMsg.content = assistantContent;
                }
                return newMessages;
              });
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      // Log the conversation
      if (assistantContent) {
        logChat(messageText, assistantContent);
      }
    } catch (err) {
      console.error('Chat error:', err);
      toast({
        title: 'Ошибка',
        description: 'Не удалось получить ответ. Попробуйте позже.',
        variant: 'destructive',
      });
      // Remove the empty assistant message on error
      setMessages((prev) => prev.filter((m) => m.content !== ''));
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    sendMessage(question);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/30 flex items-center justify-center"
          >
            <MessageCircle className="w-7 h-7" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] bg-card rounded-2xl shadow-2xl shadow-primary/10 overflow-hidden border border-border/50"
          >
            {/* Header */}
            <div className="p-4 bg-primary text-primary-foreground flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="font-body font-medium">BB BOKEEB Ассистент</div>
                <div className="text-xs text-primary-foreground/70 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Онлайн 24/7
                </div>
              </div>
              
              {/* Language Selector */}
              <div className="flex gap-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as typeof language)}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      language === lang.code
                        ? 'bg-primary-foreground text-primary'
                        : 'bg-primary-foreground/20 hover:bg-primary-foreground/30'
                    }`}
                    title={lang.name}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-primary-foreground/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="h-[350px] overflow-y-auto p-4 space-y-4 bg-secondary/20">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
                >
                  {msg.role === 'assistant' && (
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
                    {msg.content || (
                      <span className="inline-flex items-center gap-1">
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                      </span>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length <= 1 && (
              <div className="px-4 py-2 border-t border-border/50 bg-card">
                <div className="flex flex-wrap gap-2">
                  {quickQuestions[language].map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuickQuestion(q)}
                      className="px-3 py-1.5 text-xs font-body bg-secondary hover:bg-secondary/80 rounded-full transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-border/50 flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
                placeholder={
                  language === 'ru' ? 'Введите ваш вопрос...' :
                  language === 'kz' ? 'Сұрағыңызды жазыңыз...' :
                  language === 'en' ? 'Type your question...' :
                  '请输入您的问题...'
                }
                disabled={isLoading}
                className="flex-1 bg-secondary/50 border-none focus-visible:ring-1 focus-visible:ring-primary"
              />
              <Button
                size="icon"
                onClick={() => sendMessage(input)}
                disabled={isLoading || !input.trim()}
                className="bg-primary text-primary-foreground hover:bg-forest-light"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
