
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { useApplicationStore } from '@/store/useApplicationStore';
import { TrendingUp, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface SystemInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemInsightsModal: React.FC<SystemInsightsModalProps> = ({ isOpen, onClose }) => {
  const { systemMetrics } = useApplicationStore();

  const insights = [
    {
      title: 'Applications Completed Today',
      value: systemMetrics.applicationsCompleted,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Avg. AI Processing Time',
      value: systemMetrics.avgProcessingTime,
      subtitle: 'vs 8.5h traditional',
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Manual Interventions',
      value: `${systemMetrics.manualInterventions}%`,
      subtitle: 'Down from 45%',
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Exceptions Auto-Resolved',
      value: systemMetrics.exceptionsAutoResolved,
      subtitle: 'Today',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>System Insights & Performance</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <Card key={index} className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${insight.bgColor}`}>
                    <Icon className={`w-6 h-6 ${insight.color}`} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{insight.value}</div>
                    <div className="text-sm font-medium text-gray-900">{insight.title}</div>
                    {insight.subtitle && (
                      <div className="text-xs text-gray-500">{insight.subtitle}</div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">Key Benefits</h4>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>• 70% reduction in processing time through AI automation</li>
            <li>• 55% decrease in manual interventions required</li>
            <li>• 85% of exceptions now auto-resolved by AI agents</li>
            <li>• Improved SLA compliance across all application types</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};
