import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import LandingPage from '@/pages/LandingPage';
import WorkspacePage from '@/pages/WorkspacePage';
import AboutPage from '@/features/landing/AboutSection';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/workspace" element={<WorkspacePage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
