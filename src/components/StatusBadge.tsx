
import React from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  exceptions?: number;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, exceptions, className }) => {
  const getStatusConfig = () => {
    if (exceptions && exceptions > 0) {
      return {
        variant: 'destructive',
        icon: AlertTriangle,
        text: `${exceptions} Exception${exceptions > 1 ? 's' : ''}`
      };
    }
    
    switch (status.toLowerCase()) {
      case 'completed':
      case 'ready for approval':
      case 'pending approval':
        return { variant: 'success', icon: CheckCircle, text: status };
      case 'escalated':
      case 'missing docs':
      case 'missing passport':
        return { variant: 'destructive', icon: XCircle, text: status };
      case 'low confidence':
      case 'validating':
        return { variant: 'warning', icon: Clock, text: status };
      default:
        return { variant: 'default', icon: Clock, text: status };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const variants = {
    default: 'bg-gray-100 text-gray-800 border-gray-200',
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    destructive: 'bg-red-100 text-red-800 border-red-200'
  };

  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border',
      variants[config.variant as keyof typeof variants],
      className
    )}>
      <Icon className="w-3 h-3" />
      {config.text}
    </span>
  );
};
