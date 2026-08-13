import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Sparkles, FileText, UploadCloud, ArrowRight, CheckCircle2, ShieldCheck, Cpu } from 'lucide-react';
import DragAndDropArea from '@/features/upload/DragAndDropArea';
import ManualTextInput from '@/features/upload/ManualTextInput';

export default function LandingPage() {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);

  const handleClassifySuccess = (data) => {
    setResult(data);
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/70 via-white to-slate-50 pt-12 pb-8 border-b border-slate-200">
        <div className="container mx-auto px-4 text-center max-w-4xl space-y-6">
          <Badge variant="outline" className="bg-white border-indigo-200 text-indigo-700 py-1 px-3 shadow-xs">
            <Sparkles className="mr-1.5 h-3.5 w-3.5 text-indigo-500 fill-indigo-500" />
            Modelo de Inteligencia Artificial Entrenado
          </Badge>
          
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Clasificación Automática de Documentos Técnicos
          </h1>
          
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Sube un archivo o pega un extracto. Nuestra plataforma impulsada por IA analizará el contenido, determinará la categoría y extraerá las palabras clave relevantes al instante.
          </p>

          <div className="flex justify-center gap-6 text-sm font-medium text-slate-500 pt-2">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Categorización Exacta
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-indigo-500" /> Confidencialidad Asegurada
            </div>
            <div className="flex items-center gap-1.5">
              <Cpu className="h-4 w-4 text-amber-500" /> Modelo TechMind v1
            </div>
          </div>
        </div>
      </section>

      {/* 2. ZONA INTERACTIVA DE CLASIFICACIÓN */}
      <section className="container mx-auto px-4 max-w-4xl">
        <Card className="shadow-lg border-slate-200">
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
                <DragAndDropArea onClassifySuccess={handleClassifySuccess} />
              </TabsContent>

              <TabsContent value="text">
                <ManualTextInput onClassifySuccess={handleClassifySuccess} />
              </TabsContent>
            </Tabs>

            {/* 3. RESULTADO DE CLASIFICACIÓN (MOCK SINTÉTICO) */}
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

                  {/* Barra de Certidumbre */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Nivel de Certeza del Modelo</span>
                      <span>{(result.score * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={result.score * 100} className="h-2 bg-slate-800" />
                  </div>

                  {/* Palabras Clave */}
                  <div>
                    <p className="text-xs font-medium text-slate-400 mb-2">Palabras Clave Extraídas:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {result.keywords.map((kw, i) => (
                        <Badge key={i} variant="secondary" className="bg-slate-800 text-slate-300 text-xs border-slate-700">
                          #{kw}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Vista Previa del Extracto */}
                  <div className="bg-slate-950/80 p-3 rounded-md text-xs font-mono text-slate-300 line-clamp-2 border border-slate-800">
                    "{result.summary}"
                  </div>

                  {/* Botón de acción hacia el Workspace */}
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
      </section>

    </div>
  );
}