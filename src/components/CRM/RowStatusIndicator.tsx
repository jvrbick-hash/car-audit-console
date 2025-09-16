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
    <Dialog>
      <div className={`flex items-center gap-2 ${className}`}>
        {/* Traffic light indicator */}
        <div className={`w-2 h-2 rounded-full ${statusInfo.color} animate-pulse`} />
        <DialogTrigger asChild>
          <button
            onClick={() => {
              console.log(`📊 Status clicked for Order ${order.Order_ID}:`, {
                orderId: order.Order_ID,
                status: statusInfo.status,
                message: statusInfo.message,
                issuesCount: statusInfo.issues.length,
                issues: statusInfo.issues,
                timestamp: new Date().toISOString(),
                orderSummary: {
                  customerName: `${order.Jméno} ${order.Příjmení}`,
                  email: order.Email,
                  phone: order['Telefonní číslo'],
                  orderValue: order['Hodnota objednávky'],
                  paymentStatus: order['Stav platby'],
                  orderStatus: order['Stav objednávky']
                }
              });
            }}
            className="focus:outline-none"
          >
            <Badge 
              variant={statusInfo.status === 'success' ? 'default' : statusInfo.status === 'error' ? 'destructive' : 'secondary'}
              className="text-xs flex items-center gap-1 cursor-pointer hover:opacity-80"
            >
              {getStatusIcon(statusInfo.status)}
              {statusInfo.message}
            </Badge>
          </button>
        </DialogTrigger>
      </div>
      
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getStatusIcon(statusInfo.status)}
            Sync Status Log - Order {order.Order_ID}
          </DialogTitle>
          <DialogDescription>
            Detailed synchronization status and data validation report
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Status Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className={`flex items-center gap-2 p-3 rounded-lg border ${
              statusInfo.status === 'success' ? 'bg-green-50 border-green-200' :
              statusInfo.status === 'warning' ? 'bg-yellow-50 border-yellow-200' :
              'bg-red-50 border-red-200'
            }`}>
              {getStatusIcon(statusInfo.status)}
              <div>
                <div className="text-sm font-medium">Status</div>
                <div className="text-lg font-bold">{statusInfo.message}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 border border-blue-200">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-sm font-medium text-blue-900">Issues Found</div>
                <div className="text-lg font-bold text-blue-700">{statusInfo.issues.length}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 border border-gray-200">
              <CheckCircle className="h-5 w-5 text-gray-600" />
              <div>
                <div className="text-sm font-medium text-gray-900">Order Value</div>
                <div className="text-lg font-bold text-gray-700">
                  {order['Hodnota objednávky'].toLocaleString('cs-CZ')} Kč
                </div>
              </div>
            </div>
          </div>

          {/* Order Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Order Information</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="font-medium">Customer:</span> {order.Jméno} {order.Příjmení}</div>
              <div><span className="font-medium">Email:</span> {order.Email}</div>
              <div><span className="font-medium">Phone:</span> {order['Telefonní číslo']}</div>
              <div><span className="font-medium">Payment Status:</span> {order['Stav platby']}</div>
              <div><span className="font-medium">Order Status:</span> {order['Stav objednávky']}</div>
              <div><span className="font-medium">VIN:</span> {order.VIN}</div>
            </div>
          </div>

          {/* Issues Log */}
          {statusInfo.issues.length > 0 && (
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                Detected Issues
              </h4>
              <ScrollArea className="h-[200px] border rounded-lg">
                <div className="p-4 space-y-2">
                  {statusInfo.issues.map((issue, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg border-l-4 border-l-red-500 bg-red-50"
                    >
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <Badge variant="destructive" className="text-xs">
                          SYNC ERROR
                        </Badge>
                      </div>
                      <div className="text-sm font-medium mt-1">{issue}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Timestamp: {new Date().toLocaleString('cs-CZ')}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {statusInfo.issues.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-2" />
              <p className="text-green-700 font-medium">All data synchronized successfully</p>
              <p className="text-sm text-muted-foreground">No issues detected</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Last checked: {new Date().toLocaleString('cs-CZ')}
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Status
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};