'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { handleExtractTicketData } from '@/lib/actions';
import type { ExtractedTicketData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2 } from 'lucide-react';

const formSchema = z.object({
  ticketText: z.string().min(20, { message: 'Ticket text must be at least 20 characters.' }).max(5000, { message: 'Ticket text cannot exceed 5000 characters.' }),
});

type FormValues = z.infer<typeof formSchema>;

interface TicketProcessorProps {
  onTicketProcessed: (data: ExtractedTicketData) => void;
}

export function TicketProcessor({ onTicketProcessed }: TicketProcessorProps) {
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ticketText: '',
    },
  });

  const { formState: { isSubmitting } } = form;

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const response = await handleExtractTicketData({ ticketText: data.ticketText });

    if ('error' in response) {
      toast({
        variant: 'destructive',
        title: 'Error Processing Ticket',
        description: response.error,
      });
    } else {
      const processedData: ExtractedTicketData = { ...response, ticketText: data.ticketText };
      onTicketProcessed(processedData);
      toast({
        title: 'Ticket Processed Successfully',
        description: 'Key information has been extracted and added to the list.',
      });
      form.reset();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Process New Ticket</CardTitle>
        <CardDescription>Enter raw ticket text below to extract key information and generate a summary.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <FormField
              control={form.control}
              name="ticketText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Ticket Text</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste your raw ticket text here. For example: 'Our production database server is down. We are seeing connection errors across all services...'"
                      className="min-h-[150px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Process Ticket
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
