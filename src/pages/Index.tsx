import React, { useState } from 'react';
import { Header } from '@/components/CRM/Header';
import { OrdersTable } from '@/components/CRM/OrdersTable';
import { UltimateCustomerSupportNotepad } from '@/components/UltimateCustomerSupportNotepad';
import { Button } from '@/components/ui/button';
import { MessageSquare, Database } from 'lucide-react';

const Index = () => {
  const [currentView, setCurrentView] = useState<'crm' | 'notepad'>('crm');

  return (
    <div className="min-h-screen bg-background">
      {currentView === 'crm' && <Header />}
      
      {/* Navigation */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-2">
            <Button
              variant={currentView === 'crm' ? 'default' : 'outline'}
              onClick={() => setCurrentView('crm')}
              className="flex items-center gap-2"
            >
              <Database className="h-4 w-4" />
              CRM Orders
            </Button>
            <Button
              variant={currentView === 'notepad' ? 'default' : 'outline'}
              onClick={() => setCurrentView('notepad')}
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Support Notepad
            </Button>
          </div>
        </div>
      </div>

      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'crm' ? <OrdersTable /> : <UltimateCustomerSupportNotepad />}
      </main>
    </div>
  );
};

export default Index;
