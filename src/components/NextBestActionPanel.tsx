
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, ArrowRight, Clock, AlertTriangle, FileText, Users, Zap, TrendingUp, Target, Bot, Sparkles, Eye, CheckCircle } from 'lucide-react';
import { useApplicationStore } from '@/store/useApplicationStore';

export const NextBestActionPanel: React.FC = () => {
  const { applications } = useApplicationStore();
  
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

  // Active workflows based on actual application data
  const activeWorkflows = applications.slice(0, 3).map((app, index) => ({
    id: app.id,
    type: `${app.accountType} Account`,
    client: app.clientName,
    stage: app.stage,
    progress: Math.round((app.progress / app.totalSteps) * 100),
    status: `AI ${app.stage.toLowerCase().includes('extraction') ? 'processing documents' : 
             app.stage.toLowerCase().includes('validation') ? 'validating data' :
             app.stage.toLowerCase().includes('collection') ? 'tracking documents' :
             'analyzing application'}`,
    statusColor: app.exceptions > 0 ? "text-amber-600" : "text-green-600"
  }));

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

      {/* Active Workflows */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Client Onboarding Workflows</h3>
        
        <div className="space-y-4">
          {activeWorkflows.map((workflow, index) => (
            <div key={workflow.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-medium text-gray-600">
                    {workflow.id}
                  </span>
                  <span className="font-medium text-gray-900">{workflow.type}</span>
                </div>
                <span className="text-sm text-gray-600">{workflow.client}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">{workflow.stage}</span>
                  <span className="text-sm font-medium text-gray-600">{workflow.progress}%</span>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${workflow.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-green-600" />
                  <span className={`text-sm font-medium ${workflow.statusColor}`}>
                    {workflow.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
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
