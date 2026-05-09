-- =============================================
-- AFFORDHOSTEL COMPLETE DATABASE SCHEMA
-- =============================================
-- This schema drops all existing tables and recreates them
-- with proper relationships, RLS policies, and indexes.
-- Run this in Supabase SQL Editor to reset the database.

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- DROP EXISTING TABLES (in dependency order)
-- ============================================

-- Verification tables
DROP TABLE IF EXISTS public.verification_evidence CASCADE;
DROP TABLE IF EXISTS public.property_verification_timeline CASCADE;
DROP TABLE IF EXISTS public.contact_verification_logs CASCADE;
DROP TABLE IF EXISTS public.property_amenities_verification CASCADE;
DROP TABLE IF EXISTS public.property_verification_checklists CASCADE;
DROP TABLE IF EXISTS public.verification_stages CASCADE;
DROP TABLE IF EXISTS public.standard_checklist_items CASCADE;

-- Core application tables
DROP TABLE IF EXISTS public.wishlists CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.room_types CASCADE;
DROP TABLE IF EXISTS public.hostels CASCADE;

-- User management tables
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.team_members CASCADE;
DROP TABLE IF EXISTS public.company_info CASCADE;
DROP TABLE IF EXISTS public.students CASCADE;
DROP TABLE IF EXISTS public.landlords CASCADE;
DROP TABLE IF EXISTS public.agents CASCADE;
DROP TABLE IF EXISTS public.admins CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- ============================================
-- PART 1: PROFILES & USER MANAGEMENT
-- ============================================

-- Profiles table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  name TEXT GENERATED ALWAYS AS (TRIM(COALESCE(first_name,'') || ' ' || COALESCE(last_name,''))) STORED,
  email TEXT,
  phone TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'landlord', 'agent', 'admin', 'super_admin')),
  verified BOOLEAN DEFAULT false,
  avatar_url TEXT,
  university TEXT,
  student_id TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
  last_sign_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for profiles
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_verified ON public.profiles(verified);
CREATE INDEX idx_profiles_id_role ON public.profiles(id, role);

-- Students table (additional student data)
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id TEXT,
  university TEXT NOT NULL,
  course TEXT,
  year_of_study TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_students_user_id ON public.students(user_id);
CREATE INDEX idx_students_university ON public.students(university);

-- Landlords table (additional landlord data)
CREATE TABLE public.landlords (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  tax_pin TEXT NOT NULL,
  bank_account TEXT NOT NULL,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  total_properties INTEGER DEFAULT 0,
  total_revenue DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_landlords_user_id ON public.landlords(user_id);

-- Agents table (verification agents)
CREATE TABLE public.agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  license_number TEXT,
  agency_name TEXT,
  region TEXT,
  verified BOOLEAN DEFAULT false,
  total_verified INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_agents_user_id ON public.agents(user_id);
CREATE INDEX idx_agents_verified ON public.agents(verified);

-- Admins table (optional additional admin data)
CREATE TABLE public.admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_admins_user_id ON public.admins(user_id);

-- ============================================
-- PART 2: PROPERTY & LISTINGS
-- ============================================

-- Hostels (properties) table
CREATE TABLE public.hostels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  landlord_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  location TEXT NOT NULL,
  university TEXT NOT NULL,
  amenities TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  room_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  verification_status TEXT DEFAULT 'pending_submission' CHECK (verification_status IN ('pending_submission', 'pending_assignment', 'pending_review', 'amenity_verification', 'document_verification', 'site_inspection', 'approved', 'rejected')),
  assigned_agent_id UUID REFERENCES public.profiles(id),
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_hostels_landlord ON public.hostels(landlord_id);
CREATE INDEX idx_hostels_agent ON public.hostels(assigned_agent_id);
CREATE INDEX idx_hostels_verified ON public.hostels(verified);
CREATE INDEX idx_hostels_verification_status ON public.hostels(verification_status);
CREATE INDEX idx_hostels_university ON public.hostels(university);
CREATE INDEX idx_hostels_price ON public.hostels(price);

-- Room types table
CREATE TABLE public.room_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hostel_id UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  type VARCHAR(100) NOT NULL CHECK (type IN ('Single Room', 'Shared Room', 'Double Room', 'Studio Apartment', 'Bedsitter', 'One Bedroom', 'Two Bedroom', 'Deluxe Room')),
  price DECIMAL(10,2) NOT NULL,
  total INTEGER NOT NULL,
  available INTEGER DEFAULT 0,
  features TEXT[] DEFAULT '{}',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_room_types_hostel ON public.room_types(hostel_id);
CREATE INDEX idx_room_types_price ON public.room_types(price);

-- ============================================
-- PART 3: BOOKINGS & PAYMENTS
-- ============================================

-- Bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hostel_id UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  room_type UUID NOT NULL REFERENCES public.room_types(id),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  service_fee DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('mpesa', 'paypal', 'card')),
  payment_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bookings_hostel ON public.bookings(hostel_id);
