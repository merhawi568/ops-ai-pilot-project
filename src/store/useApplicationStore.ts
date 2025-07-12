import { create } from 'zustand';
import { Application, SystemMetrics } from '../types';

interface ApplicationStore {
  applications: Application[];
  selectedApplication: Application | null;
  systemMetrics: SystemMetrics;
  filters: {
    status: string;
    sortBy: string;
  };
  setSelectedApplication: (app: Application | null) => void;
  setFilter: (key: string, value: string) => void;
  updateApplication: (id: string, updates: Partial<Application>) => void;
}

const mockApplications: Application[] = [
  {
    id: 'ON-2025-0450',
    clientName: 'Global Health Trust',
    color:'blue',
    accountType: 'Trust',
    stage: 'Doc Collection',
    status: 'Missing docs',
    exceptions: 1,
    slaHours: 6,
    progress: 3,
    totalSteps: 8,
    documents: [
      { id: '1', name: 'Trust Agreement', type: 'pdf', required: true, validated: false },
      { id: '2', name: 'Tax ID Form', type: 'pdf', required: true, validated: true }
    ],
    emails: [
      { id: '1', from: 'advisor@uspb.com', subject: 'Missing Trust Documentation', date: '2025-01-10', type: 'advisor' }
    ],
    sorData: {
      name: 'Global Health Trust',
      accountType: 'Trust',
      entityName: 'Global Health Trust',
      complianceId: 'GHT-4502'
    },
    extractedFields: [
      { fieldName: 'Client Core Information', value: 'Yan Luo Living Trust', sourceDocument: 'Trust_Agreement.pdf', confidence: 99, validated: false },
      { fieldName: 'Client Addresses', value: '123 Trust Avenue, San Francisco, CA 94102', sourceDocument: 'Trust_Agreement.pdf', confidence: 97, validated: false },
      { fieldName: 'Tax Info', value: 'EIN: 04-5558529, UCN: 0299372527', sourceDocument: 'Tax_ID_Form.pdf', confidence: 98, validated: false },
      { fieldName: 'Products', value: 'Revocable Trust Account', sourceDocument: 'Trust_Agreement.pdf', confidence: 98, validated: false },
      { fieldName: 'Investment Suitability', value: 'Conservative Risk Profile', sourceDocument: 'Suitability_Form.pdf', confidence: 93, validated: false },
      { fieldName: 'Investment Experience', value: '10+ years institutional investing', sourceDocument: 'Suitability_Form.pdf', confidence: 94, validated: false },
      { fieldName: 'Marital Information & Dependents', value: 'Single, No Dependents', sourceDocument: 'Personal_Info_Form.pdf', confidence: 96, validated: false },
      { fieldName: 'Account Level Suitability', value: 'High Net Worth Individual', sourceDocument: 'Suitability_Form.pdf', confidence: 98, validated: false },
      { fieldName: 'Authorized Contact', value: 'Yan Luo (Primary), Sarah Chen (Secondary)', sourceDocument: 'Authorization_Form.pdf', confidence: 98, validated: false }
    ]
  },
  {
    id: 'ON-2025-0455',
    clientName: 'Elisa Kim',
    color:'green',
    accountType: 'Cash Mgmt',
    stage: 'AI Extraction',
    status: 'Escalated',
    exceptions: 1,
    slaHours: 8,
    progress: 4,
    totalSteps: 8,
    documents: [
      { id: '1', name: 'Passport.pdf', type: 'pdf', required: true, validated: true, confidence: 95 },
      { id: '2', name: 'DriverLicense.pdf', type: 'pdf', required: true, validated: true, confidence: 88 },
      { id: '3', name: 'W2.pdf', type: 'pdf', required: true, validated: true, confidence: 92 }
    ],
    emails: [
      { id: '1', from: 'advisor@uspb.com', subject: 'DOB Verification Required', date: '2025-01-10', type: 'advisor' },
      { id: '2', from: 'elisa.kim@email.com', subject: 'Re: DOB Verification', date: '2025-01-10', type: 'client' }
    ],
    sorData: {
      name: 'Elisa Kim',
      dob: '08/16/1984',
      accountType: 'Cash Mgmt',
      address: '400 West St, New York, NY'
    },
    extractedFields: [
      { fieldName: 'Last Name', value: 'Kim', sourceDocument: 'Passport.pdf', confidence: 96, validated: true },
      { fieldName: 'First Name', value: 'Elisa', sourceDocument: 'Passport.pdf', confidence: 94, validated: true },
      { fieldName: 'DOB', value: '08/14/1984', sourceDocument: 'Passport.pdf', confidence: 89, validated: false },
      { fieldName: 'Address', value: '400 West St, New York, NY', sourceDocument: 'DriverLicense.pdf', confidence: 91, validated: true }
    ],
    aiSuggestions: [
      {
        id: '1',
        type: 'warning',
        message: 'DOB mismatch detected: Extracted 08/14/1984 vs SOR 08/16/1984. Manual verification required.',
        confidence: 89
      }
    ]
  },
  {
    id: 'ON-2025-0456',
    clientName: 'Devlin Patel',
    color:'yellow',
    accountType: 'Investment',
    stage: 'Document Validation',
    status: 'Missing passport',
    exceptions: 1,
    slaHours: 5,
    progress: 2,
    totalSteps: 8,
    documents: [
      { id: '1', name: 'DriverLicense.pdf', type: 'pdf', required: true, validated: true, confidence: 94 },
      { id: '2', name: 'W2.pdf', type: 'pdf', required: true, validated: true, confidence: 88 },
      { id: '3', name: 'Passport.pdf', type: 'pdf', required: true, validated: false, confidence: 0 }
    ],
    emails: [
      { id: '1', from: 'advisor@uspb.com', subject: 'KYC Documents Required', date: '2025-01-09', type: 'advisor' },
      { id: '2', from: 'devlin.patel@email.com', subject: 'Document Upload Question', date: '2025-01-09', type: 'client' }
    ],
    sorData: {
      name: 'Devlin Patel',
      dob: '04/11/1976',
      accountType: 'Investment'
    },
    aiSuggestions: [
      {
        id: '1',
        type: 'action',
        message: 'Client passport is missing — recommend reaching out to request document.',
        action: 'draft_email',
        confidence: 95
      }
    ]
  },
  {
    id: 'ON-2025-0458',
    clientName: 'Rachel Nunez',
    color:'green',
    accountType: 'Investment',
    stage: 'AI Extraction',
    status: 'Low confidence',
    exceptions: 1,
    slaHours: 10,
    progress: 4,
    totalSteps: 8,
    documents: [
      { id: '1', name: 'Passport.pdf', type: 'pdf', required: true, validated: true, confidence: 85 },
      { id: '2', name: 'DriverLicense.pdf', type: 'pdf', required: true, validated: true, confidence: 78 },
      { id: '3', name: '1099.pdf', type: 'pdf', required: true, validated: true, confidence: 65 }
    ],
    emails: [
      { id: '1', from: 'advisor@uspb.com', subject: 'Income Verification', date: '2025-01-10', type: 'advisor' },
      { id: '2', from: 'rachel.nunez@email.com', subject: 'Updated Tax Documents', date: '2025-01-10', type: 'client' }
    ],
    sorData: {
      name: 'Rachel Nunez',
      income: '$182,000',
      accountType: 'Investment',
      riskTolerance: 'Moderate'
    },
    extractedFields: [
      { fieldName: 'Income', value: '$165,000', sourceDocument: '1099.pdf', confidence: 65, validated: false }
    ],
    aiSuggestions: [
      {
        id: '1',
        type: 'warning',
        message: 'Low confidence income extraction (65%). Manual review recommended.',
        confidence: 65
      }
    ]
  },
  {
    id: 'ON-2025-0459',
    clientName: 'Tyrell Systems',
    color:'red',
    accountType: 'Cash Mgmt',
    stage: 'Final Approval',
    status: 'Pending Approval',
    exceptions: 0,
    slaHours: 2,
    progress: 7,
    totalSteps: 8,
    documents: [
      { id: '1', name: 'Passport.pdf', type: 'pdf', required: true, validated: true, confidence: 96 },
      { id: '2', name: 'W2.pdf', type: 'pdf', required: true, validated: true, confidence: 94 },
      { id: '3', name: 'TrustAgreement.pdf', type: 'pdf', required: true, validated: true, confidence: 98 }
    ],
    emails: [
      { id: '1', from: 'advisor@uspb.com', subject: 'Final Review Complete', date: '2025-01-10', type: 'advisor' }
    ],
    sorData: {
      name: 'Tyrell Systems',
      accountType: 'Cash Mgmt',
      entityName: 'Tyrell Systems',
      complianceId: 'TYS-8905'
    }
  }
];

export const useApplicationStore = create<ApplicationStore>((set, get) => ({
  applications: mockApplications,
  selectedApplication: null,
  systemMetrics: {
    applicationsCompleted: 47,
    avgProcessingTime: '2.3h',
    manualInterventions: 12,
    exceptionsAutoResolved: 34
  },
  filters: {
    status: 'All',
    sortBy: 'sla'
  },
  setSelectedApplication: (app) => set({ selectedApplication: app }),
  setFilter: (key, value) => set((state) => ({
    filters: { ...state.filters, [key]: value }
  })),
  updateApplication: (id, updates) => set((state) => ({
    applications: state.applications.map(app =>
      app.id === id ? { ...app, ...updates } : app
    )
  }))
}));
