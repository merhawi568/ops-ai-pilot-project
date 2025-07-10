import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, FileText, Mail, Database, Eye, AlertTriangle, Clock, CheckCircle, Brain, Lightbulb } from 'lucide-react';
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

  const handleFullReview = () => {
    // Open ticket detail in new tab
    window.open(`/ticket/${application.id}`, '_blank');
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
          action: 'Request Missing Documents',
          description: 'Send automated email to client requesting missing KYC documents',
          icon: Mail
        });
      }
      
      if (application.status.includes('Low confidence')) {
        recommendations.push({
          priority: 'medium',
          action: 'Manual Data Review',
          description: 'Review AI-extracted fields for accuracy before proceeding',
          icon: Eye
        });
      }
    }
    
    if (application.slaHours <= 6) {
      recommendations.push({
        priority: application.slaHours <= 2 ? 'high' : 'medium',
        action: 'Prioritize Processing',
        description: `SLA deadline approaching - escalate to next available agent`,
        icon: Clock
      });
    }
    
    if (application.stage === 'Document Validation' && application.documents.length > 0) {
      const unvalidatedDocs = application.documents.filter(doc => !doc.validated).length;
      if (unvalidatedDocs > 0) {
        recommendations.push({
          priority: 'medium',
          action: 'Complete Document Validation',
          description: `${unvalidatedDocs} documents pending validation`,
          icon: FileText
        });
      }
    }
    
    if (!recommendations.length) {
      recommendations.push({
        priority: 'low',
        action: 'Continue Standard Processing',
        description: 'No immediate actions required - proceed with normal workflow',
        icon: CheckCircle
      });
    }
    
    return recommendations;
  };

  const renderSummaryView = () => {
    const issues = getIssueDetails();
    const aiRecommendations = getAIRecommendations();
    
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

        {/* AI Recommendations */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-600" />
            AI Recommendations
          </h4>
          <div className="space-y-3">
            {aiRecommendations.map((rec, idx) => {
              const Icon = rec.icon;
              const priorityColors = {
                high: 'text-red-700 bg-red-100 border-red-300',
                medium: 'text-yellow-700 bg-yellow-100 border-yellow-300',
                low: 'text-green-700 bg-green-100 border-green-300'
              };
              
              return (
                <div key={idx} className={`p-3 rounded border ${priorityColors[rec.priority as keyof typeof priorityColors]}`}>
                  <div className="flex items-start gap-2">
                    <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm flex items-center gap-2">
                        {rec.action}
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                          rec.priority === 'high' ? 'bg-red-200 text-red-800' :
                          rec.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                          'bg-green-200 text-green-800'
                        }`}>
                          {rec.priority.toUpperCase()}
                        </span>
                      </p>
                      <p className="text-xs mt-1 opacity-90">{rec.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
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
