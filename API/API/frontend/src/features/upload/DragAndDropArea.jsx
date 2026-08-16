import { useState } from 'react';
import { UploadCloud, FileText, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DragAndDropArea({ onClassifySuccess }) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSimulateAnalysis = () => {
    if (!file) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      if (onClassifySuccess) {
        onClassifySuccess({
          type: 'file',
          fileName: file.name,
          category: 'Backend',
          score: 0.96,
          keywords: ['Spring Boot', 'REST API', 'Java', 'Inyección de Dependencias'],
          summary: 'Documento técnico centrado en la arquitectura de backend con el framework Spring Boot y patrones de diseño API REST.'
        });
      }
    }, 1200);
  };

  return (
    <div className="space-y-4">
      {/* Contenedor Dropzone estilizado con la paleta actual */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer bg-snow/80 dark:bg-navy/40 ${
          isDragging
            ? 'border-navy bg-lavender/30 scale-[1.01] dark:border-golden dark:bg-navy/60'
            : file
            ? 'border-golden bg-golden/10 dark:border-golden/80'
            : 'border-navy/20 dark:border-white/20 hover:border-navy/50 dark:hover:border-white/50'
        }`}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".txt,.md"
          onChange={handleFileChange}
        />

        {!file ? (
          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-3">
            <div className="h-14 w-14 rounded-full bg-lavender/50 dark:bg-navy/60 flex items-center justify-center text-navy dark:text-golden shadow-sm transition-transform group-hover:scale-105">
              <UploadCloud className="h-7 w-7" />
            </div>
            <div>
              <p className="font-bold text-primary text-base">
                Arrastra y suelta tu documento aquí
              </p>
              <p className="text-xs text-secondary/80 mt-1">
                Soporta archivos <span className="font-semibold text-primary">.txt y .md</span> (máx. 10MB)
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2 border-navy/20 dark:border-white/20 text-primary hover:bg-lavender/40 dark:hover:bg-navy/50 rounded-xl"
            >
              Explorar Equipo
            </Button>
          </label>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-golden/20 text-navy dark:text-golden flex items-center justify-center shadow-inner">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-primary">{file.name}</p>
              <p className="text-xs text-secondary">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <div className="flex gap-2 mt-2">
              <Button
                type="button"
                size="sm"
                className="bg-navy hover:bg-navy/90 text-snow dark:bg-golden dark:text-navy dark:hover:bg-golden/90 font-semibold shadow-md rounded-xl"
                onClick={handleSimulateAnalysis}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Analizando con IA...
                  </>
                ) : (
                  'Clasificar Documento'
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-secondary hover:text-primary rounded-xl"
                onClick={() => setFile(null)}
                disabled={isAnalyzing}
              >
                Cambiar
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}