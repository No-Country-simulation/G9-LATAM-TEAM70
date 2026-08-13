import { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';

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
      // Simulación de respuesta del modelo
      onClassifySuccess({
        type: 'file',
        fileName: file.name,
        category: 'Backend',
        score: 0.96,
        keywords: ['Spring Boot', 'REST API', 'Java', 'Inyección de Dependencias'],
        summary: 'Documento técnico centrado en la arquitectura de backend con el framework Spring Boot y patrones de diseño API REST.'
      });
    }, 1200);
  };

  return (
    <div className="space-y-4">
      {/* Dropzone Container */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer bg-slate-50/50 ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]'
            : file
            ? 'border-emerald-500 bg-emerald-50/20'
            : 'border-slate-300 hover:border-slate-400'
        }`}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".txt,.pdf,.docx,.md"
          onChange={handleFileChange}
        />

        {!file ? (
          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-3">
            <div className="h-14 w-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
              <UploadCloud className="h-7 w-7" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-base">
                Arrastra y suelta tu documento aquí
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Soporta archivos <span className="font-medium text-slate-700">.txt, .pdf, .docx, .md</span> (máx. 10MB)
              </p>
            </div>
            <Button type="button" variant="outline" size="sm" className="mt-2">
              Explorar Equipo
            </Button>
          </label>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">{file.name}</p>
              <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
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
                variant="ghost"
                size="sm"
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