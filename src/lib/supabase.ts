'use server';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { AnalyticsReport } from '@/lib/types';

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

export async function saveAnalyticsReport(report: AnalyticsReport): Promise<void> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('analytics_reports')
    .insert([
      {
        report_summary: report.reportSummary,
        identified_trends: report.identifiedTrends,
        common_issues: report.commonIssues,
        improvement_areas: report.improvementAreas,
      },
    ]);

  if (error) {
    console.error('Error saving analytics report to Supabase:', error);
    throw new Error(`Failed to save report: ${error.message}`);
  }
}
