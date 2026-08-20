import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, RefreshCw, Layers } from 'lucide-react';
import { classifyContent } from '@/services/contentApi';

export default function QuickUploadPanel({ onAddDocument }) {
  const [quickText, setQuickText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [latestResult, setLatestResult] = useState(null);

  const handleQuickSubmit = async () => {
    const content = quickText.trim();
    if (!content) return;

    setIsProcessing(true);
    setError('');
    try {
      const result = await classifyContent({
        title: content.slice(0, 80),
        content,
      });
      onAddDocument({
        id: result.outputId ?? Date.now(),
        fileName: `entrada_${Date.now()}.txt`,
        originalTitle: content.slice(0, 80),
        contentPreview: content,
        createdAt: new Date().toISOString(),
        ...result,
      });
      setLatestResult(result);
      setQuickText('');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-full bg-white p-4 space-y-6 overflow-y-auto">
      <div>
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <Plus className="h-4 w-4 text-indigo-600" />
          Clasificación rápida
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">Procesa contenido con el modelo de TechMind.</p>
      </div>
      <Card className="border-slate-200 shadow-none bg-slate-50/50">
        <CardHeader className="p-3 pb-2"><CardTitle className="text-xs">Pegar extracto técnico</CardTitle></CardHeader>
        <CardContent className="p-3 pt-0 space-y-3">
          <Textarea placeholder="Introduce texto para analizar..." className="text-xs font-mono h-28 bg-white resize-none" value={quickText} onChange={(event) => setQuickText(event.target.value)} />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8" onClick={handleQuickSubmit} disabled={!quickText.trim() || isProcessing}>
            {isProcessing ? <RefreshCw className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <Layers className="h-3.5 w-3.5 mr-1.5" />}
            {isProcessing ? 'Procesando...' : 'Clasificar con el modelo'}
          </Button>
        </CardContent>
      </Card>
      {latestResult && (
        <Card className="border-emerald-200 bg-emerald-50 shadow-none">
          <CardHeader className="p-3 pb-2">
            <CardTitle className="text-xs text-emerald-900">Resultado de clasificación</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 space-y-2 text-xs text-emerald-950">
            <div className="flex items-center justify-between gap-2">
              <span>Categoría</span>
              <Badge className="bg-emerald-600 text-white">{latestResult.category}</Badge>
            </div>
            <p>Confianza: <strong>{(latestResult.score * 100).toFixed(0)}%</strong></p>
            <p className="leading-relaxed">Palabras clave: {latestResult.keywords.map((keyword) => `#${keyword}`).join(' ')}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
