# Denise Mai Lofty CRM

A custom Real Estate Automation CRM designed to synchronize with the Lofty API, providing a "Single Pane of Glass" experience for lead management, communication, and document handling.

## 🚀 Features

- **Lofty Integration:** Full synchronization engine with the Lofty API for real-time lead data.
- **Lead Management:** Comprehensive dashboard for tracking and managing real estate leads.
- **AI Drafting:** Integrated AI capabilities for drafting communications and responses.
- **Document Management:** Centralized handling of lead-related documents and files.
- **Communication Timeline:** Enhanced visual timeline of all interactions with leads.
- **Real-time Data:** Powered by Supabase for instant updates and persistence.

## 🛠 Tech Stack

- **Framework:** [Next.js 16+](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Backend/BaaS:** [Supabase](https://supabase.com/) (PostgreSQL, Auth, Storage, Edge Functions)
- **Deployment:** [Vercel](https://vercel.com/)

## 📦 Getting Started

### Prerequisites

- Node.js 20+
- A Supabase account and project
- A Lofty API key

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd denise-mai-crm
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add the following:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Lofty API Configuration
   LOFTY_API_KEY=your_lofty_api_key
   LOFTY_API_BASE_URL=https://api.lofty.com
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🌐 Deployment

### Frontend (Vercel)

1. Push your code to GitHub.
2. Import the project into Vercel.
3. Add the environment variables listed above in the Vercel project settings.
4. Deploy.

### Backend (Supabase)

1. Ensure your Supabase schema is applied.
2. Configure Auth providers and Storage buckets as required by the application.

## 📂 Project Structure

- `src/app/`: Next.js App Router pages and layouts.
- `src/components/`: Reusable UI components.
- `src/services/`: Business logic and external API wrappers (Lofty, Supabase).
- `src/lib/`: Shared configurations and client initializations.
- `src/hooks/`: Custom React hooks.
- `src/types/`: TypeScript domain entity definitions.
- `src/utils/`: Pure utility functions.
- `supabase/`: Database migrations and edge functions.
