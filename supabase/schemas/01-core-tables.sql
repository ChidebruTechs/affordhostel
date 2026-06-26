-- Core user tables - run this first
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
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

CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_verified ON public.profiles(verified);
CREATE INDEX idx_profiles_id_role ON public.profiles(id, role);

-- Students table
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

-- Landlords table
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

-- Agents table
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

-- Admins table
CREATE TABLE public.admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_admins_user_id ON public.admins(user_id);

SELECT 'Core user tables created successfully!' AS status;