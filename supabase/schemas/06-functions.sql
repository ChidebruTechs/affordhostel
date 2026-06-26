-- Functions and triggers - run after all tables are created

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
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON public.notifications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email, phone, role)
  VALUES (
    NEW.id,
    NEW.user_metadata->>'first_name',
    NEW.user_metadata->>'last_name',
    NEW.email,
    NEW.phone,
    COALESCE(NEW.user_metadata->>'role', 'student')
  ) ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

SELECT 'Functions and triggers created successfully!' AS status;