import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';

// Vistas Temporales (Placeholders para verificar que el router funciona)
import LandingPage from '@/pages/LandingPage';
import WorkspacePage from '@/pages/WorkspacePage';
import AboutPage from '@/pages/AboutPage';
import LoginPage from '@/pages/LoginPage';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
        <Navbar />
        <main className="flex-1">
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