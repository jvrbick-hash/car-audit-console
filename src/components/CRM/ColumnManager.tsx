import React, { useState } from 'react';
import { Settings, Eye, EyeOff, GripVertical, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Column } from '@/types/orders';

interface ColumnManagerProps {
  columns: Column[];
  onColumnsChange: (columns: Column[]) => void;
}

export const ColumnManager: React.FC<ColumnManagerProps> = ({ columns, onColumnsChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const visibleColumns = columns.filter(col => col.visible);
  const hiddenColumns = columns.filter(col => !col.visible);

  const handleColumnVisibilityChange = (columnKey: string, visible: boolean) => {
    const updatedColumns = columns.map(col =>
      col.key === columnKey ? { ...col, visible } : col
    );
    onColumnsChange(updatedColumns);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null) return;

    const visibleCols = columns.filter(col => col.visible);
    const hiddenCols = columns.filter(col => !col.visible);
    
    const draggedColumn = visibleCols[draggedIndex];
    const newVisibleCols = [...visibleCols];
    
    // Remove dragged item
    newVisibleCols.splice(draggedIndex, 1);
    // Insert at new position
    newVisibleCols.splice(dropIndex, 0, draggedColumn);
    
    // Reconstruct full columns array maintaining order for hidden columns
    const reorderedColumns = [...newVisibleCols, ...hiddenCols];
    onColumnsChange(reorderedColumns);
    setDraggedIndex(null);
  };

  const addColumn = (columnKey: string) => {
    handleColumnVisibilityChange(columnKey, true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="w-4 h-4" />
          Správa sloupců
          <Badge variant="secondary" className="ml-1">
            {visibleColumns.length}
          </Badge>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Správa sloupců tabulky</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto">
          {/* Visible Columns */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Zobrazené sloupce ({visibleColumns.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {visibleColumns.map((column, index) => (
                <div
                  key={`visible-${column.key}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg border cursor-move hover:bg-secondary/70 transition-colors"
                >
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                  <Checkbox
                    checked={true}
                    onCheckedChange={() => handleColumnVisibilityChange(column.key, false)}
                  />
                  <div className="flex-1">
                    <span className="font-medium text-sm">{column.label}</span>
                    {column.editable && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        Editovatelný
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
              
              {visibleColumns.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Žádné zobrazené sloupce
                </p>
              )}
            </CardContent>
          </Card>

          {/* Hidden Columns */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <EyeOff className="w-5 h-5" />
                Skryté sloupce ({hiddenColumns.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {hiddenColumns.map((column) => (
                <div
                  key={`hidden-${column.key}`}
                  className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border"
                >
                  <Checkbox
                    checked={false}
                    onCheckedChange={() => handleColumnVisibilityChange(column.key, true)}
                  />
                  <div className="flex-1">
                    <span className="font-medium text-sm text-muted-foreground">{column.label}</span>
                    {column.editable && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        Editovatelný
                      </Badge>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => addColumn(column.key)}
                    className="h-8 w-8 p-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              
              {hiddenColumns.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Všechny sloupce jsou zobrazené
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Přetáhněte sloupce pro změnu pořadí
          </p>
          <Button onClick={() => setIsOpen(false)}>
            Hotovo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};