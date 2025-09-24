'use client';

import { useState } from 'react';
import { handleGenerateAnalyticsReport } from '@/lib/actions';
import type { ExtractedTicketData, AnalyticsReport } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, BarChart2, TrendingUp, AlertCircle, Construction } from 'lucide-react';
import { Separator } from './ui/separator';

interface AnalyticsDashboardProps {
  processedTickets: ExtractedTicketData[];
}

export function AnalyticsDashboard({ processedTickets }: AnalyticsDashboardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<AnalyticsReport | null>(null);
  const { toast } = useToast();

  const generateReport = async () => {
    setIsLoading(true);
    setReport(null);
    const ticketDataString = processedTickets
      .map(t => `Ticket Summary: ${t.summary}\nAffected Service: ${t.impactedService}\nIssue Type: ${t.issueType}\nPriority: ${t.priority}`)
      .join('\n---\n');
    
    const response = await handleGenerateAnalyticsReport({ ticketData: ticketDataString });

    if ('error' in response) {
      toast({
        variant: 'destructive',
        title: 'Error Generating Report',
        description: response.error,
      });
    } else {
      setReport(response);
       toast({
        title: 'Analytics Report Generated',
        description: 'The report has been successfully created based on the processed tickets.',
      });
    }
    setIsLoading(false);
  };

  const canGenerateReport = processedTickets.length > 0;

  return (
    <Card>
        <CardHeader>
            <CardTitle>Analytics Dashboard</CardTitle>
            <CardDescription>Generate an intelligent analytics report based on the processed tickets.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <Button onClick={generateReport} disabled={!canGenerateReport || isLoading} className="w-full sm:w-auto">
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Report...
                    </>
                ) : (
                    <>
                        <BarChart2 className="mr-2 h-4 w-4" />
                        Generate Analytics Report
                    </>
                )}
            </Button>
            
            {!canGenerateReport && <p className="text-sm text-muted-foreground">Process at least one ticket to generate a report.</p>}

            {isLoading && (
              <div className="flex items-center justify-center pt-8">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <p>Analyzing tickets and generating insights...</p>
                  </div>
              </div>
            )}

            {report && (
              <div className="space-y-6 pt-4">
                <h3 className="text-lg font-semibold text-primary">Analytics Report (JSON)</h3>
                <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                  <code>{JSON.stringify(report, null, 2)}</code>
                </pre>
              </div>
            )}
        </CardContent>
    </Card>
  );
}
