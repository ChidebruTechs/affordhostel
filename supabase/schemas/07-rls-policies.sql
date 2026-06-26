-- RLS Policies - run after functions

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

-- Helper function to check if current user is admin/super_admin
CREATE OR REPLACE FUNCTION public.is_admin_or_super()
RETURNS BOOLEAN AS $$
  SELECT (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'super_admin');
$$ LANGUAGE sql SECURITY DEFINER;

-- Profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins and super_admins can view all profiles" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins and super_admins can view all profiles" ON public.profiles FOR SELECT USING (public.is_admin_or_super());

-- Students policies
DROP POLICY IF EXISTS "Students can manage own record" ON public.students;
CREATE POLICY "Students can manage own record" ON public.students
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Landlords policies
DROP POLICY IF EXISTS "Landlords can manage own record" ON public.landlords;
DROP POLICY IF EXISTS "Admins and agents can manage landlords" ON public.landlords;

CREATE POLICY "Landlords can manage own record" ON public.landlords
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins and agents can manage landlords" ON public.landlords FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'agent'))
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'agent'))
  );

-- Agents policies
DROP POLICY IF EXISTS "Agents can manage own record" ON public.agents;
DROP POLICY IF EXISTS "Admins can manage agents" ON public.agents;

CREATE POLICY "Agents can manage own record" ON public.agents
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage agents" ON public.agents FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins policies
DROP POLICY IF EXISTS "Admins can manage own record" ON public.admins;
CREATE POLICY "Admins can manage own record" ON public.admins
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Hostels policies
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

-- Room types policies
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

-- Bookings policies
DROP POLICY IF EXISTS "Students can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Landlords can view property bookings" ON public.bookings;

CREATE POLICY "Students can view own bookings" ON public.bookings FOR ALL
  USING (auth.uid() = user_id);
CREATE POLICY "Landlords can view property bookings" ON public.bookings FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.hostels WHERE id = hostel_id AND landlord_id = auth.uid()
  ));

-- Reviews policies
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON public.reviews;
DROP POLICY IF EXISTS "Students can manage own reviews" ON public.reviews;

CREATE POLICY "Reviews are viewable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Students can manage own reviews" ON public.reviews FOR ALL
  USING (auth.uid() = user_id);

-- Wishlists policies
DROP POLICY IF EXISTS "Users can manage own wishlist" ON public.wishlists;
CREATE POLICY "Users can manage own wishlist" ON public.wishlists FOR ALL
  USING (auth.uid() = user_id);

-- Notifications policies
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;

CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Company info policies
DROP POLICY IF EXISTS "Company info is viewable by everyone" ON public.company_info;
DROP POLICY IF EXISTS "Admins can manage company info" ON public.company_info;

CREATE POLICY "Company info is viewable by everyone" ON public.company_info FOR SELECT USING (true);
CREATE POLICY "Admins and super_admins can manage company info" ON public.company_info FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));

-- Team members policies
DROP POLICY IF EXISTS "Team members are viewable by everyone" ON public.team_members;
DROP POLICY IF EXISTS "Admins can manage team members" ON public.team_members;

CREATE POLICY "Team members are viewable by everyone" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Admins can manage team members" ON public.team_members FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

SELECT 'RLS policies created successfully!' AS status;