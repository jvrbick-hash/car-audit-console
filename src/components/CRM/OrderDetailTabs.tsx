import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { EditableField } from './EditableField';
import { Order, defaultColumns } from '@/types/orders';
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
  CheckCircle2,
  AlertCircle,
  XCircle
} from 'lucide-react';

interface OrderDetailTabsProps {
  order: Order;
  onEdit: (field: string, value: string) => void;
}

export function OrderDetailTabs({ order, onEdit }: OrderDetailTabsProps) {
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
      case 'Dokončeno':
        return <Badge variant="default" className="bg-success text-success-foreground"><CheckCircle2 className="h-3 w-3 mr-1" />Dokončeno</Badge>;
      case 'Zpracovává se':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Zpracovává se</Badge>;
      case 'Čeká na platbu':
        return <Badge variant="secondary" className="bg-warning text-warning-foreground"><AlertCircle className="h-3 w-3 mr-1" />Čeká na platbu</Badge>;
      case 'Zrušeno':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Zrušeno</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getOrderProgress = () => {
    switch (order['Stav objednávky']) {
      case 'Dokončeno': return 100;
      case 'Zpracovává se': return 60;
      case 'Čeká na platbu': return 30;
      case 'Zrušeno': return 0;
      default: return 0;
    }
  };

  return (
    <div className="space-y-6">
      {/* Order Summary Header */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Hash className="h-5 w-5 text-primary" />
                Objednávka {order.Order_ID}
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
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Průběh objednávky</span>
              <span className="text-sm font-medium">{getOrderProgress()}%</span>
            </div>
            <Progress value={getOrderProgress()} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Single Consolidated View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Zákaznické údaje
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <EditableField
                label="PSČ"
                value={order.PSČ}
                isEditable={isFieldEditable('PSČ')}
                onSave={handleFieldSave('PSČ')}
                icon={<MapPin className="h-4 w-4" />}
              />
              <EditableField
                label="Město"
                value={order.Město}
                isEditable={isFieldEditable('Město')}
                onSave={handleFieldSave('Město')}
                icon={<MapPin className="h-4 w-4" />}
              />
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Detaily objednávky
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <EditableField
                label="Variabilní symbol"
                value={order['Variabilní symbol']}
                isEditable={isFieldEditable('Variabilní symbol')}
                onSave={handleFieldSave('Variabilní symbol')}
                icon={<Hash className="h-4 w-4" />}
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
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Product Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5 text-primary" />
                Informace o produktu
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                label="Typ produktu"
                value={order['Typ produktu']}
                isEditable={isFieldEditable('Typ produktu')}
                onSave={handleFieldSave('Typ produktu')}
                icon={<Package className="h-4 w-4" />}
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
                label="DIČ"
                value={order.DIČ}
                isEditable={isFieldEditable('DIČ')}
                onSave={handleFieldSave('DIČ')}
                icon={<Building className="h-4 w-4" />}
              />
            </CardContent>
          </Card>

          {/* Payment Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Stav platby a objednávky
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Full Width Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Notes */}
        <Card>
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
            <EditableField
              label="Poznámka interní"
              value={order['Poznámka interní']}
              isEditable={isFieldEditable('Poznámka interní')}
              type="textarea"
              onSave={handleFieldSave('Poznámka interní')}
              icon={<MessageSquare className="h-4 w-4" />}
            />
          </CardContent>
        </Card>

        {/* Links and Additional Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5 text-primary" />
              Odkazy a dodatečné informace
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <EditableField
              label="Adresa inzerátu"
              value={order['Adresa inzerátu']}
              isEditable={isFieldEditable('Adresa inzerátu')}
              type="textarea"
              onSave={handleFieldSave('Adresa inzerátu')}
              icon={<MapPin className="h-4 w-4" />}
            />
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                Odkaz inzerátu
              </div>
              <div className="p-3 rounded-md border bg-card">
                {order['Odkaz inzerátu'] ? (
                  <a
                    href={order['Odkaz inzerátu']}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline break-all"
                  >
                    {order['Odkaz inzerátu']}
                  </a>
                ) : (
                  <span className="text-sm text-muted-foreground">Nevyplněno</span>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Report link
              </div>
              <div className="p-3 rounded-md border bg-card">
                {order['Report link'] ? (
                  <a
                    href={order['Report link']}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline break-all"
                  >
                    {order['Report link']}
                  </a>
                ) : (
                  <span className="text-sm text-muted-foreground">Nevyplněno</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}