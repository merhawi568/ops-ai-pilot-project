
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, ArrowRight, Clock, AlertTriangle, FileText, Users, Zap, TrendingUp, Target, Bot, Sparkles, Eye, CheckCircle, User, Calendar, Activity } from 'lucide-react';
import { useApplicationStore } from '@/store/useApplicationStore';
import { StatusBadge } from '@/components/StatusBadge';
import { ProgressRing } from '@/components/ui/progress-ring';

export const NextBestActionPanel: React.FC = () => {
  const { applications, setSelectedApplication } = useApplicationStore();
  
  // Filter applications based on actual data patterns
  const lowConfidenceApps = applications.filter(app => 
    app.documents?.some(doc => doc.confidence && doc.confidence < 85) ||
    app.status.toLowerCase().includes('low confidence')
  );
  
  const missingDocsApps = applications.filter(app => 
    app.status.toLowerCase().includes('missing') ||
    app.status.toLowerCase().includes('passport') ||
    app.exceptions > 0
  );

  const urgentApps = applications.filter(app => app.slaHours <= 6);
  
  const escalatedApps = applications.filter(app => 
    app.status.toLowerCase().includes('escalated')
  );

  const readyForApprovalApps = applications.filter(app => 
    app.status.toLowerCase().includes('approval') ||
    app.progress >= 7
  );

  const handleRecommendationClick = (apps: typeof applications, action?: string) => {
    if (apps.length > 0) {
      // Navigate to the first application in the category
      window.open(`/ticket/${apps[0].id}`, '_blank');
    }
  };

  const handleTicketClick = (app: any) => {
    window.open(`/ticket/${app.id}`, '_blank');
  };

  const handleRowClick = (app: any) => {
    setSelectedApplication(app);
  };

  // Generate AI recommendations based on actual application data
  const generateAIRecommendations = () => {
    const recommendations = [];

    // Low confidence document extraction recommendation
    if (lowConfidenceApps.length > 0) {
      recommendations.push({
        icon: Eye,
        title: "Document Review Required",
        description: `${lowConfidenceApps.length} applications have low-confidence field extractions (${lowConfidenceApps.map(app => app.clientName).join(', ')}). AI suggests manual review to maintain quality standards.`,
        primaryAction: "Review Documents",
        secondaryAction: "View All",
        priority: "high",
        color: "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200",
        iconColor: "text-amber-600",
        apps: lowConfidenceApps,
        aiConfidence: 94,
        category: "Quality Assurance"
      });
    }

    // Missing documents recommendation
    if (missingDocsApps.length > 0) {
      recommendations.push({
        icon: FileText,
        title: "Document Collection Priority",
        description: `${missingDocsApps.length} clients need document follow-up (${missingDocsApps.map(app => app.clientName).join(', ')}). Auto-generated email templates available for immediate outreach.`,
        primaryAction: "Send Requests",
        secondaryAction: "Draft Emails",
        priority: "high",
        color: "bg-gradient-to-r from-red-50 to-pink-50 border-red-200",
        iconColor: "text-red-600",
        apps: missingDocsApps,
        aiConfidence: 89,
        category: "Document Management"
      });
    }

    // Urgent SLA recommendation
    if (urgentApps.length > 0) {
      recommendations.push({
        icon: Clock,
        title: "SLA Alert - Immediate Action",
        description: `${urgentApps.length} applications approaching SLA deadlines within 6 hours. Priority processing recommended to maintain service levels.`,
        primaryAction: "Process Now",
        secondaryAction: "View Queue",
        priority: "critical",
        color: "bg-gradient-to-r from-red-50 to-rose-50 border-red-300",
        iconColor: "text-red-700",
        apps: urgentApps,
        aiConfidence: 98,
        category: "SLA Management"
      });
    }

    // Escalation resolution recommendation
    if (escalatedApps.length > 0) {
      recommendations.push({
        icon: AlertTriangle,
        title: "Escalation Resolution",
        description: `${escalatedApps.length} applications require senior review. AI has pre-analyzed common resolution patterns to expedite processing.`,
        primaryAction: "Review Cases",
        secondaryAction: "View Suggestions",
        priority: "medium",
        color: "bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200",
        iconColor: "text-purple-600",
        apps: escalatedApps,
        aiConfidence: 87,
        category: "Exception Handling"
      });
    }

    // Ready for approval recommendation
    if (readyForApprovalApps.length > 0) {
      recommendations.push({
        icon: CheckCircle,
        title: "Ready for Final Approval",
        description: `${readyForApprovalApps.length} applications completed validation and ready for approval. Streamlined review process available.`,
        primaryAction: "Approve Batch",
        secondaryAction: "Individual Review",
        priority: "low",
        color: "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200",
        iconColor: "text-green-600",
        apps: readyForApprovalApps,
        aiConfidence: 96,
        category: "Final Processing"
      });
    }

    return recommendations;
  };

  const aiRecommendations = generateAIRecommendations();

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

  if (aiRecommendations.length === 0) {
    return (
      <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">All Systems Optimized!</h3>
            <p className="text-sm text-gray-700">
              AI has processed all workflows. Your onboarding pipeline is running at peak efficiency.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Agent Recommendations Header */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Sparkles className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-1">AI Agent Recommendations</h2>
            <p className="text-sm text-gray-600">
              Intelligent insights powered by client onboarding patterns and document analysis
            </p>
          </div>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            <Bot className="w-3 h-3 mr-1" />
            AI Powered
          </Badge>
        </div>

        {/* AI Recommendations */}
        <div className="grid gap-4">
          {aiRecommendations.map((rec, index) => (
            <div key={index} className={`p-5 rounded-xl border ${rec.color} transition-all hover:shadow-lg`}>
              <div className="flex items-start gap-4">
                <div className={`p-3 bg-white rounded-lg shadow-sm`}>
                  <rec.icon className={`w-6 h-6 ${rec.iconColor}`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                    <Badge variant="outline" className="text-xs">
                      {rec.aiConfidence}% confidence
                    </Badge>
                    <Badge variant="secondary" className="text-xs bg-gray-100">
                      {rec.category}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                    {rec.description}
                  </p>
                  
                  <div className="flex items-center gap-3">
                    <Button 
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => handleRecommendationClick(rec.apps, rec.primaryAction)}
                    >
                      {rec.primaryAction}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleRecommendationClick(rec.apps, rec.secondaryAction)}
                    >
                      {rec.secondaryAction}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Enhanced Active Client Onboarding Workflows */}
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
      </Card>

      {/* AI Insights Footer */}
      <div className="flex items-center justify-between text-sm text-gray-600 px-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>AI insights updated 30 seconds ago</span>
        </div>
        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
          View AI Analytics Dashboard
          <ArrowRight className="w-3 h-3 ml-1" />
        </Button>
      </div>
    </div>
  );
};
