import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Cpu, Lock, Mail, User, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación básica en registro
    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        setError('Las contraseñas no coinciden');
        return;
      }
    }

    setIsLoading(true);

    // Simulación de autenticación (1.2s)
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);

      setTimeout(() => {
        login({
          username: isLogin ? formData.email.split('@')[0] : formData.username,
          email: formData.email,
        });
        navigate('/workspace');
      }, 800);
    }, 1200);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-main transition-colors">
      {/* Animación fade-in en la carga inicial */}
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        <Card className="border-border bg-card shadow-2xl rounded-2xl overflow-hidden transition-all">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-wisteria/20 flex items-center justify-center text-wisteria mb-2">
              <Cpu className="h-6 w-6 text-navy dark:text-wisteria" />
            </div>
            <CardTitle className="text-2xl font-bold text-primary">
              {isLogin ? '¡Bienvenido de nuevo!' : 'Crear una cuenta'}
            </CardTitle>
            <CardDescription className="text-secondary">
              {isLogin
                ? 'Ingresa tus credenciales para acceder a TechMind'
                : 'Completa los campos para comenzar a usar la plataforma'}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            {isSuccess ? (
              <div className="py-8 text-center flex flex-col items-center gap-3">
                <CheckCircle2 className="h-12 w-12 text-emerald-500 animate-bounce" />
                <p className="font-semibold text-lg text-primary">
                  {isLogin ? '¡Sesión Iniciada!' : '¡Cuenta Creada Exitosamente!'}
                </p>
                <p className="text-xs text-secondary">Redirigiendo a tu Workspace...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-1.5">
                    <label htmlFor="username" className="block text-primary font-medium text-xs">
                      Nombre de Usuario
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-secondary" />
                      <Input
                        id="username"
                        type="text"
                        name="username"
                        required
                        placeholder="ej. carlos_dev"
                        value={formData.username}
                        onChange={handleChange}
                        className="pl-9 bg-input border-border text-primary rounded-xl focus:ring-2 focus:ring-wisteria"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-primary font-medium text-xs">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-secondary" />
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      required
                      placeholder="usuario@techmind.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-9 bg-input border-border text-primary rounded-xl focus:ring-2 focus:ring-wisteria"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="password" className="block text-primary font-medium text-xs">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-secondary" />
                    <Input
                      id="password"
                      type="password"
                      name="password"
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-9 bg-input border-border text-primary rounded-xl focus:ring-2 focus:ring-wisteria"
                    />
                  </div>
                </div>

                {!isLogin && (
                  <div className="space-y-1.5">
                    <label htmlFor="confirmPassword" className="block text-primary font-medium text-xs">
                      Confirmar Contraseña
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-secondary" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        name="confirmPassword"
                        required
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="pl-9 bg-input border-border text-primary rounded-xl focus:ring-2 focus:ring-wisteria"
                      />
                    </div>
                  </div>
                )}

                {error && (
                  <p className="text-xs text-red-500 font-medium text-center">{error}</p>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-navy hover:bg-navy/90 text-snow dark:bg-wisteria dark:text-navy dark:hover:bg-wisteria/90 font-bold rounded-xl h-11 transition-all mt-2 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Procesando...
                    </>
                  ) : isLogin ? (
                    'Iniciar Sesión'
                  ) : (
                    'Crear Cuenta'
                  )}
                </Button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError('');
                    }}
                    className="text-xs text-secondary hover:text-primary transition-colors cursor-pointer"
                  >
                    {isLogin ? (
                      <>
                        ¿No tienes una cuenta?{' '}
                        <span className="font-bold text-wisteria underline">Regístrate gratis</span>
                      </>
                    ) : (
                      <>
                        ¿Ya tienes una cuenta?{' '}
                        <span className="font-bold text-wisteria underline">Inicia Sesión</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}