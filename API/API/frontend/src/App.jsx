import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';

// Vistas Temporales (Placeholders para verificar que el router funciona)
import LandingPage from '@/pages/LandingPage';
import WorkspacePage from '@/pages/WorkspacePage';
import AboutPage from '@/features/landing/AboutSection';
import LoginPage from '@/pages/LoginPage';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
        <Navbar />
        <main className="flex-1">
          Hello world!
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/workspace" element={<WorkspacePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}