-- Authentication and User Profiles Schema for Supabase
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE (extends Supabase auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'landlord', 'agent', 'admin')),
  verified BOOLEAN DEFAULT false,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- ============================================
-- STUDENTS TABLE (additional student-specific data)
-- ============================================
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  university TEXT,
  student_id TEXT UNIQUE,
  course TEXT,
  year_of_study TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_students_user_id ON public.students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_student_id ON public.students(student_id);

-- ============================================
-- LANDLORDS TABLE (additional landlord-specific data)
-- ============================================
CREATE TABLE IF NOT EXISTS public.landlords (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT,
  tax_pin TEXT,
  bank_account TEXT,
  verification_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_landlords_user_id ON public.landlords(user_id);

-- Landlords policies
DROP POLICY IF EXISTS "Users can view own landlord record" ON public.landlords;
DROP POLICY IF EXISTS "Users can update own landlord record" ON public.landlords;
DROP POLICY IF EXISTS "Users can insert own landlord record" ON public.landlords;
CREATE POLICY "Users can view own landlord record" ON public.landlords
   FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own landlord record" ON public.landlords
   FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own landlord record" ON public.landlords
   FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- AGENTS TABLE (verification agents)
-- ============================================
CREATE TABLE IF NOT EXISTS public.agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  license_number TEXT,
  agency_name TEXT,
  region TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agents_user_id ON public.agents(user_id);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into profiles
  INSERT INTO public.profiles (id, first_name, last_name, email, phone, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.email,
    NEW.phone,
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );

  -- Role-specific inserts are handled manually in the app code

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile and role record on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for all tables to update timestamps
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
   BEFORE UPDATE ON public.profiles
   FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_students_updated_at ON public.students;
CREATE TRIGGER update_students_updated_at
   BEFORE UPDATE ON public.students
   FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_landlords_updated_at ON public.landlords;
CREATE TRIGGER update_landlords_updated_at
   BEFORE UPDATE ON public.landlords
   FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_agents_updated_at ON public.agents;
CREATE TRIGGER update_agents_updated_at
   BEFORE UPDATE ON public.agents
   FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landlords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

-- Allow trigger function to bypass RLS
DROP POLICY IF EXISTS "Trigger bypass" ON public.profiles;
DROP POLICY IF EXISTS "Trigger bypass" ON public.students;
DROP POLICY IF EXISTS "Trigger bypass" ON public.landlords;
DROP POLICY IF EXISTS "Trigger bypass" ON public.agents;
CREATE POLICY "Trigger bypass" ON public.profiles FOR ALL USING (auth.uid() IS NULL);
CREATE POLICY "Trigger bypass" ON public.students FOR ALL USING (auth.uid() IS NULL);
CREATE POLICY "Trigger bypass" ON public.landlords FOR ALL USING (auth.uid() IS NULL);
CREATE POLICY "Trigger bypass" ON public.agents FOR ALL USING (auth.uid() IS NULL);

-- Profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
   FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
   FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
   FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
   FOR SELECT USING (
     EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
   );

-- Students policies
DROP POLICY IF EXISTS "Users can view own student record" ON public.students;
DROP POLICY IF EXISTS "Users can update own student record" ON public.students;
DROP POLICY IF EXISTS "Users can insert own student record" ON public.students;
DROP POLICY IF EXISTS "Landlords can view student records" ON public.students;
CREATE POLICY "Users can view own student record" ON public.students
   FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own student record" ON public.students
   FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own student record" ON public.students
   FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Landlords can view student records" ON public.students
   FOR SELECT USING (
     EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'landlord')
   );