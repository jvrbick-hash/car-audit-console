import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Edit, RefreshCw, Gift, FileText, DollarSign, FilterX } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { ColumnManager } from './ColumnManager';
import { SearchAndFilters } from './SearchAndFilters';
import { ExcelFilter } from './ExcelFilter';
import { OrderDetailTabs } from './OrderDetailTabs';
import { RowStatusIndicator } from './RowStatusIndicator';
import { Order, Column, defaultColumns, validateColumnWidth, ItemStatus } from '@/types/orders';

const dummyOrders: Order[] = [
  {
    Order_ID: 'ORD001',
    Jméno: 'Jan',
    Příjmení: 'Novák',
    Email: 'jan.novak@email.cz',
    'Telefonní číslo': '+420 123 456 789',
    Adresa: 'Václavské náměstí 1, Praha 1',
    PSČ: '11000',
    Město: 'Praha',
    'Hodnota objednávky': 2500,
    'Datum objednávky': '2024-01-15T10:30:00',
    'Stav platby': 'Zaplaceno',
    'Stav objednávky': 'Caraudit hotový',
    'Variabilní symbol': '2024010001',
    Výrobce: 'Škoda',
    Model: 'Octavia',
    'Adresa inzerátu': 'Praha 5 - Smíchov',
    'Odkaz inzerátu': 'https://autobazar.eu/inzerat/123456',
    'Report link': 'https://carvago.caraudit.app/8194c912-e4d8-43d9-8751-f6c9da7e9919?lang=cs&theme=7dced998-4ba2-409b-8cca-01267732b1b6',
    DIČ: 'CZ8855123456',
    IČ: '12345678',
    'Ulice a číslo': 'Václavské náměstí 1',
    Měna: 'CZK',
    VIN: 'TMBJF71V8C6123456',
    'Poloha inzerátu': 'Praha 5',
    'Poznámka zákazníka': 'Rychlé zpracování prosím',
    'Číslo dokladu': 'DOC123',
    'Slevový kód': 'SLEVA10',
    'Poznámka interní': 'VIP zákazník - rychlé zpracování požadováno',
    poznámka: 'Ano',
    internalNoteHistory: [
      {
        note: 'VIP zákazník',
        timestamp: '2024-01-15T09:15:00',
        user: 'Admin'
      },
      {
        note: 'Zákazník volal ohledně rychlého zpracování. Priorita vysoká.',
        timestamp: '2024-01-15T10:20:00',
        user: 'Jana Svobodová'
      },
      {
        note: 'Rychlé zpracování požadováno - dokončit do 16:00',
        timestamp: '2024-01-15T11:45:00',
        user: 'Petr Novák'
      }
    ],
    items: [
      {
        id: 'item-1',
        productCode: 'CA_CEBIA_VEHICLE',
        productName: 'Základní kontrola vozu',
        quantity: 1,
        unitPrice: 1500,
        totalPrice: 1500,
        status: 'Completed',
        refundStatus: 'None'
      },
      {
        id: 'item-2',
        productCode: 'CA_CEBIA_EXTENDED_CHECK',
        productName: 'Rozšířená kontrola vozu bez zákazníka',
        quantity: 1,
        unitPrice: 1000,
        totalPrice: 1000,
        status: 'Completed',
        refundStatus: 'None'
      }
    ],
    statusHistory: [
      { status: 'Technik přiřazen', timestamp: '2024-01-15T10:30:00', note: 'Technik Jan Novák přiřazen' },
      { status: 'Technik je na cestě', timestamp: '2024-01-15T11:15:00', note: 'Technik vyjel k vozidlu' },
      { status: 'Prohlídka v procesu', timestamp: '2024-01-15T14:20:00', note: 'Zahájení prohlídky vozidla' },
      { status: 'Caraudit hotový', timestamp: '2024-01-15T16:45:00', note: 'Report dokončen a odeslán' }
    ]
  },
  {
    Order_ID: 'ORD002',
    Jméno: 'Petra',
    Příjmení: 'Svobodová',
    Email: 'petra.svobodova@email.cz',
    'Telefonní číslo': '+420 987 654 321',
    Adresa: 'Náměstí Míru 15, Brno',
    PSČ: '60200',
    Město: 'Brno',
    'Hodnota objednávky': 2990,
    'Datum objednávky': '2024-01-16T14:45:00',
    'Stav platby': 'Částečně zaplaceno',
    'Stav objednávky': 'Prohlídka v procesu',
    'Variabilní symbol': '2024010002',
    Výrobce: 'Volkswagen',
    Model: 'Golf',
    'Adresa inzerátu': 'Brno - Královo Pole',
    'Odkaz inzerátu': 'https://autobazar.eu/inzerat/123457',
    'Report link': '', // Missing report link - sync issue
    DIČ: '',
    IČ: '',
    'Ulice a číslo': 'Náměstí Míru 15',
    Měna: 'CZK',
    VIN: '1VWBP7A39CC123457',
    'Poloha inzerátu': 'Brno',
    'Poznámka zákazníka': '',
    'Číslo dokladu': '', // Missing document number - sync issue
    'Slevový kód': '',
    'Poznámka interní': 'Report link chybí - kontaktovat technika',
    poznámka: 'Ne',
    internalNoteHistory: [
      {
        note: 'Čeká na platbu',
        timestamp: '2024-01-16T14:50:00',
        user: 'Markéta Nová'
      },
      {
        note: 'Platba potvrzena, může pokračovat zpracování',
        timestamp: '2024-01-16T15:30:00',
        user: 'Tomáš Veselý'
      },
      {
        note: 'Report link chybí - kontaktovat technika',
        timestamp: '2024-01-16T16:25:00',
        user: 'Jana Svobodová'
      }
    ],
    items: [
      {
        id: 'item-3',
        productCode: 'CA_CEBIA_EXTENDED_BATTERY_CHECK',
        productName: 'Rozšířená kontrola',
        quantity: 1,
        unitPrice: 800,
        totalPrice: 800,
        status: 'In Progress',
        refundStatus: 'None'
      },
      {
        id: 'item-4',
        productCode: 'CA_CEBIA_EXTENDED_CHECK',
        productName: 'Rozšířená kontrola vozu bez zákazníka',
        quantity: 1,
        unitPrice: 1000,
        totalPrice: 1000,
        status: 'Pending',
        refundStatus: 'None'
      }
    ],
    statusHistory: [
      { status: 'Technik přiřazen', timestamp: '2024-01-16T14:45:00', note: 'Technik Petr Novotný přiřazen' },
      { status: 'Caraudit hotový', timestamp: '2024-01-16T16:20:00', note: 'Report dokončen ale chybí link' }
    ]
  },
  {
    Order_ID: 'ORD003',
    Jméno: 'Martin',
    Příjmení: 'Procházka',
    Email: 'martin.invalid-email', // Invalid email - sync issue
    'Telefonní číslo': '+420 555', // Invalid phone - sync issue
    Adresa: '', // Missing address - sync issue
    PSČ: '',
    Město: '',
    'Hodnota objednávky': 4990,
    'Datum objednávky': '2024-01-17T09:15:00',
    'Stav platby': 'Nezaplaceno',
    'Stav objednávky': 'Auto není dostupné - vratka',
    'Variabilní symbol': '2024010003',
    Výrobce: 'BMW',
    Model: '320d',
    'Adresa inzerátu': 'Ostrava - Poruba',
    'Odkaz inzerátu': 'https://autobazar.eu/inzerat/123458',
    'Report link': '', // Missing report link - sync issue
    DIČ: 'CZ7712345678',
    IČ: '87654321',
    'Ulice a číslo': 'Hlavní třída 89',
    Měna: 'CZK',
    VIN: 'INVALID', // Invalid VIN - sync issue
    'Poloha inzerátu': 'Ostrava',
    'Poznámka zákazníka': 'Kontrola před koupí',
    'Číslo dokladu': '', // Missing document number - sync issue
    'Slevový kód': 'BMW20',
    'Poznámka interní': 'Pravidelný zákazník',
    poznámka: 'Ano',
    items: [
      {
        id: 'item-5',
        productCode: 'CA_CEBIA_VEHICLE',
        productName: 'Základní kontrola vozu',
        quantity: 1,
        unitPrice: 1500,
        totalPrice: 1500,
        status: 'Completed',
        refundStatus: 'None'
      },
      {
        id: 'item-6',
        productCode: 'CA_CEBIA_EXTENDED_BATTERY_CHECK',
        productName: 'Rozšířená kontrola',
        quantity: 1,
        unitPrice: 700,
        totalPrice: 700,
        status: 'In Progress',
        refundStatus: 'None'
      },
      {
        id: 'item-7',
        productCode: 'CA_CEBIA_EXTENDED_CHECK_WITH_CUSTOMER',
        productName: 'Rozšířená kontrola s přítomností zákazníka',
        quantity: 1,
        unitPrice: 1000,
        totalPrice: 1000,
        status: 'Pending',
        refundStatus: 'None'
      },
      {
        id: 'item-8',
        productCode: 'CA_CEBIA_DISCOUNT',
        productName: 'Sleva',
        quantity: 1,
        unitPrice: -200,
        totalPrice: -200,
        status: 'Completed',
        refundStatus: 'None',
        note: '10% sleva BMW20'
      }
    ],
    statusHistory: [
      { status: 'Technik přiřazen', timestamp: '2024-01-17T09:15:00', note: 'Technik Petr Svoboda přiřazen' },
      { status: 'Auto není dostupné - vratka', timestamp: '2024-01-17T10:30:00', note: 'Vozidlo nebylo nalezeno na uvedené adrese' }
    ]
  },
  {
    Order_ID: 'ORD004',
    Jméno: 'Alice',
    Příjmení: 'Krásná',
    Email: 'alice.krasna@email.cz',
    'Telefonní číslo': '+420 777 888 999',
    Adresa: 'Wenceslas Square 10, Praha 1',
    PSČ: '11000',
    Město: 'Praha',
    'Hodnota objednávky': 1500,
    'Datum objednávky': '2024-01-18T08:30:00',
    'Stav platby': 'Nezaplaceno',
    'Stav objednávky': 'Technik je na cestě',
    'Variabilní symbol': '2024010004',
    Výrobce: 'Audi',
    Model: 'A4',
    'Adresa inzerátu': 'Praha 2 - Vinohrady',
    'Odkaz inzerátu': 'https://autobazar.eu/inzerat/123459',
    'Report link': '',
    DIČ: '',
    IČ: '',
    'Ulice a číslo': 'Wenceslas Square 10',
    Měna: 'CZK',
    VIN: 'WAUEF78E16A123459',
    'Poloha inzerátu': 'Praha 2',
    'Poznámka zákazníka': 'Urgentní kontrola',
    'Číslo dokladu': '',
    'Slevový kód': '',
    'Poznámka interní': 'Čeká na platbu před prohlídkou',
    poznámka: 'Ne',
    items: [
      {
        id: 'item-9',
        productCode: 'CA_CEBIA_VEHICLE',
        productName: 'Základní kontrola vozu',
        quantity: 1,
        unitPrice: 1500,
        totalPrice: 1500,
        status: 'Pending',
        refundStatus: 'None'
      }
    ],
    statusHistory: [
      { status: 'Technik přiřazen', timestamp: '2024-01-18T08:30:00', note: 'Technik Pavel Novák přiřazen' },
      { status: 'Technik je na cestě', timestamp: '2024-01-18T09:15:00', note: 'Technik vyjel k vozidlu' }
    ]
  },
  {
    Order_ID: 'ORD005',
    Jméno: 'David',
    Příjmení: 'Veselý',
    Email: 'david.vesely@email.cz',
    'Telefonní číslo': '+420 666 777 888',
    Adresa: 'Národní třída 20, Praha 1',
    PSČ: '11000',
    Město: 'Praha',
    'Hodnota objednávky': 3500,
    'Datum objednávky': '2024-01-19T16:20:00',
    'Stav platby': 'Zaplaceno',
    'Stav objednávky': 'Vrácené peníze',
    'Variabilní symbol': '2024010005',
    Výrobce: 'Mercedes',
    Model: 'C-Class',
    'Adresa inzerátu': 'Praha 4 - Podolí',
    'Odkaz inzerátu': 'https://autobazar.eu/inzerat/123460',
    'Report link': '',
    DIČ: 'CZ9988776655',
    IČ: '99887766',
    'Ulice a číslo': 'Národní třída 20',
    Měna: 'CZK',
    VIN: 'WDD2050541R123460',
    'Poloha inzerátu': 'Praha 4',
    'Poznámka zákazníka': 'Zrušení objednávky',
    'Číslo dokladu': '',
    'Slevový kód': '',
    'Poznámka interní': 'Zákazník zrušil objednávku - refund proveden',
    poznámka: 'Ano',
    items: [
      {
        id: 'item-10',
        productCode: 'CA_CEBIA_EXTENDED_CHECK',
        productName: 'Rozšířená kontrola vozu bez zákazníka',
        quantity: 1,
        unitPrice: 3500,
        totalPrice: 3500,
        status: 'Refunded',
        refundStatus: 'Full',
        refundAmount: 3500
      }
    ],
    statusHistory: [
      { status: 'Technik přiřazen', timestamp: '2024-01-19T16:20:00', note: 'Technik Jana Nová přiřazena' },
      { status: 'Vrácené peníze', timestamp: '2024-01-19T17:45:00', note: 'Zákazník zrušil objednávku, refund zpracován' }
    ]
  },
  {
    Order_ID: 'ORD006',
    Jméno: 'Eva',
    Příjmení: 'Černá',
    Email: 'eva.cerna@email.cz',
    'Telefonní číslo': '+420 555 444 333',
    Adresa: 'Karlova 5, Praha 1',
    PSČ: '11000',
    Město: 'Praha',
    'Hodnota objednávky': 2200,
    'Datum objednávky': '2024-01-20T11:10:00',
    'Stav platby': 'Částečně zaplaceno',
    'Stav objednávky': 'Auto není dostupné - nevratka',
    'Variabilní symbol': '2024010006',
    Výrobce: 'Ford',
    Model: 'Focus',
    'Adresa inzerátu': 'Praha 6 - Dejvice',
    'Odkaz inzerátu': 'https://autobazar.eu/inzerat/123461',
    'Report link': '',
    DIČ: '',
    IČ: '',
    'Ulice a číslo': 'Karlova 5',
    Měna: 'CZK',
    VIN: 'WF0DXXGCDDW123461',
    'Poloha inzerátu': 'Praha 6',
    'Poznámka zákazníka': 'Kontrola před výměnou',
    'Číslo dokladu': '',
    'Slevový kód': '',
    'Poznámka interní': 'Vozidlo prodáno jinému kupci',
    poznámka: 'Ne',
    items: [
      {
        id: 'item-11',
        productCode: 'CA_CEBIA_VEHICLE',
        productName: 'Základní kontrola vozu',
        quantity: 1,
        unitPrice: 1500,
        totalPrice: 1500,
        status: 'Cancelled',
        refundStatus: 'None'
      },
      {
        id: 'item-12',
        productCode: 'CA_CEBIA_EXTENDED_BATTERY_CHECK',
        productName: 'Rozšířená kontrola',
        quantity: 1,
        unitPrice: 700,
        totalPrice: 700,
        status: 'Cancelled',
        refundStatus: 'None'
      }
    ],
    statusHistory: [
      { status: 'Technik přiřazen', timestamp: '2024-01-20T11:10:00', note: 'Technik Tomáš Kratký přiřazen' },
      { status: 'Auto není dostupné - nevratka', timestamp: '2024-01-20T14:30:00', note: 'Vozidlo bylo prodáno jinému kupci' }
    ]
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
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const [resizeStartX, setResizeStartX] = useState<number>(0);
  const [resizeStartWidth, setResizeStartWidth] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>({});
  const [confirmAction, setConfirmAction] = useState<{ action: string; orderId: string } | null>(null);
  const { toast } = useToast();

  const handleMouseDown = (e: React.MouseEvent, columnKey: string) => {
    e.preventDefault();
    const column = columns.find(col => col.key === columnKey);
    if (!column) return;
    
    const currentWidth = column.width ? parseInt(column.width.replace('px', '')) : 120;
    
    setResizingColumn(columnKey);
    setResizeStartX(e.clientX);
    setResizeStartWidth(currentWidth);
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizingColumn) return;
      
      const deltaX = e.clientX - resizeStartX;
      const newWidth = Math.max(80, resizeStartWidth + deltaX);
      
      setColumns(prev => prev.map(col => 
        col.key === resizingColumn 
          ? { ...col, width: validateColumnWidth(`${newWidth}px`) }
          : col
      ));
    };

    const handleMouseUp = () => {
      setResizingColumn(null);
    };

    if (resizingColumn) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [resizingColumn, resizeStartX, resizeStartWidth]);

  const visibleColumns = columns.filter(col => col.visible);

  // Filtered orders based on all active filters
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Search term filter (searches across all visible columns)
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = visibleColumns.some(column => {
          const value = order[column.key];
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(searchLower);
        });
        if (!matchesSearch) return false;
      }

      // Date range filter
      if (dateRange?.from) {
        const orderDate = new Date(order['Datum objednávky']);
        const fromDate = dateRange.from;
        const toDate = dateRange.to || dateRange.from;
        
        // Set time to start/end of day for proper comparison
        const orderDateOnly = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate());
        const fromDateOnly = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
        const toDateOnly = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());
        
        if (orderDateOnly < fromDateOnly || orderDateOnly > toDateOnly) {
          return false;
        }
      }

      // Column-specific filters
      for (const [columnKey, filterValues] of Object.entries(columnFilters)) {
        if (!filterValues || filterValues.length === 0) continue;
        
        const value = order[columnKey as keyof Order];
        if (value === null || value === undefined) continue;
        
        // If filter values are set, the value must be in the selected values
        if (!filterValues.includes(String(value))) {
          return false;
        }
      }

      return true;
    });
  }, [orders, searchTerm, dateRange, columnFilters, visibleColumns]);

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
    setConfirmAction({ action, orderId });
  };

  const confirmAndExecuteAction = () => {
    if (confirmAction) {
      toast({
        title: "Akce spuštěna",
        description: `${confirmAction.action} pro objednávku ${confirmAction.orderId}`,
      });
      setConfirmAction(null);
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setDateRange(undefined);
    setColumnFilters({});
    toast({
      title: "Filtry vymazány",
      description: "Všechny filtry byly odstraněny.",
    });
  };

  const handleUpdateItemStatus = (itemId: string, status: ItemStatus) => {
    setOrders(prev => prev.map(order => ({
      ...order,
      items: order.items.map(item => 
        item.id === itemId ? { ...item, status } : item
      )
    })));

    toast({
      title: "Stav položky aktualizován",
      description: `Stav položky byl změněn na ${status}.`,
    });
  };

  const handleRefundItem = (itemId: string, amount: number) => {
    setOrders(prev => prev.map(order => ({
      ...order,
      items: order.items.map(item => 
        item.id === itemId 
          ? { 
              ...item, 
              refundStatus: amount === item.totalPrice ? 'Full' : 'Partial',
              refundAmount: amount,
              status: 'Refunded'
            } 
          : item
      )
    })));

    toast({
      title: "Refund zpracován",
      description: `Částka ${amount.toLocaleString('cs-CZ')} Kč byla vrácena.`,
    });
  };

  const updateColumnFilter = (columnKey: string, values: string[]) => {
    setColumnFilters(prev => ({
      ...prev,
      [columnKey]: values
    }));
  };

  const hasActiveFilters = searchTerm.length > 0 || dateRange?.from || Object.values(columnFilters).some(v => v.length > 0);

  const renderColumnFilter = (column: Column) => {
    const selectedValues = columnFilters[column.key] || [];

    return (
      <ExcelFilter
        column={column}
        orders={orders}
        selectedValues={selectedValues}
        onSelectionChange={(values) => updateColumnFilter(column.key, values)}
      />
    );
  };

  const renderCellContent = (order: Order, column: Column) => {
    // Handle special StatusIndicator column
    if (column.key === 'StatusIndicator') {
      return <RowStatusIndicator order={order} />;
    }

    const value = order[column.key as keyof Order];
    const stringValue = value as string;
    
    switch (column.type) {
      case 'currency':
        return (
          <span className="font-semibold whitespace-nowrap">
            {(value as number).toLocaleString()} Kč
          </span>
        );
      case 'date':
        return (
          <span className="whitespace-nowrap">
            {new Date(value as string).toLocaleDateString('cs-CZ')}
          </span>
        );
      case 'datetime':
        return (
          <span className="whitespace-nowrap">
            {new Date(value as string).toLocaleString('cs-CZ')}
          </span>
        );
      case 'status':
        return (
          <Badge variant={getStatusBadgeVariant(value as string)} className="whitespace-nowrap">
            {value as string}
          </Badge>
        );
      case 'link':
        return value ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <a 
                href={value as string} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-accent hover:underline block max-w-full break-all text-sm"
              >
                {(value as string).length > 30 
                  ? `${(value as string).substring(0, 30)}...` 
                  : value as string
                }
              </a>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-sm break-all">
              <p>{value as string}</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      default:
        if (column.key === 'Order_ID') {
          return (
            <button
              onClick={() => setExpandedOrder(expandedOrder === order.Order_ID ? null : order.Order_ID)}
              className="flex items-center gap-2 text-primary hover:text-accent font-medium whitespace-nowrap"
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
                className="h-8 text-sm min-w-0"
                autoFocus
              />
            );
          } else {
            return stringValue && stringValue.length > 25 ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className="flex items-center gap-2 cursor-pointer hover:text-accent group"
                    onClick={() => setEditingField({ orderId: order.Order_ID, field: column.key })}
                  >
                    <span className="break-words text-sm leading-tight">
                      {stringValue.substring(0, 25)}...
                    </span>
                    <Edit className="w-3 h-3 opacity-50 group-hover:opacity-100 flex-shrink-0" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-sm">
                  <p className="break-words">{stringValue}</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <div 
                className="flex items-center gap-2 cursor-pointer hover:text-accent group"
                onClick={() => setEditingField({ orderId: order.Order_ID, field: column.key })}
              >
                <span className="break-words text-sm leading-tight">{stringValue}</span>
                <Edit className="w-3 h-3 opacity-50 group-hover:opacity-100 flex-shrink-0" />
              </div>
            );
          }
        }
        
        // Non-editable text fields with full visibility
        return stringValue && stringValue.length > 30 ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-help break-words text-sm leading-tight">
                {stringValue.substring(0, 30)}...
              </span>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-sm">
              <p className="break-words">{stringValue}</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <span className="break-words text-sm leading-tight">{stringValue}</span>
        );
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary">Přehled objednávek</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {hasActiveFilters ? (
                <>Zobrazeno: {filteredOrders.length} z {orders.length} objednávek • Sloupců: {visibleColumns.length}</>
              ) : (
                <>Celkem: {orders.length} objednávek • Sloupců: {visibleColumns.length}</>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                <FilterX className="w-4 h-4 mr-2" />
                Vymazat filtry
              </Button>
            )}
            <ColumnManager columns={columns} onColumnsChange={setColumns} />
          </div>
        </div>

        {/* Search and Date Range */}
        <SearchAndFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          filteredCount={filteredOrders.length}
          totalCount={orders.length}
        />

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full" style={{ minWidth: `${visibleColumns.length * 180}px` }}>
                <thead>
                  {/* Column Headers */}
                   <tr className="bg-secondary">
                     {visibleColumns.map((column) => (
                       <th 
                         key={column.key}
                         className="text-left p-4 font-semibold text-secondary-foreground border-r border-border last:border-r-0 relative"
                          style={{ 
                            minWidth: column.width,
                            width: column.width
                          }}
                       >
                         {column.label}
                         <div 
                           className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/20 active:bg-primary/40"
                           onMouseDown={(e) => handleMouseDown(e, column.key)}
                         />
                       </th>
                     ))}
                   </tr>
                  {/* Column Filters */}
                  <tr className="bg-muted/50">
                    {visibleColumns.map((column) => (
                      <th 
                        key={`filter-${column.key}`}
                        className="p-2 border-r border-border last:border-r-0"
                         style={{ 
                           minWidth: column.width,
                           width: column.width
                         }}
                      >
                        {renderColumnFilter(column)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <React.Fragment key={order.Order_ID}>
                      <tr className="border-b hover:bg-muted/50 transition-colors">
                        {visibleColumns.map((column) => (
                          <td 
                            key={`${order.Order_ID}-${column.key}`} 
                            className="p-4 align-top"
                             style={{ 
                               minWidth: column.width,
                               width: column.width
                             }}
                          >
                            {renderCellContent(order, column)}
                          </td>
                        ))}
                      </tr>
                      
                      {/* Enhanced ERP-style Detail View */}
                      {expandedOrder === order.Order_ID && (
                        <tr>
                          <td colSpan={visibleColumns.length} className="p-0">
                            <div className="bg-muted/30 p-6 border-t">
                              <OrderDetailTabs 
                                order={order} 
                                onEdit={(field, value) => handleEdit(order.Order_ID, field, value)}
                                onUpdateItemStatus={handleUpdateItemStatus}
                                onRefundItem={handleRefundItem}
                              />
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan={visibleColumns.length} className="p-8 text-center">
                        <div className="text-muted-foreground">
                          {hasActiveFilters ? (
                            <>
                              <p className="text-lg font-medium mb-2">Žádné výsledky</p>
                              <p className="text-sm">Zkuste upravit filtry nebo vyhledávací termín</p>
                            </>
                          ) : (
                            <p>Žádné objednávky k zobrazení</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Confirmation Dialog */}
        <AlertDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Potvrzení akce</AlertDialogTitle>
              <AlertDialogDescription>
                Opravdu chcete provést tuto akci?
                {confirmAction && (
                  <div className="mt-2 font-medium">
                    {confirmAction.action} pro objednávku {confirmAction.orderId}
                  </div>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Zrušit</AlertDialogCancel>
              <AlertDialogAction onClick={confirmAndExecuteAction}>
                Pokračovat
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
};