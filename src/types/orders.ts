export interface Order {
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

export interface Column {
  key: keyof Order;
  label: string;
  visible: boolean;
  editable: boolean;
  width?: string;
  type: 'text' | 'number' | 'date' | 'status' | 'currency' | 'link';
}

export const defaultColumns: Column[] = [
  { key: 'Order_ID', label: 'Order ID', visible: true, editable: false, width: '120px', type: 'text' },
  { key: 'Jméno', label: 'Jméno', visible: true, editable: false, width: '100px', type: 'text' },
  { key: 'Příjmení', label: 'Příjmení', visible: true, editable: false, width: '120px', type: 'text' },
  { key: 'Email', label: 'Email', visible: true, editable: false, width: '250px', type: 'text' },
  { key: 'Telefonní číslo', label: 'Telefon', visible: true, editable: true, width: '140px', type: 'text' },
  { key: 'Adresa', label: 'Adresa', visible: true, editable: true, width: '300px', type: 'text' },
  { key: 'Hodnota objednávky', label: 'Hodnota', visible: true, editable: false, width: '120px', type: 'currency' },
  { key: 'Datum objednávky', label: 'Datum', visible: true, editable: false, width: '120px', type: 'date' },
  { key: 'Stav platby', label: 'Stav platby', visible: true, editable: false, width: '140px', type: 'status' },
  { key: 'Stav objednávky', label: 'Stav objednávky', visible: true, editable: false, width: '140px', type: 'status' },
  // Additional columns that can be added
  { key: 'Variabilní symbol', label: 'Variabilní symbol', visible: false, editable: false, width: '140px', type: 'text' },
  { key: 'Výrobce', label: 'Výrobce', visible: false, editable: false, width: '100px', type: 'text' },
  { key: 'Model', label: 'Model', visible: false, editable: false, width: '120px', type: 'text' },
  { key: 'Typ produktu', label: 'Typ produktu', visible: false, editable: false, width: '160px', type: 'text' },
];