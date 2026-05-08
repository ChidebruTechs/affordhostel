-- =============================================
-- SUPABASE AUXILIARY SETUP
-- Storage Buckets, RLS Policies for Storage, and Additional Config
-- =============================================

-- ============================================
-- PART 1: Storage Buckets
-- ============================================

-- Create storage buckets (must be done via SQL or Supabase Dashboard)
-- These are the three main buckets needed:

-- 1. Hostel Images Bucket (publicly readable)
-- Note: In Supabase Dashboard > Storage, create bucket named "hostels" with public access

-- 2. Avatar/Profile Pictures Bucket (publicly readable)
-- Note: In Supabase Dashboard > Storage, create bucket named "avatars" with public access

-- 3. Verification Evidence Bucket (private, agent/admin access only)
-- Note: In Supabase Dashboard > Storage, create bucket named "verification" with private access

-- ============================================
-- PART 2: Storage Policies
-- ============================================

-- Policy for hostels bucket (public can view, authenticated can upload)
-- Run these after creating buckets in the Supabase Dashboard:

-- For "hostels" bucket:
-- CREATE POLICY "Public can view hostel images" ON storage.objects FOR SELECT
--   USING (bucket_id = 'hostels');
-- CREATE POLICY "Authenticated users can upload hostel images" ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'hostels' AND auth.role() = 'authenticated');

-- For "avatars" bucket:
-- CREATE POLICY "Public can view avatars" ON storage.objects FOR SELECT
--   USING (bucket_id = 'avatars');
-- CREATE POLICY "Users can upload own avatar" ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- For "verification" bucket (private):
-- CREATE POLICY "Agents and admins can upload evidence" ON storage.objects FOR INSERT
--   WITH CHECK (
--     bucket_id = 'verification' AND
--     EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('agent', 'admin'))
--   );
-- CREATE POLICY "Agents and admins can view evidence" ON storage.objects FOR SELECT
--   USING (
--     bucket_id = 'verification' AND
--     EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('agent', 'admin'))
--   );

-- ============================================
-- PART 3: Additional Indexes for Performance
-- ============================================

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_hostels_landlord_verified ON public.hostels(landlord_id, verified);
CREATE INDEX IF NOT EXISTS idx_hostels_agent_status ON public.hostels(assigned_agent_id, verification_status);
CREATE INDEX IF NOT EXISTS idx_bookings_hostel_status ON public.bookings(hostel_id, status);
CREATE INDEX IF NOT EXISTS idx_bookings_user_status ON public.bookings(user_id, status);
CREATE INDEX IF NOT EXISTS idx_reviews_hostel_rating ON public.reviews(hostel_id, rating);
CREATE INDEX IF NOT EXISTS idx_wishlists_user_created ON public.wishlists(user_id, created_at DESC);

-- Full-text search index for hostel search (optional, requires pg_trgm)
-- CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- CREATE INDEX idx_hostels_name_trgm ON public.hostels USING gin (name gin_trgm_ops);
-- CREATE INDEX idx_hostels_location_trgm ON public.hostels USING gin (location gin_trgm_ops);
-- CREATE INDEX idx_hostels_description_trgm ON public.hostels USING gin (description gin_trgm_ops);

-- ============================================
-- PART 4: Functions for Common Operations
-- ============================================

-- Function to update property verification status automatically
CREATE OR REPLACE FUNCTION public.update_hostel_verification_progress(
  p_property_id UUID,
  p_completed_items INTEGER,
  p_total_items INTEGER
)
RETURNS VOID AS $$
DECLARE
  completion_percentage DECIMAL;
  current_status TEXT;
BEGIN
  -- Calculate completion percentage
  IF p_total_items > 0 THEN
    completion_percentage := (p_completed_items::DECIMAL / p_total_items) * 100;
  ELSE
    completion_percentage := 0;
  END IF;

  -- Get current status
  SELECT verification_status INTO current_status
  FROM public.hostels
  WHERE id = p_property_id;

  -- Update based on completion
  IF completion_percentage = 100 THEN
    UPDATE public.hostels
    SET verification_status = 'approved', verified = true, updated_at = NOW()
    WHERE id = p_property_id;
  ELSIF completion_percentage >= 75 THEN
    UPDATE public.hostels
    SET verification_status = 'pending_review', updated_at = NOW()
    WHERE id = p_property_id;
  ELSIF completion_percentage >= 50 THEN
    UPDATE public.hostels
    SET verification_status = 'amenity_verification', updated_at = NOW()
    WHERE id = p_property_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to get property verification summary
CREATE OR REPLACE FUNCTION public.get_verification_summary(p_property_id UUID)
RETURNS TABLE (
  total_checklist_items BIGINT,
  completed_checklist_items BIGINT,
  total_amenities BIGINT,
  verified_amenities BIGINT,
  completion_percentage DECIMAL,
  current_status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM public.property_verification_checklists WHERE property_id = p_property_id) AS total_checklist_items,
    (SELECT COUNT(*) FROM public.property_verification_checklists WHERE property_id = p_property_id AND is_confirmed = true) AS completed_checklist_items,
    (SELECT COUNT(*) FROM public.property_amenities_verification WHERE property_id = p_property_id) AS total_amenities,
    (SELECT COUNT(*) FROM public.property_amenities_verification WHERE property_id = p_property_id AND is_verified = true) AS verified_amenities,
    CASE
      WHEN (SELECT COUNT(*) FROM public.property_verification_checklists WHERE property_id = p_property_id) > 0
      THEN ROUND(
        (SELECT COUNT(*)::DECIMAL FROM public.property_verification_checklists WHERE property_id = p_property_id AND is_confirmed = true) /
        (SELECT COUNT(*) FROM public.property_verification_checklists WHERE property_id = p_property_id) * 100
      , 2)
      ELSE 0
    END AS completion_percentage,
    h.verification_status AS current_status
  FROM public.hostels h
  WHERE h.id = p_property_id;
