-- TENOUCHI Initial Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================
-- PROFILES テーブル (auth.usersを参照)
-- =====================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  pin_hash TEXT, -- bcrypt hashed PIN for secret mode

  -- Onboarding answers
  personality TEXT,
  strength TEXT,
  weakness TEXT,
  stress_relief TEXT,
  goal TEXT,
  secret_type TEXT,
  secretary_style TEXT,

  -- Settings
  theme_preference TEXT DEFAULT 'auto',
  notification_enabled BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- TIMELINE_ITEMS テーブル
-- =====================
CREATE TABLE timeline_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  source TEXT NOT NULL,
  source_id TEXT,

  from_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT,

  ai_summary TEXT,
  ai_action_suggestion TEXT,

  priority TEXT DEFAULT 'this_week',
  status TEXT DEFAULT 'pending',

  has_draft_reply BOOLEAN DEFAULT false,
  draft_reply TEXT,

  due_date TIMESTAMPTZ,
  snoozed_until TIMESTAMPTZ,

  is_secret BOOLEAN DEFAULT false,

  received_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- MONEY_RECORDS テーブル
-- =====================
CREATE TABLE money_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  type TEXT NOT NULL,
  category TEXT NOT NULL,
  amount INTEGER NOT NULL,

  description TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,

  is_recurring BOOLEAN DEFAULT false,
  recurring_day INTEGER,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- STASH テーブル (へそくり)
-- =====================
CREATE TABLE stash (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  type TEXT NOT NULL,
  amount INTEGER NOT NULL,
  description TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE stash_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  target_amount INTEGER DEFAULT 5000000,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- NOTES テーブル
-- =====================
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  title TEXT NOT NULL,
  content TEXT,
  color TEXT DEFAULT '#FF6B00',

  is_pinned BOOLEAN DEFAULT false,
  is_secret BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- FAMILY_EVENTS テーブル
-- =====================
CREATE TABLE family_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  title TEXT NOT NULL,
  date DATE NOT NULL,
  category TEXT NOT NULL,
  color TEXT DEFAULT '#4A90D9',

  description TEXT,
  reminder_days INTEGER DEFAULT 3,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- CONTACTS テーブル
-- =====================
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  company TEXT,
  position TEXT,

  email TEXT,
  phone TEXT,
  line_id TEXT,

  is_secret BOOLEAN DEFAULT false,

  -- Secret mode fields
  age INTEGER,
  job TEXT,
  rating_sex INTEGER,
  rating_looks INTEGER,
  rating_personality INTEGER,
  rating_overall INTEGER,
  status TEXT,
  total_cost INTEGER DEFAULT 0,
  date_count INTEGER DEFAULT 0,
  avatar_initial TEXT,

  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- SECRETARY_LOGS テーブル
-- =====================
CREATE TABLE secretary_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  role TEXT NOT NULL,
  content TEXT NOT NULL,

  related_item_type TEXT,
  related_item_id UUID,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- INDEXES
-- =====================
CREATE INDEX idx_timeline_user_priority ON timeline_items(user_id, priority, status);
CREATE INDEX idx_timeline_received ON timeline_items(received_at DESC);
CREATE INDEX idx_money_user_date ON money_records(user_id, date DESC);
CREATE INDEX idx_stash_user_date ON stash(user_id, date DESC);
CREATE INDEX idx_notes_user ON notes(user_id, is_pinned DESC, created_at DESC);
CREATE INDEX idx_family_events_date ON family_events(user_id, date);
CREATE INDEX idx_contacts_user ON contacts(user_id, is_secret);

-- =====================
-- ROW LEVEL SECURITY (RLS)
-- =====================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE money_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE stash ENABLE ROW LEVEL SECURITY;
ALTER TABLE stash_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE secretary_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can view own timeline" ON timeline_items
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own money records" ON money_records
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own stash" ON stash
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own stash settings" ON stash_settings
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own notes" ON notes
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own family events" ON family_events
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own contacts" ON contacts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own secretary logs" ON secretary_logs
  FOR ALL USING (auth.uid() = user_id);

-- =====================
-- FUNCTIONS & TRIGGERS
-- =====================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_timeline_updated_at BEFORE UPDATE ON timeline_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_money_updated_at BEFORE UPDATE ON money_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_family_updated_at BEFORE UPDATE ON family_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Get stash balance
CREATE OR REPLACE FUNCTION get_stash_balance(p_user_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN COALESCE(
    (SELECT SUM(CASE WHEN type = 'in' THEN amount ELSE -amount END)
     FROM stash WHERE user_id = p_user_id),
    0
  );
END;
$$ LANGUAGE plpgsql;
