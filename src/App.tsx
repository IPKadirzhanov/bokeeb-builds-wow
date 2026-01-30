import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Catalog from "./pages/Catalog";
import HouseDetail from "./pages/HouseDetail";
import HowWeBuild from "./pages/HowWeBuild";
import About from "./pages/About";
import Contacts from "./pages/Contacts";
import Policy from "./pages/Policy";
import ThankYou from "./pages/ThankYou";
import AdminLogin from "./pages/admin/Login";
import AdminLeads from "./pages/admin/Leads";
import AdminHouses from "./pages/admin/Houses";
import AdminSettings from "./pages/admin/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/catalog/:slug" element={<HouseDetail />} />
            <Route path="/how-we-build" element={<HowWeBuild />} />
            <Route path="/about" element={<About />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/policy" element={<Policy />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/leads" element={<AdminLeads />} />
            <Route path="/admin/houses" element={<AdminHouses />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
