# Kompletní dokumentace chování CRM aplikace CarAudit

## 1. Přehled aplikace

### 1.1 Účel a funkce
CRM aplikace CarAudit je komplexní systém pro správu objednávek automobilových kontrol. Aplikace slouží k:
- Správě zákaznických dat a objednávek
- Sledování stavu plateb a zpracování objednávek
- Interní komunikaci týmu prostřednictvím systému poznámek
- Kontrole kvality dat a synchronizace s externími systémy

### 1.2 Technické specifikace
- **Frontend:** React 18.3.1 s TypeScript
- **UI Framework:** shadcn/ui komponenty s Tailwind CSS
- **Routing:** React Router DOM
- **Správa stavu:** React hooks (useState, useMemo)
- **Responsivní design:** Mobilní první přístup

## 2. Struktura aplikace

### 2.1 Hlavní komponenty
- **App.tsx:** Root komponenta s routingem
- **Index.tsx:** Hlavní stránka s Header a OrdersTable
- **Header:** Navigační lišta s logem a datumem
- **OrdersTable:** Hlavní tabulka s daty a funkcionalitou
- **OrderDetailTabs:** Rozbalený detail objednávky
- **Systém poznámek:** Interní komunikace týmu

## 3. Header komponenta

### 3.1 Struktura a zobrazení
**Umístění:** Horní část aplikace, fixní pozice
**Obsah:**
- Logo CarAudit (levá strana)
- Název aplikace "CarAudit CRM" a podtitul "Správa objednávek"
- Označení "Admin Panel" s aktuálním českým datem (pravá strana)

### 3.2 Očekávané chování
- **Responsivní:** Na mobilních zařízeních se skrývají textové prvky
- **Datum:** Automaticky aktualizované v českém formátu (pondělí, 23. září 2024)
- **Logo:** Zobrazuje se z uploadovaného souboru v projektových složkách

## 4. Hlavní tabulka objednávek (OrdersTable)

### 4.1 Základní funkce
**Zobrazení dat:**
- Tabulkový formát s konfigurovatelými sloupci
- Výchozích 11 viditelných sloupců z celkem 25 dostupných
- Možnost přizpůsobení šířky sloupců přetažením

### 4.2 Vyhledávání a filtrování

#### 4.2.1 Globální vyhledávání
- **Funkce:** Prohledává všechny viditelné sloupce současně
- **Chování:** Živé vyhledávání (bez potřeby stisknutí Enter)
- **Umístění:** V horní části nad tabulkou

#### 4.2.2 Sloupcové vyhledávání
- **Funkce:** Specifické vyhledávání pro každý sloupec
- **Placeholder:** "Hledat [název sloupce]..."
- **Chování:** Živé filtrování s debouncing
- **Umístění:** Pod záhlavím každého sloupce

#### 4.2.3 Excel filtry
**Dostupné pro sloupce:**
- Poznámka (Ano/Ne)
- Stav platby (Zaplaceno, Nezaplaceno, Vráceno, Částečně vráceno)
- Stav objednávky (New, V procesu, Hotová)
- Měna (CZK)

**Funkcionalita:**
- Dropdown s unikátními hodnotami ze sloupce
- Vyhledávání v seznamu hodnot
- Možnost vybrat více hodnot současně
- "Vybrat vše" / "Odznačit vše" funkcionalita
- Počítadlo vybraných hodnot

#### 4.2.4 Datumový filtr
- **Typ:** Kalendářový výběr rozsahu dat
- **Formát:** dd.mm.yyyy - dd.mm.yyyy
- **Chování:** Filtruje podle sloupce "Datum objednávky"
- **Reset:** Tlačítko X pro rychlé vymazání

### 4.3 Správa sloupců (ColumnSelector)

#### 4.3.1 Funkcionalität
- **Přístup:** Tlačítko "Sloupce (8/25)" v horní liště
- **Zobrazení:** Popup s checkboxy pro všech 25 sloupců
- **Počítadlo:** Dynamické zobrazení počtu aktivních sloupců
- **Reset:** Tlačítko "Výchozí zobrazení" pro návrat k defaultnímu nastavení

#### 4.3.2 Dostupné sloupce
**Základní (výchozí viditelné):**
- Order ID, Stav synchronizace, Jméno, Příjmení, Email, Telefon, Adresa
- Hodnota objednávky, Datum objednávky, Stav platby, Stav objednávky, Poznámka

**Rozšířené (výchozí skryté):**
- PSČ, Město, Variabilní symbol, Výrobce, Model, DIČ, IČ
- Ulice a číslo, Měna, VIN, Poloha inzerátu, Poznámka zákazníka
- Číslo dokladu, Slevový kód, Poznámka interní

