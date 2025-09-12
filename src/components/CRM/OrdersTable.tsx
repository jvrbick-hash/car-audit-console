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
import { Order, Column, defaultColumns } from '@/types/orders';

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
    'Report link': 'https://reports.caraudit.cz/report/ORD001',
    DIČ: 'CZ8855123456',
    Měna: 'CZK',
    VIN: 'TMBJF71V8C6123456',
    'Poloha inzerátu': 'Praha 5',
    'Poznámka zákazníka': 'Rychlé zpracování prosím',
    'Číslo dokladu': 'DOK001',
    'Slevový kód': 'SLEVA10',
    'Poznámka interní': 'VIP zákazník'
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
    'Datum objednávky': '2024-01-16',
    'Stav platby': 'Nezaplaceno',
    'Stav objednávky': 'Čeká na platbu',
    'Variabilní symbol': '2024010002',
    Výrobce: 'Volkswagen',
    Model: 'Golf',
    'Adresa inzerátu': 'Brno - Královo Pole',
    'Odkaz inzerátu': 'https://autobazar.eu/inzerat/123457',
    'Typ produktu': 'CarAudit Premium',
    'Report link': '',
    DIČ: '',
    Měna: 'CZK',
    VIN: '1VWBP7A39CC123457',
    'Poloha inzerátu': 'Brno',
    'Poznámka zákazníka': '',
    'Číslo dokladu': 'DOK002',
    'Slevový kód': '',
    'Poznámka interní': 'Čeká na platbu'
  },
  {
    Order_ID: 'ORD003',
    Jméno: 'Martin',
    Příjmení: 'Procházka',
    Email: 'martin.prochazka@email.cz',
    'Telefonní číslo': '+420 555 123 456',
    Adresa: 'Hlavní třída 89, Ostrava',
    PSČ: '70200',
    Město: 'Ostrava',
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
    'Report link': '',
    DIČ: 'CZ7712345678',
    Měna: 'CZK',
    VIN: 'WBA3B1G59DN123458',
    'Poloha inzerátu': 'Ostrava',
    'Poznámka zákazníka': 'Kontrola před koupí',
    'Číslo dokladu': 'DOK003',
    'Slevový kód': 'BMW20',
    'Poznámka interní': 'Pravidelný zákazník'
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
          ? { ...col, width: `${newWidth}px` }
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
    const value = order[column.key];
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
                           width: column.key === 'Email' || column.key === 'Adresa' ? 'auto' : column.width
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
                          width: column.key === 'Email' || column.key === 'Adresa' ? 'auto' : column.width
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
                              width: column.key === 'Email' || column.key === 'Adresa' ? 'auto' : column.width,
                              maxWidth: column.key === 'Email' ? '250px' : column.key === 'Adresa' ? '300px' : 'none'
                            }}
                          >
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
                                      <p className="text-sm break-words">{order['Adresa inzerátu']}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">Odkaz inzerátu</label>
                                      <a href={order['Odkaz inzerátu']} target="_blank" rel="noopener noreferrer" 
                                         className="text-sm text-accent hover:underline block break-all">
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
                                           className="text-sm text-accent hover:underline block break-all">
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
                                      variant="secondary" 
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
                                      variant="secondary" 
                                      size="sm" 
                                      className="w-full justify-start"
                                      onClick={() => handleAction('Odeslat všechny emaily', order.Order_ID)}
                                    >
                                      <RefreshCw className="w-4 h-4 mr-2" />
                                      Odeslat všechny emaily
                                    </Button>

                                    <Button 
                                      variant="default" 
                                      size="sm" 
                                      className="w-full justify-start"
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