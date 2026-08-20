import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Sparkles, RefreshCw, Eraser, FileText, Type } from 'lucide-react';
import DragAndDropArea from '@/features/upload/DragAndDropArea';

export default function ManualTextInput({ onClassifySuccess }) {
  const [activeTab, setActiveTab] = useState('text'); // 'text' | 'file'
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSimulateAnalysis = () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    
    setTimeout(() => {
      setIsAnalyzing(false);
      if (onClassifySuccess) {
        onClassifySuccess({
          type: 'text',
          category: 'Procesamiento de Lenguaje Natural',
          score: 0.94,
          keywords: ['Clasificación', 'IA', 'Texto', 'NLP'],
          summary: 'Texto analizado correctamente y categorizado dentro del ámbito técnico.'
        });
      }
    }, 1200);
  };

  return (
    <div className="w-full space-y-5">
      {/* Selector de Pestañas (Tabs Header) */}
      <div className="flex border-b border-navy/10 dark:border-white/10 pb-2 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('text')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'text'
              ? 'bg-navy text-snow shadow-md shadow-navy/20 dark:bg-golden dark:text-navy'
              : 'text-primary/70 hover:text-primary hover:bg-snow/50 dark:hover:bg-navy/30'
          }`}
        >
          <Type className="h-4 w-4" />
          Ingresar Texto
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('file')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
            activeTab === 'file'
              ? 'bg-navy text-snow shadow-md shadow-navy/20 dark:bg-golden dark:text-navy'
              : 'text-primary/70 hover:text-primary hover:bg-snow/50 dark:hover:bg-navy/30'
          }`}
        >
          <FileText className="h-4 w-4" />
          Subir Archivo (.txt, .md)
        </button>
      </div>

      {/* Contenido Pestaña 1: Entrada de Texto Manual */}
      {activeTab === 'text' && (
        <div className="space-y-4 animate-in fade-in-50 duration-300">
          <Textarea
            placeholder="Escribe o pega aquí el fragmento de texto a clasificar..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            disabled={isAnalyzing}
            className="w-full bg-snow/80 dark:bg-navy/40 border-navy/10 dark:border-white/10 focus:border-navy dark:focus:border-golden text-primary placeholder:text-secondary/60 rounded-2xl resize-none p-4 shadow-inner focus-visible:ring-0"
          />

          {/* Acciones principales */}
          <div className="flex justify-between items-center pt-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setText('')}
              disabled={!text || isAnalyzing}
              className="text-secondary hover:text-primary hover:bg-snow/60 dark:hover:bg-navy/30 rounded-xl"
            >
              <Eraser className="mr-1.5 h-4 w-4" />
              Limpiar
            </Button>

            <Button
              type="button"
              onClick={handleSimulateAnalysis}
              disabled={!text.trim() || isAnalyzing}
              className="bg-navy hover:bg-navy/90 text-snow dark:bg-golden dark:text-navy dark:hover:bg-golden/90 font-semibold shadow-lg shadow-navy/20 dark:shadow-golden/10 rounded-xl transition-all duration-200"
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
      )}

      {/* Contenido Pestaña 2: Carga de Archivos */}
      {activeTab === 'file' && (
        <div className="animate-in fade-in-50 duration-300">
          <DragAndDropArea onClassifySuccess={onClassifySuccess} />
        </div>
      )}
    </div>
  );
}