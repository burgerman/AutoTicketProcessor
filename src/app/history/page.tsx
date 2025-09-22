'use client';

import React, { useContext } from 'react';
import { TicketContext } from '@/context/TicketContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Server, AlertTriangle, ChevronUp, ChevronDown, Minus, Ticket } from 'lucide-react';

export default function HistoryPage() {
  const { processedTickets } = useContext(TicketContext);

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
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold tracking-tight">Processed Tickets History</CardTitle>
            <CardDescription>A list of tickets you have processed in this session.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[75vh] min-h-[500px]">
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
    </main>
  );
}
