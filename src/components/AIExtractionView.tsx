import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { HelpCircle, FileText } from 'lucide-react';
import { ExtractedField } from '@/types';

interface AIExtractionViewProps {
  extractedFields: ExtractedField[];
}

export const AIExtractionView: React.FC<AIExtractionViewProps> = ({ extractedFields }) => {
  const [editedFields, setEditedFields] = useState<Record<string, string>>({});
  const [selectedField, setSelectedField] = useState<ExtractedField | null>(null);
  const [humanValidation, setHumanValidation] = useState(false);

  const handleFieldEdit = (fieldName: string, value: string) => {
    setEditedFields(prev => ({ ...prev, [fieldName]: value }));
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceBg = (confidence: number) => {
    if (confidence >= 90) return 'bg-green-100';
    if (confidence >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Extracted Fields */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">Extracted Fields</h4>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Field Name</th>
                <th className="text-left py-2">Value</th>
                <th className="text-left py-2">Source</th>
                <th className="text-left py-2">Confidence</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {extractedFields.map((field, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 font-medium">{field.fieldName}</td>
                  <td className="py-2">
                    <Input
                      value={editedFields[field.fieldName] || field.value}
                      onChange={(e) => handleFieldEdit(field.fieldName, e.target.value)}
                      className="w-full h-8 text-sm"
                    />
                  </td>
                  <td className="py-2 text-gray-600">{field.sourceDocument}</td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getConfidenceBg(field.confidence)} ${getConfidenceColor(field.confidence)}`}>
                      {field.confidence}%
                    </span>
                  </td>
                  <td className="py-2">
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedField(field)}
                        className="h-6 w-6 p-0"
                      >
                        <FileText className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        title="Why this result?"
                      >
                        <HelpCircle className="w-3 h-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex items-center gap-2 mt-4">
          <Checkbox
            checked={humanValidation}
            onCheckedChange={(checked) => setHumanValidation(checked as boolean)}
          />
          <label className="text-sm text-gray-700">Human Validation Complete</label>
        </div>
        
        <Button className="w-full mt-4">
          Save Extracted Fields
        </Button>
      </div>
      
      {/* Document Viewer with Highlights */}
      <div>
        {selectedField ? (
          <Card className="p-4 h-96">
            <h5 className="font-semibold mb-3">
              {selectedField.sourceDocument} - {selectedField.fieldName}
            </h5>
            <div className="bg-gray-100 h-full rounded flex items-center justify-center">
              <div className="text-center text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-2" />
                <p>PDF Viewer with Highlights</p>
                <p className="text-sm">Field: {selectedField.fieldName}</p>
                <p className="text-sm">Value: {selectedField.value}</p>
                <p className="text-sm">Confidence: {selectedField.confidence}%</p>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-4 h-96 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-2" />
              <p>Click on a field to view source document</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
