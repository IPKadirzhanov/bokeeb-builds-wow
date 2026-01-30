import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ChatWidget } from '@/components/ChatWidget';

interface LayoutProps {
  children: React.ReactNode;
  showChat?: boolean;
}

export function Layout({ children, showChat = true }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      {showChat && <ChatWidget />}
    </div>
  );
}
