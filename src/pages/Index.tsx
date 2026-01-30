import { Layout } from '@/components/Layout';
import { HeroSection } from '@/components/HeroSection';
import { TrustSection } from '@/components/TrustSection';
import { CatalogSection } from '@/components/CatalogSection';
import { ProcessSection } from '@/components/ProcessSection';
import { AIConsultant } from '@/components/AIConsultant';
import { ContactForm } from '@/components/ContactForm';

const Index = () => {
  return (
    <Layout showChat={false}>
      <HeroSection />
      <TrustSection />
      <CatalogSection />
      <ProcessSection />
      <AIConsultant />
      <ContactForm />
    </Layout>
  );
};

export default Index;
