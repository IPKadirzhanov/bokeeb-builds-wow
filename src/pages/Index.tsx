import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { TrustSection } from '@/components/TrustSection';
import { CatalogSection } from '@/components/CatalogSection';
import { ProcessSection } from '@/components/ProcessSection';
import { AIConsultant } from '@/components/AIConsultant';
import { ContactForm } from '@/components/ContactForm';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <TrustSection />
        <CatalogSection />
        <ProcessSection />
        <AIConsultant />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