### 4.4 Inline editace

#### 4.4.1 Editovatelná pole
- Email, Telefonní číslo, Adresa, Poznámka interní

#### 4.4.2 Aktivace editace
- **Klik:** Na ikonu tužky vedle textu
- **Chování:** Pole se změní na input s fokusem
- **Uložení:** Enter klávesa nebo ztráta fokusu (blur)
- **Zrušení:** Escape klávesa

#### 4.4.3 Validace a zpětná vazba
- **Toast notifikace:** "Úprava uložena" při úspěšném uložení
- **Vizuální indikace:** Editovatelná pole mají ikonu tužky

### 4.5 Indikátory stavu synchronizace

#### 4.5.1 Barevné indikátory
- **Zelená:** Všechna data synchronizována bez problémů
- **Červená:** Nalezeny chyby v datech nebo chybějící informace

#### 4.5.2 Kontrolované podmínky
**Chybějící kritická data:**
- Report link u dokončených objednávek
- Číslo dokladu u zaplacených objednávek

**Neplatné formáty:**
- Email bez @ znaku
- Telefonní číslo kratší než 9 znaků
- VIN kratší než 10 znaků

**Nekonzistentní data:**
- Rozpor mezi hodnotou objednávky a součtem položek
- Neúplné adresní údaje

### 4.6 Rozbalení detailu objednávky

#### 4.6.1 Aktivace
- **Klik:** Na Order ID nebo šipku vedle něj
- **Chování:** Řádek se rozbalí pod aktuální objednávku
- **Toggle:** Opětovný klik sbalí detail

#### 4.6.2 Obsah detailu
Zobrazuje se komponenta OrderDetailTabs s kompletními informacemi

## 5. Detail objednávky (OrderDetailTabs)

### 5.1 Struktura záložek

#### 5.1.1 Základní informace
**Zákaznické údaje:**
- Editovatelná pole: Jméno, Příjmení, Email, Telefon
- Zobrazení: Adresa, PSČ, Město

**Objednávkové údaje:**
- Hodnota objednávky, Datum objednávky
- Stav platby, Stav objednávky
- Variabilní symbol

**Vozidlo:**
- Výrobce, Model, VIN
- Adresa inzerátu, Odkaz inzerátu

#### 5.1.2 Firemní údaje
- IČ, DIČ
- Ulice a číslo (fakturační adresa)
- Poznámka zákazníka, Slevový kód

#### 5.1.3 Historie změn
**Zobrazení:**
- Chronologický seznam stavů objednávky
- Časové razítko v českém formátu
- Poznámky k jednotlivým změnám

#### 5.1.4 Položky objednávky (OrderItems)
**Tabulka s produkty:**
- Název produktu a kód
- Množství a celková cena
- Stav položky (switch Vráceno/Nezaplaceno)

**Funkcionalita:**
- Přepínání stavu refundu přes Switch komponentu
- Automatický výpočet celkové sumy
- Zobrazení vrácených částek

#### 5.1.5 Akční tlačítka
- Email zákazníkovi
- Stáhnout report
- Daňový doklad
- Potvrzovací dialogy před spuštěním akcí

## 6. Systém poznámek (Customer Support Notepad)

### 6.1 Přehled funkcí
Interní komunikační systém pro zákaznickou podporu s možností kategorizace dotazů.

### 6.2 Pole poznámky zákazníka
- **Zobrazení:** Textarea s textem poznámky zákazníka
- **Chování:** Read-only, nelze editovat
- **Účel:** Zobrazení původní poznámky od zákazníka

### 6.3 Výběr typu dotazu
**Dostupné kategorie:**
- **Fakturace:** Pro dotazy ohledně plateb a účtování
- **Technický problém:** Pro technické problémy a chyby
- **Reklamace:** Pro stížnosti a reklamace
- **Obecný dotaz:** Pro ostatní komunikaci

### 6.4 Tlačítko "Přidat poznámku"

#### 6.4.1 Chování tlačítka
- **Stav:** Vždy aktivní (ne závislé na vyplnění textu)
- **Akce:** Otevře modální dialog
- **Vzhled:** Primární tlačítko s ikonou plus

#### 6.4.2 Modální dialog pro přidání poznámky

**Struktura dialogu:**
- **Nadpis:** "Přidat interní poznámku"
- **Výběr typu:** Dropdown s kategoriemi dotazů
- **Text poznámky:** Textarea pro zadání textu
- **Tlačítka:** "Zrušit" a "Uložit poznámku"

