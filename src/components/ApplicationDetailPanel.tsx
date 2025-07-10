
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, FileText, Mail, Database, ExternalLink } from 'lucide-react';
import { useApplicationStore } from '@/store/useApplicationStore';
import { Application } from '@/types';

interface ApplicationDetailPanelProps {
  application: Application;
}

export const ApplicationDetailPanel: React.FC<ApplicationDetailPanelProps> = ({ application }) => {
  const { setSelectedApplication } = useApplicationStore();

  return (
    <div className="fixed left-0 top-0 h-full w-96 bg-white shadow-xl border-r z-40 overflow-y-auto">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="text-lg font-semibold">{application.clientName}</h3>
        <Button variant="ghost" size="sm" onClick={() => setSelectedApplication(null)}>
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="p-4 space-y-6">
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

        {/* Action Button */}
        <Button className="w-full" onClick={() => {/* Navigate to detail view */}}>
          <ExternalLink className="w-4 h-4 mr-2" />
          Open Full Detail View
        </Button>
      </div>
    </div>
  );
};
