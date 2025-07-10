
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, ArrowRight } from 'lucide-react';
import { useApplicationStore } from '@/store/useApplicationStore';

export const NextBestActionPanel: React.FC = () => {
  const { applications } = useApplicationStore();
  
  const docSignCount = applications.filter(app => 
    app.stage.toLowerCase().includes('signature') || 
    app.status.toLowerCase().includes('signature')
  ).length;
  
  const missingDocsCount = applications.filter(app => 
    app.status.toLowerCase().includes('missing') ||
    app.exceptions > 0
  ).length;

  if (docSignCount === 0 && missingDocsCount === 0) return null;

  return (
    <Card className="p-4 mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Brain className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">AI Recommendations</h3>
          <p className="text-sm text-gray-700">
            {docSignCount > 0 && `${docSignCount} tickets need DocuSign review. `}
            {missingDocsCount > 0 && `${missingDocsCount} missing KYC docs. `}
            Start with highest priority items.
          </p>
        </div>
        <Button size="sm" variant="outline">
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};
