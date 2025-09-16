import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { Order } from '@/types/orders';

interface RowStatusIndicatorProps {
  order: Order;
  className?: string;
}

export const RowStatusIndicator: React.FC<RowStatusIndicatorProps> = ({ order, className }) => {
  const getOrderStatus = () => {
    // Check payment status first
    if (order['Stav platby'] === 'Nezaplaceno') {
      return { status: 'error', message: 'Nezaplaceno', color: 'bg-red-500' };
    }

    // Check order status
    switch (order['Stav objednávky']) {
      case 'Caraudit hotový':
        return { status: 'success', message: 'Dokončeno', color: 'bg-green-500' };
      case 'Auto není dostupné - nevratka':
      case 'Auto není dostupné - vratka':
      case 'Vrácené peníze':
        return { status: 'error', message: 'Problém', color: 'bg-red-500' };
      case 'Prohlídka v procesu':
      case 'Technik je na cestě':
      case 'Technik přiřazen':
        return { status: 'warning', message: 'V procesu', color: 'bg-yellow-500' };
      default:
        return { status: 'warning', message: 'Neznámý', color: 'bg-gray-500' };
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

  const statusInfo = getOrderStatus();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Traffic light indicator */}
      <div className={`w-2 h-2 rounded-full ${statusInfo.color} animate-pulse`} />
      <Badge 
        variant={statusInfo.status === 'success' ? 'default' : statusInfo.status === 'error' ? 'destructive' : 'secondary'}
        className="text-xs flex items-center gap-1"
      >
        {getStatusIcon(statusInfo.status)}
        {statusInfo.message}
      </Badge>
    </div>
  );
};