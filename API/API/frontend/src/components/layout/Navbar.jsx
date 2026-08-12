import { Link, useNavigate } from 'react-router-dom';
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
import { Cpu, LayoutDashboard, Info, LogOut, User } from 'lucide-react';
import { mockUser } from '@/services/mockData';

export default function Navbar() {
  const navigate = useNavigate();
  // Simulamos un estado de sesión para la maqueta
  const isAuthenticated = true; 

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-slate-900">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md">
            <Cpu className="h-5 w-5" />
          </div>
          <span>TechMind</span>
        </Link>

        {/* Links Centrales */}
        <nav className="hidden md:flex items-center gap-6 font-medium text-sm text-slate-600">
          <Link to="/" className="hover:text-indigo-600 transition-colors">
            Inicio
          </Link>
          <Link to="/workspace" className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
            <LayoutDashboard className="h-4 w-4" />
            Panel de Clasificación
          </Link>
          <Link to="/about" className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
            <Info className="h-4 w-4" />
            Acerca del Equipo
          </Link>
        </nav>

        {/* Zona de Usuario / Auth */}
        <div className="flex items-center gap-3">
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
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Mis Datos</span>
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