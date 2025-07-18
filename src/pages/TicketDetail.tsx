import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, FileText, Mail, Database, Settings, Brain, CheckCircle, AlertTriangle, PenTool, CheckSquare, Shield, Eye, HelpCircle, Clock, Save, Check } from 'lucide-react';
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
  const [savedValidations, setSavedValidations] = useState<Record<string, boolean>>({});
  const [selectedField, setSelectedField] = useState<any>(null);

  useEffect(() => {
    console.log('TicketDetail mounted with ticketId:', ticketId);
    console.log('Available applications:', applications);
    
    if (ticketId) {
      const app = applications.find(app => app.id === ticketId);
      console.log('Found application:', app);
      setApplication(app || null);
    }
  }, [ticketId, applications]);

  if (!application) {
    console.log('No application found, showing not found message');
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

  console.log('Rendering TicketDetail for application:', application);

  const getAIRecommendations = () => {
    const recommendations = [];
    
    console.log('Application data:', application);
    
    if (application && application.exceptions > 0) {
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
    console.log('Getting extraction data for ticket:', ticketId);
    
    // Use the application's extractedFields if available, otherwise fall back to hardcoded data
    if (application?.extractedFields && application.extractedFields.length > 0) {
      console.log('Using application extractedFields:', application.extractedFields);
      return application.extractedFields;
    }
    
    switch (ticketId) {
      case 'ON-2025-0455':
        console.log('Returning data for ON-2025-0455');
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
        console.log('No specific data for ticket, returning empty array');
        return [];
    }
  };

  // Save validation function
  const saveValidationStep = (stepKey: string) => {
    console.log('Saving validation for step:', stepKey);
    setSavedValidations(prev => ({ ...prev, [stepKey]: true }));
  };

  // Check if step has both AI and human validation complete
  const isStepFullyValidated = (stepKey: string) => {
    return savedValidations[stepKey] && Object.keys(humanValidations).some(key => 
      key.startsWith(stepKey) && humanValidations[key]
    );
  };

  // Get validation status icon
  const getValidationStatusIcon = (stepKey: string) => {
    const isHumanValidated = savedValidations[stepKey];
    const hasHumanChecks = Object.keys(humanValidations).some(key => 
      key.startsWith(stepKey) && humanValidations[key]
    );
    
    if (isHumanValidated && hasHumanChecks) {
      return (
        <div className="flex items-center gap-1">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <CheckCircle className="w-4 h-4 text-blue-600" />
        </div>
      );
    } else if (isHumanValidated) {
      return <CheckCircle className="w-4 h-4 text-blue-600" />;
    } else if (hasHumanChecks) {
      return <Check className="w-4 h-4 text-green-600" />;
    }
    return null;
  };

  const getMockPDFViewer = (documentName: string, highlightedField?: string) => {
    console.log('Rendering PDF viewer for:', documentName, 'with highlighted field:', highlightedField);
    
    const getPDFContent = () => {
      switch (documentName) {
        case 'Trust_Agreement.pdf':
          return (
            <div className="bg-white border-2 border-gray-300 h-full p-4 text-xs relative">
              <div className="text-center mb-4 font-bold">YAN LUO LIVING TRUST AGREEMENT</div>
              <div className="text-center mb-2">Revocable Trust Document</div>
              <div className="space-y-3 mt-6">
                <div className={`${highlightedField === 'Client Core Information' ? 'bg-yellow-200 border-2 border-yellow-400 p-1' : ''}`}>
                  <strong>Trust Name:</strong> Yan Luo Living Trust
                </div>
                <div className={`${highlightedField === 'Client Addresses' ? 'bg-yellow-200 border-2 border-yellow-400 p-1' : ''}`}>
                  <strong>Trust Address:</strong> 123 Trust Avenue, San Francisco, CA 94102
                </div>
                <div className={`${highlightedField === 'Products' ? 'bg-yellow-200 border-2 border-yellow-400 p-1' : ''}`}>
                  <strong>Account Type:</strong> Revocable Trust Account
                </div>
                <div>
                  <strong>Trustee:</strong> Yan Luo
                </div>
                <div>
                  <strong>Date Established:</strong> March 15, 2024
                </div>
                <div className={`${highlightedField === 'Authorized Contact' ? 'bg-yellow-200 border-2 border-yellow-400 p-1' : ''}`}>
                  <strong>Authorized Contacts:</strong>
                  <div className="ml-4">
                    - Yan Luo (Primary Trustee)
                    <br />
                    - Sarah Chen (Secondary Contact)
                  </div>
                </div>
              </div>
            </div>
          );
        case 'Tax_ID_Form.pdf':
          return (
            <div className="bg-white border-2 border-gray-300 h-full p-4 text-xs">
              <div className="text-center mb-4 font-bold">IRS FORM SS-4</div>
              <div className="text-center mb-4">Application for Employer Identification Number</div>
              <div className="space-y-3">
                <div>
                  <strong>Legal Name:</strong> Yan Luo Living Trust
                </div>
                <div className={`${highlightedField === 'Tax Info' ? 'bg-yellow-200 border-2 border-yellow-400 p-1' : ''}`}>
                  <strong>EIN:</strong> 04-5558529
                </div>
                <div className={`${highlightedField === 'Tax Info' ? 'bg-yellow-200 border-2 border-yellow-400 p-1' : ''}`}>
                  <strong>UCN:</strong> 0299372527
                </div>
                <div>
                  <strong>Type of Entity:</strong> Trust
                </div>
                <div>
                  <strong>Date Applied:</strong> March 20, 2024
                </div>
              </div>
            </div>
          );
        case 'Suitability_Form.pdf':
          return (
            <div className="bg-white border-2 border-gray-300 h-full p-4 text-xs">
              <div className="text-center mb-4 font-bold">INVESTMENT SUITABILITY ASSESSMENT</div>
              <div className="space-y-3">
                <div className={`${highlightedField === 'Investment Suitability' ? 'bg-yellow-200 border-2 border-yellow-400 p-1' : ''}`}>
                  <strong>Risk Profile:</strong> Conservative Risk Profile
                </div>
                <div className={`${highlightedField === 'Investment Experience' ? 'bg-yellow-200 border-2 border-yellow-400 p-1' : ''}`}>
                  <strong>Investment Experience:</strong> 10+ years institutional investing
                </div>
                <div className={`${highlightedField === 'Account Level Suitability' ? 'bg-yellow-200 border-2 border-yellow-400 p-1' : ''}`}>
                  <strong>Client Classification:</strong> High Net Worth Individual
                </div>
                <div>
                  <strong>Investment Objectives:</strong> Capital Preservation, Income Generation
                </div>
                <div>
                  <strong>Time Horizon:</strong> Long-term (10+ years)
                </div>
              </div>
            </div>
          );
        case 'Personal_Info_Form.pdf':
          return (
            <div className="bg-white border-2 border-gray-300 h-full p-4 text-xs">
              <div className="text-center mb-4 font-bold">PERSONAL INFORMATION FORM</div>
              <div className="space-y-3">
                <div>
                  <strong>Trustee Name:</strong> Yan Luo
                </div>
                <div className={`${highlightedField === 'Marital Information & Dependents' ? 'bg-yellow-200 border-2 border-yellow-400 p-1' : ''}`}>
                  <strong>Marital Status:</strong> Single
                </div>
                <div className={`${highlightedField === 'Marital Information & Dependents' ? 'bg-yellow-200 border-2 border-yellow-400 p-1' : ''}`}>
                  <strong>Dependents:</strong> No Dependents
                </div>
                <div>
                  <strong>Occupation:</strong> Business Executive
                </div>
                <div>
                  <strong>Date of Birth:</strong> January 15, 1970
                </div>
              </div>
            </div>
          );
        case 'Authorization_Form.pdf':
          return (
            <div className="bg-white border-2 border-gray-300 h-full p-4 text-xs">
              <div className="text-center mb-4 font-bold">AUTHORIZED CONTACT DESIGNATION</div>
              <div className="space-y-3">
                <div className={`${highlightedField === 'Authorized Contact' ? 'bg-yellow-200 border-2 border-yellow-400 p-1' : ''}`}>
                  <strong>Primary Contact:</strong> Yan Luo
                  <div className="ml-4 text-xs">
                    Title: Primary Trustee<br />
                    Phone: (415) 555-0123<br />
                    Email: yan.luo@email.com
                  </div>
                </div>
                <div className={`${highlightedField === 'Authorized Contact' ? 'bg-yellow-200 border-2 border-yellow-400 p-1' : ''}`}>
                  <strong>Secondary Contact:</strong> Sarah Chen
                  <div className="ml-4 text-xs">
                    Title: Financial Advisor<br />
                    Phone: (415) 555-0124<br />
                    Email: sarah.chen@advisor.com
                  </div>
                </div>
                <div>
                  <strong>Authorization Level:</strong> Full Account Access
                </div>
              </div>
            </div>
          );
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
        case 'Driver_License.pdf':
          return (
            <div className="bg-white border-2 border-gray-300 h-full p-4 text-xs relative">
              <div className="text-center mb-4 font-bold">CALIFORNIA DRIVER LICENSE</div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <div className="bg-gray-200 w-24 h-32 mb-2"></div>
                  <div className="text-xs">Photo</div>
                </div>
                <div className="space-y-1">
                  <div className={`${highlightedField === 'Name' ? 'bg-yellow-200 border-2 border-yellow-400 p-1' : ''}`}>
                    <strong>Name:</strong> Devlin Patel
                  </div>
                  <div><strong>Address:</strong> 456 Oak Street</div>
                  <div><strong>City:</strong> Los Angeles, CA 90210</div>
                  <div><strong>DOB:</strong> 03/22/1985</div>
                  <div><strong>License #:</strong> D1234567</div>
                  <div><strong>Class:</strong> C</div>
                  <div><strong>Expires:</strong> 03/22/2029</div>
                </div>
              </div>
            </div>
          );
        case 'Utility_Bill.pdf':
          return (
            <div className="bg-white border-2 border-gray-300 h-full p-4 text-xs">
              <div className="text-center mb-4 font-bold">PACIFIC GAS & ELECTRIC</div>
              <div className="text-center mb-4">Monthly Statement</div>
              <div className="space-y-3">
                <div>
                  <strong>Service Address:</strong>
                  <div className={`${highlightedField === 'Address' ? 'bg-yellow-200 border-2 border-yellow-400 p-1' : ''}`}>
                    123 Main St<br/>
                    Los Angeles, CA 90210
                  </div>
                </div>
                <div>
                  <strong>Account Holder:</strong> Devlin Patel
                </div>
                <div>
                  <strong>Statement Date:</strong> December 15, 2024
                </div>
                <div>
                  <strong>Amount Due:</strong> $124.50
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
                  <div className={`${highlightedField === 'Name' ? 'bg-yellow-200 border-2 border-yellow-400 p-1' : ''}`}>
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
                    <div className={`${highlightedField === 'Tax Year' ? 'bg-yellow-200 border-2 border-yellow-400 p-1' : ''}`}>
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
        case 'EIN_Letter.pdf':
          return (
            <div className="bg-white border-2 border-gray-300 h-full p-4 text-xs">
              <div className="text-center mb-4 font-bold">INTERNAL REVENUE SERVICE</div>
              <div className="text-center mb-4">Employer Identification Number Assignment</div>
              <div className="space-y-3">
                <div>
                  <strong>Entity Name:</strong> Tyrell Systems LLC
                </div>
                <div>
                  <strong>Employer Identification Number:</strong>
                  <div className={`text-lg font-bold ${highlightedField === 'EIN' ? 'bg-yellow-200 border-2 border-yellow-400 p-1' : ''}`}>
                    12-3456789
                  </div>
                </div>
                <div>
                  <strong>Date Assigned:</strong> January 15, 2024
                </div>
                <div>
                  <strong>Entity Type:</strong> Limited Liability Company
                </div>
              </div>
            </div>
          );
        case 'Resolution.pdf':
          return (
            <div className="bg-white border-2 border-gray-300 h-full p-4 text-xs">
              <div className="text-center mb-4 font-bold">CORPORATE RESOLUTION</div>
              <div className="text-center mb-4">Tyrell Systems LLC</div>
              <div className="space-y-3">
                <div>
                  <strong>RESOLVED:</strong> That the following person is hereby authorized to act as signatory for the company:
                </div>
                <div className={`${highlightedField === 'Authorized Signatory' ? 'bg-yellow-200 border-2 border-yellow-400 p-1' : ''}`}>
                  <strong>Authorized Signatory:</strong> John Tyrell
                </div>
                <div>
                  <strong>Title:</strong> Managing Member
                </div>
                <div>
                  <strong>Date of Resolution:</strong> January 20, 2024
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
                  <strong>Full Name:</strong> [PRE-FILLED] {ticketId === 'ON-2025-0455' ? 'Elisa Kim' : 'Client Name'}
                </div>
                <div className={`${highlightedField === 'DOB' ? 'bg-blue-200 border-2 border-blue-400 p-1' : 'border p-1'}`}>
                  <strong>Date of Birth:</strong> [PRE-FILLED] {ticketId === 'ON-2025-0455' ? '08/14/1984' : 'DOB'}
                </div>
                <div className="mt-6">
                  <div className={`${highlightedField === 'signature' ? 'bg-green-200 border-2 border-green-400 p-2' : 'border-2 border-dashed border-gray-300 p-2'} h-16`}>
                    <div className="text-xs text-gray-500 mb-1">Client Signature:</div>
                    {highlightedField === 'signature' && (
                      <div className="italic font-script text-lg">{ticketId === 'ON-2025-0455' ? 'Elisa Kim' : 'Client Signature'}</div>
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
                  <strong>Client Name:</strong> {application?.clientName}
                </div>
                <div className={`${highlightedField === 'Account Type' ? 'bg-purple-200 border-2 border-purple-400 p-1' : ''}`}>
                  <strong>Account Type:</strong> {application?.accountType}
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
                    <li>Primary documents validated ✓</li>
                    <li>Form completed ✓</li>
                  </ul>
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
    console.log('Rendering step content for step:', currentStep);
    const extractionData = getExtractionDataForTicket();
    console.log('Extraction data:', extractionData);

    switch (currentStep) {
      case 0: // Document Validation
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Document Status</h4>
              <div className="flex items-center gap-2">
                {getValidationStatusIcon('doc')}
                <Button 
                  onClick={() => saveValidationStep('doc')}
                  disabled={savedValidations['doc']}
                  className={savedValidations['doc'] ? 'bg-green-600' : ''}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {savedValidations['doc'] ? 'Saved' : 'Save Human Validation'}
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                {application?.documents.map((doc) => (
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
                          onClick={() => {
                            console.log('Selecting document:', doc);
                            setSelectedField({ type: 'document', data: doc });
                          }}
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
          </div>
        );

      case 1: // AI Extraction
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Extracted Fields</h4>
              <div className="flex items-center gap-2">
                {getValidationStatusIcon('field')}
                <Button 
                  onClick={() => saveValidationStep('field')}
                  disabled={savedValidations['field']}
                  className={savedValidations['field'] ? 'bg-green-600' : ''}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {savedValidations['field'] ? 'Saved' : 'Save Human Validation'}
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
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
                          onClick={() => {
                            console.log('Selecting extraction field:', field);
                            setSelectedField({ type: 'extraction', data: field });
                          }}
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
              <div>
                {selectedField?.type === 'extraction' && selectedField?.data ? (
                  getMockPDFViewer(selectedField.data.sourceDocument, selectedField.data.fieldName)
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
          </div>
        );

      case 2: // SOR Cross-check
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Data Comparison</h4>
              <div className="flex items-center gap-2">
                {getValidationStatusIcon('sor')}
                <Button 
                  onClick={() => saveValidationStep('sor')}
                  disabled={savedValidations['sor']}
                  className={savedValidations['sor'] ? 'bg-green-600' : ''}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {savedValidations['sor'] ? 'Saved' : 'Save Human Validation'}
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
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
                        <div className="flex justify-between p-2 bg-green-50 rounded mb-2">
                          <span className="text-sm font-medium">Place of Birth:</span>
                          <span className="text-sm">California, USA</span>
                        </div>
                      </>
                    )}
                    {ticketId === 'ON-2025-0456' && (
                      <>
                        <div className="flex justify-between p-2 bg-green-50 rounded mb-2">
                          <span className="text-sm font-medium">Name:</span>
                          <span className="text-sm">Devlin Patel</span>
                        </div>
                        <div className="flex justify-between p-2 bg-green-50 rounded mb-2">
                          <span className="text-sm font-medium">Address:</span>
                          <span className="text-sm">123 Main St, City, State</span>
                        </div>
                      </>
                    )}
                    {ticketId === 'ON-2025-0458' && (
                      <>
                        <div className="flex justify-between p-2 bg-green-50 rounded mb-2">
                          <span className="text-sm font-medium">Name:</span>
                          <span className="text-sm">Rachel Nunez</span>
                        </div>
                        <div className="flex justify-between p-2 bg-red-50 rounded mb-2 border border-red-200">
                          <span className="text-sm font-medium">Income:</span>
                          <span className="text-sm text-red-700">$175,000</span>
                        </div>
                        <div className="flex justify-between p-2 bg-green-50 rounded mb-2">
                          <span className="text-sm font-medium">Tax Year:</span>
                          <span className="text-sm">2023</span>
                        </div>
                      </>
                    )}
                    {ticketId === 'ON-2025-0459' && (
                      <>
                        <div className="flex justify-between p-2 bg-green-50 rounded mb-2">
                          <span className="text-sm font-medium">Entity Name:</span>
                          <span className="text-sm">Tyrell Systems LLC</span>
                        </div>
                        <div className="flex justify-between p-2 bg-green-50 rounded mb-2">
                          <span className="text-sm font-medium">EIN:</span>
                          <span className="text-sm">12-3456789</span>
                        </div>
                        <div className="flex justify-between p-2 bg-green-50 rounded mb-2">
                          <span className="text-sm font-medium">Authorized Signatory:</span>
                          <span className="text-sm">John Tyrell</span>
                        </div>
                      </>
                    )}
                    {ticketId === 'ON-2025-0450' && (
                      <>  
                        <div className="flex justify-between p-2 bg-green-50 rounded mb-2">
                          <span className="text-sm font-medium">Name:</span>
                          <span className="text-sm">Global Health Trust</span>
                        </div>
                        <div className="flex justify-between p-2 bg-green-50 rounded mb-2">
                          <span className="text-sm font-medium">Account Type:</span>
                          <span className="text-sm">Trust</span>
                        </div>
                        <div className="flex justify-between p-2 bg-green-50 rounded mb-2">
                          <span className="text-sm font-medium">Entity Name:</span>
                          <span className="text-sm">Global Health Trust</span>
                        </div>
                        <div className="flex justify-between p-2 bg-green-50 rounded mb-2">
                          <span className="text-sm font-medium">Compliance ID:</span>
                          <span className="text-sm">GHT-4502</span>
                        </div>
                      </>
                    )}
                  </Card>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={humanValidations['sor-review'] || false}
                    onCheckedChange={(checked) => 
                      setHumanValidations(prev => ({ ...prev, 'sor-review': checked as boolean }))
                    }
                  />
                  <label className="text-sm text-gray-700">SOR Cross-check Complete</label>
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
                {ticketId === 'ON-2025-0458' && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium text-red-800">Income Mismatch Detected</span>
                    </div>
                    <p className="text-sm text-red-700 mt-1">
                      Extracted: $182,000 vs SOR: $175,000
                    </p>
                  </div>
                )}
              </div>
              <div>
                {ticketId === 'ON-2025-0455' && getMockPDFViewer('Passport.pdf', 'DOB')}
                {ticketId === 'ON-2025-0456' && getMockPDFViewer('Driver_License.pdf', 'Name')}
                {ticketId === 'ON-2025-0458' && getMockPDFViewer('1099.pdf', 'Income')}
                {ticketId === 'ON-2025-0459' && getMockPDFViewer('Articles_of_Incorporation.pdf', 'Entity Name')}
                {ticketId === 'ON-2025-0450' && getMockPDFViewer('Trust_Agreement.pdf', 'Client Core Information')}
              </div>
            </div>
          </div>
        );

      case 3: // DocuSign Pre-fill
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Form Pre-fill Status</h4>
              <div className="flex items-center gap-2">
                {getValidationStatusIcon('docusign')}
                <Button 
                  onClick={() => saveValidationStep('docusign')}
                  disabled={savedValidations['docusign']}
                  className={savedValidations['docusign'] ? 'bg-green-600' : ''}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {savedValidations['docusign'] ? 'Saved' : 'Save Human Validation'}
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
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
                  <div className="flex items-center gap-2 mt-4">
                    <Checkbox
                      checked={humanValidations['docusign-review'] || false}
                      onCheckedChange={(checked) => 
                        setHumanValidations(prev => ({ ...prev, 'docusign-review': checked as boolean }))
                      }
                    />
                    <label className="text-sm text-gray-700">DocuSign Pre-fill Complete</label>
                  </div>
                </Card>
              </div>
              {getMockPDFViewer('DocuSign_Form.pdf', selectedField?.field)}
            </div>
          </div>
        );

      case 4: // Good Order Review
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Good Order Review</h4>
              <div className="flex items-center gap-2">
                {getValidationStatusIcon('goodorder')}
                <Button 
                  onClick={() => saveValidationStep('goodorder')}
                  disabled={savedValidations['goodorder']}
                  className={savedValidations['goodorder'] ? 'bg-green-600' : ''}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {savedValidations['goodorder'] ? 'Saved' : 'Save Human Validation'}
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
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
          </div>
        );

      case 5: // Workflow Entry
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Workflow Entry</h4>
              <div className="flex items-center gap-2">
                {getValidationStatusIcon('workflow')}
                <Button 
                  onClick={() => saveValidationStep('workflow')}
                  disabled={savedValidations['workflow']}
                  className={savedValidations['workflow'] ? 'bg-green-600' : ''}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {savedValidations['workflow'] ? 'Saved' : 'Save Human Validation'}
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <Card className="p-4">
                  <h5 className="font-medium mb-3">Entry Data</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                      <span className="font-medium">Client Name:</span>
                      <span>{application?.clientName}</span>
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
                      <span>{application?.accountType}</span>
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
                issues: ['Low confidence income field (68%)', 'Income mismatch with SOR'],
                summary: 'Pending human confirmation of low-confidence extraction and data mismatch'
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
                    {application?.documents.every(d => d.validated) ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    )}
                    <span className="text-sm">All required documents present</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {application && application.exceptions === 0 ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    )}
                    <span className="text-sm">No open exceptions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {application && application.slaHours > 0 ? (
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
                  <div className="text-sm font-medium">{application?.clientName}</div>
                </div>
                <div className="text-left space-y-1">
                  <div className="text-xs text-gray-500">Account Type:</div>
                  <div className="text-sm font-medium">{application?.accountType}</div>
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
                onStepChange={(step) => {
                  console.log('Step changed to:', step);
                  setCurrentStep(step);
                }}
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
                      <div><span className="text-gray-500">Place of Birth:</span> California, USA</div>
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
