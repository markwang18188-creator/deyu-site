-- AI Chatbot schema for deyu-site
-- Run this once in Supabase Dashboard → SQL Editor

-- ──────────────────────────────────────────────────────────
-- 1. chatbot_sessions: one row per visitor conversation
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chatbot_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_ip TEXT,
  visitor_country TEXT,
  referrer_page TEXT,
  user_agent TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  stage INT DEFAULT 1,
  language TEXT,
  lead_captured BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_chatbot_sessions_started_at ON chatbot_sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_chatbot_sessions_lead_captured ON chatbot_sessions(lead_captured) WHERE lead_captured = TRUE;

-- ──────────────────────────────────────────────────────────
-- 2. chatbot_messages: every user / assistant / tool turn
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chatbot_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES chatbot_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL,                  -- 'user' | 'assistant' | 'tool'
  content TEXT,
  tool_calls JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chatbot_messages_session ON chatbot_messages(session_id, created_at);

-- ──────────────────────────────────────────────────────────
-- 3. Extend leads table with chatbot-specific structured fields
--    (existing columns: name, company, email, phone, country,
--     machine_interest, message, source, source_page, language,
--     country_iso are preserved)
-- ──────────────────────────────────────────────────────────
ALTER TABLE leads ADD COLUMN IF NOT EXISTS session_id UUID REFERENCES chatbot_sessions(id);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS materials TEXT[];
ALTER TABLE leads ADD COLUMN IF NOT EXISTS colors INT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS mold_config TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS product_category TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS tonnage_recommendation TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS recommended_models TEXT[];
ALTER TABLE leads ADD COLUMN IF NOT EXISTS upgrades_discussed TEXT[];
ALTER TABLE leads ADD COLUMN IF NOT EXISTS cooling_preference TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS port TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS payment_preference TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS full_summary TEXT;

-- ──────────────────────────────────────────────────────────
-- 4. RLS — chat tables are written by server (service role) only
-- ──────────────────────────────────────────────────────────
ALTER TABLE chatbot_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_messages ENABLE ROW LEVEL SECURITY;

-- No public policies → only service_role bypasses RLS. Anonymous browsers
-- cannot read or write these tables directly.
