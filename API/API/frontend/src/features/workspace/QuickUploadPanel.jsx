import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, UploadCloud, RefreshCw, Layers } from 'lucide-react';

export default function QuickUploadPanel({ onAddDocument }) {
  const [quickText, setQuickText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleQuickSubmit = () => {
    if (!quickText.trim()) return;
    setIsProcessing(true);

    setTimeout(() => {
      const category = quickText.toLowerCase().includes('react')
        ? 'Frontend'
        : quickText.toLowerCase().includes('docker')
        ? 'DevOps'
        : 'Backend';

      const newDoc = {
        id: Date.now(),
        fileName: `quick_input_${Math.floor(Math.random() * 1000)}.txt`,
        originalTitle: quickText.slice(0, 30) + '...',
        category,
        score: 0.93,
        keywords: ['Ingreso Rápido', 'NLP', category],
        modelUsed: 'TechMind-Classifier-v1',
        contentPreview: quickText,
        createdAt: new Date().toISOString(),
      };

      onAddDocument(newDoc);
      setQuickText('');
      setIsProcessing(false);
    }, 800);
  };

  return (
    <div className="h-full bg-white p-4 space-y-6 overflow-y-auto">
      <div>
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <Plus className="h-4 w-4 text-indigo-600" />
          Clasificación Rápida
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Agrega nuevos documentos a tu espacio en tiempo real.
        </p>
      </div>

      <Card className="border-slate-200 shadow-none bg-slate-50/50">
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-xs">Pegar Extracto Técnico</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 space-y-3">
          <Textarea
            placeholder="Introduce texto para analizar..."
            className="text-xs font-mono h-28 bg-white resize-none"
            value={quickText}
            onChange={(e) => setQuickText(e.target.value)}
          />
          <Button
            size="sm"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8"
            onClick={handleQuickSubmit}
            disabled={!quickText.trim() || isProcessing}
          >
            {isProcessing ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin mr-1.5" />
            ) : (
              <Layers className="h-3.5 w-3.5 mr-1.5" />
            )}
            Procesar y Agregar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}