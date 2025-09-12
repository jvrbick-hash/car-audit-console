export interface Order {
  Order_ID: string;
  Jméno: string;
  Příjmení: string;
  Email: string;
  'Telefonní číslo': string;
  Adresa: string;
  PSČ: string;
  Město: string;
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
  DIČ: string;
  Měna: string;
  VIN: string;
  'Poloha inzerátu': string;
  'Poznámka zákazníka': string;
  'Číslo dokladu': string;
  'Slevový kód': string;
  'Poznámka interní': string;
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
  { key: 'Email', label: 'Email', visible: true, editable: true, width: '250px', type: 'text' },
  { key: 'Telefonní číslo', label: 'Telefon', visible: true, editable: true, width: '140px', type: 'text' },
  { key: 'Adresa', label: 'Adresa', visible: true, editable: true, width: '300px', type: 'text' },
  { key: 'Hodnota objednávky', label: 'Hodnota', visible: true, editable: false, width: '120px', type: 'currency' },
  { key: 'Datum objednávky', label: 'Datum', visible: true, editable: false, width: '120px', type: 'date' },
  { key: 'Stav platby', label: 'Stav platby', visible: true, editable: false, width: '140px', type: 'status' },
  { key: 'Stav objednávky', label: 'Stav objednávky', visible: true, editable: false, width: '140px', type: 'status' },
  // Additional columns that can be added
  { key: 'PSČ', label: 'PSČ', visible: false, editable: true, width: '100px', type: 'text' },
  { key: 'Město', label: 'Město', visible: false, editable: true, width: '120px', type: 'text' },
  { key: 'Variabilní symbol', label: 'Variabilní symbol', visible: false, editable: false, width: '140px', type: 'text' },
  { key: 'Výrobce', label: 'Výrobce', visible: false, editable: false, width: '100px', type: 'text' },
  { key: 'Model', label: 'Model', visible: false, editable: false, width: '120px', type: 'text' },
  { key: 'Typ produktu', label: 'Typ produktu', visible: false, editable: false, width: '160px', type: 'text' },
  { key: 'DIČ', label: 'DIČ', visible: false, editable: true, width: '120px', type: 'text' },
  { key: 'Měna', label: 'Měna', visible: false, editable: true, width: '80px', type: 'text' },
  { key: 'VIN', label: 'VIN', visible: false, editable: true, width: '180px', type: 'text' },
  { key: 'Poloha inzerátu', label: 'Poloha inzerátu', visible: false, editable: true, width: '140px', type: 'text' },
  { key: 'Poznámka zákazníka', label: 'Poznámka zákazníka', visible: false, editable: true, width: '200px', type: 'text' },
  { key: 'Číslo dokladu', label: 'Číslo dokladu', visible: false, editable: true, width: '120px', type: 'text' },
  { key: 'Slevový kód', label: 'Slevový kód', visible: false, editable: true, width: '120px', type: 'text' },
  { key: 'Poznámka interní', label: 'Poznámka interní', visible: false, editable: true, width: '200px', type: 'text' },
];