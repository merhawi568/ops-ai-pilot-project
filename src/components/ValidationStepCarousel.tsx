
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle, Clock, FileText, Eye, Database, FileCheck, PenTool, Shield, CheckSquare } from 'lucide-react';
import { ValidationStep } from '@/types';

interface ValidationStepCarouselProps {
  currentStep: number;
  onStepChange: (step: number) => void;
}

export const ValidationStepCarousel: React.FC<ValidationStepCarouselProps> = ({
  currentStep,
  onStepChange
}) => {
  const steps: ValidationStep[] = [
    {
      id: 'doc-validation',
      name: 'Document Validation',
      status: 'completed',
      icon: 'FileText',
      description: 'Verify all required documents are submitted and valid'
    },
    {
      id: 'ai-extraction',
      name: 'AI Extraction',
      status: 'exception',
      icon: 'Eye',
      description: 'Extract data from submitted documents using OCR'
    },
    {
      id: 'field-validation',
      name: 'Field Validation',
      status: 'pending',
      icon: 'CheckSquare',
      description: 'Validate extracted field data for accuracy'
    },
    {
      id: 'sor-check',
      name: 'SOR Cross-check',
      status: 'pending',
      icon: 'Database',
      description: 'Cross-reference data with system of record'
    },
    {
      id: 'docusign-prefill',
      name: 'DocuSign Pre-fill',
      status: 'pending',
      icon: 'PenTool',
      description: 'Pre-populate DocuSign forms with extracted data'
    },
    {
      id: 'good-order',
      name: 'Good Order Review',
      status: 'pending',
      icon: 'FileCheck',
      description: 'Review signatures and completion status'
    },
    {
      id: 'workflow-entry',
      name: 'Workflow Entry',
      status: 'pending',
      icon: 'Shield',
      description: 'Enter application into processing workflow'
    },
    {
      id: 'final-approval',
      name: 'Final Approval',
      status: 'pending',
      icon: 'CheckCircle',
      description: 'Final review and approval for account opening'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'exception':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string, isActive: boolean) => {
    if (isActive) return 'bg-blue-100 border-blue-300';
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'exception':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card className="p-4 mb-6">
      <h3 className="text-lg font-semibold mb-4">Validation Progress</h3>
      
      <div className="grid grid-cols-8 gap-2 mb-4">
        {steps.map((step, index) => (
          <Button
            key={step.id}
            variant="ghost"
            onClick={() => onStepChange(index)}
            className={`h-16 flex flex-col items-center justify-center border-2 ${getStatusColor(step.status, index === currentStep)} text-xs`}
          >
            {getStatusIcon(step.status)}
            <span className="font-medium mt-1 text-center leading-tight">
              {step.name}
            </span>
          </Button>
        ))}
      </div>
      
      <div className="text-sm text-gray-600">
        <strong>{steps[currentStep]?.name}:</strong> {steps[currentStep]?.description}
      </div>
    </Card>
  );
};
