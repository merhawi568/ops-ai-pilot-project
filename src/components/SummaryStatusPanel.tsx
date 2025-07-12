
import React from 'react';
import { Card } from '@/components/ui/card';
import { useApplicationStore } from '@/store/useApplicationStore';
import { Sparkles, CheckCircle, Zap, FileText, Clock, AlertTriangle, TrendingUp, Activity, Mail, Users, MessageSquare, MoveUp, MoveDown } from 'lucide-react';


export const SummaryStatusPanel: React.FC = () => {
  const { applications, systemMetrics, setFilter } = useApplicationStore();
  
  const stats = [
    { label: 'Applications Completed', value: systemMetrics.applicationsCompleted, filter: 'All', trend:'up' },
    { label: 'Avg Processing Time', value: systemMetrics.avgProcessingTime, filter: 'All', trend:'down' },
    { label: 'Manual Interventions', value: `${systemMetrics.manualInterventions}%`, filter: 'With Exceptions', trend:'down' },
    { label: 'Exceptions Auto-Resolved', value: systemMetrics.exceptionsAutoResolved, filter: 'With Exceptions', trend:'up' }
  ];

  return (
    <Card className="p-6 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
        </div>
        <div className="flex justify-center">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Live Performance</h2>
        </div>
      </div>
      <div className="space-y-4 w-sm">
          {stats.map((stat, index) => (
          <div className="flex justify-center gap-3 w-sm">
            <button
              key={index}
              onClick={() => setFilter('status', stat.filter)}
              className="text-center hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
            >
              <div className="text-2xl justify-center  font-bold text-blue-600">
                <table width="100%"><tr><td align='right'>{stat.value}</td><td align='left'>
                {stat.trend == 'up'?<MoveUp size={15}/>:<MoveDown size={15}/>}
                </td></tr></table>
               </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </button>
          </div>
          ))}
      </div>
    </Card>
  );
};
