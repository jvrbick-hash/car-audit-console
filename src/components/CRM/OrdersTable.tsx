import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Edit, RefreshCw, Gift, FileText, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ColumnManager } from './ColumnManager';
import { Order, Column, defaultColumns } from '@/types/orders';

const dummyOrders: Order[] = [
  {
    Order_ID: 'ORD001',
    Jméno: 'Jan',
    Příjmení: 'Novák',
    Email: 'jan.novak@email.cz',
    'Telefonní číslo': '+420 123 456 789',
    Adresa: 'Václavské náměstí 1, Praha 1',
    'Hodnota objednávky': 3990,
    'Datum objednávky': '2024-01-15',
    'Stav platby': 'Zaplaceno',
    'Stav objednávky': 'Dokončeno',
    'Variabilní symbol': '2024010001',
    Výrobce: 'Škoda',
    Model: 'Octavia',
    'Adresa inzerátu': 'Praha 5 - Smíchov',
    'Odkaz inzerátu': 'https://autobazar.eu/inzerat/123456',
    'Typ produktu': 'CarAudit Standard',
    'Report link': 'https://reports.caraudit.cz/report/ORD001'
  },
  {
    Order_ID: 'ORD002',
    Jméno: 'Petra',
    Příjmení: 'Svobodová',
    Email: 'petra.svobodova@email.cz',
    'Telefonní číslo': '+420 987 654 321',
    Adresa: 'Náměstí Míru 15, Brno',
    'Hodnota objednávky': 2990,
    'Datum objednávky': '2024-01-16',
    'Stav platby': 'Nezaplaceno',
    'Stav objednávky': 'Čeká na platbu',
    'Variabilní symbol': '2024010002',
    Výrobce: 'Volkswagen',
    Model: 'Golf',
    'Adresa inzerátu': 'Brno - Královo Pole',
    'Odkaz inzerátu': 'https://autobazar.eu/inzerat/123457',
    'Typ produktu': 'CarAudit Premium',
    'Report link': ''
  },
  {
    Order_ID: 'ORD003',
    Jméno: 'Martin',
    Příjmení: 'Procházka',
    Email: 'martin.prochazka@email.cz',
    'Telefonní číslo': '+420 555 123 456',
    Adresa: 'Hlavní třída 89, Ostrava',
    'Hodnota objednávky': 4990,
    'Datum objednávky': '2024-01-17',
    'Stav platby': 'Zaplaceno',
    'Stav objednávky': 'Zpracovává se',
    'Variabilní symbol': '2024010003',
    Výrobce: 'BMW',
    Model: '320d',
    'Adresa inzerátu': 'Ostrava - Poruba',
    'Odkaz inzerátu': 'https://autobazar.eu/inzerat/123458',
    'Typ produktu': 'CarAudit Professional',
    'Report link': ''
  }
];

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'Zaplaceno':
    case 'Dokončeno':
      return 'default';
    case 'Nezaplaceno':
    case 'Zrušeno':
      return 'destructive';
    case 'Částečně zaplaceno':
    case 'Zpracovává se':
      return 'secondary';
    default:
      return 'outline';
  }
};

