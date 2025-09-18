import React from 'react';
import { Header } from '@/components/CRM/Header';
import { OrdersTable } from '@/components/CRM/OrdersTable';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <OrdersTable />
      </main>
    </div>
  );
};

export default Index;
