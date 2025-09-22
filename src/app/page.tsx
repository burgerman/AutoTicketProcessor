'use client';

import React, { useContext } from 'react';
import { TicketProcessor } from '@/components/ticket-processor';
import { AnalyticsDashboard } from '@/components/analytics-dashboard';
import type { ExtractedTicketData } from '@/lib/types';
import { TicketContext } from '@/context/TicketContext';

export default function Home() {
  const { processedTickets, addTicket } = useContext(TicketContext);

  const handleTicketProcessed = (ticketData: ExtractedTicketData) => {
    addTicket(ticketData);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">TicketWise</h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Automate ticket pre-processing, information extraction, and summarization with AI-powered analytics.
          </p>
        </header>

        <div className="flex flex-col gap-8 items-start max-w-4xl mx-auto">
          <TicketProcessor onTicketProcessed={handleTicketProcessed} />
          <AnalyticsDashboard processedTickets={processedTickets} />
        </div>
      </div>
    </main>
  );
}
