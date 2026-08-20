import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Folder, FileText, ChevronRight, ChevronDown, CheckCircle2 } from 'lucide-react';

export default function FileTreeView({ documents, selectedDocId, onSelectDoc }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFolders, setExpandedFolders] = useState({
    Backend: true,
    Frontend: true,
    DevOps: true,
  });

  const toggleFolder = (category) => {
    setExpandedFolders((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  // Agrupar documentos por categoría
  const categories = [...new Set(documents.map((document) => document.category))];
  const filteredDocs = documents.filter(doc => 
    doc.originalTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col border-r border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 p-4 space-y-4">
      {/* Buscador */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
        <Input
          type="search"
          placeholder="Buscar documento..."
          className="pl-9 h-9 text-xs bg-slate-50 border-slate-200 focus-visible:ring-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
        <span>Explorador</span>
        <Badge variant="outline" className="text-[10px] font-normal border-slate-300">
          {documents.length} archivos
        </Badge>
      </div>

      {/* Árbol de Directorios */}
      <ScrollArea className="flex-1 -mx-2 px-2">
        <div className="space-y-2 text-sm">
          {categories.map((cat) => {
            const catDocs = filteredDocs.filter((d) => d.category === cat);
            const isExpanded = expandedFolders[cat] ?? true;

            return (
              <div key={cat} className="space-y-1">
                {/* Carpeta */}
                <button
                  onClick={() => toggleFolder(cat)}
                  className="w-full flex items-center justify-between p-1.5 rounded-md hover:bg-slate-100 text-slate-700 font-medium text-xs transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    {isExpanded ? <ChevronDown className="h-3.5 w-3.5 text-slate-500" /> : <ChevronRight className="h-3.5 w-3.5 text-slate-500" />}
                    <Folder className="h-4 w-4 text-amber-500 fill-amber-500/20" />
                    <span>{cat}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">({catDocs.length})</span>
                </button>

                {/* Archivos dentro de la carpeta */}
                {isExpanded && (
                  <div className="ml-4 pl-2 border-l border-slate-200 space-y-1">
                    {catDocs.length > 0 ? (
                      catDocs.map((doc) => {
                        const isSelected = selectedDocId === doc.id;
                        return (
                          <button
                            key={doc.id}
                            onClick={() => onSelectDoc(doc)}
                            className={`w-full flex items-center justify-between p-2 rounded-md text-xs transition-all text-left ${
                              isSelected
                                ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <FileText className={`h-3.5 w-3.5 shrink-0 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                              <span className="truncate">{doc.originalTitle}</span>
                            </div>
                            <CheckCircle2 className={`h-3.5 w-3.5 shrink-0 ${isSelected ? 'opacity-100 text-indigo-600' : 'opacity-0'}`} />
                          </button>
                        );
                      })
                    ) : (
                      <p className="text-[11px] text-slate-400 italic p-1">Sin archivos</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
