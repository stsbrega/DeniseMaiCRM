# Phase 0: Client Workflow & Technical Discovery
## Custom Real Estate Automation CRM

### 1. Current Repository Assessment
- **Status:** Empty.
- **Initial State:** No existing code or configuration files.

### 2. Recommended Architecture
To ensure rapid development, high performance, and low maintenance, the following stack is recommended:

- **Frontend/Backend:** Next.js (App Router) - Provides a unified full-stack framework.
- **BaaS:** Supabase - Handles the heavy lifting of infrastructure.
    - **Database:** PostgreSQL for relational data.
    - **Auth:** Supabase Auth for secure user/agent management.
    - **Storage:** Supabase Storage for lead documents.
    - **Edge Functions:** For handling Lofty webhooks and background sync tasks.
- **Deployment:** Vercel (Frontend) and Supabase Cloud (Backend).

### 3. Proposed Minimum Data Model
The data model is designed to synchronize with Lofty while allowing for local CRM enhancements.

- **`profiles`**: User data, roles, and Lofty account mapping.
- **`leads`**: Synced data from `/v1.0/leads` (ID, contact info, pipeline stage, assigned agent).
- **`lead_sources`**: Origin tracking for lead attribution.
- **`notes`**: Internal team communication and lead history.
- **`tasks`**: Follow-up reminders and action items with due dates.
- **`documents`**: File metadata and links to Supabase Storage.
- **`communications`**: Log of all Emails/SMS (inbound/outbound) synced via Lofty.
- **`integrations`**: Configuration and encrypted keys for Lofty API.

### 4. External Integrations
- **Lofty API:** Primary source of truth for leads, activities, and messaging.
- **Email/SMS Providers:** Managed via Lofty API (`/v1.0/message/email/send`, `/v1.0/message/sms/send`).
- **Document Management:** Integration with Supabase Storage for internal file handling.

### 5. Lofty Integration Findings
- **Lead Management:** Full CRUD capabilities available via `/v1.0/leads`.
- **Timeline:** Activity tracking available via `/v2.0/leads/{leadId}/activities`.
- **Communication:** Send/Receive capabilities for Email and SMS.
- **Webhooks:** Support for real-time updates on lead info, communications, and pipeline changes.
- **Rate Limits:** 100/min (Dev), 500/min (Prod) — requires a queuing/throttling mechanism in the integration layer.
- **Auth:** OAuth 2.0 or API Key based.

### 6. Security & Privacy Considerations
- **Regional Compliance:** Since the client is and leads are in Canada, the system must strictly adhere to **PIPEDA** (Personal Information Protection and Electronic Documents Act) and **CASL** (Canada's Anti-Spam Legislation).
- **CASL Compliance Requirements:**
    - **Consent Tracking:** Mandatory fields for `Consent Type` (Express vs. Implied), `Consent Date`, and `Consent Source`.
    - **Expiry Logic:** Automate suppression of contacts when implied consent expires (6 months for inquiries, 2 years for business relationship).
    - **Global Unsubscribe:** A single "STOP" or unsubscribe action must propagate across all active queues and domains immediately.
    - **Identification:** All automated outbound messages must clearly identify the business and include a valid physical mailing address.
- **Data Residency:** Use Supabase/AWS regions closest to Canada to minimize latency and meet potential residency preferences.
- **Access Control:** Row-Level Security (RLS) in PostgreSQL to ensure agents only access their assigned leads.
- **Encryption:** API keys and sensitive lead data encrypted at rest and in transit (TLS).

### 7. MVP Scope (Definition of Done)
The MVP will focus on the "Single Pane of Glass" experience:
- [ ] Bi-directional lead synchronization between Lofty and the CRM.
- [ ] Centralized lead dashboard with pipeline stage visibility.
- [ ] Ability to add internal notes and set follow-up tasks.
- [ ] Document upload and association with specific leads.
- [ ] View-only communication history (Email/SMS) pulled from Lofty.
- [ ] Basic user authentication and role management.

### 8. Automation vs. Human-Approved
To maintain quality and professional rapport, the following logic will be applied:
- **Automated:** Lead ingestion, communication logging, pipeline status updates, and system notifications.
- **Human-Approved:** All outbound communication (AI can generate drafts, but agents must review and click "Send"), task assignment, and lead disqualification.

### 9. Key Unknowns
- **Workflow Specifics:** Exact trigger-action sequences for "Automation" (e.g., "If lead moves to Stage X, then create Task Y").
- **Document Types:** Specific requirements for document handling (e.g., e-signatures, templates).
- **User Roles:** Hierarchy of permissions (Admin vs. Agent vs. Assistant).

### 10. Risks & Operating Costs
- **API Limits:** Exceeding Lofty rate limits could lead to temporary service suspension.
- **Cost:**
    - Vercel: Likely free tier or Pro ($20/mo).
    - Supabase: Free tier or Pro ($25/mo) depending on data volume and storage.
- **Data Sync Lag:** Webhook failures could lead to temporary data inconsistency.

### 11. Sequenced Engineering Implementation Plan
1. **Phase 1: Project Initialization**
    - Setup Next.js + Supabase project.
    - Configure Database schema and Auth.
2. **Phase 2: Lofty Integration Core**
    - Build API wrapper with rate limiting.
    - Implement Lead Sync engine.
3. **Phase 3: Core CRM Features**
    - Build Lead List and Detail views.
    - Implement Notes and Task modules.
4. **Phase 4: Documents & Communications**
    - Integrate Supabase Storage for files.
    - Build communication history timeline.
5. **Phase 5: Automation & Polishing**
    - Implement AI draft generation for messages.
    - Final UI/UX polish and deployment.
