'use client';

import type { ExtractedTicketData } from '@/lib/types';
import React, { createContext, useState, ReactNode } from 'react';

interface TicketContextType {
  processedTickets: ExtractedTicketData[];
  addTicket: (ticket: ExtractedTicketData) => void;
}

export const TicketContext = createContext<TicketContextType>({
  processedTickets: [],
  addTicket: () => {},
});

export const TicketProvider = ({ children }: { children: ReactNode }) => {
  const [processedTickets, setProcessedTickets] = useState<ExtractedTicketData[]>([]);

  const addTicket = (ticket: ExtractedTicketData) => {
    setProcessedTickets(prevTickets => [ticket, ...prevTickets]);
  };

  return (
    <TicketContext.Provider value={{ processedTickets, addTicket }}>
      {children}
    </TicketContext.Provider>
  );
};
