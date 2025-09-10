import React from 'react';
import cebiaLogo from '@/assets/cebia-logo.png';

export const Header: React.FC = () => {
  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <img 
              src={cebiaLogo} 
              alt="Cebia Logo" 
              className="h-16 w-auto object-contain"
              style={{ aspectRatio: '426/215' }}
            />
            <div className="hidden sm:block">
              <h1 className="text-xl font-semibold text-primary">CarAudit CRM</h1>
              <p className="text-sm text-muted-foreground">Správa objednávek</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
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