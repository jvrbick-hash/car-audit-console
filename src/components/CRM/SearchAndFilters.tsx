import React, { useState } from 'react';
import { Search, Calendar, X } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface SearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  dateRange?: DateRange | undefined;
  onDateRangeChange?: (range: DateRange | undefined) => void;
  filteredCount: number;
  totalCount: number;
}

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchTerm,
  onSearchChange,
  dateRange,
  onDateRangeChange,
  filteredCount,
  totalCount,
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const clearDateRange = () => {
    onDateRangeChange(undefined);
    setIsCalendarOpen(false);
  };

  const formatDateRange = () => {
    if (!dateRange?.from) return "Vybrat období";
    
    if (dateRange.to) {
      return `${format(dateRange.from, "dd.MM.yyyy")} - ${format(dateRange.to, "dd.MM.yyyy")}`;
    }
    
    return format(dateRange.from, "dd.MM.yyyy");
  };

  const hasActiveFilters = dateRange?.from;

  return (
    <Card className="p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Levá strana - vyhledávání a filtry */}
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Globální vyhledávání */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Vyhledat v objednávkách..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Datumový filtr */}
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal min-w-[200px]",
                  !dateRange?.from && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {formatDateRange()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={onDateRangeChange}
                numberOfMonths={2}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          {/* Vymazat filtry */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearDateRange}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Vymazat filtry
            </Button>
          )}
        </div>

        {/* Pravá strana - počítadlo záznamů */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">
            Zobrazeno {filteredCount} z {totalCount} záznamů
          </Badge>
        </div>
      </div>
    </Card>
  );
};