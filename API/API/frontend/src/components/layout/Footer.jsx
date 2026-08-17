import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cpu, Code2, Layers, Users } from 'lucide-react';

export default function Footer() {
  const teamMembers = [
    {
      name: 'Rubén Rodríguez',
      role: 'Full Stack & ML Specialist',
      initial: 'RR',
      description: 'Encargado del diseño de la arquitectura general, integración de servicios Spring Boot e implementación de modelos NLP.',
      linkedin: 'https://linkedin.com/in/',
      github: 'https://github.com/',
    },
    {
      name: 'Integrante Team 70',
      role: 'Backend & Operations',
      initial: 'T7',
      description: 'Especialista en persistencia de datos, seguridad JWT y optimización de microservicios en Spring Boot.',
      linkedin: 'https://linkedin.com/in/',
      github: 'https://github.com/',
    },
    {
      name: 'Integrante Team 70',
      role: 'Frontend & UI/UX',
      initial: 'T7',
      description: 'Diseñador e implementador de la interfaz reactiva SPA utilizando React, Tailwind CSS y componentes accesibles.',
      linkedin: 'https://linkedin.com/in/',
      github: 'https://github.com/',
    },
  ];

  return (
    <section id="about" className="py-16 bg-card border-t border-border text-primary relative overflow-hidden transition-colors">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="container mx-auto px-4 max-w-4xl space-y-12"
      >
        {/* Cabecera */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-primary">
            Acerca del Proyecto TechMind & Team 70
          </h2>
          <p className="text-secondary max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            TechMind API es un microservicio de clasificación automática de texto desarrollado para el ecosistema enterprise, combinando la potencia de Spring Boot en el orquestador backend con un modelo de Machine Learning alojado en Python.
          </p>
        </div>

        {/* Grid de Arquitectura (Sin bordes, fondo azul Wisteria) */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-wisteria/15 border-none text-primary shadow-lg rounded-2xl backdrop-blur-md">
            <CardContent className="p-6 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-wisteria/30 text-navy dark:text-snow flex items-center justify-center">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg text-primary">Spring Boot Backend</h3>
              <p className="text-xs text-secondary leading-relaxed">
                API RESTful encargada del manejo de persistencia JPA, autenticación con JWT y exposición de endpoints seguros multipart/file.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-wisteria/15 border-none text-primary shadow-lg rounded-2xl backdrop-blur-md">
            <CardContent className="p-6 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-golden/30 text-navy dark:text-snow flex items-center justify-center">
                <Code2 className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg text-primary">Python ML Service</h3>
              <p className="text-xs text-secondary leading-relaxed">
                Modelo entrenado con técnicas de NLP para categorizar contenido técnico, extraer entidades clave y calcular scores de certidumbre.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-wisteria/15 border-none text-primary shadow-lg rounded-2xl backdrop-blur-md">
            <CardContent className="p-6 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-wisteria/30 text-navy dark:text-snow flex items-center justify-center">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg text-primary">Vite + React UI</h3>
              <p className="text-xs text-secondary leading-relaxed">
                Interfaz SPA reactiva maquetada con Tailwind CSS, componentes Shadcn UI y animaciones fluidas para una experiencia interactiva.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sección Inferior de Integrantes (Fondo azul Wisteria Blue) */}
        <div className="bg-wisteria dark:bg-wisteria/20 p-8 rounded-3xl space-y-6 text-navy dark:text-snow shadow-inner transition-colors">
          <h3 className="text-center text-xs font-bold uppercase tracking-wider text-navy/80 dark:text-wisteria">
            Desarrollado por LATAM Team 70
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {teamMembers.map((member, idx) => (
              <div
                key={idx}
                className="bg-card dark:bg-navy/80 p-5 rounded-2xl border border-border/50 shadow-sm flex flex-col justify-between space-y-4 transition-all hover:shadow-md"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-wisteria text-navy flex items-center justify-center font-bold text-sm shadow-md shrink-0">
                      {member.initial}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary">{member.name}</p>
                      <p className="text-xs font-medium text-wisteria">{member.role}</p>
                    </div>
                  </div>

                  <p className="text-xs text-secondary leading-relaxed">
                    {member.description}
                  </p>
                </div>

                {/* Enlaces Sociales */}
                <div className="flex items-center gap-3 pt-2 border-t border-border/40">
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary hover:text-wisteria transition-colors"
                    aria-label={`LinkedIn de ${member.name}`}
                  >
                    {/* <Linkedin className="h-4 w-4" /> */}
                  </a>
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary hover:text-wisteria transition-colors"
                    aria-label={`GitHub de ${member.name}`}
                  >
                    {/* <Github className="h-4 w-4" /> */}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}