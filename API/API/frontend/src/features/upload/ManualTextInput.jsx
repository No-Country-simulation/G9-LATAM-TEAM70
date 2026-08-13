import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Sparkles, RefreshCw, Eraser } from 'lucide-react';

export default function ManualTextInput({ onClassifySuccess }) {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const sampleTexts = [
    {
      title: 'Ejemplo Backend',
      content: 'Spring Boot simplifica la creación de servicios web RESTful en Java, reduciendo la configuración explícita mediante autoconfiguración y contenedores de inyección de dependencias embebidos.'
    },
    {
      title: 'Ejemplo Frontend',
      content: 'React permite construir interfaces de usuario interactivas basadas en componentes reactivos utilizando un Virtual DOM para optimizar el renderizado del navegador.'
    },
    {
      title: 'Ejemplo DevOps',
      content: 'Docker Compose coordina múltiples contenedores isolated compartiendo volúmenes de almacenamiento y redes internas mediante archivos yaml de orquestación.'
    }
  ];

  const handleSimulateAnalysis = () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      onClassifySuccess({
        type: 'text',
        fileName: 'Texto Libre / Sintético',
        category: text.toLowerCase().includes('react') ? 'Frontend' : text.toLowerCase().includes('docker') ? 'DevOps' : 'Backend',
        score: 0.94,
        keywords: ['Clasificación en Tiempo Real', 'NLP', 'Procesamiento Texto'],
        summary: text
      });
    }, 1000);
  };

  return (
    <div className="space-y-4">
      {/* Botones de atajo rápido */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-slate-500 font-medium">Cargar muestra:</span>
        {sampleTexts.map((sample, idx) => (
          <Button
            key={idx}
            variant="outline"
            size="sm"
            className="text-xs h-7"
            onClick={() => setText(sample.content)}
          >
            {sample.title}
          </Button>
        ))}
      </div>

      {/* Cuadro de Texto */}
      <Textarea
        placeholder="Escribe o pega aquí el contenido del artículo, extracto técnico o código para clasificar..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        className="resize-none font-mono text-xs bg-slate-50/50 focus-visible:ring-indigo-500"
      />

      {/* Acciones */}
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-500"
          onClick={() => setText('')}
          disabled={!text || isAnalyzing}
        >
          <Eraser className="mr-1 h-4 w-4" />
          Limpiar
        </Button>

        <Button
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
          onClick={handleSimulateAnalysis}
          disabled={!text.trim() || isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Procesando Texto...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Clasificar Texto
            </>
          )}
        </Button>
      </div>
    </div>
  );
}