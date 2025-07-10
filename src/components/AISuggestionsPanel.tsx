
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Mail, ThumbsUp, ThumbsDown } from 'lucide-react';
import { AISuggestion } from '@/types';
import { EmailDraftModal } from './EmailDraftModal';

interface AISuggestionsPanelProps {
  suggestions: AISuggestion[];
  clientName: string;
}

export const AISuggestionsPanel: React.FC<AISuggestionsPanelProps> = ({ 
  suggestions, 
  clientName 
}) => {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<AISuggestion | null>(null);

  const handleDraftEmail = (suggestion: AISuggestion) => {
    setSelectedSuggestion(suggestion);
    setShowEmailModal(true);
  };

  const handleFeedback = (suggestionId: string, feedback: 'up' | 'down') => {
    console.log(`Feedback for ${suggestionId}: ${feedback}`);
    // In real app, this would send feedback to backend
  };

  return (
    <>
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-4 h-4 text-purple-600" />
          <h4 className="font-semibold text-gray-900">AI Suggestions & Actions</h4>
        </div>
        
        <div className="space-y-3">
          {suggestions.map((suggestion) => (
            <div key={suggestion.id} className="p-3 bg-purple-50 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-900 mb-2">{suggestion.message}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      Confidence: {suggestion.confidence}%
                    </span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleFeedback(suggestion.id, 'up')}
                        className="h-6 w-6 p-0"
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleFeedback(suggestion.id, 'down')}
                        className="h-6 w-6 p-0"
                      >
                        <ThumbsDown className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                {suggestion.action === 'draft_email' && (
                  <Button 
                    size="sm" 
                    onClick={() => handleDraftEmail(suggestion)}
                    className="ml-3"
                  >
                    <Mail className="w-3 h-3 mr-1" />
                    Draft Email
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {showEmailModal && selectedSuggestion && (
        <EmailDraftModal
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          clientName={clientName}
          suggestion={selectedSuggestion}
        />
      )}
    </>
  );
};