CREATE INDEX idx_bookings_user ON public.bookings(user_id);
CREATE INDEX idx_bookings_student ON public.bookings(student_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_created_at ON public.bookings(created_at);

-- ============================================
-- PART 4: REVIEWS & WISHLIST
-- ============================================

-- Reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hostel_id UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  helpful INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reviews_hostel ON public.reviews(hostel_id);
CREATE INDEX idx_reviews_user ON public.reviews(user_id);
CREATE INDEX idx_reviews_rating ON public.reviews(rating);

-- Wishlists table
CREATE TABLE public.wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  hostel_id UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, hostel_id)
);

CREATE INDEX idx_wishlists_user ON public.wishlists(user_id);
CREATE INDEX idx_wishlists_hostel ON public.wishlists(hostel_id);

-- ============================================
-- PART 5: NOTIFICATIONS & SYSTEM
-- ============================================

-- Notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('info', 'success', 'warning', 'error')),
  read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);

-- Company info table
CREATE TABLE public.company_info (
  id TEXT PRIMARY KEY DEFAULT 'company_info',
  mission TEXT,
  vision TEXT,
  team JSONB DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team members table
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT NOT NULL,
  image TEXT,
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_team_members_order ON public.team_members(display_order);
CREATE INDEX idx_team_members_active ON public.team_members(active);

-- ============================================
-- PART 6: VERIFICATION SYSTEM
-- ============================================

-- Standard checklist items (template)
CREATE TABLE public.standard_checklist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category VARCHAR(100) NOT NULL CHECK (category IN ('amenities', 'documents', 'legal', 'safety', 'contact_verification', 'property_condition')),
  item_name VARCHAR(255) NOT NULL,
  description TEXT,
  is_required BOOLEAN DEFAULT TRUE,
  confirmation_method VARCHAR(100) CHECK (confirmation_method IN ('phone_call', 'document', 'photo', 'inspection', 'walkthrough', 'photo_verification', 'physical_check')),
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_standard_checklist_category ON public.standard_checklist_items(category);
CREATE INDEX idx_standard_checklist_active ON public.standard_checklist_items(is_active);
CREATE INDEX idx_standard_checklist_order ON public.standard_checklist_items(order_index);

-- Verification stages (workflow tracking)
CREATE TABLE public.verification_stages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  stage_name VARCHAR(100) NOT NULL CHECK (stage_name IN (
    'document_submission',
    'amenity_verification',
    'contact_confirmation',
    'site_inspection',
    'amenity_checklist',
    'legal_verification',
    'final_approval'
  )),
  stage_order INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'skipped')),
  assigned_agent_id UUID REFERENCES public.profiles(id),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_verification_stages_property ON public.verification_stages(property_id);
CREATE INDEX idx_verification_stages_agent ON public.verification_stages(assigned_agent_id);
CREATE INDEX idx_verification_stages_status ON public.verification_stages(status);

-- Property verification checklists (per-property items)
CREATE TABLE public.property_verification_checklists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES public.profiles(id),
  checklist_item VARCHAR(255) NOT NULL,
  category VARCHAR(100) CHECK (category IN ('amenities', 'documents', 'legal', 'safety', 'contact_verification', 'property_condition')),
  is_confirmed BOOLEAN DEFAULT FALSE,
  confirmation_method VARCHAR(50) CHECK (confirmation_method IN ('phone_call', 'document_upload', 'physical_inspection', 'photo_verification', 'walkthrough')),
  notes TEXT,
  confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_checklist_property ON public.property_verification_checklists(property_id);
