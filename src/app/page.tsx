'use client';

import React, { useState } from 'react';
import { TicketProcessor } from '@/components/ticket-processor';
import { AnalyticsDashboard } from '@/components/analytics-dashboard';
import type { ExtractedTicketData } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Server, AlertTriangle, ChevronUp, ChevronDown, Minus, Ticket } from 'lucide-react';

export default function Home() {
  const [processedTickets, setProcessedTickets] = useState<ExtractedTicketData[]>([]);

  const handleTicketProcessed = (ticketData: ExtractedTicketData) => {
    setProcessedTickets(prevTickets => [ticketData, ...prevTickets]);
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return <ChevronUp className="h-5 w-5 text-destructive" />;
      case 'medium':
        return <Minus className="h-5 w-5 text-primary" />;
      case 'low':
        return <ChevronDown className="h-5 w-5 text-muted-foreground" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
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

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-3 flex flex-col gap-8">
            <TicketProcessor onTicketProcessed={handleTicketProcessed} />
            <AnalyticsDashboard processedTickets={processedTickets} />
          </div>
          
          <div className="lg:col-span-2 flex flex-col gap-4 lg:sticky lg:top-8">
             <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold tracking-tight">Processed Tickets</CardTitle>
                    <CardDescription>A list of tickets you have processed in this session.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <ScrollArea className="h-[60vh] min-h-[400px]">
                      <div className="p-6">
                        {processedTickets.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-16">
                                <Ticket className="w-16 h-16 mb-4 opacity-50" />
                                <h3 className="text-lg font-medium">No tickets processed yet</h3>
                                <p className="text-sm">Your processed tickets will appear here.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {processedTickets.map((ticket, index) => (
                                    <Card key={index} className="bg-secondary/50">
                                        <CardHeader className="pb-4">
                                            <CardTitle className="text-base font-semibold leading-snug">{ticket.summary}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
                                                <div className="flex items-center gap-2" title="Affected Service">
                                                    <Server className="h-4 w-4 text-primary" />
                                                    <Badge variant="secondary">{ticket.affectedService}</Badge>
                                                </div>
                                                <div className="flex items-center gap-2" title="Issue Type">
                                                    <AlertTriangle className="h-4 w-4 text-primary" />
                                                     <Badge variant="secondary">{ticket.issueType}</Badge>
                                                </div>
                                                <div className="flex items-center gap-2" title="Priority">
                                                    {getPriorityIcon(ticket.priority)}
                                                    <Badge variant={getPriorityBadgeVariant(ticket.priority)}>{ticket.priority}</Badge>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                      </div>
                    </ScrollArea>
                </CardContent>
             </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
