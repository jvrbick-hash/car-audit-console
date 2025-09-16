import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { Order } from '@/types/orders';

interface RowStatusIndicatorProps {
  order: Order;
  className?: string;
}

export const RowStatusIndicator: React.FC<RowStatusIndicatorProps> = ({ order, className }) => {
  const getSyncStatus = () => {
    const issues = [];

    // Check for missing critical data that should be synced
    if (order['Stav objednávky'] === 'Caraudit hotový' && !order['Report link']) {
      issues.push('Missing report link');
    }

    if (order['Stav platby'] === 'Zaplaceno' && !order['Číslo dokladu']) {
      issues.push('Missing document number');
    }

    if (!order.Email || !order.Email.includes('@')) {
      issues.push('Invalid email');
    }

    if (!order['Telefonní číslo'] || order['Telefonní číslo'].length < 9) {
      issues.push('Invalid phone number');
    }

    if (!order.VIN || order.VIN.length < 10) {
      issues.push('Invalid VIN number');
    }

    // Check for data consistency issues
    if (order['Hodnota objednávky'] && order.items) {
      const itemsTotal = order.items.reduce((sum, item) => sum + item.totalPrice, 0);
      if (Math.abs(itemsTotal - order['Hodnota objednávky']) > 1) {
        issues.push('Price mismatch');
      }
    }

    // Check for incomplete address data
    if (!order.Adresa || !order.PSČ || !order.Město) {
      issues.push('Incomplete address');
    }

    // Determine status based on issues found
    if (issues.length === 0) {
      return { status: 'success', message: 'Synchronized', color: 'bg-green-500', issues: [] };
    } else if (issues.length <= 2) {
      return { status: 'warning', message: `${issues.length} issue${issues.length > 1 ? 's' : ''}`, color: 'bg-yellow-500', issues };
    } else {
      return { status: 'error', message: `${issues.length} issues`, color: 'bg-red-500', issues };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-3 w-3 text-white" />;
      case 'error':
        return <XCircle className="h-3 w-3 text-white" />;
      case 'warning':
        return <AlertCircle className="h-3 w-3 text-white" />;
      default:
        return <AlertCircle className="h-3 w-3 text-white" />;
    }
  };

  const statusInfo = getSyncStatus();

  return (
    <TooltipProvider>
      <div className={`flex items-center gap-2 ${className}`}>
        {/* Traffic light indicator */}
        <div className={`w-2 h-2 rounded-full ${statusInfo.color} animate-pulse`} />
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant={statusInfo.status === 'success' ? 'default' : statusInfo.status === 'error' ? 'destructive' : 'secondary'}
              className="text-xs flex items-center gap-1 cursor-help"
            >
              {getStatusIcon(statusInfo.status)}
              {statusInfo.message}
            </Badge>
          </TooltipTrigger>
          {statusInfo.issues.length > 0 && (
            <TooltipContent side="right" className="max-w-sm">
              <div className="space-y-1">
                <p className="font-medium">Sync Issues:</p>
                <ul className="text-xs space-y-1">
                  {statusInfo.issues.map((issue, index) => (
                    <li key={index} className="flex items-center gap-1">
                      <XCircle className="h-3 w-3 text-red-500 flex-shrink-0" />
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};