import React from 'react';
import { Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Column } from '@/types/orders';

export interface ColumnFilter {
  key: string;
  value: string;
  type: 'text' | 'status';
}

interface ColumnFiltersProps {
  columns: Column[];
  filters: ColumnFilter[];
  onFiltersChange: (filters: ColumnFilter[]) => void;
}

export const ColumnFilters: React.FC<ColumnFiltersProps> = ({
  columns,
  filters,
  onFiltersChange,
}) => {
  const visibleColumns = columns.filter(col => col.visible);
  const hasFilters = filters.length > 0;

  const updateFilter = (columnKey: string, value: string, type: 'text' | 'status') => {
    const existingFilters = filters.filter(f => f.key !== columnKey);
    
    if (value.trim()) {
      onFiltersChange([...existingFilters, { key: columnKey, value: value.trim(), type }]);
    } else {
      onFiltersChange(existingFilters);
    }
  };

  const removeFilter = (columnKey: string) => {
    onFiltersChange(filters.filter(f => f.key !== columnKey));
  };

  const clearAllFilters = () => {
    onFiltersChange([]);
  };

  const getFilterValue = (columnKey: string) => {
    return filters.find(f => f.key === columnKey)?.value || '';
  };

  const statusOptions = {
    'Stav platby': ['Zaplaceno', 'Nezaplaceno', 'Částečně zaplaceno'],
    'Stav objednávky': ['Dokončeno', 'Zpracovává se', 'Čeká na platbu', 'Zrušeno']
  };

  return (
    <div className="space-y-3">
      {/* Filter controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filtry sloupců</span>
          {hasFilters && (
            <Badge variant="outline" className="text-xs">
              {filters.length} aktivních
            </Badge>
          )}
        </div>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            <X className="h-3 w-3 mr-1" />
            Vymazat vše
          </Button>
        )}
      </div>

      {/* Individual column filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {visibleColumns.map((column) => {
          const filterValue = getFilterValue(column.key);
          const isStatusColumn = statusOptions[column.label as keyof typeof statusOptions];

          return (
            <div key={column.key} className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                {column.label}
              </label>
              
              {isStatusColumn ? (
                <div className="flex gap-1">
                  <Select
                    value={filterValue}
                    onValueChange={(value) => updateFilter(column.key, value, 'status')}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Vše" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Vše</SelectItem>
                      {isStatusColumn.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {filterValue && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => removeFilter(column.key)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex gap-1">
                  <Input
                    placeholder={`Filtr ${column.label.toLowerCase()}...`}
                    value={filterValue}
                    onChange={(e) => updateFilter(column.key, e.target.value, 'text')}
                    className="h-8 text-xs"
                  />
                  {filterValue && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => removeFilter(column.key)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Active filters display */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          <span className="text-xs text-muted-foreground">Aktivní filtry:</span>
          {filters.map((filter) => {
            const column = columns.find(c => c.key === filter.key);
            return (
              <Badge 
                key={filter.key} 
                variant="secondary" 
                className="text-xs flex items-center gap-1"
              >
                {column?.label}: {filter.value}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-3 w-3 p-0 hover:bg-transparent"
                  onClick={() => removeFilter(filter.key)}
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
};