import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';

// --- IMPORTACIONES ACTIVAS ---
import LandingPage from '@/pages/LandingPage';
import WorkspacePage from '@/pages/WorkspacePage';
import AboutPage from '@/features/landing/AboutSection';
// import LoginPage from '@/pages/LoginPage'; // <-- LOGIN COMENTADO PARA PRUEBAS

// --- IMPORTACIONES DEL STASH (Pendientes de revisión) ---
// import { AuthProvider } from '@/context/AuthContext';
// import AuthPage from '@/pages/AuthPage';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/workspace" element={<WorkspacePage />} />
            <Route path="/about" element={<AboutPage />} />
            {/* <Route path="/login" element={<LoginPage />} /> */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

/*
====================================================================
  VERSIÓN STASHED (Guardada para consultar con el equipo más tarde)
====================================================================

export default function AppStashed() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-main text-primary transition-colors">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/workspace" element={<WorkspacePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/login" element={<AuthPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}
*/