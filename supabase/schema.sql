-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES
-- Stores user details and roles
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    email TEXT UNIQUE NOT NULL,
    role TEXT CHECK (role IN ('admin', 'agent', 'assistant')) DEFAULT 'agent',
    lofty_user_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. INTEGRATIONS
-- Stores encrypted API keys and Lofty config
CREATE TABLE integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider TEXT NOT NULL DEFAULT 'lofty',
    api_key_encrypted TEXT NOT NULL,
    api_secret_encrypted TEXT,
    webhook_secret TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. LEAD_SOURCES
-- Tracking where leads come from
CREATE TABLE lead_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    category TEXT, -- e.g., 'Web', 'Referral', 'Zillow'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. LEADS
-- Core lead data synced from Lofty
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lofty_lead_id TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    phone TEXT,
    pipeline_stage TEXT,
    assigned_agent_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    lead_source_id UUID REFERENCES lead_sources(id) ON DELETE SET NULL,

    -- CASL Compliance Fields
    consent_type TEXT CHECK (consent_type IN ('express', 'implied')),
    consent_date TIMESTAMPTZ,
    consent_source TEXT,
    consent_expires_at TIMESTAMPTZ,
    is_unsubscribed BOOLEAN DEFAULT false,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. NOTES
-- Internal team communication
CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE NOT NULL,
    author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TASKS
-- Follow-up reminders
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE NOT NULL,
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    subject TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMPTZ,
    status TEXT CHECK (status IN ('pending', 'completed', 'cancelled')) DEFAULT 'pending',
    priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 7. DOCUMENTS
-- File metadata for Supabase Storage
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL, -- path in Supabase Storage bucket
    file_type TEXT,
    file_size INTEGER,
    uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. COMMUNICATIONS
-- Log of Emails/SMS synced via Lofty
CREATE TABLE communications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE NOT NULL,
    type TEXT CHECK (type IN ('email', 'sms')),
    direction TEXT CHECK (direction IN ('inbound', 'outbound')),
    sender_id TEXT,
    recipient_id TEXT,
    content TEXT,
    lofty_message_id TEXT UNIQUE,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read/update their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Leads: Agents can only see leads assigned to them; Admins see all
CREATE POLICY "Leads visibility" ON leads FOR SELECT
    USING (
        auth.uid() = assigned_agent_id
        OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Leads update" ON leads FOR UPDATE
    USING (
        auth.uid() = assigned_agent_id
        OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Notes, Tasks, Documents, Communications inherit lead visibility logic
-- (Simplified: allow access if the lead is accessible)
CREATE POLICY "Notes access" ON notes FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM leads
            WHERE leads.id = notes.lead_id
            AND (leads.assigned_agent_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
        )
    );

CREATE POLICY "Tasks access" ON tasks FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM leads
            WHERE leads.id = tasks.lead_id
            AND (leads.assigned_agent_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
        )
    );

CREATE POLICY "Documents access" ON documents FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM leads
            WHERE leads.id = documents.lead_id
            AND (leads.assigned_agent_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
        )
    );

CREATE POLICY "Communications access" ON communications FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM leads
            WHERE leads.id = communications.lead_id
            AND (leads.assigned_agent_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
        )
    );

-- Integrations: Only admins can view/edit
CREATE POLICY "Integrations admin only" ON integrations FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Lead Sources: Read-only for all authenticated users
CREATE POLICY "Lead sources view" ON lead_sources FOR SELECT USING (true);
