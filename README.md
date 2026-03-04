# TicketWise (AutoTicketProcessor)

TicketWise is an AI-powered support ticket automation platform designed to streamline the analysis and management of technical support requests. It leverages Google's Genkit AI to extract structured data, summarize complex issues, and generate comprehensive analytics reports.

## Features

- **Smart Ticket Extraction**: Automatically identifies service categories, issue types, and priority levels from raw ticket text.
- **Automated Summarization**: Generates concise, technical summaries for quick reading.
- **Advanced Analytics**: Analyzes batches of tickets to identify common root causes and suggest quick fixes.
- **Data Persistence**: Seamlessly integrates with Supabase to store processed tickets and generated reports for historical tracking.
- **Modern UI**: Built with a responsive Next.js frontend featuring Radix UI components and Tailwind CSS.

## Getting Started

### Prerequisites

You will need to set up the following environment variables in a `.env.local` file:

```env
# Google AI for Genkit
GOOGLE_GENAI_API_KEY=your_google_ai_key

# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Running the Application

To run the application locally, you'll need two separate terminal windows.

**1. Start the Next.js development server:**

```bash
npm run dev
```
The web application will be available at `http://localhost:9002`.

**2. Start the Genkit AI flows:**

```bash
npm run genkit:watch
```
This starts the local Genkit development server, which handles the AI processing logic.

## Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **AI Engine**: [Firebase Genkit](https://firebase.google.com/docs/genkit)
- **Database**: [Supabase](https://supabase.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [Radix UI](https://www.radix-ui.com/) & [Lucide Icons](https://lucide.dev/)