CREATE INDEX idx_checklist_agent ON public.property_verification_checklists(agent_id);
CREATE INDEX idx_checklist_confirmed ON public.property_verification_checklists(is_confirmed);

-- Property amenities verification
CREATE TABLE public.property_amenities_verification (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  amenity_name VARCHAR(100) NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_method VARCHAR(100) CHECK (verification_method IN ('phone_call', 'photo', 'physical_check', 'document', 'walkthrough')),
  verified_by UUID REFERENCES public.profiles(id),
  verified_at TIMESTAMPTZ,
  evidence_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_amenities_property ON public.property_amenities_verification(property_id);
CREATE INDEX idx_amenities_verified ON public.property_amenities_verification(is_verified);

-- Contact verification logs
CREATE TABLE public.contact_verification_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES public.profiles(id),
  contact_type VARCHAR(50) CHECK (contact_type IN ('landlord', 'tenant', 'neighbor', 'university_office', 'student', 'other')),
  contact_name VARCHAR(255),
  phone_number VARCHAR(20),
  call_date TIMESTAMPTZ DEFAULT NOW(),
  call_duration INTEGER,
  confirmed BOOLEAN DEFAULT FALSE,
  verification_details TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contact_logs_property ON public.contact_verification_logs(property_id);
CREATE INDEX idx_contact_logs_agent ON public.contact_verification_logs(agent_id);

-- Verification timeline/audit log
CREATE TABLE public.property_verification_timeline (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES public.profiles(id),
  action_type VARCHAR(100) NOT NULL CHECK (action_type IN (
    'checklist_item_completed',
    'phone_call_made',
    'amenity_verified',
    'stage_completed',
    'stage_started',
    'verification_approved',
    'verification_rejected',
    'document_uploaded',
    'photo_added',
    'verification_deferred',
    'verification_escalated'
  )),
  action_description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_timeline_property ON public.property_verification_timeline(property_id);
CREATE INDEX idx_timeline_agent ON public.property_verification_timeline(agent_id);
CREATE INDEX idx_timeline_created ON public.property_verification_timeline(created_at DESC);

-- Verification evidence
CREATE TABLE public.verification_evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES public.profiles(id),
  evidence_type VARCHAR(50) CHECK (evidence_type IN ('photo', 'document', 'video', 'audio')),
  file_url TEXT NOT NULL,
  file_name VARCHAR(255),
  file_size INTEGER,
  category VARCHAR(100),
  description TEXT,
  checklist_item_id UUID REFERENCES public.property_verification_checklists(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_evidence_property ON public.verification_evidence(property_id);
CREATE INDEX idx_evidence_agent ON public.verification_evidence(agent_id);

-- ============================================
-- PART 7: TRIGGERS & FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all tables with that column
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_landlords_updated_at BEFORE UPDATE ON public.landlords FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON public.agents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON public.admins FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_hostels_updated_at BEFORE UPDATE ON public.hostels FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email, phone, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.email,
    NEW.phone,
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to auto-update verification status based on checklist completion
CREATE OR REPLACE FUNCTION public.update_verification_status()
RETURNS TRIGGER AS $$
DECLARE
  total_items INTEGER;
  completed_items INTEGER;
  completion_rate DECIMAL;
BEGIN
  SELECT COUNT(*), COUNT(*) FILTER (WHERE is_confirmed)
  INTO total_items, completed_items
  FROM public.property_verification_checklists
  WHERE property_id = NEW.property_id;

  IF total_items > 0 THEN
    completion_rate := (completed_items::DECIMAL / total_items) * 100;
  ELSE
    completion_rate := 0;
  END IF;

  -- Update hostel status based on completion
  IF completion_rate >= 100 THEN
    UPDATE public.hostels
    SET verification_status = 'approved', verified = true
    WHERE id = NEW.property_id;
  ELSIF completion_rate >= 75 THEN
    UPDATE public.hostels
    SET verification_status = 'pending_review'
    WHERE id = NEW.property_id;
  ELSIF completion_rate >= 50 THEN
    UPDATE public.hostels
    SET verification_status = 'amenity_verification'
    WHERE id = NEW.property_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_verification_status_checklist
  AFTER UPDATE OF is_confirmed ON public.property_verification_checklists
  FOR EACH ROW EXECUTE FUNCTION public.update_verification_status();

-- ============================================
-- PART 8: ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landlords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_verification_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_amenities_verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_verification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_verification_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_evidence ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin/super_admin (uses JWT to avoid table recursion)
CREATE OR REPLACE FUNCTION public.is_admin_or_super()
RETURNS BOOLEAN AS $$
  SELECT (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'super_admin');
$$ LANGUAGE sql SECURITY DEFINER;

-- Profiles policies (no INSERT policy - handled by SECURITY DEFINER trigger)
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins and super_admins can view all profiles" ON public.profiles FOR SELECT USING (public.is_admin_or_super());

-- Students: users can manage own record
DROP POLICY IF EXISTS "Students can manage own record" ON public.students;
CREATE POLICY "Students can manage own record" ON public.students FOR ALL USING (auth.uid() = user_id);

-- Landlords: users can manage own record; admins/agents can manage all
DROP POLICY IF EXISTS "Landlords can manage own record" ON public.landlords;
CREATE POLICY "Landlords can manage own record" ON public.landlords FOR ALL USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins and agents can manage landlords" ON public.landlords;
CREATE POLICY "Admins and agents can manage landlords" ON public.landlords FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'agent'))
);

