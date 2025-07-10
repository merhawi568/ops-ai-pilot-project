import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, FileText, Mail, Database, Settings, Brain, CheckCircle, AlertTriangle, PenTool, CheckSquare, Shield, Eye, HelpCircle, Clock } from 'lucide-react';
import { useApplicationStore } from '@/store/useApplicationStore';
import { Application } from '@/types';
import { ValidationStepCarousel } from '@/components/ValidationStepCarousel';
import { DocumentValidationView } from '@/components/DocumentValidationView';
import { AIExtractionView } from '@/components/AIExtractionView';
import { StatusBadge } from '@/components/StatusBadge';
import { ProgressRing } from '@/components/ui/progress-ring';

const TicketDetail: React.FC = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const { applications } = useApplicationStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [application, setApplication] = useState<Application | null>(null);
  const [humanValidations, setHumanValidations] = useState<Record<string, boolean>>({});
  const [selectedField, setSelectedField] = useState<any>(null);

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
    
    console.log('Application data:', application);
    
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
    
    if (!recommendations.length) {
      recommendations.push('No immediate actions required - proceed with normal workflow');
    }
    
    console.log('AI Recommendations:', recommendations);
    return recommendations;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-green-500';
    if (confidence >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getExtractionDataForTicket = () => {
    switch (ticketId) {
      case 'ON-2025-0455':
        return [
          { fieldName: 'Name', value: 'Elisa Kim', sourceDocument: 'Passport.pdf', confidence: 95, validated: false },
          { fieldName: 'DOB', value: '08/14/1984', sourceDocument: 'Passport.pdf', confidence: 90, validated: false },
          { fieldName: 'Passport Number', value: 'N12345678', sourceDocument: 'Passport.pdf', confidence: 98, validated: false },
          { fieldName: 'Place of Birth', value: 'California, USA', sourceDocument: 'Passport.pdf', confidence: 92, validated: false }
        ];
      case 'ON-2025-0456':
        return [
          { fieldName: 'Name', value: 'Devlin Patel', sourceDocument: 'Driver_License.pdf', confidence: 92, validated: false },
          { fieldName: 'Address', value: '123 Main St, City, State', sourceDocument: 'Utility_Bill.pdf', confidence: 88, validated: false }
        ];
      case 'ON-2025-0458':
        return [
          { fieldName: 'Name', value: 'Rachel Nunez', sourceDocument: '1099.pdf', confidence: 94, validated: false },
          { fieldName: 'Income', value: '$182,000', sourceDocument: '1099.pdf', confidence: 68, validated: false },
          { fieldName: 'Tax Year', value: '2023', sourceDocument: '1099.pdf', confidence: 99, validated: false }
        ];
      case 'ON-2025-0459':
        return [
          { fieldName: 'Entity Name', value: 'Tyrell Systems LLC', sourceDocument: 'Articles_of_Incorporation.pdf', confidence: 96, validated: false },
          { fieldName: 'EIN', value: '12-3456789', sourceDocument: 'EIN_Letter.pdf', confidence: 99, validated: false },
          { fieldName: 'Authorized Signatory', value: 'John Tyrell', sourceDocument: 'Resolution.pdf', confidence: 93, validated: false }
        ];
      default:
        return application.extractedFields || [];
    }
  };

  const getMockPDFViewer = (documentName: string, highlightedField?: string) => {
    const getPDFContent = () => {
      switch (documentName) {
        case 'Passport.pdf':
          return (
            <div className="bg-white border-2 border-gray-300 h-full p-4 text-xs relative">
              <div className="text-center mb-4 font-bold">UNITED STATES OF AMERICA</div>
              <div className="text-center mb-2">PASSPORT</div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <div className="bg-gray-200 w-24 h-32 mb-2"></div>
                  <div className="text-xs">Photo</div>
                </div>
                <div className="space-y-1">
                  <div className={`${highlightedField === 'Name' ? 'bg-yellow-200 border-2 border-yellow-400 p-1' : ''}`}>
                    <strong>Name:</strong> Kim, Elisa
                  </div>
                  <div className={`${highlightedField === 'DOB' ? 'bg-yellow-200 border-2 border-yellow-400 p-1' : ''}`}>
                    <strong>Date of Birth:</strong> 14 AUG 1984
                  </div>
                  <div className={`${highlightedField === 'Passport Number' ? 'bg-yellow-200 border-2 border-yellow-400 p-1' : ''}`}>
                    <strong>Passport No:</strong> N12345678
                  </div>
                  <div className={`${highlightedField === 'Place of Birth' ? 'bg-yellow-200 border-2 border-yellow-400 p-1' : ''}`}>
                    <strong>Place of Birth:</strong> California, USA
                  </div>
                  <div><strong>Issue Date:</strong> 15 JUN 2020</div>
                  <div><strong>Expiration:</strong> 14 JUN 2030</div>
                </div>
              </div>
            </div>
          );
        case 'DocuSign_Form.pdf':
          return (
            <div className="bg-white border-2 border-gray-300 h-full p-4 text-xs">
              <div className="text-center mb-4 font-bold">ACCOUNT OPENING FORM</div>
              <div className="space-y-3">
                <div className={`${highlightedField === 'Name' ? 'bg-blue-200 border-2 border-blue-400 p-1' : 'border p-1'}`}>
                  <strong>Full Name:</strong> [PRE-FILLED] Elisa Kim
                </div>
                <div className={`${highlightedField === 'DOB' ? 'bg-blue-200 border-2 border-blue-400 p-1' : 'border p-1'}`}>
                  <strong>Date of Birth:</strong> [PRE-FILLED] 08/14/1984
                </div>
                <div className={`${highlightedField === 'Passport Number' ? 'bg-blue-200 border-2 border-blue-400 p-1' : 'border p-1'}`}>
                  <strong>ID Number:</strong> [PRE-FILLED] N12345678
                </div>
                <div className="mt-6">
                  <div className={`${highlightedField === 'signature' ? 'bg-green-200 border-2 border-green-400 p-2' : 'border-2 border-dashed border-gray-300 p-2'} h-16`}>
                    <div className="text-xs text-gray-500 mb-1">Client Signature:</div>
                    {highlightedField === 'signature' && (
                      <div className="italic font-script text-lg">Elisa Kim</div>
                    )}
                  </div>
                </div>
                <div className={`${highlightedField === 'date' ? 'bg-green-200 border-2 border-green-400 p-1' : 'border p-1'}`}>
                  <strong>Date Signed:</strong> {highlightedField === 'date' ? '01/08/2025' : '[To be filled]'}
                </div>
              </div>
            </div>
          );
        case 'Workflow_Entry.pdf':
          return (
            <div className="bg-white border-2 border-gray-300 h-full p-4 text-xs">
              <div className="text-center mb-4 font-bold">WORKFLOW ENTRY FORM</div>
              <div className="space-y-2">
                <div className={`${highlightedField === 'Client Name' ? 'bg-purple-200 border-2 border-purple-400 p-1' : ''}`}>
                  <strong>Client Name:</strong> Elisa Kim
                </div>
                <div className={`${highlightedField === 'Account Type' ? 'bg-purple-200 border-2 border-purple-400 p-1' : ''}`}>
                  <strong>Account Type:</strong> Individual
                </div>
                <div className={`${highlightedField === 'Entry Date' ? 'bg-purple-200 border-2 border-purple-400 p-1' : ''}`}>
                  <strong>Workflow Entry Date:</strong> 01/08/2025
                </div>
                <div className={`${highlightedField === 'Status' ? 'bg-purple-200 border-2 border-purple-400 p-1' : ''}`}>
                  <strong>Status:</strong> Entered - Pending Final Validation
                </div>
                <div className="mt-4 p-2 bg-gray-50 rounded">
                  <strong>Source Documents:</strong>
                  <ul className="list-disc list-inside text-xs mt-1">
                    <li>Passport.pdf - Validated ✓</li>
                    <li>DocuSign_Form.pdf - Completed ✓</li>
                  </ul>
                </div>
              </div>
            </div>
          );
        case '1099.pdf':
          return (
            <div className="bg-white border-2 border-gray-300 h-full p-4 text-xs">
              <div className="text-center mb-4 font-bold">Form 1099-MISC</div>
              <div className="text-center mb-4">Miscellaneous Income</div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div><strong>PAYER:</strong></div>
                  <div>ABC Corporation</div>
                  <div>123 Business Ave</div>
                  <div>New York, NY 10001</div>
                </div>
                <div>
                  <div><strong>RECIPIENT:</strong></div>
                  <div className={`${highlightedField === 'Name' ? 'bg-yellow-200 border-2 border-yellow-400' : ''}`}>
                    Rachel Nunez
                  </div>
                  <div>456 Oak Street</div>
                  <div>Los Angeles, CA 90210</div>
                </div>
              </div>
              <div className="mt-6 border-t pt-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div><strong>Box 1 - Rents:</strong></div>
                    <div className={`text-lg font-bold ${highlightedField === 'Income' ? 'bg-yellow-200 border-2 border-yellow-400 p-1' : ''}`}>
                      $182,000.00
                    </div>
                  </div>
                  <div>
                    <div><strong>Tax Year:</strong></div>
                    <div className={`${highlightedField === 'Tax Year' ? 'bg-yellow-200 border-2 border-yellow-400' : ''}`}>
                      2023
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        case 'Articles_of_Incorporation.pdf':
          return (
            <div className="bg-white border-2 border-gray-300 h-full p-4 text-xs">
              <div className="text-center mb-4 font-bold">ARTICLES OF INCORPORATION</div>
              <div className="text-center mb-4">State of Delaware</div>
              <div className="space-y-3">
                <div>
                  <strong>Article I - Name:</strong>
                  <div className={`${highlightedField === 'Entity Name' ? 'bg-yellow-200 border-2 border-yellow-400 p-1' : ''}`}>
                    The name of the corporation is Tyrell Systems LLC
                  </div>
                </div>
                <div>
                  <strong>Article II - Purpose:</strong>
                  <div>To engage in any lawful act or activity for which corporations may be organized...</div>
                </div>
                <div>
                  <strong>Article III - Registered Agent:</strong>
                  <div>Corporation Service Company</div>
                  <div>2711 Centerville Road, Suite 400</div>
                  <div>Wilmington, DE 19808</div>
                </div>
              </div>
            </div>
          );
        default:
          return (
            <div className="bg-gray-100 h-full rounded flex items-center justify-center">
              <div className="text-center text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-2" />
                <p>PDF: {documentName}</p>
                <p className="text-sm">Document preview would appear here</p>
              </div>
            </div>
          );
      }
    };

    return (
      <Card className="p-4 h-96">
        <h5 className="font-semibold mb-3">{documentName}</h5>
        <div className="h-80 overflow-y-auto">
          {getPDFContent()}
        </div>
      </Card>
    );
  };

  const renderStepContent = () => {
    const extractionData = getExtractionDataForTicket();

    switch (currentStep) {
      case 0: // Document Validation
        return (
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Document Status</h4>
              {application.documents.map((doc) => (
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
                        onClick={() => setSelectedField({ type: 'document', data: doc })}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <Checkbox
                      checked={humanValidations[`doc-${doc.id}`] || false}
                      onCheckedChange={(checked) => 
                        setHumanValidations(prev => ({ ...prev, [`doc-${doc.id}`]: checked as boolean }))
                      }
                    />
                    <label className="text-sm text-gray-700">Human Validation</label>
                  </div>
                </Card>
              ))}
            </div>
            {selectedField?.type === 'document' ? 
              getMockPDFViewer(selectedField.data.name) :
              <Card className="p-4 h-96 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-2" />
                  <p>Select a document to view</p>
                </div>
              </Card>
            }
          </div>
        );

      case 1: // AI Extraction
        return (
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Extracted Fields</h4>
              {extractionData.map((field, idx) => (
                <Card key={idx} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{field.fieldName}</div>
                    <div className="flex items-center gap-2">
                      <div className={`w-16 h-2 rounded-full ${getConfidenceColor(field.confidence)}`}>
                        <div 
                          className="h-full bg-current rounded-full"
                          style={{ width: `${field.confidence}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{field.confidence}%</span>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="w-4 h-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Extracted from {field.sourceDocument}</p>
                        </TooltipContent>
                      </Tooltip>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedField({ type: 'extraction', data: field })}
                        className="h-6 w-6 p-0"
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <input
                    type="text"
                    defaultValue={field.value}
                    className="w-full p-2 border rounded mb-2"
                    placeholder="Edit extracted value"
                  />
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={humanValidations[`field-${idx}`] || false}
                      onCheckedChange={(checked) => 
                        setHumanValidations(prev => ({ ...prev, [`field-${idx}`]: checked as boolean }))
                      }
                    />
                    <label className="text-sm text-gray-700">Human Validation</label>
                  </div>
                </Card>
              ))}
            </div>
            {selectedField?.type === 'extraction' ? 
              getMockPDFViewer(selectedField.data.sourceDocument, selectedField.data.fieldName) :
              <Card className="p-4 h-96 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-2" />
                  <p>Click on a field to view source document</p>
                </div>
              </Card>
            }
          </div>
        );

      case 2: // SOR Cross-check
        return (
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Data Comparison</h4>
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <h5 className="font-medium mb-3 text-blue-700">Extracted Data</h5>
                  {extractionData.map((field, idx) => (
                    <div key={idx} className="flex justify-between p-2 bg-blue-50 rounded mb-2">
                      <span className="text-sm font-medium">{field.fieldName}:</span>
                      <span className="text-sm">{field.value}</span>
                    </div>
                  ))}
                </Card>
                <Card className="p-4">
                  <h5 className="font-medium mb-3 text-green-700">SOR Data</h5>
                  {ticketId === 'ON-2025-0455' && (
                    <>
                      <div className="flex justify-between p-2 bg-green-50 rounded mb-2">
                        <span className="text-sm font-medium">Name:</span>
                        <span className="text-sm">Elisa Kim</span>
                      </div>
                      <div className="flex justify-between p-2 bg-red-50 rounded mb-2 border border-red-200">
                        <span className="text-sm font-medium">DOB:</span>
                        <span className="text-sm text-red-700">08/16/1984</span>
                      </div>
                      <div className="flex justify-between p-2 bg-green-50 rounded mb-2">
                        <span className="text-sm font-medium">Passport:</span>
                        <span className="text-sm">N12345678</span>
                      </div>
                    </>
                  )}
                </Card>
              </div>
              {ticketId === 'ON-2025-0455' && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">DOB Mismatch Detected</span>
                  </div>
                  <p className="text-sm text-red-700 mt-1">
                    Extracted: 08/14/1984 vs SOR: 08/16/1984
                  </p>
                </div>
              )}
            </div>
            <div>
              {getMockPDFViewer('Passport.pdf', 'DOB')}
            </div>
          </div>
        );

      case 3: // DocuSign Pre-fill
        return (
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Form Pre-fill Status</h4>
              <Card className="p-4">
                <h5 className="font-medium mb-2">Available Data for Pre-fill</h5>
                <div className="space-y-2 text-sm">
                  {extractionData.map((field, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>{field.fieldName}: {field.value}</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedField({ type: 'docusign', field: field.fieldName })}
                        className="h-6 px-2 text-xs ml-auto"
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button className="mt-4 w-full">Generate DocuSign Form</Button>
              </Card>
            </div>
            {getMockPDFViewer('DocuSign_Form.pdf', selectedField?.field)}
          </div>
        );

      case 4: // Good Order Review
        return (
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Good Order Review</h4>
              <Card className="p-4">
                <h5 className="font-medium mb-3">Review Items</h5>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Client Signature</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedField({ type: 'goodorder', field: 'signature' })}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Date Signed</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedField({ type: 'goodorder', field: 'date' })}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Checkbox
                      checked={humanValidations['goodorder-review'] || false}
                      onCheckedChange={(checked) => 
                        setHumanValidations(prev => ({ ...prev, 'goodorder-review': checked as boolean }))
                      }
                    />
                    <label className="text-sm text-gray-700">Good Order Review Complete</label>
                  </div>
                </div>
              </Card>
            </div>
            {getMockPDFViewer('DocuSign_Form.pdf', selectedField?.field)}
          </div>
        );

      case 5: // Workflow Entry
        return (
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Workflow Entry</h4>
              <Card className="p-4">
                <h5 className="font-medium mb-3">Entry Data</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                    <span className="font-medium">Client Name:</span>
                    <span>{application.clientName}</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedField({ type: 'workflow', field: 'Client Name' })}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                    <span className="font-medium">Account Type:</span>
                    <span>{application.accountType}</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedField({ type: 'workflow', field: 'Account Type' })}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                    <span className="font-medium">Entry Date:</span>
                    <span>01/08/2025</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedField({ type: 'workflow', field: 'Entry Date' })}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <Checkbox
                    checked={humanValidations['workflow-entry'] || false}
                    onCheckedChange={(checked) => 
                      setHumanValidations(prev => ({ ...prev, 'workflow-entry': checked as boolean }))
                    }
                  />
                  <label className="text-sm text-gray-700">Workflow Entry Complete</label>
                </div>
              </Card>
            </div>
            {getMockPDFViewer('Workflow_Entry.pdf', selectedField?.field)}
          </div>
        );

      case 6: // Final Validation
        const getFinalValidationStatus = () => {
          switch (ticketId) {
            case 'ON-2025-0455':
              return {
                status: 'exception',
                issues: ['DOB mismatch between extracted data and SOR'],
                summary: 'Exception open due to DOB mismatch'
              };
            case 'ON-2025-0456':
              return {
                status: 'exception',
                issues: ['Missing passport document', 'KYC incomplete'],
                summary: 'Failed - Missing required documentation'
              };
            case 'ON-2025-0458':
              return {
                status: 'pending',
                issues: ['Low confidence income field (68%)'],
                summary: 'Pending human confirmation of low-confidence extraction'
              };
            case 'ON-2025-0459':
              return {
                status: 'completed',
                issues: [],
                summary: 'All validations passed - Ready for final approval'
              };
            default:
              return {
                status: 'pending',
                issues: [],
                summary: 'Validation in progress'
              };
          }
        };

        const validationStatus = getFinalValidationStatus();

        return (
          <div className="space-y-6">
            <div className="text-center">
              {validationStatus.status === 'completed' ? (
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              ) : validationStatus.status === 'exception' ? (
                <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              ) : (
                <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              )}
              <h4 className="text-xl font-semibold mb-2">Final Validation Summary</h4>
              <p className="text-gray-600">{validationStatus.summary}</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Card className="p-4">
                <h5 className="font-semibold mb-4">Validation Checklist</h5>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {application.documents.every(d => d.validated) ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    )}
                    <span className="text-sm">All required documents present</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {application.exceptions === 0 ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    )}
                    <span className="text-sm">No open exceptions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {application.slaHours > 0 ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    )}
                    <span className="text-sm">SLA requirements met</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {Object.keys(humanValidations).length > 0 ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    )}
                    <span className="text-sm">Human validations completed</span>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h5 className="font-semibold mb-4">Outstanding Issues</h5>
                {validationStatus.issues.length > 0 ? (
                  <div className="space-y-2">
                    {validationStatus.issues.map((issue, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                        <span className="text-sm text-red-700">{issue}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <span className="text-sm text-green-700">No outstanding issues</span>
                  </div>
                )}
              </Card>
            </div>
          </div>
        );

      case 7: // Final Approval
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
                
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-2 hover:bg-purple-50 border border-purple-200 rounded-full transition-colors duration-200"
                      onClick={() => console.log('AI Brain clicked!')}
                    >
                      <Brain className="w-5 h-5 text-purple-600" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm p-4 bg-white border-purple-200 shadow-lg" side="bottom" align="end">
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

            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Validation Steps</h3>
              <ValidationStepCarousel 
                currentStep={currentStep}
                onStepChange={setCurrentStep}
                ticketId={ticketId}
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

            <div className="col-span-4">
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Database className="w-4 h-4 text-purple-600" />
                  <h4 className="font-semibold">SOR Data</h4>
                </div>
                <div className="space-y-2 text-sm">
                  {ticketId === 'ON-2025-0455' ? (
                    <>
                      <div><span className="text-gray-500">Name:</span> Elisa Kim</div>
                      <div><span className="text-gray-500">DOB:</span> 08/16/1984</div>
                      <div><span className="text-gray-500">Account Type:</span> Individual</div>
                      <div><span className="text-gray-500">Passport:</span> N12345678</div>
                    </>
                  ) : (
                    <>
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
                    </>
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
