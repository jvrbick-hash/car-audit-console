import React from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Column } from '@/types/orders';

interface ColumnSelectorProps {
  columns: Column[];
  onColumnsChange: (columns: Column[]) => void;
  onResetToDefault: () => void;
}

export const ColumnSelector: React.FC<ColumnSelectorProps> = ({
  columns,
  onColumnsChange,
  onResetToDefault
}) => {
  const visibleCount = columns.filter(col => col.visible).length;
  const totalCount = columns.length;

  const handleColumnToggle = (columnKey: string, visible: boolean) => {
    const updatedColumns = columns.map(col =>
      col.key === columnKey ? { ...col, visible } : col
    );
    onColumnsChange(updatedColumns);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Sloupce ({visibleCount}/{totalCount})
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Výběr sloupců</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetToDefault}
              className="h-auto p-1 text-xs"
            >
              Výchozí zobrazení
            </Button>
          </div>
          
          <Separator />
          
          <div className="max-h-80 overflow-y-auto space-y-2">
            {columns.map((column) => (
              <div key={column.key} className="flex items-center space-x-2">
                <Checkbox
                  id={column.key}
                  checked={column.visible}
                  onCheckedChange={(checked) => 
                    handleColumnToggle(column.key, checked as boolean)
                  }
                />
                <label
                  htmlFor={column.key}
                  className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                >
                  {column.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};