-- Agents: users can manage own record; admins can manage all
DROP POLICY IF EXISTS "Agents can manage own record" ON public.agents;
CREATE POLICY "Agents can manage own record" ON public.agents FOR ALL USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can manage agents" ON public.agents;
CREATE POLICY "Admins can manage agents" ON public.agents FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Admins: users can manage own record
DROP POLICY IF EXISTS "Admins can manage own record" ON public.admins;
CREATE POLICY "Admins can manage own record" ON public.admins FOR ALL USING (auth.uid() = user_id);

-- Hostels: Public can view verified; Owners/Agents can manage
DROP POLICY IF EXISTS "Verified hostels are viewable by everyone" ON public.hostels;
DROP POLICY IF EXISTS "Landlords can manage own hostels" ON public.hostels;
DROP POLICY IF EXISTS "Agents and admins can manage assigned hostels" ON public.hostels;

CREATE POLICY "Verified hostels are viewable by everyone" ON public.hostels
  FOR SELECT USING (verified = true);

CREATE POLICY "Landlords can manage own hostels" ON public.hostels FOR ALL
  USING (auth.uid() = landlord_id);

CREATE POLICY "Agents and admins can manage assigned hostels" ON public.hostels FOR ALL
  USING (
    assigned_agent_id = auth.uid()
    OR public.is_admin_or_super()
  );

-- Room types: inherit from hostel
DROP POLICY IF EXISTS "Room types are manageable by hostel owner" ON public.room_types;
DROP POLICY IF EXISTS "Room types are viewable with hostel" ON public.room_types;

CREATE POLICY "Room types are manageable by hostel owner" ON public.room_types FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.hostels WHERE id = hostel_id AND landlord_id = auth.uid()
  ));

CREATE POLICY "Room types are viewable with hostel" ON public.room_types FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.hostels WHERE id = hostel_id AND verified = true
  ));

-- Bookings
DROP POLICY IF EXISTS "Students can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Landlords can view property bookings" ON public.bookings;

CREATE POLICY "Students can view own bookings" ON public.bookings FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Landlords can view property bookings" ON public.bookings FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.hostels WHERE id = hostel_id AND landlord_id = auth.uid()
  ));

-- Reviews
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON public.reviews;
DROP POLICY IF EXISTS "Students can manage own reviews" ON public.reviews;

CREATE POLICY "Reviews are viewable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Students can manage own reviews" ON public.reviews FOR ALL
  USING (auth.uid() = user_id);

