import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pencil, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { productTypeOptions } from '@/types/orders';

interface EditableFieldProps {
  label: string;
  value: string | number;
  isEditable: boolean;
  type?: 'text' | 'textarea' | 'email' | 'tel' | 'number' | 'select';
  onSave?: (value: string) => void;
  className?: string;
  icon?: React.ReactNode;
}

export function EditableField({
  label,
  value,
  isEditable,
  type = 'text',
  onSave,
  className,
  icon
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(value));
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(String(value));
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (editValue !== String(value) && onSave) {
      setIsLoading(true);
      await onSave(editValue);
      setIsLoading(false);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(String(value));
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleStartEdit = () => {
    if (isEditable) {
      setIsEditing(true);
    }
  };

  if (isEditing) {
    return (
      <div className={cn("space-y-2", className)}>
        <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          {icon}
          {label}
        </Label>
        <div className="flex items-center gap-2">
          {type === 'textarea' ? (
            <Textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              className="min-h-[80px]"
              rows={3}
            />
          ) : type === 'select' ? (
            <Select value={editValue} onValueChange={setEditValue}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Vyberte typ produktu" />
              </SelectTrigger>
              <SelectContent>
                {productTypeOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type={type}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
            />
          )}
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={handleSave}
              disabled={isLoading}
            >
              <Check className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        {icon}
        {label}
      </Label>
      <div
        className={cn(
          "group relative p-3 rounded-md border bg-card text-card-foreground min-h-[40px] flex items-center",
          isEditable && "cursor-pointer hover:bg-muted/50 transition-colors"
        )}
        onClick={handleStartEdit}
      >
        <span className="flex-1 text-sm">
          {value || <span className="text-muted-foreground">Nevyplněno</span>}
        </span>
        {isEditable && (
          <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>
    </div>
  );
}