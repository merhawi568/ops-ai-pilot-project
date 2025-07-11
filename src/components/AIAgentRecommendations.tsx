
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, CheckCircle, Zap, FileText, Clock, AlertTriangle, TrendingUp, Activity, Mail, Users, MessageSquare } from 'lucide-react';
import { useApplicationStore } from '@/store/useApplicationStore';

export const AIAgentRecommendations: React.FC = () => {
  const { applications } = useApplicationStore();

  // Generate AI achievements and recommendations based on actual ticket data
  const getAIAchievements = () => {
    const achievements = [];
    
    // Ready for approval tickets
    const readyForApproval = applications.filter(app => 
      app.stage.includes('Approval') || app.status.includes('Pending Approval')
    );
    
    if (readyForApproval.length > 0) {
      achievements.push({
        icon: CheckCircle,
        title: 'Tickets Ready for Final Approval',
        description: `${readyForApproval.length} client onboarding applications have been fully processed and validated. All required documents verified and compliance checks completed.`,
        primaryAction: 'Review & Approve',
        secondaryAction: 'View Details',
        color: 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200',
        iconColor: 'text-green-600',
        stats: `${readyForApproval.length} ready`,
        tickets: readyForApproval,
        stage: 'approval'
      });
    }

    // Missing documents with draft emails
    const missingDocs = applications.filter(app => 
      app.status.includes('Missing') || app.status.includes('missing')
    );
    
    if (missingDocs.length > 0) {
      achievements.push({
        icon: Mail,
        title: 'Missing Document Follow-ups',
        description: `${missingDocs.length} clients have missing required documents. AI has drafted personalized follow-up emails requesting specific missing items and is ready to send.`,
        primaryAction: 'Send Emails',
        secondaryAction: 'Review Drafts',
        color: 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200',
        iconColor: 'text-blue-600',
        stats: `${missingDocs.length} drafts ready`,
        tickets: missingDocs,
        stage: 'communications'
      });
    }

    // Exception handling
    const exceptionsCount = applications.reduce((sum, app) => sum + app.exceptions, 0);
    const escalatedTickets = applications.filter(app => app.status.includes('Escalated') || app.exceptions > 0);
    
    if (exceptionsCount > 0) {
      achievements.push({
        icon: AlertTriangle,
        title: 'Exception Resolution in Progress',
        description: `${exceptionsCount} data validation exceptions detected across ${escalatedTickets.length} tickets. AI has categorized issues and provided resolution recommendations for manual review.`,
        primaryAction: 'Review Exceptions',
        secondaryAction: 'Auto-Resolve',
        color: 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200',
        iconColor: 'text-amber-600',
        stats: `${exceptionsCount} flagged`,
        tickets: escalatedTickets,
        stage: 'exceptions'
      });
    }

    // Document processing achievement
    const totalDocs = applications.reduce((sum, app) => sum + app.documents.length, 0);
    const validatedDocs = applications.reduce((sum, app) => 
      sum + app.documents.filter(doc => doc.validated).length, 0);
    
    const docsToValidate = applications.filter(app => 
      app.documents.some(doc => !doc.validated)
    );
    
    achievements.push({
      icon: FileText,
      title: 'AI Document Processing Complete',
      description: `${validatedDocs} documents successfully extracted and validated across all active tickets. Average confidence score of 91% with automated field mapping completed.`,
      primaryAction: 'View Extractions',
      secondaryAction: 'Export Data',
      color: 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200',
      iconColor: 'text-purple-600',
      stats: `${Math.round((validatedDocs/totalDocs) * 100)}% processed`,
      tickets: docsToValidate,
      stage: 'documents'
    });

    return achievements;
  };

  const aiAchievements = getAIAchievements();

  const handleActionClick = (action: string, achievement: any, isPrimary: boolean = true) => {
    console.log('AI Achievement action:', action, 'Achievement:', achievement);
    
    // If we have specific tickets, navigate to the first one or handle multiple
    if (achievement.tickets && achievement.tickets.length > 0) {
      const firstTicket = achievement.tickets[0];
      
      if (achievement.tickets.length === 1) {
        // Single ticket - navigate directly to the specific stage
        const stageParam = achievement.stage ? `#${achievement.stage}` : '';
        window.open(`/ticket/${firstTicket.id}${stageParam}`, '_blank');
      } else {
        // Multiple tickets - for primary action, open first ticket with stage; for secondary, show list
        if (isPrimary) {
          const stageParam = achievement.stage ? `#${achievement.stage}` : '';
          window.open(`/ticket/${firstTicket.id}${stageParam}`, '_blank');
        } else {
          // Could implement a modal or list view, for now open first ticket
          window.open(`/ticket/${firstTicket.id}`, '_blank');
        }
      }
    } else {
      // Fallback to generic navigation based on action type
      if (action.includes('Review & Approve') || action.includes('View Details')) {
        window.open('/approval/queue', '_blank');
      } else if (action.includes('Send Emails') || action.includes('Review Drafts')) {
        window.open('/communications/drafts', '_blank');
      } else if (action.includes('Review Exceptions') || action.includes('Auto-Resolve')) {
        window.open('/exceptions/management', '_blank');
      } else if (action.includes('View Extractions') || action.includes('Export Data')) {
        window.open('/analytics/documents', '_blank');
      }
    }
  };

  return (
    <Card className="p-6 h-fit">
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
      </div>

      {/* AI Achievements */}
      <div className="space-y-4">
        {aiAchievements.map((achievement, index) => (
          <div key={index} className={`p-4 rounded-xl border ${achievement.color} transition-all hover:shadow-lg`}>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm flex-shrink-0">
                <achievement.icon className={`w-5 h-5 ${achievement.iconColor}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-sm">{achievement.title}</h3>
                  <Badge variant="outline" className="text-xs bg-white ml-2 flex-shrink-0">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {achievement.stats}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                  {achievement.description}
                </p>
                
                <div className="flex items-center gap-2 flex-wrap">
                  <Button 
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 h-7"
                    onClick={() => handleActionClick(achievement.primaryAction, achievement, true)}
                  >
                    {achievement.primaryAction}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="text-xs px-3 py-1 h-7"
                    onClick={() => handleActionClick(achievement.secondaryAction, achievement, false)}
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
            <div className="text-xl font-bold text-blue-600">{applications.length}</div>
            <div className="text-xs text-gray-600">Applications Processed</div>
          </div>
          <div>
            <div className="text-xl font-bold text-green-600">
              {applications.reduce((sum, app) => sum + app.documents.filter(doc => doc.validated).length, 0)}
            </div>
            <div className="text-xs text-gray-600">Documents Validated</div>
          </div>
          <div>
            <div className="text-xl font-bold text-purple-600">
              {applications.reduce((sum, app) => sum + app.exceptions, 0)}
            </div>
            <div className="text-xs text-gray-600">Exceptions Flagged</div>
          </div>
        </div>
      </div>
    </Card>
  );
};