-- Wishlists
DROP POLICY IF EXISTS "Users can manage own wishlist" ON public.wishlists;
CREATE POLICY "Users can manage own wishlist" ON public.wishlists FOR ALL
  USING (auth.uid() = user_id);

-- Notifications
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;

CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Company info: Readable by all, Admins can update
DROP POLICY IF EXISTS "Company info is viewable by everyone" ON public.company_info;
DROP POLICY IF EXISTS "Admins can manage company info" ON public.company_info;

CREATE POLICY "Company info is viewable by everyone" ON public.company_info FOR SELECT USING (true);
CREATE POLICY "Admins and super_admins can manage company info" ON public.company_info FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));

-- Team members: Readable by all, Admins can manage
DROP POLICY IF EXISTS "Team members are viewable by everyone" ON public.team_members;
DROP POLICY IF EXISTS "Admins can manage team members" ON public.team_members;

CREATE POLICY "Team members are viewable by everyone" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Admins can manage team members" ON public.team_members FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Verification tables: Agents and Admins can manage
-- Verification stages
DROP POLICY IF EXISTS "Agents and admins can view verification stages" ON public.verification_stages;
DROP POLICY IF EXISTS "Agents can update assigned verification stages" ON public.verification_stages;

CREATE POLICY "Agents and admins can view verification stages" ON public.verification_stages FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'agent'))
  );

CREATE POLICY "Agents can update assigned verification stages" ON public.verification_stages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.hostels h
      WHERE h.id = property_id AND h.assigned_agent_id = auth.uid()
    )
  );

-- Property verification checklists
DROP POLICY IF EXISTS "Agents and admins can view checklists" ON public.property_verification_checklists;
DROP POLICY IF EXISTS "Agents can manage checklists for assigned properties" ON public.property_verification_checklists;

CREATE POLICY "Agents and admins can view checklists" ON public.property_verification_checklists FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'agent'))
  );

CREATE POLICY "Agents can manage checklists for assigned properties" ON public.property_verification_checklists FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.hostels h
      WHERE h.id = property_id AND h.assigned_agent_id = auth.uid()
    )
  );

-- Property amenities verification
DROP POLICY IF EXISTS "Agents and admins can view amenities verification" ON public.property_amenities_verification;
DROP POLICY IF EXISTS "Agents can manage amenities for assigned properties" ON public.property_amenities_verification;

CREATE POLICY "Agents and admins can view amenities verification" ON public.property_amenities_verification FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'agent'))
  );

CREATE POLICY "Agents can manage amenities for assigned properties" ON public.property_amenities_verification FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.hostels h
      WHERE h.id = property_id AND h.assigned_agent_id = auth.uid()
    )
  );

-- Contact verification logs
DROP POLICY IF EXISTS "Agents and admins can view contact logs" ON public.contact_verification_logs;
DROP POLICY IF EXISTS "Agents can create contact logs" ON public.contact_verification_logs;

CREATE POLICY "Agents and admins can view contact logs" ON public.contact_verification_logs FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'agent'))
  );

CREATE POLICY "Agents can create contact logs" ON public.contact_verification_logs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.hostels h
      WHERE h.id = property_id AND h.assigned_agent_id = auth.uid()
    )
  );

-- Verification timeline
DROP POLICY IF EXISTS "Agents and admins can view timeline" ON public.property_verification_timeline;
DROP POLICY IF EXISTS "Agents can create timeline entries" ON public.property_verification_timeline;

CREATE POLICY "Agents and admins can view timeline" ON public.property_verification_timeline FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'agent'))
  );

CREATE POLICY "Agents can create timeline entries" ON public.property_verification_timeline FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.hostels h
      WHERE h.id = property_id AND h.assigned_agent_id = auth.uid()
    )
  );

-- Verification evidence
DROP POLICY IF EXISTS "Agents and admins can view evidence" ON public.verification_evidence;
DROP POLICY IF EXISTS "Agents can manage evidence" ON public.verification_evidence;

CREATE POLICY "Admins and super_admins can view evidence" ON public.verification_evidence FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.hostels h WHERE h.id = property_id AND h.assigned_agent_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin'))
  );

