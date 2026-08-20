import { useState } from 'react';
import FileTreeView from '@/features/workspace/FileTreeView';
import DocumentPreview from '@/features/workspace/DocumentPreview';
import QuickUploadPanel from '@/features/workspace/QuickUploadPanel';

export default function WorkspacePage() {
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const handleAddDocument = (newDoc) => {
    setDocuments((prev) => [newDoc, ...prev]);
    setSelectedDoc(newDoc);
  };

  return (
    <div className="h-[calc(100vh-4rem)] grid grid-cols-12 overflow-hidden bg-slate-100 dark:bg-slate-950 transition-colors">
      
      {/* Columna 1: Árbol (3 columnas de ancho en desktop) */}
      <div className="col-span-12 md:col-span-3 h-full overflow-hidden">
        <FileTreeView
          documents={documents}
          selectedDocId={selectedDoc?.id}
          onSelectDoc={setSelectedDoc}
        />
      </div>

      {/* Columna 2: Visor Principal (6 columnas de ancho) */}
      <div className="col-span-12 md:col-span-6 h-full overflow-hidden">
        <DocumentPreview document={selectedDoc} />
      </div>

      {/* Columna 3: Panel Lateral Rápido (3 columnas de ancho) */}
      <div className="col-span-12 md:col-span-3 h-full overflow-hidden">
        <QuickUploadPanel onAddDocument={handleAddDocument} />
      </div>

    </div>
  );
}
