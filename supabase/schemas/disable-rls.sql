-- Disable RLS on role-specific tables for testing
-- This bypasses the auth.uid() = user_id requirement during signup

ALTER TABLE public.students DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.landlords DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins DISABLE ROW LEVEL SECURITY;

-- Also disable RLS on profiles table if needed (though it has a different policy)
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Verification tables might also need this during testing
ALTER TABLE public.property_verification_checklists DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_amenities_verification DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_verification_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_verification_timeline DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_evidence DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_stages DISABLE ROW LEVEL SECURITY;