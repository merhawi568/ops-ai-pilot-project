import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowLeft, FileText, Mail, Database, Settings, Brain, CheckCircle, AlertTriangle, PenTool, CheckSquare, Database as FileCheck, Shield } from 'lucide-react';
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
    
    console.log('Application data:', application); // Debug log
    
    if (application.exceptions > 0) {
      if (application.status.includes('Missing')) {
        recommendations.push('Request missing KYC documents via automated email');
      }
      
      if (application.status.includes('Low confidence')) {
        recommendations.push('Review AI-extracted fields for accuracy before proceeding');
      }
      
      if (application.status.includes('Escalated')) {
        recommendations.push('Manual review required - escalate to senior analyst');
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
    
    // Always provide at least one recommendation
    if (!recommendations.length) {
      recommendations.push('No immediate actions required - proceed with normal workflow');
    }
    
    console.log('AI Recommendations:', recommendations); // Debug log
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
        // Field Validation - using extracted fields if available
        return application.extractedFields ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Field Validation Review</h4>
              <Button size="sm">Validate All</Button>
            </div>
            <div className="space-y-3">
              {application.extractedFields.map((field, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{field.fieldName}</div>
                    <div className="text-sm text-gray-600">{field.value}</div>
                    <div className="text-xs text-gray-400">
                      Source: {field.sourceDocument} | Confidence: {field.confidence}%
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {field.validated ? (
                      <div className="text-green-600 text-sm flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Validated
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Reject</Button>
                        <Button size="sm">Approve</Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No fields available for validation
          </div>
        );
      case 3:
        // SOR Cross-check - using sorData
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">System of Record Cross-check</h4>
              <Button size="sm">Refresh SOR Data</Button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium mb-3 text-gray-700">Extracted Data</h5>
                <div className="space-y-2">
                  {application.extractedFields?.map((field, idx) => (
                    <div key={idx} className="flex justify-between p-2 bg-blue-50 rounded">
                      <span className="text-sm font-medium">{field.fieldName}:</span>
                      <span className="text-sm">{field.value}</span>
                    </div>
                  )) || <div className="text-sm text-gray-500">No extracted data</div>}
                </div>
              </div>
              <div>
                <h5 className="font-medium mb-3 text-gray-700">SOR Data</h5>
                <div className="space-y-2">
                  <div className="flex justify-between p-2 bg-green-50 rounded">
                    <span className="text-sm font-medium">Name:</span>
                    <span className="text-sm">{application.sorData.name}</span>
                  </div>
                  {application.sorData.dob && (
                    <div className="flex justify-between p-2 bg-green-50 rounded">
                      <span className="text-sm font-medium">DOB:</span>
                      <span className="text-sm">{application.sorData.dob}</span>
                    </div>
                  )}
                  <div className="flex justify-between p-2 bg-green-50 rounded">
                    <span className="text-sm font-medium">Account Type:</span>
                    <span className="text-sm">{application.sorData.accountType}</span>
                  </div>
                  {application.sorData.address && (
                    <div className="flex justify-between p-2 bg-green-50 rounded">
                      <span className="text-sm font-medium">Address:</span>
                      <span className="text-sm">{application.sorData.address}</span>
                    </div>
                  )}
                  {application.sorData.income && (
                    <div className="flex justify-between p-2 bg-green-50 rounded">
                      <span className="text-sm font-medium">Income:</span>
                      <span className="text-sm">{application.sorData.income}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {application.aiSuggestions?.some(s => s.message.includes('mismatch')) && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">Data Mismatch Detected</span>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  Some fields don't match between extracted data and SOR. Review required.
                </p>
              </div>
            )}
          </div>
        );
      case 4:
        // DocuSign Pre-fill
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">DocuSign Pre-fill</h4>
              <Button size="sm">Generate Form</Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <h5 className="font-medium mb-2">Available Data</h5>
                <div className="space-y-2 text-sm">
                  <div>✓ Client Name: {application.clientName}</div>
                  <div>✓ Account Type: {application.accountType}</div>
                  {application.sorData.address && <div>✓ Address: Available</div>}
                  {application.sorData.dob && <div>✓ Date of Birth: Available</div>}
                  {application.sorData.income && <div>✓ Income: Available</div>}
                </div>
              </Card>
              <Card className="p-4">
                <h5 className="font-medium mb-2">Form Status</h5>
                <div className="text-center py-4">
                  <PenTool className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-500">Ready to generate DocuSign form</div>
                  <Button className="mt-2" size="sm">Create Form</Button>
                </div>
              </Card>
            </div>
          </div>
        );
      case 5:
        // Good Order Review
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Good Order Review</h4>
              <Button size="sm">Mark Complete</Button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4">
                <h5 className="font-medium mb-2 flex items-center gap-2">
                  <FileCheck className="w-4 h-4" />
                  Documents
                </h5>
                <div className="text-sm">
                  {application.documents.filter(d => d.validated).length}/{application.documents.length} validated
                </div>
              </Card>
              <Card className="p-4">
                <h5 className="font-medium mb-2 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4" />
                  Fields
                </h5>
                <div className="text-sm">
                  {application.extractedFields?.filter(f => f.validated).length || 0}/
                  {application.extractedFields?.length || 0} validated
                </div>
              </Card>
              <Card className="p-4">
                <h5 className="font-medium mb-2 flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  SOR Check
                </h5>
                <div className="text-sm text-green-600">✓ Completed</div>
              </Card>
            </div>
          </div>
        );
      case 6:
        // Workflow Entry
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Workflow Entry</h4>
              <Button size="sm">Enter Workflow</Button>
            </div>
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <div className="text-sm text-gray-600 mb-4">
                Application ready to enter processing workflow
              </div>
              <div className="space-y-2 text-sm">
                <div>✓ All documents validated</div>
                <div>✓ Fields extracted and verified</div>
                <div>✓ SOR cross-check completed</div>
                <div>✓ Good order review passed</div>
              </div>
            </div>
          </div>
        );
      case 7:
        // Final Approval
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Final Approval</h4>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">Reject</Button>
                <Button size="sm">Approve</Button>
              </div>
            </div>
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <div className="text-lg font-medium mb-2">Ready for Final Approval</div>
              <div className="text-sm text-gray-600 mb-6">
                All validation steps completed successfully
              </div>
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <div className="text-left space-y-1">
                  <div className="text-xs text-gray-500">Client:</div>
                  <div className="text-sm font-medium">{application.clientName}</div>
                </div>
                <div className="text-left space-y-1">
                  <div className="text-xs text-gray-500">Account Type:</div>
                  <div className="text-sm font-medium">{application.accountType}</div>
                </div>
              </div>
            </div>
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
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-2 hover:bg-purple-50 border border-purple-200 rounded-full"
                      onClick={() => console.log('AI Brain clicked!')}
                    >
                      <Brain className="w-5 h-5 text-purple-600" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm p-4 bg-white border-purple-200" side="bottom" align="end">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm flex items-center gap-2 text-purple-800">
                        <Brain className="w-4 h-4" />
                        AI Recommendations
                      </h4>
                      <div className="space-y-2">
                        {getAIRecommendations().map((rec, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-purple-600 mt-1 text-xs">•</span>
                            <span className="text-xs text-gray-700 leading-relaxed">{rec}</span>
                          </div>
                        ))}
                      </div>
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

            {/* Validation Steps - Horizontal Full Width */}
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Validation Steps</h3>
              <ValidationStepCarousel 
                currentStep={currentStep}
                onStepChange={setCurrentStep}
              />
            </div>
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