CREATE POLICY "Admins and super_admins can manage evidence" ON public.verification_evidence FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.hostels h WHERE h.id = property_id AND h.assigned_agent_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin'))
  );

-- ============================================
-- PART 9: SEED DATA
-- ============================================

-- Seed standard checklist items
INSERT INTO public.standard_checklist_items (category, item_name, description, is_required, confirmation_method, order_index) VALUES
-- Contact Verification
('contact_verification', 'Landlord Identity Verification', 'Verify landlord identity through government ID and cross-reference with property ownership', TRUE, 'document', 1),
('contact_verification', 'Landlord Phone Verification', 'Call landlord to confirm property listing and verify contact details', TRUE, 'phone_call', 2),
('contact_verification', 'Tenant Reference', 'Contact current tenant for reference (if occupied)', FALSE, 'phone_call', 3),
('contact_verification', 'Neighbor Verification', 'Verify property existence with neighboring properties', FALSE, 'phone_call', 4),

-- Property Condition
('property_condition', 'Physical Inspection', 'Site visit to verify property condition matches listing', TRUE, 'inspection', 5),
('property_condition', 'Photo Verification', 'Verify all listing photos match actual property', TRUE, 'photo_verification', 6),
('property_condition', 'Safety Inspection', 'Check locks, lighting, fire exits, and security', TRUE, 'inspection', 7),

-- Amenities
('amenities', 'Water Supply', 'Confirm running water and storage capacity', TRUE, 'physical_check', 8),
('amenities', 'Electricity', 'Verify stable power and backup if advertised', TRUE, 'physical_check', 9),
('amenities', 'Internet', 'Confirm internet availability and speed', FALSE, 'physical_check', 10),
('amenities', 'Security Features', 'Verify guards, gates, CCTV if listed', TRUE, 'physical_check', 11),
('amenities', 'Furniture', 'Verify all listed furniture is present and functional', TRUE, 'physical_check', 12),
('amenities', 'Sanitation', 'Verify toilets, bathrooms, kitchen facilities', TRUE, 'physical_check', 13),

-- Legal
('legal', 'Ownership Documents', 'Verify property ownership or rental authorization', TRUE, 'document', 14),
('legal', 'Local Permits', 'Check permits from local authority', FALSE, 'document', 15),
('legal', 'Fire Safety', 'Verify fire safety compliance', FALSE, 'document', 16),

-- Property Description (Documents)
('documents', 'Floor Plan', 'Verify room count, sizes, layout matches listing', TRUE, 'inspection', 17),
('documents', 'Price Verification', 'Confirm rental price with landlord', TRUE, 'phone_call', 18),
('documents', 'House Rules', 'Verify documented and reasonable house rules', TRUE, 'document', 19),

-- Final Safety Checks
('safety', 'Student Suitability', 'Final safety check for student living', TRUE, 'inspection', 20),
('safety', 'Accessibility', 'Verify access to transport, campus, hospitals', TRUE, 'inspection', 21);

-- Seed default company info
INSERT INTO public.company_info (id, mission, vision, updated_at) VALUES
('company_info',
 'To simplify and democratize student accommodation in Kenya by providing a transparent, secure, and user-friendly platform that connects students with quality, affordable hostels near their universities.',
 'To become the leading student accommodation platform in East Africa, empowering students to focus on their education while we take care of their housing needs through innovation and excellence.',
 NOW())
 ON CONFLICT (id) DO NOTHING;

-- ============================================
-- PART 10: STORAGE BUCKET SETUP (Comment: Run separately in Supabase)
-- ============================================
--
-- Run these SQL commands separately in Supabase to create storage buckets:
--
-- -- Storage for hostel images
-- INSERT INTO storage.buckets (id, name, public) VALUES ('hostels', 'hostels', true);
--
-- -- Storage for avatars
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
--
-- -- Storage for verification evidence
-- INSERT INTO storage.buckets (id, name, public) VALUES ('verification', 'verification', false);
--
-- Then set up storage policies in the Supabase dashboard.

-- ============================================
-- SCHEMA SETUP COMPLETE
-- ============================================
SELECT 'Schema created successfully!' AS status;
