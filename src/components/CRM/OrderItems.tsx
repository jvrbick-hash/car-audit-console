import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { OrderItem, ItemStatus, productCodeMapping } from '@/types/orders';
import { RefreshCw, DollarSign } from 'lucide-react';

interface OrderItemsProps {
  items: OrderItem[];
  onUpdateItemStatus: (itemId: string, status: ItemStatus) => void;
  onRefundItem: (itemId: string, amount: number) => void;
}

const getItemStatusBadgeVariant = (status: ItemStatus) => {
  switch (status) {
    case 'Completed':
      return 'default';
    case 'In Progress':
      return 'secondary';
    case 'Pending':
      return 'outline';
    case 'Refunded':
      return 'destructive';
    case 'Cancelled':
      return 'destructive';
    default:
      return 'outline';
  }
};

const getRefundStatusBadgeVariant = (refundStatus: string) => {
  switch (refundStatus) {
    case 'Full':
      return 'destructive';
    case 'Partial':
      return 'secondary';
    case 'None':
      return 'outline';
    default:
      return 'outline';
  }
};

export const OrderItems: React.FC<OrderItemsProps> = ({
  items,
  onUpdateItemStatus,
  onRefundItem
}) => {
  const totalValue = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalRefunded = items.reduce((sum, item) => sum + (item.refundAmount || 0), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Položky objednávky</span>
          <div className="text-sm text-muted-foreground">
            Celkem: {totalValue.toLocaleString('cs-CZ')} Kč
            {totalRefunded > 0 && (
              <span className="ml-2 text-destructive">
                (Vráceno: {totalRefunded.toLocaleString('cs-CZ')} Kč)
              </span>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produkt</TableHead>
              <TableHead>Množství</TableHead>
              <TableHead>Jednotková cena</TableHead>
              <TableHead>Celkem</TableHead>
              <TableHead>Stav</TableHead>
              <TableHead>Refund</TableHead>
              <TableHead>Akce</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{item.productName}</div>
                    <div className="text-sm text-muted-foreground">{item.productCode}</div>
                    {item.note && (
                      <div className="text-xs text-muted-foreground mt-1">{item.note}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.unitPrice.toLocaleString('cs-CZ')} Kč</TableCell>
                <TableCell className="font-medium">
                  {item.totalPrice.toLocaleString('cs-CZ')} Kč
                </TableCell>
                <TableCell>
                  <Badge variant={getItemStatusBadgeVariant(item.status)}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <Badge variant={getRefundStatusBadgeVariant(item.refundStatus)}>
                      {item.refundStatus}
                    </Badge>
                    {item.refundAmount && item.refundAmount > 0 && (
                      <div className="text-xs text-muted-foreground">
                        {item.refundAmount.toLocaleString('cs-CZ')} Kč
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {item.status !== 'Completed' && item.status !== 'Refunded' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onUpdateItemStatus(item.id, 'Completed')}
                      >
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                    )}
                    {item.refundStatus === 'None' && item.status === 'Completed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onRefundItem(item.id, item.totalPrice)}
                      >
                        <DollarSign className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};