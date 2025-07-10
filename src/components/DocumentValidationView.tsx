
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, Eye, CheckCircle, AlertTriangle } from 'lucide-react';
import { Document } from '@/types';

interface DocumentValidationViewProps {
  documents: Document[];
}

export const DocumentValidationView: React.FC<DocumentValidationViewProps> = ({ documents }) => {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [humanValidation, setHumanValidation] = useState<Record<string, boolean>>({});

  const handleValidation = (docId: string, validated: boolean) => {
    setHumanValidation(prev => ({ ...prev, [docId]: validated }));
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Document List */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">Submitted Documents</h4>
        
        {documents.map((doc) => (
          <Card key={doc.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium">{doc.name}</div>
                  <div className="text-sm text-gray-500">
                    {doc.required ? 'Required' : 'Optional'}
                    {doc.confidence && ` • ${doc.confidence}% confidence`}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {doc.validated ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDocument(doc)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="mt-3 flex items-center gap-2">
              <Checkbox
                checked={humanValidation[doc.id] || false}
                onCheckedChange={(checked) => handleValidation(doc.id, checked as boolean)}
              />
              <label className="text-sm text-gray-700">Human Validation</label>
            </div>
          </Card>
        ))}
        
        <Button className="w-full mt-4">
          Complete Document Validation
        </Button>
      </div>
      
      {/* Document Viewer */}
      <div>
        {selectedDocument ? (
          <Card className="p-4 h-96">
            <h5 className="font-semibold mb-3">{selectedDocument.name}</h5>
            <div className="bg-gray-100 h-full rounded flex items-center justify-center">
              <div className="text-center text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-2" />
                <p>PDF Viewer</p>
                <p className="text-sm">Document: {selectedDocument.name}</p>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-4 h-96 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-2" />
              <p>Select a document to view</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