export const OrdersTable: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(dummyOrders);
  const [columns, setColumns] = useState<Column[]>(defaultColumns);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<{ orderId: string; field: string } | null>(null);
  const { toast } = useToast();

  const visibleColumns = columns.filter(col => col.visible);

  const handleEdit = (orderId: string, field: string, value: string) => {
    setOrders(prev => prev.map(order => 
      order.Order_ID === orderId 
        ? { ...order, [field]: value }
        : order
    ));
    setEditingField(null);
    toast({
      title: "Úprava uložena",
      description: "Změny byly úspěšně uloženy.",
    });
  };

  const handleAction = (action: string, orderId: string) => {
    toast({
      title: "Akce spuštěna",
      description: `${action} pro objednávku ${orderId}`,
    });
  };

  const renderCellContent = (order: Order, column: Column) => {
    const value = order[column.key];
    
    switch (column.type) {
      case 'currency':
        return `${(value as number).toLocaleString()} Kč`;
      case 'date':
        return new Date(value as string).toLocaleDateString('cs-CZ');
      case 'status':
        return (
          <Badge variant={getStatusBadgeVariant(value as string)}>
            {value as string}
          </Badge>
        );
      case 'link':
        return value ? (
          <a href={value as string} target="_blank" rel="noopener noreferrer" 
             className="text-accent hover:underline truncate block">
            {value as string}
          </a>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      default:
        if (column.key === 'Order_ID') {
          return (
            <button
              onClick={() => setExpandedOrder(expandedOrder === order.Order_ID ? null : order.Order_ID)}
              className="flex items-center gap-2 text-primary hover:text-accent font-medium"
            >
              {expandedOrder === order.Order_ID ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              {value as string}
            </button>
          );
        }
        
        if (column.editable) {
          if (editingField?.orderId === order.Order_ID && editingField?.field === column.key) {
            return (
              <Input
                defaultValue={value as string}
                onBlur={(e) => handleEdit(order.Order_ID, column.key, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleEdit(order.Order_ID, column.key, e.currentTarget.value);
                  }
                }}
                className="h-8 text-sm"
                autoFocus
              />
            );
          } else {
            return (
              <div 
                className="flex items-center gap-2 cursor-pointer hover:text-accent truncate"
                onClick={() => setEditingField({ orderId: order.Order_ID, field: column.key })}
              >
                <span className="truncate">{value as string}</span>
                <Edit className="w-3 h-3 opacity-50 flex-shrink-0" />
              </div>
            );
          }
        }
        
        return <span className="truncate">{value as string}</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Přehled objednávek</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Celkem: {orders.length} objednávek • Zobrazeno sloupců: {visibleColumns.length}
          </p>
        </div>
        <ColumnManager columns={columns} onColumnsChange={setColumns} />
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed" style={{ minWidth: `${visibleColumns.length * 140}px` }}>
              <thead className="bg-secondary">
                <tr>
                  {visibleColumns.map((column) => (
                    <th 
                      key={column.key}
                      className="text-left p-4 font-semibold text-secondary-foreground"
                      style={{ width: column.width }}
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <React.Fragment key={order.Order_ID}>
                    <tr className="border-b hover:bg-muted/50 transition-colors">
                      {visibleColumns.map((column) => (
                        <td key={`${order.Order_ID}-${column.key}`} className="p-4" style={{ width: column.width }}>
                          {renderCellContent(order, column)}
                        </td>
                      ))}
                    </tr>
                    
                    {/* Expanded Detail View */}
                    {expandedOrder === order.Order_ID && (
                      <tr>
                        <td colSpan={visibleColumns.length} className="p-0">
                          <div className="bg-muted/30 p-6 border-t">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              {/* Left Column - Order Details */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Detail objednávky</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Variabilní symbol</label>
                                    <p className="text-sm font-mono">{order['Variabilní symbol']}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Výrobce</label>
                                    <p className="text-sm">{order.Výrobce}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Model</label>
                                    <p className="text-sm">{order.Model}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Adresa inzerátu</label>
                                    <p className="text-sm">{order['Adresa inzerátu']}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Odkaz inzerátu</label>
                                    <a href={order['Odkaz inzerátu']} target="_blank" rel="noopener noreferrer" 
                                       className="text-sm text-accent hover:underline block truncate">
                                      {order['Odkaz inzerátu']}
                                    </a>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Typ produktu</label>
                                    <p className="text-sm">{order['Typ produktu']}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Report link</label>
                                    {order['Report link'] ? (
                                      <a href={order['Report link']} target="_blank" rel="noopener noreferrer" 
                                         className="text-sm text-accent hover:underline block truncate">
                                        {order['Report link']}
                                      </a>
                                    ) : (
                                      <p className="text-sm text-muted-foreground">Nepřipraveno</p>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Right Column - Actions */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Akce</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  <Button 
                                    variant="destructive" 
                                    size="sm" 
                                    className="w-full justify-start"
                                    onClick={() => handleAction('Plná refundace', order.Order_ID)}
                                  >
                                    <DollarSign className="w-4 h-4 mr-2" />
                                    Plná refundace
                                  </Button>
                                  
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="w-full justify-start"
                                    onClick={() => handleAction('Částečná refundace', order.Order_ID)}
                                  >
                                    <DollarSign className="w-4 h-4 mr-2" />
                                    Částečná refundace
                                  </Button>

                                  <Button 
                                    variant="secondary" 
                                    size="sm" 
                                    className="w-full justify-start"
                                    onClick={() => handleAction('Znovu odeslat fakturu', order.Order_ID)}
                                  >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Znovu odeslat fakturu
                                  </Button>

                                  <Button 
                                    variant="secondary" 
                                    size="sm" 
                                    className="w-full justify-start"
                                    onClick={() => handleAction('Znovu odeslat report', order.Order_ID)}
                                  >
                                    <FileText className="w-4 h-4 mr-2" />
                                    Znovu odeslat report
                                  </Button>

                                  <Button 
                                    variant="default" 
                                    size="sm" 
                                    className="w-full justify-start bg-accent hover:bg-accent/90"
                                    onClick={() => handleAction('Vygenerovat slevový voucher', order.Order_ID)}
                                  >
                                    <Gift className="w-4 h-4 mr-2" />
                                    Vygenerovat slevový voucher
                                  </Button>
                                </CardContent>
                              </Card>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};