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

  return null;
};