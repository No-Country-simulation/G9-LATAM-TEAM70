import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cpu, Code2, ShieldCheck, GitBranch, Users, Layers } from 'lucide-react';

export default function AboutSection() {
  const teamMembers = [
    { name: 'Rubén Rodríguez', role: 'Full Stack & ML Specialist', initial: 'RR' },
    { name: 'Integrante Team 70', role: 'Backend & Operations', initial: 'T7' },
    { name: 'Integrante Team 70', role: 'Frontend & UI/UX', initial: 'T7' },
  ];

  return (
    <section id="about" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="container mx-auto px-4 max-w-5xl space-y-12"
      >
        {/* Cabecera */}
        <div className="text-center space-y-4">
          <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
            <Users className="mr-1.5 h-3.5 w-3.5" /> Equipo & Arquitectura
          </Badge>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Acerca del Proyecto TechMind & Team 70
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            TechMind API es un microservicio de clasificación automática de texto desarrollado para el ecosistema enterprise, combinando la potencia de Spring Boot en el orquestador backend con un modelo de Machine Learning alojado en Python.
          </p>
        </div>

        {/* Grid de Arquitectura */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-slate-800/60 border-slate-700/60 text-white shadow-xl backdrop-blur-xs">
            <CardContent className="p-6 space-y-3">
              <div className="h-10 w-10 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg text-slate-100">Spring Boot Backend</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                API RESTful encargada del manejo de persistencia JPA, autenticación con JWT y exposición de endpoints seguros multipart/file.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/60 border-slate-700/60 text-white shadow-xl backdrop-blur-xs">
            <CardContent className="p-6 space-y-3">
              <div className="h-10 w-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Code2 className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg text-slate-100">Python ML Service</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Modelo entrenado con técnicas de NLP para categorizar contenido técnico, extraer entidades clave y calcular scores de certidumbre.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/60 border-slate-700/60 text-white shadow-xl backdrop-blur-xs">
            <CardContent className="p-6 space-y-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg text-slate-100">Vite + React UI</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Interfaz SPA reactiva maquetada con Tailwind CSS v4, componentes Shadcn UI y animaciones fluidas para una experiencia interactiva.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Miembros del equipo */}
        <div className="pt-6 border-t border-slate-800">
          <h3 className="text-center text-xs font-semibold uppercase tracking-wider text-slate-400 mb-8">
            Desarrollado por LATAM Team 70
          </h3>
          <div className="flex justify-center gap-8 flex-wrap">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-slate-800/40 p-3 px-4 rounded-xl border border-slate-700/40">
                <div className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                  {member.initial}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-200">{member.name}</p>
                  <p className="text-[11px] text-slate-400">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}