**Validace:**
- Typ dotazu musí být vybrán
- Text poznámky nesmí být prázdný
- Chybové toast notifikace při neplatných datech

**Po uložení:**
- Dialog se zavře
- Formulář se resetuje
- Úspěšná toast notifikace
- Poznámka se přidá do historie

### 6.5 Historie poznámek

#### 6.5.1 Zobrazení seznamu
**Struktura poznámky:**
- **Záhlaví:** Jméno uživatele a časové razítko
- **Typ dotazu:** Barevně odlišený badge
- **Text poznámky:** Úplný obsah
- **Akce:** Tlačítko koše pro smazání

#### 6.5.2 Prázdný stav
**Když nejsou poznámky:**
- Zobrazuje se zpráva "Zatím nejsou žádné interní poznámky"
- Popisný text motivující k přidání první poznámky

#### 6.5.3 Mazání poznámek
- **Aktivace:** Klik na ikonu koše
- **Potvrzení:** Potvrzovací dialog s varováním
- **Akce:** Trvalé odstranění poznámky
- **Zpětná vazba:** Toast notifikace o úspěšném smazání

### 6.6 Datová struktura poznámky
```typescript
{
  id: string;           // UUID
  userName: string;     // "Admin" nebo jméno uživatele
  timestamp: string;    // ISO string
  text: string;         // Obsah poznámky
  queryType: string;    // billing|technical|complaint|general
}
```

### 6.7 Typy dotazů a jejich význam
- **billing:** Problémy s fakturací, platbami, refundy
- **technical:** Technické problémy s aplikací nebo službami
- **complaint:** Reklamace a stížnosti zákazníků
- **general:** Obecné dotazy a komunikace

### 6.8 Barevné rozlišení typů dotazů
**Badge varianty podle typu:**
- **Fakturace:** Modrá (default variant)
- **Technický problém:** Oranžová (secondary variant)
- **Reklamace:** Červená (destructive variant)
- **Obecný dotaz:** Šedá (outline variant)

## 7. Responsivní chování

### 7.1 Desktop (1024px+)
- Plné zobrazení všech funkcí
- Tabulka s horizontálním scrollováním při více sloupcích
- Dvojsloupcové layouty v detailech objednávky

### 7.2 Tablet (768px - 1023px)
- Přizpůsobené rozložení sloupců
- Zachování všech funkcí
- Optimalizace pro dotykové ovládání

### 7.3 Mobilní (< 768px)
- Jednostloupcové layouty v detailech
- Skrytí méně důležitých informací v hlavičce
- Mobilně optimalizované ovládací prvky

## 8. Správa chyb a validace

### 8.1 Toast notifikace
**Typy zpráv:**
- **Úspěch:** Zelené pozadí pro úspěšné operace
- **Chyba:** Červené pozadí pro chyby a varování
- **Info:** Modré pozadí pro informativní zprávy

**Příklady zpráv:**
- "Úprava uložena" - po editaci pole
- "Sloupce obnoveny" - po resetu sloupců
- "Filtry vymazány" - po vymazání filtrů
- "Poznámka přidána" - po uložení poznámky
- "Poznámka smazána" - po odstranění poznámky
- "Prosím vyberte typ dotazu" - chyba validace
- "Prosím zadejte text poznámky" - chyba validace

### 8.2 Datová validace
- **Email:** Automatická kontrola přítomnosti @ znaku
- **Telefon:** Kontrola minimální délky (9 znaků)
- **VIN:** Kontrola minimální délky (10 znaků)
- **Povinná pole:** Vizuální indikace chybějících dat

### 8.3 Konzolové logování
Aplikace loguje důležité události do konzole:
- Synchronizační problémy s detaily
- Chyby validace dat
- Informace o stavu objednávek

## 9. Výkonnostní optimalizace

### 9.1 React optimalizace
- **useMemo:** Pro výpočetně náročné filtrování dat
- **React.Fragment:** Minimalizace DOM elementů
- **Lazy loading:** Postupné načítání komponent

### 9.2 Responsivní tabulka
- **Virtualizace:** Při velkém množství dat
- **Debouncing:** 300ms prodleva pro vyhledávání
- **Memoizace:** Cachování výsledků filtrů

## 10. Uživatelské workflow

### 10.1 Typické pracovní postupy
1. **Přehled objednávek:** Kontrola stavu synchronizace
2. **Filtrování:** Hledání specifických objednávek
3. **Detail objednávky:** Kontrola všech údajů
4. **Editace dat:** Oprava chybných informací
5. **Interní poznámky:** Komunikace v týmu
6. **Akce:** Odesílání emailů, generování dokumentů

