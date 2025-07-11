
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Clock, User, Calendar, Activity, Bot, CheckCircle } from 'lucide-react';
import { useApplicationStore } from '@/store/useApplicationStore';
import { StatusBadge } from '@/components/StatusBadge';
import { ProgressRing } from '@/components/ui/progress-ring';

export const NextBestActionPanel: React.FC = () => {
  const { applications, setSelectedApplication } = useApplicationStore();

  const handleTicketClick = (app: any) => {
    window.open(`/ticket/${app.id}`, '_blank');
  };

  const handleRowClick = (app: any) => {
    setSelectedApplication(app);
  };

  const getSLAColor = (hours: number) => {
    if (hours <= 2) return 'text-red-600';
    if (hours <= 6) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getAIInsight = (app: any) => {
    if (app.exceptions > 0) {
      if (app.status.includes('Missing')) return 'Waiting for client response';
      if (app.status.includes('Low confidence')) return 'Requires manual validation';
      if (app.status.includes('Escalated')) return 'Under senior review';
      return 'Exception handling in progress';
    }
    
    if (app.slaHours <= 2) return 'Urgent - SLA deadline approaching';
    if (app.stage.includes('Extraction')) return 'AI processing documents';
    if (app.stage.includes('Validation')) return 'Validating extracted data';
    if (app.stage.includes('Collection')) return 'Tracking document submissions';
    if (app.stage.includes('Approval')) return 'Ready for final approval';
    
    return 'Processing normally';
  };

  const getNextAction = (app: any) => {
    if (app.exceptions > 0) {
      if (app.status.includes('Missing')) return 'Follow up with client';
      if (app.status.includes('Low confidence')) return 'Review AI extractions';
      if (app.status.includes('Escalated')) return 'Senior review required';
      return 'Resolve exception';
    }
    
    if (app.slaHours <= 2) return 'Prioritize processing';
    if (app.stage.includes('Approval')) return 'Schedule approval';
    
    return 'Continue workflow';
  };

  // More selective high priority logic - only truly urgent cases
  const isHighPriority = (app: any) => {
    return (app.slaHours <= 2) || 
           (app.accountType === 'Trust' && app.exceptions > 0) || 
           (app.status.includes('Escalated'));
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Active Client Onboarding Pipeline</h3>
          <p className="text-sm text-gray-600">AI-monitored workflows with real-time insights and recommendations</p>
        </div>
        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
          <Activity className="w-3 h-3 mr-1" />
          {applications.length} Active
        </Badge>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left">
              <th className="pb-3 text-sm font-medium text-gray-600">Ticket ID</th>
              <th className="pb-3 text-sm font-medium text-gray-600">Client & Account</th>
              <th className="pb-3 text-sm font-medium text-gray-600">Current Stage</th>
              <th className="pb-3 text-sm font-medium text-gray-600">Status & Progress</th>
              <th className="pb-3 text-sm font-medium text-gray-600">High Priority</th>
              <th className="pb-3 text-sm font-medium text-gray-600">AI Insights</th>
              <th className="pb-3 text-sm font-medium text-gray-600">Next Action</th>
              <th className="pb-3 text-sm font-medium text-gray-600">SLA Status</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr 
                key={app.id} 
                className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleRowClick(app)}
              >
                <td className="py-4">
                  <span 
                    className="font-mono text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTicketClick(app);
                    }}
                  >
                    {app.id}
                  </span>
                </td>
                <td className="py-4">
                  <div>
                    <div className="font-medium text-gray-900">{app.clientName}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <User className="w-3 h-3" />
                      {app.accountType}
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{app.stage}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" />
                      Step {app.progress} of {app.totalSteps}
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <div className="space-y-2">
                    <StatusBadge status={app.status} exceptions={app.exceptions} />
                    <div className="flex items-center gap-2">
                      <ProgressRing 
                        progress={app.progress} 
                        total={app.totalSteps} 
                        size="sm" 
                      />
                      <span className="text-xs text-gray-500">
                        {Math.round((app.progress / app.totalSteps) * 100)}%
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center">
                    {isHighPriority(app) ? (
                      <Badge variant="destructive" className="text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Yes
                      </Badge>
                    ) : (
                      <span className="text-xs text-gray-400">No</span>
                    )}
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <Bot className={`w-4 h-4 ${app.exceptions > 0 ? 'text-amber-600' : 'text-green-600'}`} />
                    <span className={`text-xs font-medium ${app.exceptions > 0 ? 'text-amber-700' : 'text-green-700'}`}>
                      {getAIInsight(app)}
                    </span>
                  </div>
                </td>
                <td className="py-4">
                  <div className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                    {getNextAction(app)}
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className={`text-sm font-medium ${getSLAColor(app.slaHours)}`}>
                      {app.slaHours}h left
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* AI Insights Footer */}
      <div className="flex items-center justify-between text-sm text-gray-600 px-2 mt-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>AI insights updated 30 seconds ago</span>
        </div>
        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
          View AI Analytics Dashboard
          <ArrowRight className="w-3 h-3 ml-1" />
        </Button>
      </div>
    </Card>
  );
};
