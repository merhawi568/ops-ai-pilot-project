
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, ArrowRight, Clock, AlertTriangle, FileText, Users, Zap, TrendingUp } from 'lucide-react';
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

  const recommendations = [
    {
      icon: AlertTriangle,
      title: "Priority: SLA Risk",
      count: urgentApps.length,
      message: `${urgentApps.length} tickets near SLA breach`,
      action: "Review Now",
      priority: "high",
      color: "bg-red-50 border-red-200",
      iconColor: "text-red-600",
      apps: urgentApps
    },
    {
      icon: FileText,
      title: "Document Signatures",
      count: docSignApps.length,
      message: `${docSignApps.length} tickets awaiting DocuSign`,
      action: "Process",
      priority: "medium",
      color: "bg-orange-50 border-orange-200",
      iconColor: "text-orange-600",
      apps: docSignApps
    },
    {
      icon: Users,
      title: "Missing Documents",
      count: missingDocsApps.length,
      message: `${missingDocsApps.length} clients need KYC docs`,
      action: "Follow Up",
      priority: "medium",
      color: "bg-yellow-50 border-yellow-200",
      iconColor: "text-yellow-600",
      apps: missingDocsApps
    },
    {
      icon: Zap,
      title: "AI Confidence",
      count: lowConfidenceApps.length,
      message: `${lowConfidenceApps.length} extractions need review`,
      action: "Validate",
      priority: "low",
      color: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-600",
      apps: lowConfidenceApps
    }
  ];

  const activeRecommendations = recommendations.filter(rec => rec.count > 0);

  if (activeRecommendations.length === 0) {
    return (
      <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">All Caught Up!</h3>
            <p className="text-sm text-gray-700">
              No immediate actions required. Your workflow is running smoothly.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Brain className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">AI-Powered Recommendations</h3>
          <p className="text-sm text-gray-600">
            Prioritized actions based on SLA, workload, and AI insights
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {activeRecommendations.map((rec, index) => (
          <div key={index} className={`p-4 rounded-lg border ${rec.color} hover:shadow-md transition-shadow`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <rec.icon className={`w-4 h-4 ${rec.iconColor}`} />
                <Badge 
                  variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {rec.count}
                </Badge>
              </div>
              <Badge variant="outline" className="text-xs">
                {rec.priority === 'high' ? 'Urgent' : rec.priority === 'medium' ? 'Medium' : 'Low'}
              </Badge>
            </div>
            
            <h4 className="font-medium text-gray-900 text-sm mb-1">{rec.title}</h4>
            <p className="text-xs text-gray-600 mb-3">{rec.message}</p>
            
            <Button 
              size="sm" 
              variant={rec.priority === 'high' ? 'default' : 'outline'}
              className="w-full text-xs h-7"
              onClick={() => handleRecommendationClick(rec.apps)}
            >
              {rec.action}
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        ))}
      </div>

      {/* AI Insights Footer */}
      <div className="mt-4 pt-4 border-t border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Updated 2 minutes ago</span>
          </div>
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
            View All Insights
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
