import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { EditableField } from './EditableField';
import { OrderItems } from './OrderItems';
import { RowStatusIndicator } from './RowStatusIndicator';
import { Order, defaultColumns, ItemStatus } from '@/types/orders';
import {
  User,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Package,
  FileText,
  Calendar,
  DollarSign,
  Car,
  Link as LinkIcon,
  MessageSquare,
  Building,
  Hash,
  Clock,
  Activity,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Users,
  Trash2
} from 'lucide-react';

interface OrderDetailTabsProps {
  order: Order;
  onEdit: (field: string, value: string) => void;
  onUpdateItemStatus?: (itemId: string, status: ItemStatus) => void;
  onRefundItem?: (itemId: string, amount: number) => void;
}

export function OrderDetailTabs({ order, onEdit, onUpdateItemStatus = () => {}, onRefundItem = () => {} }: OrderDetailTabsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [selectedQueryType, setSelectedQueryType] = useState('general');
  // Get editable fields from column configuration
  const editableFields = defaultColumns
    .filter(col => col.editable)
    .map(col => col.key);

  const isFieldEditable = (field: keyof Order) => {
    return editableFields.includes(field);
  };

  const handleFieldSave = (field: keyof Order) => (value: string) => {
    onEdit(field, value);
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'Zaplaceno':
        return <Badge variant="default" className="bg-success text-success-foreground"><CheckCircle2 className="h-3 w-3 mr-1" />Zaplaceno</Badge>;
      case 'Nezaplaceno':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Nezaplaceno</Badge>;
      case 'Částečně zaplaceno':
        return <Badge variant="secondary"><AlertCircle className="h-3 w-3 mr-1" />Částečně zaplaceno</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'Caraudit hotový':
        return <Badge variant="default" className="bg-success text-success-foreground"><CheckCircle2 className="h-3 w-3 mr-1" />Caraudit hotový</Badge>;
      case 'Prohlídka v procesu':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Prohlídka v procesu</Badge>;
      case 'Technik je na cestě':
        return <Badge variant="secondary" className="bg-warning text-warning-foreground"><AlertCircle className="h-3 w-3 mr-1" />Technik je na cestě</Badge>;
      case 'Technik přiřazen':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800"><AlertCircle className="h-3 w-3 mr-1" />Technik přiřazen</Badge>;
      case 'Auto není dostupné - vratka':
      case 'Auto není dostupné - nevratka':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />{status}</Badge>;
      case 'Vrácené peníze':
        return <Badge variant="outline"><XCircle className="h-3 w-3 mr-1" />Vrácené peníze</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getOrderProgress = () => {
    switch (order['Stav objednávky']) {
      case 'Hotová': return 100;
      case 'V procesu': return 60;
      case 'New': return 20;
      default: return 0;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Order Summary Header */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Hash className="h-5 w-5 text-primary" />
                Objednávka {order.Order_ID}
                <RowStatusIndicator order={order} className="ml-2" />
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Vytvořeno {new Date(order['Datum objednávky']).toLocaleDateString('cs-CZ')}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {order['Hodnota objednávky'].toLocaleString()} Kč
              </div>
              <div className="flex gap-2 mt-2">
                {getPaymentStatusBadge(order['Stav platby'])}
                {getOrderStatusBadge(order['Stav objednávky'])}
              </div>
               <div className="flex gap-3 mt-4 flex-wrap">
                <Button variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Odeslat všechny emaily
                </Button>
                <Button
                  variant="default" 
                  size="default" 
                  className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[140px] shadow-md"
                  onClick={() => {
                    console.log('📊 Report button clicked');
                    // TODO: Implement report sending logic
                  }}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Odeslat report
                </Button>
                <Button 
                  variant="secondary" 
                  size="default" 
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/80 min-w-[140px] shadow-md"
                  onClick={() => {
                    console.log('🧾 Tax document button clicked');
                    // TODO: Implement tax document sending logic
                  }}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Odeslat daňový doklad
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Single Consolidated View */}
      <div className="space-y-6">
        {/* Upper Row - Customer Info & Product Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Customer Information */}
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Zákaznické údaje
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <EditableField
                  label="Jméno"
                  value={order.Jméno}
                  isEditable={isFieldEditable('Jméno')}
                  onSave={handleFieldSave('Jméno')}
                  icon={<User className="h-4 w-4" />}
                />
                <EditableField
                  label="Příjmení"
                  value={order.Příjmení}
                  isEditable={isFieldEditable('Příjmení')}
                  onSave={handleFieldSave('Příjmení')}
                  icon={<User className="h-4 w-4" />}
                />
                <EditableField
                  label="Email"
                  value={order.Email}
                  isEditable={isFieldEditable('Email')}
                  type="email"
                  onSave={handleFieldSave('Email')}
                  icon={<Mail className="h-4 w-4" />}
                />
                <EditableField
                  label="Telefonní číslo"
                  value={order['Telefonní číslo']}
                  isEditable={isFieldEditable('Telefonní číslo')}
                  type="tel"
                  onSave={handleFieldSave('Telefonní číslo')}
                  icon={<Phone className="h-4 w-4" />}
                />
                <div className="md:col-span-2">
                  <EditableField
                    label="Adresa"
                    value={order.Adresa}
                    isEditable={isFieldEditable('Adresa')}
                    type="textarea"
                    onSave={handleFieldSave('Adresa')}
                    icon={<MapPin className="h-4 w-4" />}
                  />
                </div>
              </div>

              {/* Company Information */}
              <div>
                <Separator />
                <div className="py-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Firemní údaje
                  </h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    <EditableField
                      label="IČ"
                      value={order.IČ || ''}
                      isEditable={true}
                      onSave={handleFieldSave('IČ')}
                      icon={<Building className="h-4 w-4" />}
                    />
                    <EditableField
                      label="DIČ"
                      value={order.DIČ}
                      isEditable={true}
                      onSave={handleFieldSave('DIČ')}
                      icon={<Building className="h-4 w-4" />}
                    />
                    <EditableField
                      label="Ulice a číslo"
                      value={order['Ulice a číslo'] || ''}
                      isEditable={true}
                      onSave={handleFieldSave('Ulice a číslo')}
                      icon={<MapPin className="h-4 w-4" />}
                    />
                    <EditableField
                      label="Město"
                      value={order.Město}
                      isEditable={true}
                      onSave={handleFieldSave('Město')}
                      icon={<MapPin className="h-4 w-4" />}
                    />
                    <EditableField
                      label="PSČ"
                      value={order.PSČ}
                      isEditable={true}
                      onSave={handleFieldSave('PSČ')}
                      icon={<MapPin className="h-4 w-4" />}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Information */}
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5 text-primary" />
                Informace o produktu
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <EditableField
                label="Výrobce"
                value={order.Výrobce}
                isEditable={isFieldEditable('Výrobce')}
                onSave={handleFieldSave('Výrobce')}
                icon={<Building className="h-4 w-4" />}
              />
              <EditableField
                label="Model"
                value={order.Model}
                isEditable={isFieldEditable('Model')}
                onSave={handleFieldSave('Model')}
                icon={<Car className="h-4 w-4" />}
              />
              <EditableField
                label="VIN"
                value={order.VIN}
                isEditable={isFieldEditable('VIN')}
                onSave={handleFieldSave('VIN')}
                icon={<Hash className="h-4 w-4" />}
              />
              <EditableField
                label="Poloha inzerátu"
                value={order['Poloha inzerátu']}
                isEditable={isFieldEditable('Poloha inzerátu')}
                onSave={handleFieldSave('Poloha inzerátu')}
                icon={<MapPin className="h-4 w-4" />}
              />
              <EditableField
                label="Odkaz na report"
                value={order['Report link'] || ''}
                isEditable={isFieldEditable('Report link')}
                onSave={handleFieldSave('Report link')}
                icon={<FileText className="h-4 w-4" />}
              />
              <EditableField
                label="Odkaz inzerátu"
                value={order['Odkaz inzerátu']}
                isEditable={isFieldEditable('Odkaz inzerátu')}
                onSave={handleFieldSave('Odkaz inzerátu')}
                icon={<LinkIcon className="h-4 w-4" />}
              />
              
              {/* Order Items within Product Information */}
              <div className="md:col-span-2 mt-4">
                <div className="border-t pt-4">
                  <OrderItems 
                    items={order.items}
                    onUpdateItemStatus={onUpdateItemStatus}
                    onRefundItem={onRefundItem}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lower Row - Order Details & Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Order Details */}
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Detaily objednávky
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <EditableField
                label="Datum objednávky"
                value={new Date(order['Datum objednávky']).toLocaleString('cs-CZ')}
                isEditable={false}
                icon={<Calendar className="h-4 w-4" />}
              />
              <EditableField
                label="Hodnota objednávky"
                value={`${order['Hodnota objednávky'].toLocaleString()} Kč`}
                isEditable={false}
                icon={<DollarSign className="h-4 w-4" />}
              />
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Číslo dokladu
                </div>
                <div className="p-3 rounded-md border bg-card">
                  {(() => {
                    console.log('Order data:', order);
                    console.log('Document number value:', order['Číslo dokladu']);
                    console.log('Document number type:', typeof order['Číslo dokladu']);
                    console.log('Document number truthy:', !!order['Číslo dokladu']);
                    return null;
                  })()}
                  {order['Číslo dokladu'] ? (
                    <div className="flex items-center gap-2">
                      <a
                        href={`/invoices/${order['Číslo dokladu']}.pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
                      >
                        📄 {order['Číslo dokladu']} (PDF)
                      </a>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Nevyplněno</span>
                  )}
                </div>
              </div>
              <EditableField
                label="Měna"
                value={order.Měna}
                isEditable={isFieldEditable('Měna')}
                onSave={handleFieldSave('Měna')}
                icon={<DollarSign className="h-4 w-4" />}
              />
              <EditableField
                label="Slevový kód"
                value={order['Slevový kód']}
                isEditable={isFieldEditable('Slevový kód')}
                onSave={handleFieldSave('Slevový kód')}
                icon={<FileText className="h-4 w-4" />}
              />
              
              {/* Status fields moved to bottom */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Stav platby
                </div>
                <div className="flex items-center gap-2">
                  {getPaymentStatusBadge(order['Stav platby'])}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Stav objednávky
                </div>
                <div className="flex items-center gap-2">
                  {getOrderStatusBadge(order['Stav objednávky'])}
                </div>
              </div>
              
              {/* Historie změn */}
              {order.statusHistory && order.statusHistory.length > 0 && (
                <div className="md:col-span-2 mt-4">
                  <div className="border-t pt-4 flex flex-col h-full">
                    <div className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-3">
                      <Activity className="h-4 w-4" />
                      Historie změn
                    </div>
                    <div className="space-y-2 flex-1 max-h-96 overflow-y-auto bg-muted/30 rounded-md p-2">
                      {order.statusHistory.map((entry, index) => (
                        <div key={index} className="flex items-start gap-2 text-xs">
                          <div className="w-2 h-2 bg-primary/60 rounded-full mt-1.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline" className="text-xs px-1 py-0.5 h-auto">
                                {entry.status}
                              </Badge>
                              <span className="text-muted-foreground">
                                {new Date(entry.timestamp).toLocaleString('cs-CZ')}
                              </span>
                            </div>
                            {entry.note && (
                              <p className="text-muted-foreground mt-1">{entry.note}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Poznámky
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <EditableField
                label="Poznámka zákazníka"
                value={order['Poznámka zákazníka']}
                isEditable={isFieldEditable('Poznámka zákazníka')}
                type="textarea"
                onSave={handleFieldSave('Poznámka zákazníka')}
                icon={<MessageSquare className="h-4 w-4" />}
              />
              
              {/* Query Type Selection */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Typ dotazu
                </div>
                <Select 
                  value={order.queryType || "general"} 
                  onValueChange={(value) => handleFieldSave('queryType')(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Vyberte typ dotazu" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="billing">Fakturace</SelectItem>
                    <SelectItem value="technical">Technický problém</SelectItem>
                    <SelectItem value="complaint">Reklamace</SelectItem>
                    <SelectItem value="general">Obecný dotaz</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Internal Note with Add Note functionality */}
              <div className="space-y-3">
                <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Interní poznámka
                </div>
                
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full sm:w-auto">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Přidat poznámku
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Přidat interní poznámku</DialogTitle>
                      <DialogDescription>
                        Napište poznámku pro interní potřeby týmu. Tato poznámka nebude viditelná pro zákazníka.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Typ dotazu</label>
                        <Select value={selectedQueryType} onValueChange={setSelectedQueryType}>
                          <SelectTrigger>
                            <SelectValue placeholder="Vyberte typ dotazu" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="billing">Fakturace</SelectItem>
                            <SelectItem value="technical">Technický problém</SelectItem>
                            <SelectItem value="complaint">Reklamace</SelectItem>
                            <SelectItem value="general">Obecný dotaz</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Poznámka</label>
                        <Textarea
                          placeholder="Napište svou interní poznámku zde..."
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          className="min-h-[120px] resize-none"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsDialogOpen(false);
                            setNewNote('');
                            setSelectedQueryType('general');
                          }}
                        >
                          Zrušit
                        </Button>
                        <Button
                          onClick={() => {
                            if (!newNote.trim()) {
                              toast({
                                title: "Chyba",
                                description: "Poznámka nemůže být prázdná",
                                variant: "destructive"
                              });
                              return;
                            }
                            
                            const noteEntry = {
                              id: Date.now().toString(),
                              userName: 'Support Agent',
                              timestamp: new Date().toISOString(),
                              text: newNote.trim(),
                              queryType: selectedQueryType
                            };
                            
                            // Update the order object directly (in a real app, this would update the database)
                            order.internalNoteHistory = [noteEntry, ...(order.internalNoteHistory || [])];
                            
                            // Clear form and close dialog
                            setNewNote('');
                            setSelectedQueryType('general');
                            setIsDialogOpen(false);
                            
                            // Force a re-render by updating a field
                            handleFieldSave('Poznámka interní')(order['Poznámka interní'] || '');
                            
                            toast({
                              title: "Úspěch",
                              description: "Poznámka byla úspěšně přidána"
                            });
                          }}
                          disabled={!newNote.trim()}
                        >
                          Uložit poznámku
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <Separator />

              {/* Notes History */}
              <div className="space-y-3">
                <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Historie poznámek
                </div>
                {!order.internalNoteHistory || order.internalNoteHistory.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Zatím nebyly přidány žádné poznámky</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-4">
                      {order.internalNoteHistory.map((note, index) => (
                        <div 
                          key={note.id}
                          className="border border-border rounded-lg p-4 bg-card/50"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Users className="h-3 w-3" />
                              <span className="font-medium">{note.userName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>
                                   {new Date(note.timestamp).toLocaleString('cs-CZ', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false
                                   })}
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  // Remove the note from history
                                  order.internalNoteHistory = order.internalNoteHistory?.filter(n => n.id !== note.id) || [];
                                  // Force a re-render
                                  handleFieldSave('Poznámka interní')(order['Poznámka interní'] || '');
                                }}
                                className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="mb-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
                              {note.queryType}
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed">{note.text}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
}