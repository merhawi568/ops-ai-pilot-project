import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, FileText, Mail, Database, Eye, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { useApplicationStore } from '@/store/useApplicationStore';
import { Application } from '@/types';
import { ValidationStepCarousel } from './ValidationStepCarousel';
import { DocumentValidationView } from './DocumentValidationView';
import { AIExtractionView } from './AIExtractionView';
import { AISuggestionsPanel } from './AISuggestionsPanel';

interface ApplicationDetailPanelProps {
  application: Application;
}

export const ApplicationDetailPanel: React.FC<ApplicationDetailPanelProps> = ({ application }) => {
  const { setSelectedApplication } = useApplicationStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [viewMode, setViewMode] = useState<'summary' | 'detailed'>('summary');

  const handleFullReview = () => {
    // Switch to detailed view instead of opening new tab
    setViewMode('detailed');
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

  const renderSummaryView = () => {
    const issues = getIssueDetails();
    
    return (
      <div className="space-y-4">
        {/* Quick Overview */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">Quick Overview</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><span className="text-gray-500">Stage:</span> {application.stage}</div>
            <div><span className="text-gray-500">Status:</span> {application.status}</div>
            <div><span className="text-gray-500">SLA:</span> {application.slaHours}h left</div>
            <div><span className="text-gray-500">Progress:</span> {application.progress}/{application.totalSteps}</div>
          </div>
        </div>

        {/* Issue Details */}
        {issues.length > 0 && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Issues Detected ({issues.length})
            </h4>
            <div className="space-y-3">
              {issues.map((issue, idx) => {
                const Icon = issue.icon;
                const colorClasses = {
                  error: 'text-red-700 bg-red-100 border-red-300',
                  warning: 'text-yellow-700 bg-yellow-100 border-yellow-300',
                  info: 'text-blue-700 bg-blue-100 border-blue-300'
                };
                
                return (
                  <div key={idx} className={`p-3 rounded border ${colorClasses[issue.type as keyof typeof colorClasses]}`}>
                    <div className="flex items-start gap-2">
                      <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">{issue.title}</p>
                        <p className="text-xs mt-1 opacity-90">{issue.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* No Issues */}
        {issues.length === 0 && (
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              No Issues Detected
            </h4>
            <p className="text-sm text-green-700">This application is progressing normally without exceptions.</p>
          </div>
        )}

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

        {/* SLA Status */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            SLA Status
          </h4>
          <div className={`p-3 rounded border ${
            application.slaHours <= 2 ? 'bg-red-50 border-red-200 text-red-700' :
            application.slaHours <= 6 ? 'bg-yellow-50 border-yellow-200 text-yellow-700' :
            'bg-green-50 border-green-200 text-green-700'
          }`}>
            <p className="text-sm">
              <span className="font-medium">{application.slaHours} hours remaining</span>
              {application.slaHours <= 2 && ' - Urgent attention required'}
              {application.slaHours > 2 && application.slaHours <= 6 && ' - Monitor closely'}
              {application.slaHours > 6 && ' - On track'}
            </p>
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
      </div>
    );
  };

  const renderDetailedView = () => (
    <div className="space-y-6">
      {/* Back to Summary Button */}
      <Button variant="outline" onClick={() => setViewMode('summary')} className="w-full">
        Back to Summary
      </Button>

      {/* Validation Step Carousel */}
      <ValidationStepCarousel 
        currentStep={currentStep}
        onStepChange={setCurrentStep}
      />

      {/* Step Content */}
      <div className="min-h-96">
        {renderStepContent()}
      </div>

      {/* AI Suggestions Panel */}
      {application.aiSuggestions && application.aiSuggestions.length > 0 && (
        <AISuggestionsPanel 
          suggestions={application.aiSuggestions}
          clientName={application.clientName}
        />
      )}

      {/* Ticket Info */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-2">Ticket Details</h4>
        <div className="text-sm space-y-1">
          <div><span className="text-gray-500">ID:</span> {application.id}</div>
          <div><span className="text-gray-500">Stage:</span> {application.stage}</div>
          <div><span className="text-gray-500">Status:</span> {application.status}</div>
          <div><span className="text-gray-500">Account:</span> {application.accountType}</div>
        </div>
      </div>

      {/* Documents */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-4 h-4 text-blue-600" />
          <h4 className="font-semibold text-gray-900">Documents Submitted</h4>
          <span className="text-sm text-gray-500">({application.documents.length})</span>
        </div>
        <div className="space-y-2">
          {application.documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{doc.name}</span>
                {doc.required && <span className="text-xs text-red-600">*</span>}
              </div>
              <div className="flex items-center gap-2">
                {doc.confidence && (
                  <span className="text-xs text-gray-500">{doc.confidence}%</span>
                )}
                {doc.validated ? (
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                ) : (
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emails */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Mail className="w-4 h-4 text-green-600" />
          <h4 className="font-semibold text-gray-900">Email Communications</h4>
          <span className="text-sm text-gray-500">({application.emails.length})</span>
        </div>
        <div className="space-y-2">
          {application.emails.map((email) => (
            <div key={email.id} className="p-2 bg-gray-50 rounded">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{email.subject}</span>
                <span className="text-xs text-gray-500">{email.date}</span>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                From: {email.from} ({email.type})
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SOR Data */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Database className="w-4 h-4 text-purple-600" />
          <h4 className="font-semibold text-gray-900">SOR Data</h4>
        </div>
        <div className="space-y-2 text-sm">
          <div><span className="text-gray-500">Name:</span> {application.sorData.name}</div>
          {application.sorData.dob && (
            <div><span className="text-gray-500">DOB:</span> {application.sorData.dob}</div>
          )}
          <div><span className="text-gray-500">Account Type:</span> {application.sorData.accountType}</div>
          {application.sorData.address && (
            <div><span className="text-gray-500">Address:</span> {application.sorData.address}</div>
          )}
          {application.sorData.income && (
            <div><span className="text-gray-500">Income:</span> {application.sorData.income}</div>
          )}
          {application.sorData.entityName && (
            <div><span className="text-gray-500">Entity:</span> {application.sorData.entityName}</div>
          )}
          {application.sorData.complianceId && (
            <div><span className="text-gray-500">Compliance ID:</span> {application.sorData.complianceId}</div>
          )}
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <DocumentValidationView documents={application.documents} />;
      case 1:
        return application.extractedFields ? (
          <AIExtractionView extractedFields={application.extractedFields} />
        ) : (
          <div className="text-center py-8 text-gray-500">
            No extracted fields available
          </div>
        );
      case 2:
        return (
          <div className="text-center py-8 text-gray-500">
            Field Validation View - Coming Soon
          </div>
        );
      case 3:
        return (
          <div className="text-center py-8 text-gray-500">
            SOR Cross-check View - Coming Soon
          </div>
        );
      case 4:
        return (
          <div className="text-center py-8 text-gray-500">
            DocuSign Pre-fill View - Coming Soon
          </div>
        );
      case 5:
        return (
          <div className="text-center py-8 text-gray-500">
            Good Order Review View - Coming Soon
          </div>
        );
      case 6:
        return (
          <div className="text-center py-8 text-gray-500">
            Workflow Entry View - Coming Soon
          </div>
        );
      case 7:
        return (
          <div className="text-center py-8 text-gray-500">
            Final Approval View - Coming Soon
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed left-0 top-0 h-full w-96 bg-white shadow-xl border-r z-40 overflow-y-auto">
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{application.clientName}</h3>
          <p className="text-xs text-gray-500">{application.id}</p>
        </div>
        <div className="flex items-center gap-2">
          {viewMode === 'detailed' && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setViewMode('summary')}
            >
              Summary
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => setSelectedApplication(null)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="p-4">
        {viewMode === 'summary' ? renderSummaryView() : renderDetailedView()}
      </div>
    </div>
  );
};
