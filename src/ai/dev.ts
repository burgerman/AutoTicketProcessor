import { config } from 'dotenv';
config();

import '@/ai/flows/generate-analytics-report.ts';
import '@/ai/flows/extract-ticket-data.ts';
import '@/ai/flows/summarize-issue.ts';