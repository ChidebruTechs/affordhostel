-- System and notifications tables - run after bookings-tables

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

SELECT 'System tables created successfully!' AS status;