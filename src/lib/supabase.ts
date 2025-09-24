'use server';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type {AnalyticsReport } from '@/lib/types';

let supabase: SupabaseClient | undefined;

function getSupabaseClient(): SupabaseClient {
  if (supabase) {
    return supabase;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL and anonymous key are required.');
  }

  supabase = createClient(supabaseUrl, supabaseKey);
  return supabase;
}

export async function loadHistoricalReportsSupabase(): Promise<any> { 
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('analytics_reports')
      .select('*')
      .order('created_time', { ascending: false })
      .limit(10);
    if (error) {
        console.error('Error loading analytics report from Supabase:', error);
        throw new Error(`Failed to load report: ${error.message}`);
    }
    return data;
}


export async function saveAnalyticsReportSupabase(report: AnalyticsReport, reportNum: string): Promise<void> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('analytics_reports')
    .insert([
      {
        report_id: reportNum,
        report_summary: report.reportSummary,
        identified_issues: report.identifiedIssues,
        common_causes: report.commonCauses,
        quick_fixes: report.solutions,
      },
    ]);

  if (error) {
    console.error('Error saving analytics report to Supabase:', error);
    throw new Error(`Failed to save report: ${error.message}`);
  }
}