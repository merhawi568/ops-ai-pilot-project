
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowLeft, FileText, Mail, Database, Settings, Brain } from 'lucide-react';
import { useApplicationStore } from '@/store/useApplicationStore';
import { Application } from '@/types';
import { ValidationStepCarousel } from '@/components/ValidationStepCarousel';
import { DocumentValidationView } from '@/components/DocumentValidationView';
import { AIExtractionView } from '@/components/AIExtractionView';
import { AISuggestionsPanel } from '@/components/AISuggestionsPanel';
import { StatusBadge } from '@/components/StatusBadge';
import { ProgressRing } from '@/components/ui/progress-ring';

const TicketDetail: React.FC = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const { applications } = useApplicationStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [application, setApplication] = useState<Application | null>(null);

  useEffect(() => {
    if (ticketId) {
      const app = applications.find(app => app.id === ticketId);
      setApplication(app || null);
    }
  }, [ticketId, applications]);

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Ticket Not Found</h2>
          <p className="text-gray-600 mb-4">The ticket {ticketId} could not be found.</p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const getAIRecommendations = () => {
    const recommendations = [];
    
    if (application.exceptions > 0) {
      if (application.status.includes('Missing')) {
        recommendations.push('Request missing KYC documents via automated email');
      }
      
      if (application.status.includes('Low confidence')) {
        recommendations.push('Review AI-extracted fields for accuracy before proceeding');
      }
    }
    
    if (application.slaHours <= 6) {
      recommendations.push(`SLA deadline approaching (${application.slaHours}h left) - escalate to next available agent`);
    }
    
    if (application.stage === 'Document Validation' && application.documents.length > 0) {
      const unvalidatedDocs = application.documents.filter(doc => !doc.validated).length;
      if (unvalidatedDocs > 0) {
        recommendations.push(`${unvalidatedDocs} documents pending validation - complete document review`);
      }
    }
    
    if (!recommendations.length) {
      recommendations.push('No immediate actions required - proceed with normal workflow');
    }
    
    return recommendations;
  };

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
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/')}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{application.clientName}</h1>
                  <p className="text-sm text-gray-600">Ticket: {application.id}</p>
                </div>
              </div>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Actions
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-6">
          {/* Ticket Overview - Full Width */}
          <Card className="p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Ticket Overview</h2>
              <div className="flex items-center gap-4">
                <StatusBadge status={application.status} exceptions={application.exceptions} />
                
                {/* AI Recommendations Tooltip */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-2">
                      <Brain className="w-5 h-5 text-purple-600" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm p-3" side="bottom">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <Brain className="w-4 h-4" />
                        AI Recommendations
                      </h4>
                      <ul className="text-xs space-y-1">
                        {getAIRecommendations().map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span className="text-purple-600 mt-0.5">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Account Type</p>
                <p className="font-medium">{application.accountType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Stage</p>
                <p className="font-medium">{application.stage}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">SLA</p>
                <p className="font-medium">{application.slaHours}h left</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Progress</p>
                <div className="flex items-center gap-2">
                  <ProgressRing 
                    progress={application.progress} 
                    total={application.totalSteps} 
                    size="sm" 
                  />
                  <span className="text-sm">{application.progress}/{application.totalSteps}</span>
                </div>
              </div>
            </div>

            {/* Validation Steps - Full Width */}
            <ValidationStepCarousel 
              currentStep={currentStep}
              onStepChange={setCurrentStep}
            />
          </Card>

          {/* Step Content */}
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Step Details</h3>
            {renderStepContent()}
          </Card>

          {/* Additional Information */}
          <div className="grid grid-cols-12 gap-6">
            {/* Documents */}
            <div className="col-span-4">
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <h4 className="font-semibold">Documents ({application.documents.length})</h4>
                </div>
                <div className="space-y-2">
                  {application.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{doc.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {doc.confidence && (
                          <span className="text-xs text-gray-500">{doc.confidence}%</span>
                        )}
                        <div className={`w-2 h-2 rounded-full ${doc.validated ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Communications */}
            <div className="col-span-4">
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Mail className="w-4 h-4 text-green-600" />
                  <h4 className="font-semibold">Communications ({application.emails.length})</h4>
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
              </Card>
            </div>

            {/* SOR Data */}
            <div className="col-span-4">
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Database className="w-4 h-4 text-purple-600" />
                  <h4 className="font-semibold">SOR Data</h4>
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
              </Card>
            </div>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
};

export default TicketDetail;
