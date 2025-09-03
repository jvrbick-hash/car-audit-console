import React, { useState, useMemo } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Order, Column } from '@/types/orders';

interface ExcelFilterProps {
  column: Column;
  orders: Order[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
}

export const ExcelFilter: React.FC<ExcelFilterProps> = ({
  column,
  orders,
  selectedValues,
  onSelectionChange
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Get all unique values for this column
  const uniqueValues = useMemo(() => {
    const values = orders
      .map(order => order[column.key])
      .filter(value => value !== null && value !== undefined && value !== '')
      .map(value => String(value));
    
    return Array.from(new Set(values)).sort();
  }, [orders, column.key]);

  // Filter values based on search
  const filteredValues = useMemo(() => {
    if (!searchValue) return uniqueValues;
    return uniqueValues.filter(value => 
      value.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [uniqueValues, searchValue]);

  const handleSelectAll = () => {
    if (selectedValues.length === uniqueValues.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(uniqueValues);
    }
  };

  const handleValueToggle = (value: string) => {
    if (selectedValues.includes(value)) {
      onSelectionChange(selectedValues.filter(v => v !== value));
    } else {
      onSelectionChange([...selectedValues, value]);
    }
  };

  const isAllSelected = selectedValues.length === uniqueValues.length;
  const hasSelection = selectedValues.length > 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-7 text-xs justify-between border-muted hover:bg-muted/50 w-full"
        >
          <div className="flex items-center gap-1 min-w-0 flex-1">
            {hasSelection && selectedValues.length < uniqueValues.length ? (
              <>
                <span className="truncate">
                  {selectedValues.length === 1 
                    ? selectedValues[0] 
                    : `${selectedValues.length} vybrané`
                  }
                </span>
                <Badge variant="secondary" className="h-4 px-1 text-xs">
                  {selectedValues.length}
                </Badge>
              </>
            ) : (
              <span className="text-muted-foreground">Vše</span>
            )}
          </div>
          <ChevronDown className="h-3 w-3 opacity-50 flex-shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              placeholder="Hledat hodnoty..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-9"
            />
          </div>
          <CommandList className="max-h-64">
            <CommandGroup>
              {/* Select All option */}
              <CommandItem onSelect={handleSelectAll} className="flex items-center space-x-2">
                <Checkbox 
                  checked={isAllSelected}
                  className="h-4 w-4"
                />
                <span className="font-medium">Vybrat vše ({uniqueValues.length})</span>
              </CommandItem>
              
              {filteredValues.length === 0 && searchValue && (
                <CommandEmpty>Žádné hodnoty nenalezeny.</CommandEmpty>
              )}
              
              {filteredValues.map((value) => (
                <CommandItem
                  key={value}
                  onSelect={() => handleValueToggle(value)}
                  className="flex items-center space-x-2"
                >
                  <Checkbox 
                    checked={selectedValues.includes(value)}
                    className="h-4 w-4"
                  />
                  <span className="truncate">{value}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};