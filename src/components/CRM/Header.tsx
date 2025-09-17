import React from 'react';
import cebiaLogo from '@/assets/cebia-logo-new.png';
import { Button } from '@/components/ui/button';

export const Header: React.FC = () => {
  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-6">
            <img 
              src="/lovable-uploads/653476b0-1013-42d3-84fd-836b0e88ce50.png"
              alt="Cebia Logo" 
              className="h-12 w-auto object-contain"
            />
            <div className="hidden sm:block">
              <h1 className="text-xl font-semibold text-primary">CarAudit CRM</h1>
              <p className="text-sm text-muted-foreground">Správa objednávek</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Odeslat všechny emaily
            </Button>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-primary">Admin Panel</p>
              <p className="text-xs text-muted-foreground">
                {new Date().toLocaleDateString('cs-CZ', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};