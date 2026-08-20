import { motion } from 'framer-motion';
import StudentHeroIllustration from '@/components/vectors/StudentHeroIllustration.jsx';
import CommunityIllustration from '@/components/vectors/CommunityIllustration.jsx';

const featuresData = [
  {
    id: 'feature-1',
    title: 'Organización Automática de Apuntes y Lecturas',
    description:
      'Di adiós al desorden de PDFs y fragmentos sin clasificar. La plataforma identifica materias, temas clave y conceptos académicos en segundos, ordenando tus archivos para repasar antes de los exámenes.',
    illustration: <StudentHeroIllustration className="w-full max-w-sm mx-auto text-wisteria" />,
  },
  {
    id: 'feature-2',
    title: 'Repositorio Colaborativo para Estudiantes y Docentes',
    description:
      'Crea y comparte bibliotecas de estudio con tus compañeros de equipo o grupos de clase. Mantén el material de investigación y las guías docentes sincronizadas y clasificadas para todos.',
    illustration: <CommunityIllustration className="w-full max-w-sm mx-auto text-golden" />,
  },
  {
    id: 'feature-3',
    title: 'Potenciado para Proyectos e Investigación Académica',
    description:
      'Procesa grandes fragmentos de literatura científica y libros de texto. El backend respaldado por Spring Boot y modelos ML permite estructurar información compleja para tesis y tareas avanzadas.',
    illustration: <StudentHeroIllustration className="w-full max-w-sm mx-auto opacity-90 text-wisteria" />,
  },
];

export default function FeaturesSection() {
  return (
    <section id="caracteristicas" className="py-12 px-6 max-w-4xl mx-auto space-y-16 overflow-hidden">
      {/* Encabezado de la Sección */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
          Diseñado para el Ecosistema Académico
        </h2>
        <p className="mt-4 text-base sm:text-lg text-secondary">
          Herramientas pensadas para simplificar el flujo de estudio, la investigación universitaria y la colaboración docente.
        </p>
      </div>

      {/* Lista de Características (Diseño Zig-Zag Alternado) */}
      <div className="space-y-16">
        {featuresData.map((feature, index) => {
          const isEven = index % 2 === 0;

          const imageVariants = {
            hidden: { opacity: 0, x: isEven ? -50 : 50 },
            visible: { opacity: 1, x: 0 },
          };

          const textVariants = {
            hidden: { opacity: 0, x: isEven ? 50 : -50 },
            visible: { opacity: 1, x: 0 },
          };

          return (
            <div
              key={feature.id}
              className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-12 ${
                !isEven ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Contenedor del Vector (sin borde) */}
              <motion.div
                className="w-full lg:w-1/2 flex justify-center p-6 bg-card/60 rounded-3xl backdrop-blur-sm shadow-sm"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                variants={imageVariants}
              >
                {feature.illustration}
              </motion.div>

              {/* Contenedor de Texto */}
              <motion.div
                className="w-full lg:w-1/2 text-left space-y-3"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
                variants={textVariants}
              >
                <h3 className="text-xl sm:text-2xl font-extrabold text-primary leading-tight">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}