import { motion } from 'framer-motion';
import ManualTextInput from '@/components/sections/ManualTextInput';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-12 lg:py-16 px-6 max-w-7xl mx-auto">
      {/* Ambient Light / Glow Effect usando la paleta base */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-tr from-wisteria/20 via-golden/10 to-navy/20 blur-[120px] rounded-full pointer-events-none -z-10" 
        aria-hidden="true"
      />

      <div className="text-center max-w-4xl mx-auto space-y-8">
        {/* Titular Principal con Gradiente Radiante de la configuración */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-5xl font-extrabold tracking-tight text-primary leading-[1.15]"
        >
          Organiza tus documentos con{' '}
          <span className="text-gradient-radiant">
            clasificación inteligente
          </span>
        </motion.h1>

        {/* Subtítulo Secundario */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-base sm:text-lg text-secondary max-w-2xl mx-auto leading-normal"
        >
          {/* Opción Upstream (Activa) */}
          Categoriza apuntes, lecturas y textos de investigación al instante para estudiantes y profesores.

          {/* Opción Stashed (Guardada para consultar):
          Categoriza apuntes, lecturas y textos de investigación al instante.
          */}
        </motion.p>

        {/* Demo Interactivo Integrado (Fondo Wisteria sin Borde) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="pt-2 text-left bg-wisteria backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-2xl shadow-navy/10 dark:shadow-accent/5"
        >
          <div className="mb-6 text-center sm:text-left">
            <h3 className="text-xl font-bold text-primary">
              Pruébalo en tiempo real
            </h3>
            <p className="text-xs sm:text-sm text-secondary mt-1">
              Pega un fragmento de tus apuntes o guía de estudio para clasificarlo automáticamente.
            </p>
          </div>
          <ManualTextInput />
        </motion.div>
      </div>
    </section>
  );
}