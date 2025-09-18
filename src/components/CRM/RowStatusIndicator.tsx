import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle, AlertCircle, XCircle, RefreshCw } from 'lucide-react';
import { Order } from '@/types/orders';

interface RowStatusIndicatorProps {
  order: Order;
  className?: string;
}

export const RowStatusIndicator: React.FC<RowStatusIndicatorProps> = ({ order, className }) => {
  const getSyncStatus = () => {
    const issues = [];

    // Check for missing critical data that should be synced
    if (order['Stav objednávky'] === 'Hotová' && !order['Report link']) {
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

    // Log issues to console for debugging
    if (issues.length > 0) {
      console.error(`🔴 Sync Issues detected for Order ${order.Order_ID}:`, {
        orderId: order.Order_ID,
        issues: issues,
        severity: issues.length <= 2 ? 'warning' : 'error',
        timestamp: new Date().toISOString(),
        orderData: {
          email: order.Email,
          phone: order['Telefonní číslo'],
          vin: order.VIN,
          reportLink: order['Report link'],
          documentNumber: order['Číslo dokladu'],
          address: order.Adresa,
          postalCode: order.PSČ,
          city: order.Město
        }
      });
    }

    // Determine status based on issues found
    if (issues.length === 0) {
      return { status: 'success', message: 'Synchronized', color: 'bg-green-500', issues: [] };
    } else {
      return { status: 'error', message: `${issues.length} issue${issues.length > 1 ? 's' : ''}`, color: 'bg-red-500', issues };
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
    <div className={`flex items-center justify-center ${className}`}>
      {/* Static traffic light indicator only */}
      <div className={`w-3 h-3 rounded-full ${statusInfo.color}`} />
    </div>
  );
};