
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressRing } from '@/components/ui/progress-ring';
import { StatusBadge } from '@/components/StatusBadge';
import { useApplicationStore } from '@/store/useApplicationStore';
import { Clock, Filter, SortAsc } from 'lucide-react';

export const TaskGrid: React.FC = () => {
  const { applications, filters, setFilter, setSelectedApplication } = useApplicationStore();

  const filteredApplications = applications.filter(app => {
    if (filters.status === 'All') return true;
    if (filters.status === 'With Exceptions') return app.exceptions > 0;
    if (filters.status === 'Final Review') return app.status.includes('Approval');
    if (filters.status === 'Waiting Signature') return app.status.includes('signature');
    return true;
  });

  const getSLAColor = (hours: number) => {
    if (hours <= 2) return 'text-red-600';
    if (hours <= 6) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Task Queue</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <SortAsc className="w-4 h-4 mr-2" />
            Sort by SLA
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left">
              <th className="pb-3 text-sm font-medium text-gray-600">Ticket ID</th>
              <th className="pb-3 text-sm font-medium text-gray-600">Client Name</th>
              <th className="pb-3 text-sm font-medium text-gray-600">Account Type</th>
              <th className="pb-3 text-sm font-medium text-gray-600">Stage</th>
              <th className="pb-3 text-sm font-medium text-gray-600">Status</th>
              <th className="pb-3 text-sm font-medium text-gray-600">Progress</th>
              <th className="pb-3 text-sm font-medium text-gray-600">SLA</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map((app) => (
              <tr 
                key={app.id} 
                className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setSelectedApplication(app)}
              >
                <td className="py-4">
                  <span className="font-mono text-sm text-blue-600">{app.id}</span>
                </td>
                <td className="py-4">
                  <div className="font-medium">{app.clientName}</div>
                </td>
                <td className="py-4">
                  <span className="text-sm text-gray-600">{app.accountType}</span>
                </td>
                <td className="py-4">
                  <span className="text-sm">{app.stage}</span>
                </td>
                <td className="py-4">
                  <StatusBadge status={app.status} exceptions={app.exceptions} />
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <ProgressRing 
                      progress={app.progress} 
                      total={app.totalSteps} 
                      size="sm" 
                    />
                    <span className="text-xs text-gray-500">
                      {app.progress}/{app.totalSteps} steps
                    </span>
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
  );
};
