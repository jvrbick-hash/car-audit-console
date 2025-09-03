import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Edit, RefreshCw, Gift, FileText, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface Order {
  Order_ID: string;
  Jméno: string;
  Příjmení: string;
  Email: string;
  'Telefonní číslo': string;
  Adresa: string;
  'Hodnota objednávky': number;
  'Datum objednávky': string;
  'Stav platby': 'Zaplaceno' | 'Nezaplaceno' | 'Částečně zaplaceno';
  'Stav objednávky': 'Dokončeno' | 'Zpracovává se' | 'Čeká na platbu' | 'Zrušeno';
  // Detail fields
  'Variabilní symbol': string;
  Výrobce: string;
  Model: string;
  'Adresa inzerátu': string;
  'Odkaz inzerátu': string;
  'Typ produktu': string;
  'Report link': string;
}

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
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<{ orderId: string; field: string } | null>(null);
  const { toast } = useToast();

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

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary">Přehled objednávek</h2>
        <div className="text-sm text-muted-foreground">
          Celkem: {orders.length} objednávek
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="text-left p-4 font-semibold text-secondary-foreground">Order ID</th>
                  <th className="text-left p-4 font-semibold text-secondary-foreground">Jméno</th>
                  <th className="text-left p-4 font-semibold text-secondary-foreground">Příjmení</th>
                  <th className="text-left p-4 font-semibold text-secondary-foreground">Email</th>
                  <th className="text-left p-4 font-semibold text-secondary-foreground">Telefon</th>
                  <th className="text-left p-4 font-semibold text-secondary-foreground">Adresa</th>
                  <th className="text-left p-4 font-semibold text-secondary-foreground">Hodnota</th>
                  <th className="text-left p-4 font-semibold text-secondary-foreground">Datum</th>
                  <th className="text-left p-4 font-semibold text-secondary-foreground">Stav platby</th>
                  <th className="text-left p-4 font-semibold text-secondary-foreground">Stav objednávky</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <React.Fragment key={order.Order_ID}>
                    <tr className="border-b hover:bg-muted/50 transition-colors">
                      <td className="p-4">
                        <button
                          onClick={() => setExpandedOrder(expandedOrder === order.Order_ID ? null : order.Order_ID)}
                          className="flex items-center gap-2 text-primary hover:text-accent font-medium"
                        >
                          {expandedOrder === order.Order_ID ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                          {order.Order_ID}
                        </button>
                      </td>
                      <td className="p-4">{order.Jméno}</td>
                      <td className="p-4">{order.Příjmení}</td>
                      <td className="p-4 text-sm">{order.Email}</td>
                      <td className="p-4">
                        {editingField?.orderId === order.Order_ID && editingField?.field === 'Telefonní číslo' ? (
                          <Input
                            defaultValue={order['Telefonní číslo']}
                            onBlur={(e) => handleEdit(order.Order_ID, 'Telefonní číslo', e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleEdit(order.Order_ID, 'Telefonní číslo', e.currentTarget.value);
                              }
                            }}
                            className="h-8 text-sm"
                            autoFocus
                          />
                        ) : (
                          <div 
                            className="flex items-center gap-2 cursor-pointer hover:text-accent"
                            onClick={() => setEditingField({ orderId: order.Order_ID, field: 'Telefonní číslo' })}
                          >
                            {order['Telefonní číslo']}
                            <Edit className="w-3 h-3 opacity-50" />
                          </div>
                        )}
                      </td>
                      <td className="p-4 max-w-xs">
                        {editingField?.orderId === order.Order_ID && editingField?.field === 'Adresa' ? (
                          <Input
                            defaultValue={order.Adresa}
                            onBlur={(e) => handleEdit(order.Order_ID, 'Adresa', e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleEdit(order.Order_ID, 'Adresa', e.currentTarget.value);
                              }
                            }}
                            className="h-8 text-sm"
                            autoFocus
                          />
                        ) : (
                          <div 
                            className="flex items-center gap-2 cursor-pointer hover:text-accent truncate"
                            onClick={() => setEditingField({ orderId: order.Order_ID, field: 'Adresa' })}
                          >
                            <span className="truncate">{order.Adresa}</span>
                            <Edit className="w-3 h-3 opacity-50 flex-shrink-0" />
                          </div>
                        )}
                      </td>
                      <td className="p-4 font-semibold">{order['Hodnota objednávky'].toLocaleString()} Kč</td>
                      <td className="p-4">{new Date(order['Datum objednávky']).toLocaleDateString('cs-CZ')}</td>
                      <td className="p-4">
                        <Badge variant={getStatusBadgeVariant(order['Stav platby'])}>
                          {order['Stav platby']}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant={getStatusBadgeVariant(order['Stav objednávky'])}>
                          {order['Stav objednávky']}
                        </Badge>
                      </td>
                    </tr>
                    
                    {/* Expanded Detail View */}
                    {expandedOrder === order.Order_ID && (
                      <tr>
                        <td colSpan={10} className="p-0">
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