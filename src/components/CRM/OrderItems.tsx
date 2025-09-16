import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OrderItem, ItemStatus, productCodeMapping } from '@/types/orders';

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
    <div>
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-primary">Položky objednávky</h3>
          <div className="text-sm text-muted-foreground">
            Celkem: {totalValue.toLocaleString('cs-CZ')} Kč
            {totalRefunded > 0 && (
              <span className="ml-2 text-destructive">
                (Vráceno: {totalRefunded.toLocaleString('cs-CZ')} Kč)
              </span>
            )}
          </div>
        </div>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produkt</TableHead>
              <TableHead>Množství</TableHead>
              <TableHead>Celkem</TableHead>
              <TableHead>Stav</TableHead>
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
                <TableCell className="font-medium">
                  {item.totalPrice.toLocaleString('cs-CZ')} Kč
                </TableCell>
                <TableCell>
                  <Select
                    value={item.status}
                    onValueChange={(value) => onUpdateItemStatus(item.id, value as ItemStatus)}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                      <SelectItem value="Refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};