
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Bot, CheckCircle, Zap, FileText, Clock, AlertTriangle, TrendingUp, Activity, Eye, Mail } from 'lucide-react';
import { useApplicationStore } from '@/store/useApplicationStore';

export const AIAgentRecommendations: React.FC = () => {
  const { applications } = useApplicationStore();

  // Generate AI achievements and recommendations
  const getAIAchievements = () => {
    const achievements = [];
    
    // Document processing achievement
    const totalDocs = applications.reduce((sum, app) => sum + app.documents.length, 0);
    const validatedDocs = applications.reduce((sum, app) => 
      sum + app.documents.filter(doc => doc.validated).length, 0);
    
    achievements.push({
      icon: FileText,
      title: 'Document Processing Optimized',
      description: `${validatedDocs} of ${totalDocs} documents auto-validated with 94% accuracy. Saved 12 hours of manual review time.`,
      primaryAction: 'View Processing',
      secondaryAction: 'Analytics',
      color: 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200',
      iconColor: 'text-blue-600',
      stats: `${Math.round((validatedDocs/totalDocs) * 100)}% automated`
    });

    // SLA management achievement
    const urgentApps = applications.filter(app => app.slaHours <= 6).length;
    const totalApps = applications.length;
    
    achievements.push({
      icon: Clock,
      title: 'SLA Compliance Enhanced',
      description: `${urgentApps} urgent applications identified and prioritized. Average processing time reduced by 35%.`,
      primaryAction: 'View Queue',
      secondaryAction: 'Optimize',
      color: 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200',
      iconColor: 'text-green-600',
      stats: `${Math.round(((totalApps - urgentApps)/totalApps) * 100)}% on track`
    });

    // Exception handling achievement
    const exceptionsCount = applications.reduce((sum, app) => sum + app.exceptions, 0);
    
    if (exceptionsCount > 0) {
      achievements.push({
        icon: AlertTriangle,
        title: 'Exception Auto-Resolution',
        description: `${exceptionsCount} exceptions detected and categorized. Pre-generated solutions available for 78% of cases.`,
        primaryAction: 'Review Cases',
        secondaryAction: 'Auto-Resolve',
        color: 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200',
        iconColor: 'text-amber-600',
        stats: '78% auto-resolvable'
      });
    }

    return achievements;
  };

  const aiAchievements = getAIAchievements();

  const handleActionClick = (action: string) => {
    console.log('AI Achievement action:', action);
    // Navigate based on action type
    if (action.includes('Processing') || action.includes('Analytics')) {
      window.open('/analytics/documents', '_blank');
    } else if (action.includes('Queue') || action.includes('Optimize')) {
      window.open('/queue/priority', '_blank');
    } else if (action.includes('Cases') || action.includes('Auto-Resolve')) {
      window.open('/exceptions/management', '_blank');
    }
  };

  return (
    <Card className="p-6">
      {/* AI Agent Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Sparkles className="w-6 h-6 text-purple-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900 mb-1">AI Agent Recommendations</h2>
          <p className="text-sm text-gray-600">
            Intelligent automation and optimization insights
          </p>
        </div>
        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
          <Bot className="w-3 h-3 mr-1" />
          AI Powered
        </Badge>
      </div>

      {/* AI Achievements */}
      <div className="grid gap-4">
        {aiAchievements.map((achievement, index) => (
          <div key={index} className={`p-5 rounded-xl border ${achievement.color} transition-all hover:shadow-lg`}>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <achievement.icon className={`w-6 h-6 ${achievement.iconColor}`} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                  <Badge variant="outline" className="text-xs bg-white">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {achievement.stats}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                  {achievement.description}
                </p>
                
                <div className="flex items-center gap-3">
                  <Button 
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => handleActionClick(achievement.primaryAction)}
                  >
                    {achievement.primaryAction}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleActionClick(achievement.secondaryAction)}
                  >
                    {achievement.secondaryAction}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Activity Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-4 h-4 text-gray-600" />
          <span className="font-medium text-gray-900">Recent AI Activity</span>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{applications.length}</div>
            <div className="text-xs text-gray-600">Applications Processed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {applications.reduce((sum, app) => sum + app.documents.filter(doc => doc.validated).length, 0)}
            </div>
            <div className="text-xs text-gray-600">Documents Validated</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {applications.reduce((sum, app) => sum + app.exceptions, 0)}
            </div>
            <div className="text-xs text-gray-600">Exceptions Flagged</div>
          </div>
        </div>
      </div>
    </Card>
  );
};
