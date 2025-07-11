
import React from 'react';
import { Card } from '@/components/ui/card';
import { useApplicationStore } from '@/store/useApplicationStore';

export const SummaryStatusPanel: React.FC = () => {
  const { applications, systemMetrics, setFilter } = useApplicationStore();
  
  const stats = [
    { label: 'Applications Completed', value: systemMetrics.applicationsCompleted, filter: 'All' },
    { label: 'Avg Processing Time', value: systemMetrics.avgProcessingTime, filter: 'All' },
    { label: 'Manual Interventions', value: `${systemMetrics.manualInterventions}%`, filter: 'With Exceptions' },
    { label: 'Exceptions Auto-Resolved', value: systemMetrics.exceptionsAutoResolved, filter: 'With Exceptions' }
  ];

  return (
    <Card className="p-4 mb-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Overview</h3>
        <div className="flex gap-6">
          {stats.map((stat, index) => (
            <button
              key={index}
              onClick={() => setFilter('status', stat.filter)}
              className="text-center hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
            >
              <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
};
