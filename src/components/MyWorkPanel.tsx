
import React from 'react';
import { Card } from '@/components/ui/card';
import { useApplicationStore } from '@/store/useApplicationStore';

export const MyWorkPanel: React.FC = () => {
  const { applications } = useApplicationStore();
  
  const workStats = [
    { 
      label: 'Assigned to Me', 
      value: applications.length,
      color: 'text-blue-600'
    },
    { 
      label: 'Exceptions', 
      value: applications.filter(app => app.exceptions > 0).length,
      color: 'text-red-600'
    },
    { 
      label: 'Pending Approvals', 
      value: applications.filter(app => app.status.includes('Approval')).length,
      color: 'text-yellow-600'
    },
    { 
      label: 'Near SLA Breach', 
      value: applications.filter(app => app.slaHours <= 2).length,
      color: 'text-orange-600'
    }
  ];

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">My Work</h3>
      <div className="grid grid-cols-2 gap-4">
        {workStats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>
    </Card>
  );
};
