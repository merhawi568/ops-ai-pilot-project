import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, FileText, Mail, Database, Eye, AlertTriangle, Clock, CheckCircle, Brain, Lightbulb, Sparkles, Bot, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { useApplicationStore } from '@/store/useApplicationStore';
import { Application } from '@/types';
import { ValidationStepCarousel } from './ValidationStepCarousel';
import { DocumentValidationView } from './DocumentValidationView';
import { AIExtractionView } from './AIExtractionView';
import { AISuggestionsPanel } from './AISuggestionsPanel';
import { EmailDraftModal } from './EmailDraftModal';

interface ApplicationDetailPanelProps {
  application: Application;
}

export const ApplicationDetailPanel: React.FC<ApplicationDetailPanelProps> = ({ application }) => {
  const { setSelectedApplication } = useApplicationStore();
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailAction, setEmailAction] = useState<string>('');
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);

  const handleFullReview = () => {
    // Open ticket detail in new tab
    window.open(`/ticket/${application.id}`, '_blank');
  };

  const handleTakeAction = (action: string, category: string) => {
    console.log('Taking action:', action, 'Category:', category);
    
    if (action.toLowerCase().includes('email') || action.toLowerCase().includes('send') || action.toLowerCase().includes('request')) {
      setEmailAction(action);
      setIsEmailModalOpen(true);
    } else if (action.toLowerCase().includes('review') || action.toLowerCase().includes('validation')) {
      // Navigate to document validation view
      window.open(`/ticket/${application.id}#documents`, '_blank');
    } else if (action.toLowerCase().includes('process') || action.toLowerCase().includes('priority')) {
      // Navigate to processing workflow
      window.open(`/ticket/${application.id}#workflow`, '_blank');
    } else if (action.toLowerCase().includes('approve')) {
      // Navigate to approval section
      window.open(`/ticket/${application.id}#approval`, '_blank');
    } else {
      // Default: open ticket detail
      window.open(`/ticket/${application.id}`, '_blank');
    }
  };

  const getIssueDetails = () => {
    const issues = [];
    
    if (application.exceptions > 0) {
      // Add specific issue details based on status
      if (application.status.includes('Missing')) {
        issues.push({
          type: 'error',
          title: 'Missing Documentation',
          description: application.status,
          icon: FileText
        });
      }
      
      if (application.status.includes('Escalated')) {
        issues.push({
          type: 'warning',
          title: 'Manual Review Required',
          description: 'Application escalated for manual intervention',
          icon: AlertTriangle
        });
      }
      
      if (application.status.includes('Low confidence')) {
        issues.push({
          type: 'warning',
          title: 'Low AI Confidence',
          description: 'Extracted data requires validation',
          icon: AlertTriangle
        });
      }
      
      // Add AI suggestions as issues
      if (application.aiSuggestions) {
        application.aiSuggestions.forEach(suggestion => {
          issues.push({
            type: suggestion.type === 'action' ? 'info' : suggestion.type,
            title: suggestion.type === 'action' ? 'Action Required' : 
                   suggestion.type === 'warning' ? 'Data Mismatch' : 'Information',
            description: suggestion.message,
            icon: suggestion.type === 'action' ? Eye : AlertTriangle
          });
        });
      }
    }
    
    return issues;
  };

  const getAIRecommendations = () => {
    const recommendations = [];
    
    // Generate recommendations based on application state
    if (application.exceptions > 0) {
      if (application.status.includes('Missing')) {
        recommendations.push({
          priority: 'high',
          action: 'Send Document Request',
          description: 'Auto-generated email template ready for missing KYC documents',
          icon: Mail,
          aiConfidence: 92,
          category: 'Document Management'
        });
      }
      
      if (application.status.includes('Low confidence')) {
        recommendations.push({
          priority: 'medium',
          action: 'Review AI Extractions',
          description: 'AI has flagged specific fields requiring manual validation',
          icon: Eye,
          aiConfidence: 78,
          category: 'Quality Assurance'
        });
      }
    }
    
    if (application.stage === 'Document Validation' && application.documents.length > 0) {
      const unvalidatedDocs = application.documents.filter(doc => !doc.validated).length;
      if (unvalidatedDocs > 0) {
        recommendations.push({
          priority: 'medium',
          action: 'Complete Document Validation',
          description: `${unvalidatedDocs} documents awaiting validation with pre-analysis available`,
          icon: FileText,
          aiConfidence: 89,
          category: 'Document Processing'
        });
      }
    }
    
    return recommendations;
  };

  const renderSummaryView = () => {
    const issues = getIssueDetails();
    const aiRecommendations = getAIRecommendations();
    
    return (
      <div className="space-y-6">
        {/* Ticket Summary - Prominent Default View */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Ticket Summary</h3>
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Client:</span> 
              <span className="font-medium">{application.clientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Account Type:</span> 
              <span className="font-medium">{application.accountType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Current Stage:</span> 
              <span className="font-medium">{application.stage}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span> 
              <span className={`font-medium ${application.exceptions > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {application.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Progress:</span> 
              <span className="font-medium">{application.progress}/{application.totalSteps} steps</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">SLA Status:</span> 
              <span className={`font-medium ${
                application.slaHours <= 2 ? 'text-red-600' :
                application.slaHours <= 6 ? 'text-yellow-600' :
                'text-green-600'
              }`}>
                {application.slaHours}h remaining
              </span>
            </div>
          </div>
        </div>

        {/* AI Recommendations - Collapsible */}
        <Card className="p-4">
          <Button
            variant="ghost"
            onClick={() => setShowAIRecommendations(!showAIRecommendations)}
            className="w-full flex items-center justify-between p-0 h-auto hover:bg-transparent"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-gray-900">AI Agent Recommendations</span>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                {aiRecommendations.length} insights
              </span>
            </div>
            {showAIRecommendations ? (
              <ChevronUp className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            )}
          </Button>
          
          {showAIRecommendations && (
            <div className="mt-4 pt-4 border-t space-y-4">
              {aiRecommendations.map((rec, idx) => {
                const Icon = rec.icon;
                const priorityColors = {
                  high: 'from-red-50 to-pink-50 border-red-300 text-red-800',
                  medium: 'from-yellow-50 to-orange-50 border-yellow-300 text-yellow-800',
                  low: 'from-green-50 to-emerald-50 border-green-300 text-green-800'
                };
                
                return (
                  <div key={idx} className={`bg-gradient-to-r ${priorityColors[rec.priority as keyof typeof priorityColors]} border-2 p-4 rounded-xl shadow-sm`}>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-semibold text-sm">{rec.action}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            rec.priority === 'high' ? 'bg-red-200 text-red-800' :
                            rec.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                            'bg-green-200 text-green-800'
                          }`}>
                            {rec.priority.toUpperCase()}
                          </span>
                          <span className="text-xs bg-white px-2 py-0.5 rounded-full text-gray-600">
                            {rec.aiConfidence}% confidence
                          </span>
                        </div>
                        <p className="text-xs opacity-90 mb-2">{rec.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs bg-white bg-opacity-70 px-2 py-1 rounded text-gray-600">
                            {rec.category}
                          </span>
                          <Button 
                            size="sm" 
                            className="h-7 text-xs bg-white text-gray-700 hover:bg-gray-50 shadow-sm"
                            onClick={() => handleTakeAction(rec.action, rec.category)}
                          >
                            Take Action
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Issues Detected Section within AI Recommendations */}
              {issues.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Issues Detected by AI ({issues.length})
                  </h4>
                  <div className="space-y-2">
                    {issues.map((issue, idx) => {
                      const Icon = issue.icon;
                      const colorClasses = {
                        error: 'text-red-700 bg-red-50 border-red-200',
                        warning: 'text-yellow-700 bg-yellow-50 border-yellow-200',
                        info: 'text-blue-700 bg-blue-50 border-blue-200'
                      };
                      
                      return (
                        <div key={idx} className={`p-3 rounded border ${colorClasses[issue.type as keyof typeof colorClasses]}`}>
                          <div className="flex items-start gap-2">
                            <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-xs">{issue.title}</p>
                              <p className="text-xs mt-1 opacity-90">{issue.description}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Document Status */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Documents ({application.documents.length})
          </h4>
          <div className="space-y-1">
            {application.documents.slice(0, 3).map((doc) => (
              <div key={doc.id} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                <span className="truncate">{doc.name}</span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {doc.confidence && <span className="text-xs text-gray-500">{doc.confidence}%</span>}
                  <div className={`w-2 h-2 rounded-full ${doc.validated ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </div>
              </div>
            ))}
            {application.documents.length > 3 && (
              <p className="text-xs text-gray-500">+{application.documents.length - 3} more documents</p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Recent Communications
          </h4>
          <div className="space-y-1">
            {application.emails.slice(0, 2).map((email) => (
              <div key={email.id} className="text-sm bg-gray-50 p-2 rounded">
                <div className="font-medium truncate">{email.subject}</div>
                <div className="text-xs text-gray-600">From: {email.from} • {email.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Full Review Button */}
        <Button className="w-full" onClick={handleFullReview}>
          <Eye className="w-4 h-4 mr-2" />
          Open Full Review
        </Button>

        {/* Email Draft Modal */}
        <EmailDraftModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          clientName={application.clientName}
          suggestion={{
            id: 'email-suggestion-1',
            type: 'action',
            message: emailAction.includes('Document') ? 'Missing passport document required' : 'Follow-up required',
            confidence: 92
          }}
        />
      </div>
    );
  };

  return (
    <div className="fixed left-0 top-0 h-full w-96 bg-white shadow-xl border-r z-40 overflow-y-auto">
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{application.clientName}</h3>
          <p className="text-xs text-gray-500">{application.id}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setSelectedApplication(null)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="p-4">
        {renderSummaryView()}
      </div>
    </div>
  );
};
