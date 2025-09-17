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
    <Card className="p-4 bg-secondary/30">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Filter status display */}
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Badge variant="outline" className="text-xs">
              {filteredCount} z {totalCount} záznamů
            </Badge>
          )}
        </div>

        {/* Right side - Empty now that date selector moved */}
        <div className="flex items-center gap-2">
        </div>
      </div>
    </Card>
  );
};