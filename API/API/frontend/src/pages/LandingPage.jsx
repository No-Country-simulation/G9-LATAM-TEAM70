import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Sparkles, FileText, UploadCloud, ArrowRight, CheckCircle2, ShieldCheck, Cpu, Zap, FileSearch, Database } from 'lucide-react';
import DragAndDropArea from '@/features/upload/DragAndDropArea';
import ManualTextInput from '@/features/upload/ManualTextInput';
import AboutSection from '@/features/landing/AboutSection';

export default function LandingPage() {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);

  const featuresList = [
    {
      id: 1,
      icon: <Zap className="h-8 w-8 text-indigo-600" />,
      title: "1. Inferencia Ultrarrápida en Tiempo Real",
      description: "Sube archivos o pega bloques de código/artículos. El pipeline procesa el lenguaje natural y devuelve la clasificación y su score de confianza en menos de 500ms."
    },
    {
      id: 2,
      icon: <FileSearch className="h-8 w-8 text-amber-500" />,
      title: "2. Extracción Inteligente de Entidades Clave",
      description: "El modelo no solo categoriza en Backend, Frontend o DevOps; también extrae etiquetas (#Java, #React, #Docker) facilitando la indexación rápida en bases de datos."
    },
    {
      id: 3,
      icon: <Database className="h-8 w-8 text-emerald-500" />,
      title: "3. Arquitectura Escalable y Desacoplada",
      description: "Integración transparente entre Spring Boot para el orquestador REST y microservicios externos en Python, garantizando un despliegue ligero e independiente en producción."
    }
  ];

  return (
    <div className="space-y-16 pt-4">
      
      {/* 1. HERO & DRAG AND DROP (Fade In de Abajo hacia Arriba) */}
      <section id="hero" className="container mx-auto px-4 max-w-4xl pt-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="space-y-8"
        >
          {/* Header Text */}
          <div className="text-center space-y-4">
            <Badge variant="outline" className="bg-white border-indigo-200 text-indigo-700 py-1 px-3 shadow-xs">
              <Sparkles className="mr-1.5 h-3.5 w-3.5 text-indigo-500 fill-indigo-500" />
              Modelo de Inteligencia Artificial Entrenado
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Clasificación Automática de Documentos Técnicos
            </h1>
            
            <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Sube un archivo o pega un extracto. Nuestra plataforma impulsada por IA analizará el contenido, determinará la categoría y extraerá las palabras clave relevantes al instante.
            </p>
          </div>

          {/* Card de Clasificación */}
          <Card className="shadow-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
            <CardHeader>
              <CardTitle className="text-xl">Prueba el Clasificador en Tiempo Real</CardTitle>
              <CardDescription>
                Selecciona el método de entrada de datos para realizar la deducción del modelo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="file" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="file" className="flex items-center gap-2">
                    <UploadCloud className="h-4 w-4" /> Archivo (.txt, .pdf, .md)
                  </TabsTrigger>
                  <TabsTrigger value="text" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Texto Sintético
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="file">
                  <DragAndDropArea onClassifySuccess={setResult} />
                </TabsContent>

                <TabsContent value="text">
                  <ManualTextInput onClassifySuccess={setResult} />
                </TabsContent>
              </Tabs>

              {/* Resultado Sintético */}
              {result && (
                <div className="mt-8 border-t border-slate-200 pt-6 animate-in fade-in duration-300">
                  <div className="rounded-xl bg-slate-900 text-white p-6 shadow-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold">
                          {result.category}
                        </Badge>
                        <span className="text-xs text-slate-400">Origen: {result.fileName}</span>
                      </div>
                      <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                        Score: {(result.score * 100).toFixed(0)}%
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Nivel de Certeza del Modelo</span>
                        <span>{(result.score * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={result.score * 100} className="h-2 bg-slate-800" />
                    </div>

                    <div className="pt-2 flex justify-end">
                      <Button
                        size="sm"
                        onClick={() => navigate('/workspace')}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium"
                      >
                        Ver en Workspace Completo
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* 2. TRES SECCIONES HORIZONTALES APILADAS (Fade In con Scroll) */}
      <section id="caracteristicas" className="container mx-auto px-4 max-w-4xl space-y-12 py-12 border-t border-slate-200">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Características Principales de la Aplicación
          </h2>
          <p className="text-xs md:text-sm text-slate-500">
            Diseñada para ofrecer rapidez, precisión y facilidades de integración.
          </p>
        </div>

        <div className="space-y-8">
          {featuresList.map((feat) => (
            <motion.div
              key={feat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <Card className="border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow bg-white dark:bg-slate-900">
                <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 shrink-0">
                    {feat.icon}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{feat.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{feat.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. SECCIÓN ACERCA DEL EQUIPO / PROYECTO (Fade In de Arriba hacia Abajo) */}
      <AboutSection />

    </div>
  );
}