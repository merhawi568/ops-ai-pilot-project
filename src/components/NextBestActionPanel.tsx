
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, ArrowRight, Clock, AlertTriangle, FileText, Users, Zap, TrendingUp, Target, Bot, Sparkles } from 'lucide-react';
import { useApplicationStore } from '@/store/useApplicationStore';

export const NextBestActionPanel: React.FC = () => {
  const { applications } = useApplicationStore();
  
  const docSignApps = applications.filter(app => 
    app.stage.toLowerCase().includes('signature') || 
    app.status.toLowerCase().includes('signature')
  );
  
  const missingDocsApps = applications.filter(app => 
    app.status.toLowerCase().includes('missing') ||
    app.exceptions > 0
  );

  const urgentApps = applications.filter(app => app.slaHours <= 2);
  const lowConfidenceApps = applications.filter(app => 
    app.documents?.some(doc => doc.confidence && doc.confidence < 85)
  );

  const handleRecommendationClick = (apps: typeof applications) => {
    if (apps.length > 0) {
      // Open the first ticket in the category
      window.open(`/ticket/${apps[0].id}`, '_blank');
    }
  };

  const aiRecommendations = [
    {
      icon: Target,
      title: "Optimize Mortgage Pipeline",
      description: `${urgentApps.length + docSignApps.length} applications have been pre-validated and can be fast-tracked. Expected time savings: ${Math.floor((urgentApps.length + docSignApps.length) * 1.5)} hours.`,
      primaryAction: "Apply Optimization",
      secondaryAction: "View Details",
      priority: "high",
      color: "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200",
      iconColor: "text-blue-600",
      apps: [...urgentApps, ...docSignApps],
      savings: `${Math.floor((urgentApps.length + docSignApps.length) * 1.5)} hours`,
      aiConfidence: 92
    },
    {
      icon: AlertTriangle,
      title: "Document Expiration Alert",
      description: `${missingDocsApps.length} loan applications have documents expiring within 48 hours. Auto-renewal requests can be sent.`,
      primaryAction: "Send Renewals",
      secondaryAction: "Review List",
      priority: "medium",
      color: "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200",
      iconColor: "text-amber-600",
      apps: missingDocsApps,
      urgency: "48 hours",
      aiConfidence: 87
    }
  ];

  const activeWorkflows = [
    {
      id: "WF-001",
      type: "Mortgage Application",
      client: "Sarah Johnson",
      stage: "Underwriting",
      progress: 75,
      status: "AI reviewing income docs",
      statusColor: "text-green-600"
    },
    {
      id: "WF-002", 
      type: "Account Opening",
      client: "Tech Corp Inc",
      stage: "Compliance Check",
      progress: 60,
      status: "KYC verification in progress",
      statusColor: "text-green-600"
    },
    {
      id: "WF-003",
      type: "Wire Transfer",
      client: "John Doe", 
      stage: "Approval",
      progress: 90,
      status: "Ready for auto-approval",
      statusColor: "text-green-600"
    }
  ];

  if (aiRecommendations.length === 0) {
    return (
      <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">All Optimized!</h3>
            <p className="text-sm text-gray-700">
              AI has processed all workflows. Your pipeline is running at peak efficiency.
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
              Intelligent insights powered by machine learning to optimize your workflow
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
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                    {rec.description}
                  </p>
                  
                  <div className="flex items-center gap-3">
                    <Button 
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => handleRecommendationClick(rec.apps)}
                    >
                      {rec.primaryAction}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleRecommendationClick(rec.apps)}
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Workflows</h3>
        
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
