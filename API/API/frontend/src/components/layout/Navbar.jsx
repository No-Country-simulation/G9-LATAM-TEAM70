import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Cpu, LayoutDashboard, Info, LogOut, Sparkles, Sun, Moon } from 'lucide-react';
import { mockUser } from '@/services/mockData';
import { useTheme } from '@/context/ThemeContext';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const isAuthenticated = true;

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-slate-900 dark:text-white">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md">
            <Cpu className="h-5 w-5" />
          </div>
          <span>TechMind</span>
        </Link>

        {/* Links Centrales */}
        <nav className="hidden md:flex items-center gap-6 font-medium text-sm text-slate-600 dark:text-slate-300">
          <button
            onClick={() => scrollToSection('hero')}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
          >
            Inicio
          </button>
          <button
            onClick={() => scrollToSection('caracteristicas')}
            className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
          >
            <Sparkles className="h-4 w-4 text-indigo-500" />
            Características
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
          >
            <Info className="h-4 w-4" />
            Acerca del Equipo
          </button>
          <Link to="/workspace" className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            <LayoutDashboard className="h-4 w-4" />
            Workspace
          </Link>
        </nav>

        {/* Zona de Usuario y Toggle de Tema */}
        <div className="flex items-center gap-2">
          
          {/* Botón para alternar tema */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-amber-400" />
            ) : (
              <Moon className="h-5 w-5 text-slate-700" />
            )}
          </Button>

          {/* Menú o Botón Login */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-indigo-500/20">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={mockUser.avatarUrl} alt={mockUser.name} />
                    <AvatarFallback className="bg-indigo-100 text-indigo-700 font-semibold">
                      RR
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{mockUser.name}</p>
                    <p className="text-xs leading-none text-slate-500">{mockUser.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/workspace')}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Mi Workspace</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 focus:bg-red-50">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => navigate('/login')} className="bg-indigo-600 hover:bg-indigo-700">
              Iniciar Sesión
            </Button>
          )}
        </div>

      </div>
    </header>
  );
}