END;
$$ LANGUAGE plpgsql;

-- Function to assign agent to property (admin action)
CREATE OR REPLACE FUNCTION public.assign_agent_to_property(
  p_property_id UUID,
  p_agent_id UUID
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.hostels
  SET
    assigned_agent_id = p_agent_id,
    verification_status = 'pending_review',
    updated_at = NOW()
  WHERE id = p_property_id;

  -- Create verification stages for this property
  INSERT INTO public.verification_stages (property_id, stage_name, stage_order, status)
  VALUES
    (p_property_id, 'document_submission', 1, 'pending'),
    (p_property_id, 'amenity_verification', 2, 'pending'),
    (p_property_id, 'contact_confirmation', 3, 'pending'),
    (p_property_id, 'site_inspection', 4, 'pending'),
    (p_property_id, 'legal_verification', 5, 'pending'),
    (p_property_id, 'final_approval', 6, 'pending')
  ON CONFLICT (property_id, stage_name) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- PART 5: Views for Common Queries
-- ============================================

-- View for verified hostels with full details
CREATE OR REPLACE VIEW public.verified_hostels_view AS
SELECT
  h.*,
  l.business_name as landlord_business_name,
  p.email as landlord_email,
  p.phone as landlord_phone,
  COALESCE(AVG(r.rating), 0) as average_rating,
  COUNT(DISTINCT r.id) as review_count,
  array_agg(DISTINCT rt.type) FILTER (WHERE rt.type IS NOT NULL) as room_types_available,
  COUNT(DISTINCT b.id) FILTER (WHERE b.status = 'confirmed') as active_bookings
FROM public.hostels h
INNER JOIN public.profiles p ON h.landlord_id = p.id
INNER JOIN public.landlords l ON p.id = l.user_id
LEFT JOIN public.reviews r ON h.id = r.hostel_id
LEFT JOIN public.room_types rt ON h.id = rt.hostel_id AND rt.available > 0
LEFT JOIN public.bookings b ON h.id = b.hostel_id
WHERE h.verified = true AND h.available = true
GROUP BY h.id, l.business_name, p.email, p.phone;

-- View for agent dashboard: assigned properties
CREATE OR REPLACE VIEW public.agent_assigned_properties_view AS
SELECT
  h.id,
  h.name,
  h.location,
  h.university,
  h.price,
  h.verification_status,
  h.assigned_agent_id,
  (p.first_name || ' ' || p.last_name) as landlord_name,
  p.email as landlord_email,
  p.phone as landlord_phone,
  COUNT(rt.id) as total_room_types,
  SUM(rt.total) as total_rooms,
  COUNT(DISTINCT vc.id) as checklist_items_count,
  COUNT(DISTINCT vc.id) FILTER (WHERE vc.is_confirmed = true) as completed_checklist_items
FROM public.hostels h
INNER JOIN public.profiles p ON h.landlord_id = p.id
LEFT JOIN public.room_types rt ON h.id = rt.hostel_id
LEFT JOIN public.property_verification_checklists vc ON h.id = vc.property_id
WHERE h.assigned_agent_id IS NOT NULL
GROUP BY h.id, p.first_name, p.last_name, p.email, p.phone;

-- View for admin dashboard: verification queue
CREATE OR REPLACE VIEW public.verification_queue_view AS
SELECT
  h.id,
  h.name,
  h.location,
  h.university,
  h.price,
  h.created_at as submitted_at,
  (p.first_name || ' ' || p.last_name) as landlord_name,
  p.email as landlord_email,
  COUNT(DISTINCT vc.id) as checklist_completion,
  (SELECT COUNT(*) FROM public.property_verification_checklists WHERE property_id = h.id) as total_checklist_items,
  CASE
    WHEN h.assigned_agent_id IS NULL THEN 'unassigned'
    WHEN h.verification_status = 'approved' THEN 'completed'
    ELSE 'in_progress'
  END as queue_status
FROM public.hostels h
INNER JOIN public.profiles p ON h.landlord_id = p.id
LEFT JOIN public.property_verification_checklists vc ON h.id = vc.property_id AND vc.is_confirmed = true
WHERE h.verified = false
GROUP BY h.id, p.first_name, p.last_name, p.email, p.phone;

-- ============================================
-- PART 6: Cleanup Commands (optional)
-- ============================================

-- To reset all user data but keep schema, run:
-- DELETE FROM public.wishlists;
-- DELETE FROM public.reviews;
-- DELETE FROM public.bookings;
-- DELETE FROM public.property_verification_checklists;
-- DELETE FROM public.property_amenities_verification;
-- DELETE FROM public.contact_verification_logs;
-- DELETE FROM public.property_verification_timeline;
-- DELETE FROM public.verification_evidence;
-- DELETE FROM public.verification_stages;
-- DELETE FROM public.room_types;
-- DELETE FROM public.hostels;
-- DELETE FROM public.students;
-- DELETE FROM public.landlords;
-- DELETE FROM public.agents;
-- DELETE FROM public.admins;
-- DELETE FROM public.team_members;
-- DELETE FROM public.notifications;
-- -- Keep company_info if desired

-- ============================================
-- SETUP COMPLETE
-- ============================================
SELECT 'Auxiliary setup complete! Create storage buckets via Supabase Dashboard.' AS status;
