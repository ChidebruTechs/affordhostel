-- Signup Complete RPC Function
-- Deploy this in Supabase SQL Editor

CREATE OR REPLACE FUNCTION public.signup_complete(
  p_user_id UUID,
  p_first_name TEXT,
  p_last_name TEXT,
  p_email TEXT,
  p_phone TEXT,
  p_role TEXT,
  p_university TEXT DEFAULT NULL,
  p_student_id TEXT DEFAULT NULL,
  p_course TEXT DEFAULT NULL,
  p_year_of_study TEXT DEFAULT NULL,
  p_business_name TEXT DEFAULT NULL,
  p_tax_pin TEXT DEFAULT NULL,
  p_bank_account TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  -- Insert into profiles table first (required for foreign key constraint)
  -- Note: handle_new_user trigger may have already inserted, so use ON CONFLICT
  INSERT INTO public.profiles (id, first_name, last_name, email, phone, role)
  VALUES (
    p_user_id,
    p_first_name,
    p_last_name,
    p_email,
    p_phone,
    COALESCE(p_role, 'student')
  ) ON CONFLICT (id) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    role = EXCLUDED.role;

  -- Insert into role-specific table based on role
  IF p_role = 'student' THEN
    INSERT INTO public.students (user_id, university, student_id, course, year_of_study, is_verified)
    VALUES (p_user_id, p_university, p_student_id, p_course, p_year_of_study, false)
    ON CONFLICT (user_id) DO UPDATE SET
      university = EXCLUDED.university,
      student_id = EXCLUDED.student_id,
      course = EXCLUDED.course,
      year_of_study = EXCLUDED.year_of_study;
  ELSIF p_role = 'landlord' THEN
    INSERT INTO public.landlords (user_id, business_name, tax_pin, bank_account, verification_status)
    VALUES (p_user_id, p_business_name, p_tax_pin, p_bank_account, 'pending')
    ON CONFLICT (user_id) DO UPDATE SET
      business_name = EXCLUDED.business_name,
      tax_pin = EXCLUDED.tax_pin,
      bank_account = EXCLUDED.bank_account;
  ELSIF p_role = 'agent' THEN
    INSERT INTO public.agents (user_id) VALUES (p_user_id)
    ON CONFLICT (user_id) DO NOTHING;
  ELSIF p_role = 'admin' THEN
    INSERT INTO public.admins (user_id) VALUES (p_user_id)
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  -- Return success JSON for email confirmation notification
  result := jsonb_build_object(
    'success', true,
    'message', 'Signup completed successfully. Please check your email to confirm.',
    'user_id', p_user_id,
    'email', p_email,
    'role', p_role
  );

  RETURN result;

EXCEPTION WHEN OTHERS THEN
  -- Return error JSON
  result := jsonb_build_object(
    'success', false,
    'error', SQLERRM,
    'user_id', p_user_id
  );
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.signup_complete TO authenticated, anon;

SELECT 'signup_complete function deployed!' AS status;