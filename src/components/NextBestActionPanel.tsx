
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Clock, User, Calendar, Activity, Bot, CheckCircle, ChevronDown, ChevronUp, Settings,Sparkles } from 'lucide-react';
import { useApplicationStore } from '@/store/useApplicationStore';
import { StatusBadge } from '@/components/StatusBadge';
import { ProgressRing } from '@/components/ui/progress-ring';
import { OpsMap } from '@/components/OpsMap';
import { SystemInsightsModal } from '@/components/SystemInsightsModal';

export const NextBestActionPanel: React.FC = () => {
  const { applications, setSelectedApplication } = useApplicationStore();
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const [showSystemInsights, setShowSystemInsights] = useState(false);
  const [showOpsMap, setShowOpsMap] = useState(false);
  const [showFlagged, setShowFlagged] = useState(true);

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

  const SELECTED_PILL_CLASS = 'px-4 border border-gray-300 rounded-full text-sm text-white bg-blue-500 p-4 w-[150px] text-center cursor-pointer  font-semibold'

  const [selectedPill, setSelectedPill] = useState('Flagged')

  const PILLS = [
    {
        label:'Flagged',
        className:'px-4 border border-gray-300 rounded-full text-sm text-gray-700 bg-red-100 p-4  w-[150px] text-center cursor-pointer font-semibold'
    },
    {
        label:'Ops Map',
        className:'px-4 border border-gray-300 rounded-full text-sm text-gray-700 bg-orange-50 p-4  w-[150px] text-center cursor-pointer font-semibold'
    },
    {
        label:'Doc Collection',
        className:'px-4 border border-gray-300 rounded-full text-sm text-gray-700 bg-blue-50 p-4  w-[150px] text-center cursor-pointer font-semibold'
    },
    {
        label:'AI Extraction',
        className:'px-4 border border-gray-300 rounded-full text-sm text-gray-700 bg-green-50 p-4  w-[150px] text-center cursor-pointer font-semibold'
    },
    {
        label:'Doc Validation',
        className:'px-4 border border-gray-300 rounded-full text-sm text-gray-700 bg-yellow-50 p-4  w-[150px] text-center cursor-pointer font-semibold'
    },
    {
        label:'Final Approval',
        className:'px-4 border border-gray-300 rounded-full text-sm text-gray-700 bg-green-200 p-4  w-[150px] text-center cursor-pointer font-semibold'
    }

  ]

  const handlePillChange = (pill) => {
    setSelectedPill(pill.label)
    if (pill.label == 'Flagged') {
        setShowFlagged(true)
        setShowOpsMap(false)
    } else if (pill.label == 'Ops Map') {
        setShowFlagged(false)
        setShowOpsMap(true)
    }
  }

  return (
    <div className="space-y-4">
      {/* AI Recommendations - Collapsible */}
      <Card className="p-1">
      <div className="flex item-center justify-center">
          {PILLS.map((pill,index) => (
              <span key={index} className={selectedPill == pill.label?SELECTED_PILL_CLASS:pill.className} onClick={(e)=> {handlePillChange(pill)}}>
                {pill.label}
              </span>
          ))}
          <span className='px-4 border justify-center item-center border-gray-300 rounded-full text-sm text-gray-700 bg-sky-50 p-4  w-[150px] text-center cursor-pointer font-semibold' onClick={() => setShowSystemInsights(true)}>
            <table width="100%">
                <tr>
                    <td align='right'><Settings className="w-4 h-4" />
                    </td>
                    <td align='left'>Insights
                    </td>
                </tr>
            </table>

          </span>

       </div>
        {showAIRecommendations && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600 mb-4">
              AI-powered insights and recommendations for your active applications
            </p>
            <Button variant="outline" size="sm" className="text-purple-600 border-purple-200 hover:bg-purple-50">
              View AI Analytics Dashboard
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        )}
      </Card>

      <Card className="p-6">
      {showOpsMap?(<OpsMap/>):null}

      {/* Active Client Onboarding Pipeline - Always Visible */}
      {showFlagged?
      (
      <div>
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
        {applications.map((app) => (
        <div className={`p-4 rounded-xl border green transition-all hover:shadow-lg bg-${app.color}-50 `} onClick={() => handleRowClick(app)} style={{cursor: 'pointer'}}>
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-gray-900">{app.clientName}</div>
              </div>
              <table width="100%" cellspacing='10'>
                <tr>
                    <td align="left" style={{ width: `600px` }}>
                        <span
                          className="font-mono text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-medium"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTicketClick(app);
                          }}
                        >
                          Case Reference : {app.id}
                        </span>
                    </td>
                    <td align="left">
                      <div className="text-sm font-medium text-gray-900">
                        Account Type : {app.accountType}
                      </div>
                    </td>
                </tr>
                <tr>
                    <td style={{paddingTop:'10px'}}>
                      <div className="text-sm font-medium text-gray-900">
                        Workflow Stage : {app.stage}
                      </div>
                    </td>
                    <td>

                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium text-gray-900">
                            Progress :
                        </div>
                        <ProgressRing
                          progress={app.progress}
                          total={app.totalSteps}
                          size="sm"
                        />
                        <span className="text-xs text-gray-500">
                          {Math.round((app.progress / app.totalSteps) * 100)}%
                        </span>
                      </div>
                    </td>
                </tr>
                <tr>
                    <td style={{paddingTop:'10px'}}>
                    <div className="text-sm font-medium text-gray-900 w-[300px]">
                    <table>
                        <tr>
                            <td>Next Best Action : {getNextAction(app)}</td>
                            <td><Sparkles className="w-5 h-5 text-purple-600" /></td>
                        </tr>
                    </table>

                      </div>
                    </td>
                    <td>
                    <div className="text-sm font-medium text-gray-900">
                        SLA hours : {app.slaHours}h left
                        </div>
                    </td>
                </tr>

                <tr>
                    <td style={{paddingTop:'10px'}}>
                      {isHighPriority(app) ? (
                          <div className="text-sm font-medium text-gray-900">High Priority : Yes</div>
                      ) : (
                        <div className="text-sm font-medium text-gray-900">High Priority : No</div>
                      )}
                    </td>
                    <td>
                    </td>
               </tr>
              </table>
            </div>
          </div>
        </div>))}

        {/* AI Insights Footer */}
        <div className="flex items-center justify-between text-sm text-gray-600 px-2 mt-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>AI insights updated 30 seconds ago</span>
          </div>
        </div>
      </div>
      )
      :null}
      </Card>
      <SystemInsightsModal
        isOpen={showSystemInsights}
        onClose={() => setShowSystemInsights(false)}
      />
    </div>
  );
};
