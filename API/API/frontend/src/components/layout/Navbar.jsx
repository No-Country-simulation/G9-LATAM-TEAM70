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
import { Cpu, LayoutDashboard, LogOut, Sun, Moon } from 'lucide-react';
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
    <header className="sticky top-0 z-50 w-full border-b border-border bg-main/80 backdrop-blur-md transition-colors">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-7xl">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 font-bold text-xl text-primary">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-wisteria text-navy shadow-lg shadow-wisteria/20">
            <Cpu className="h-5 w-5" />
          </div>
          <span className="tracking-tight">TechMind</span>
        </Link>

        {/* Links Centrales */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-secondary">
          <button
            onClick={() => scrollToSection('hero')}
            className="hover:text-wisteria transition-colors cursor-pointer"
          >
            Inicio
          </button>
          <button
            onClick={() => scrollToSection('caracteristicas')}
            className="flex items-center gap-1.5 hover:text-wisteria transition-colors cursor-pointer"
          >
            Características
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="flex items-center gap-1.5 hover:text-wisteria transition-colors cursor-pointer"
          >
            Acerca del Equipo
          </button>
          <Link to="/workspace" className="flex items-center gap-1.5 hover:text-wisteria transition-colors">
            <LayoutDashboard className="h-4 w-4" />
            Workspace
          </Link>
        </nav>

        {/* Zona de Usuario y Toggle de Tema */}
        <div className="flex items-center gap-3">
          
          {/* Botón para alternar tema */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-xl text-secondary hover:bg-input hover:text-primary transition-colors"
            title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-golden" />
            ) : (
              <Moon className="h-5 w-5 text-secondary" />
            )}
          </Button>

          {/* Menú o Botón Login */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-wisteria/30 hover:ring-wisteria p-0 transition-all">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={mockUser.avatarUrl} alt={mockUser.name} />
                    <AvatarFallback className="bg-wisteria text-navy font-semibold">
                      RR
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-card border-border text-primary" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-primary">{mockUser.name}</p>
                    <p className="text-xs leading-none text-secondary">{mockUser.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem onClick={() => navigate('/workspace')} className="focus:bg-input focus:text-primary cursor-pointer">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Mi Workspace</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem className="text-red-500 focus:bg-red-500/10 focus:text-red-500 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => navigate('/login')} className="bg-wisteria hover:opacity-90 text-navy font-semibold rounded-xl">
              Iniciar Sesión
            </Button>
          )}
        </div>

      </div>
    </header>
  );
}