### 10.2 Workflow pro poznámky
1. **Zobrazení detailu objednávky**
2. **Přečtení poznámky zákazníka** (pokud existuje)
3. **Výběr typu dotazu** podle charakteru problému
4. **Otevření dialogu** tlačítkem "Přidat poznámku"
5. **Vyplnění formuláře** (typ + text)
6. **Uložení poznámky** s validací
7. **Zobrazení v historii** s možností mazání

### 10.3 Integrace s CRM systémem
Aplikace slouží jako frontend pro širší CRM systém s možností:
- Synchronizace dat s externími API
- Generování reportů a dokumentů
- Komunikace se zákazníky
- Správa týmu a oprávnění

## 11. Konfigurace sloupců a jejich význam

### 11.1 Základní sloupce (vždy viditelné)
- **Order ID:** Jedinečný identifikátor objednávky
- **Stav synchronizace:** Vizuální indikátor kvality dat
- **Jméno, Příjmení:** Základní identifikace zákazníka
- **Email, Telefon:** Kontaktní údaje
- **Adresa:** Místo doručení/fakturace
- **Hodnota objednávky:** Celková suma
- **Datum objednávky:** Kdy byla objednávka vytvořena
- **Stav platby:** Platební status
- **Stav objednávky:** Průběh zpracování
- **Poznámka:** Indikátor přítomnosti poznámky

### 11.2 Rozšířené sloupce (volitelně viditelné)
- **PSČ, Město:** Doplňující adresní údaje
- **Variabilní symbol:** Pro párování plateb
- **Výrobce, Model, VIN:** Identifikace vozidla
- **DIČ, IČ:** Firemní údaje pro fakturaci
- **Měna:** Měna transakce
- **Poloha inzerátu:** Odkaz na původní inzerát
- **Poznámka zákazníka:** Původní text od zákazníka
- **Číslo dokladu:** Fakturační reference
- **Slevový kód:** Použité slevy
- **Poznámka interní:** Týmová komunikace

## 12. Stavové hodnoty a jejich význam

### 12.1 Stavy platby
- **Zaplaceno:** Platba byla přijata a zpracována
- **Nezaplaceno:** Čeká se na platbu
- **Vráceno:** Platba byla vrácena zákazníkovi
- **Částečně vráceno:** Část platby byla vrácena

### 12.2 Stavy objednávky
- **New:** Nová objednávka čekající na zpracování
- **V procesu:** Objednávka se zpracovává
- **Hotová:** Objednávka byla dokončena

### 12.3 Stavy položek objednávky
- **Active:** Standardní stav položky
- **Refunded:** Položka byla refundována

### 12.4 Stavy synchronizace
- **Synchronizováno (zelená):** Vše v pořádku
- **Chyba (červená):** Problémy s daty nebo chybějící informace

## 13. Klávesové zkratky

### 13.1 Editace polí
- **Enter:** Uložit změny
- **Escape:** Zrušit editaci
- **Tab:** Přejít na další editovatelné pole

### 13.2 Navigace v tabulce
- **Šipky:** Pohyb mezi buňkami
- **Page Up/Down:** Rychlé scrollování
- **Home/End:** Přechod na začátek/konec řádku

### 13.3 Dialogy a modály
- **Escape:** Zavřít dialog
- **Enter:** Potvrdit akci (pokud je tlačítko fokusované)

## 14. Lokalizace a formátování

### 14.1 Datum a čas
- **Formát:** České standardní formátování (dd.mm.yyyy)
- **Časové razítko:** Včetně hodin a minut
- **Relativní čas:** "před 2 hodinami", "včera"

### 14.2 Měna
- **Formát:** České koruny (CZK) s mezerami jako oddělovače tisíců
- **Zobrazení:** "25 000 CZK"

### 14.3 Texty rozhraní
- **Jazyk:** Čeština
- **Terminologie:** Jednotná napříč aplikací
- **Chybové zprávy:** V češtině s jasným popisem problému

## 15. Bezpečnost a oprávnění

### 15.1 Editovatelná pole
Pouze určitá pole jsou editovatelná:
- Email, Telefon, Adresa, Poznámka interní

### 15.2 Akce vyžadující potvrzení
- Mazání poznámek
- Odesílání emailů zákazníkům
- Generování dokumentů

### 15.3 Logování akcí
Všechny důležité akce jsou logovány pro audit:
- Editace dat
- Přidání/smazání poznámek
- Změny stavů

---

*Tato dokumentace popisuje aktuální stav aplikace CarAudit CRM verze 1.0. Pro technické dotazy kontaktujte vývojový tým.*