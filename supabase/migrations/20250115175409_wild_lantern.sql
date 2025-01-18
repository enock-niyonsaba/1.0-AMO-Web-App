/*
  # Initial Schema Setup for AMO Platform

  1. User Authentication Tables
    - `amo_user_login`: Main user authentication table
    - `amo_user_info`: Additional user information
    - `amo_user_updates`: Track user information changes
    
  2. Business Tables
    - `desktop_user`: Desktop application users
    - `company_info`: Company details and license info
    - `activities`: System activity logs
    - `licenses`: License records
    
  3. Security
    - Enable RLS on all tables
    - Add appropriate policies
*/

-- Create enum types
CREATE TYPE user_role AS ENUM ('ADMIN', 'USER');
CREATE TYPE user_status AS ENUM ('active', 'locked', 'license_expired');

-- AMO User Login Table
CREATE TABLE IF NOT EXISTS amo_user_login (
  user_id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  user_role user_role NOT NULL,
  verification_code TEXT,
  is_verified BOOLEAN DEFAULT false,
  remember_token TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- AMO User Info Table
CREATE TABLE IF NOT EXISTS amo_user_info (
  user_id TEXT PRIMARY KEY REFERENCES amo_user_login(user_id),
  phone_number TEXT,
  profile_picture TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- AMO User Updates Table
CREATE TABLE IF NOT EXISTS amo_user_updates (
  update_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES amo_user_login(user_id),
  field_name TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Desktop User Table
CREATE TABLE IF NOT EXISTS desktop_user (
  desktop_user_id TEXT PRIMARY KEY,
  company_name TEXT NOT NULL,
  tin_number CHAR(9) NOT NULL UNIQUE,
  telephone CHAR(10) NOT NULL,
  email TEXT NOT NULL UNIQUE,
  address TEXT NOT NULL,
  sdc_id TEXT NOT NULL,
  mrc_number TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  status user_status DEFAULT 'active',
  is_deleted BOOLEAN DEFAULT false
);

-- Company Info Table
CREATE TABLE IF NOT EXISTS company_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  desktop_user_id TEXT REFERENCES desktop_user(desktop_user_id),
  license_start TIMESTAMPTZ NOT NULL,
  license_end TIMESTAMPTZ NOT NULL,
  qr_code_scanned INTEGER DEFAULT 0,
  vat_amount DECIMAL(15,2) DEFAULT 0,
  last_sync TIMESTAMPTZ,
  UNIQUE(desktop_user_id)
);

-- Activities Table
CREATE TABLE IF NOT EXISTS activities (
  activity_id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  affected_user TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('desktop_user', 'amo_user')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Licenses Table
CREATE TABLE IF NOT EXISTS licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  desktop_user_id TEXT REFERENCES desktop_user(desktop_user_id),
  license_activated TIMESTAMPTZ NOT NULL,
  license_expired TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE amo_user_login ENABLE ROW LEVEL SECURITY;
ALTER TABLE amo_user_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE amo_user_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE desktop_user ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policies
-- AMO User Login policies
CREATE POLICY "Users can read own data" ON amo_user_login
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

-- AMO User Info policies
CREATE POLICY "Users can read own info" ON amo_user_info
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

-- Create triggers for user_id generation
CREATE OR REPLACE FUNCTION generate_user_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.user_id := NEW.user_role || to_char(now(), 'YYYY-MM-DD-') || 
                 LPAD(COALESCE(
                   (SELECT COUNT(*) + 1 FROM amo_user_login 
                    WHERE user_role = NEW.user_role 
                    AND created_at::date = CURRENT_DATE)::text,
                   '1'
                 ), 3, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_user_id
  BEFORE INSERT ON amo_user_login
  FOR EACH ROW
  EXECUTE FUNCTION generate_user_id();