
export interface Application {
  id: string;
  clientName: string;
  accountType: 'Individual' | 'Trust' | 'Investment' | 'Cash Mgmt';
  stage: string;
  status: string;
  exceptions: number;
  slaHours: number;
  progress: number;
  totalSteps: number;
  documents: Document[];
  emails: Email[];
  sorData: SORData;
  aiSuggestions?: AISuggestion[];
  extractedFields?: ExtractedField[];
  color:string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  required: boolean;
  validated: boolean;
  confidence?: number;
  url?: string;
}

export interface Email {
  id: string;
  from: string;
  subject: string;
  date: string;
  type: 'advisor' | 'client' | 'system';
}

export interface SORData {
  name: string;
  dob?: string;
  accountType: string;
  address?: string;
  income?: string;
  entityName?: string;
  complianceId?: string;
  riskTolerance?: string;
}

export interface AISuggestion {
  id: string;
  type: 'action' | 'warning' | 'info';
  message: string;
  action?: string;
  confidence: number;
}

export interface ExtractedField {
  fieldName: string;
  value: string;
  sourceDocument: string;
  confidence: number;
  validated: boolean;
}

export interface ValidationStep {
  id: string;
  name: string;
  status: 'completed' | 'pending' | 'exception';
  icon: string;
  description: string;
}

export interface SystemMetrics {
  applicationsCompleted: number;
  avgProcessingTime: string;
  manualInterventions: number;
  exceptionsAutoResolved: number;
}
