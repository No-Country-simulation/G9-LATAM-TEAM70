import HeroSection from '@/components/sections/HeroSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import Footer from '@/components/layout/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* 1. Hero Principal con Demo Interactivo integrado */}
      <HeroSection />

      {/* 2. Sección de Características Principales */}
      <FeaturesSection />

      {/* 3. Pie de página */}
      <Footer />
    </div>
  );
}