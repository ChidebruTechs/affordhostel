-- Seed data and signup_complete function - run last

-- Seed standard checklist items
INSERT INTO public.standard_checklist_items (category, item_name, description, is_required, confirmation_method, order_index) VALUES
('contact_verification', 'Landlord Identity Verification', 'Verify landlord identity through government ID and cross-reference with property ownership', TRUE, 'document', 1),
('contact_verification', 'Landlord Phone Verification', 'Call landlord to confirm property listing and verify contact details', TRUE, 'phone_call', 2),
('contact_verification', 'Tenant Reference', 'Contact current tenant for reference (if occupied)', FALSE, 'phone_call', 3),
('contact_verification', 'Neighbor Verification', 'Verify property existence with neighboring properties', FALSE, 'phone_call', 4),
('property_condition', 'Physical Inspection', 'Site visit to verify property condition matches listing', TRUE, 'inspection', 5),
('property_condition', 'Photo Verification', 'Verify all listing photos match actual property', TRUE, 'photo_verification', 6),
('property_condition', 'Safety Inspection', 'Check locks, lighting, fire exits, and security', TRUE, 'inspection', 7),
('amenities', 'Water Supply', 'Confirm running water and storage capacity', TRUE, 'physical_check', 8),
('amenities', 'Electricity', 'Verify stable power and backup if advertised', TRUE, 'physical_check', 9),
('amenities', 'Internet', 'Confirm internet availability and speed', FALSE, 'physical_check', 10),
('amenities', 'Security Features', 'Verify guards, gates, CCTV if listed', TRUE, 'physical_check', 11),
('amenities', 'Furniture', 'Verify all listed furniture is present and functional', TRUE, 'physical_check', 12),
('amenities', 'Sanitation', 'Verify toilets, bathrooms, kitchen facilities', TRUE, 'physical_check', 13),
('legal', 'Ownership Documents', 'Verify property ownership or rental authorization', TRUE, 'document', 14),
('legal', 'Local Permits', 'Check permits from local authority', FALSE, 'document', 15),
('legal', 'Fire Safety', 'Verify fire safety compliance', FALSE, 'document', 16),
('documents', 'Floor Plan', 'Verify room count, sizes, layout matches listing', TRUE, 'inspection', 17),
('documents', 'Price Verification', 'Confirm rental price with landlord', TRUE, 'phone_call', 18),
('documents', 'House Rules', 'Verify documented and reasonable house rules', TRUE, 'document', 19),
('safety', 'Student Suitability', 'Final safety check for student living', TRUE, 'inspection', 20),
('safety', 'Accessibility', 'Verify access to transport, campus, hospitals', TRUE, 'inspection', 21);

-- Seed default company info
INSERT INTO public.company_info (id, mission, vision, updated_at) VALUES
('company_info',
 'To simplify and democratize student accommodation in Kenya by providing a transparent, secure, and user-friendly platform that connects students with quality, affordable hostels near their universities.',
 'To become the leading student accommodation platform in East Africa, empowering students to focus on their education while we take care of their housing needs through innovation and excellence.',
 NOW())
 ON CONFLICT (id) DO NOTHING;

-- signup_complete function - critical for signup flow
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

  result := jsonb_build_object(
    'success', true,
    'message', 'Signup completed successfully. Please check your email to confirm.',
    'user_id', p_user_id,
    'email', p_email,
    'role', p_role
  );

  RETURN result;

EXCEPTION WHEN OTHERS THEN
  result := jsonb_build_object(
    'success', false,
    'error', SQLERRM,
    'user_id', p_user_id
  );
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.signup_complete TO authenticated, anon;

SELECT 'Seed data and signup_complete function created successfully!' AS status;