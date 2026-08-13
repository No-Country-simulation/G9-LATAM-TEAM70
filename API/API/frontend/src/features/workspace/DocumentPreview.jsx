import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Cpu, Clock, Tag, ExternalLink, Sparkles } from 'lucide-react';

export default function DocumentPreview({ document }) {
  if (!document) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 dark:bg-slate-950/50 border-r border-slate-200">
        <FileText className="h-12 w-12 text-slate-300 mb-3" />
        <p className="font-semibold text-slate-700">Ningún documento seleccionado</p>
        <p className="text-xs text-slate-500 mt-1">
          Selecciona un elemento del árbol lateral izquierdo para ver su clasificación y contenido.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50/50 border-r border-slate-200 overflow-hidden">
      
      {/* Header del documento */}
      <div className="p-6 bg-white border-b border-slate-200 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-indigo-600 text-white hover:bg-indigo-700">
                {document.category}
              </Badge>
              <span className="text-xs text-slate-400 font-mono">ID: #{document.id}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 leading-snug">
              {document.originalTitle}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Archivo: {document.fileName}</p>
          </div>
          <Button variant="outline" size="sm" className="shrink-0 text-xs gap-1.5">
            <ExternalLink className="h-3.5 w-3.5" />
            Descargar .txt
          </Button>
        </div>

        {/* Métricas del Modelo */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <Card className="bg-slate-50 border-slate-200 p-3 shadow-none">
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
              <span>Score de Confianza</span>
            </div>
            <p className="text-lg font-extrabold text-slate-900">
              {(document.score * 100).toFixed(0)}%
            </p>
            <Progress value={document.score * 100} className="h-1.5 mt-1 bg-slate-200" />
          </Card>

          <Card className="bg-slate-50 border-slate-200 p-3 shadow-none">
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Cpu className="h-3.5 w-3.5 text-amber-500" />
              <span>Modelo Utilizado</span>
            </div>
            <p className="text-sm font-bold text-slate-800 truncate mt-1">
              {document.modelUsed || 'TechMind-v1'}
            </p>
          </Card>

          <Card className="bg-slate-50 border-slate-200 p-3 shadow-none">
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Clock className="h-3.5 w-3.5 text-emerald-500" />
              <span>Fecha Registro</span>
            </div>
            <p className="text-xs font-semibold text-slate-800 mt-1.5">
              {new Date(document.createdAt).toLocaleDateString()}
            </p>
          </Card>
        </div>

        {/* Keywords */}
        <div className="flex items-center gap-2 pt-1">
          <Tag className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <div className="flex flex-wrap gap-1">
            {document.keywords.map((kw, idx) => (
              <Badge key={idx} variant="secondary" className="text-[11px] bg-slate-100 text-slate-700">
                #{kw}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Visor de Contenido Texto */}
      <div className="flex-1 p-6 overflow-hidden flex flex-col">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
          Extracto de Contenido
        </h3>
        <Card className="flex-1 border-slate-200 bg-white shadow-xs overflow-hidden">
          <ScrollArea className="h-full p-4">
            <pre className="font-mono text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
              {document.contentPreview}
            </pre>
          </ScrollArea>
        </Card>
      </div>

    </div>
  );
}