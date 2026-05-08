# Supabase Database Setup Guide

## Overview

This document explains how to set up and reset the Supabase database for the AffordHostel platform.

## Schema Files

1. **`supabase/schemas/complete-schema.sql`** - Main schema with all tables, relationships, RLS policies, and seed data
2. **`supabase/schemas/auxiliary-setup.sql`** - Additional setup: storage bucket policies, helper functions, views

## Required Storage Buckets

Create these buckets in **Supabase Dashboard → Storage**:

### 1. `hostels` (Public)
- Used for: Hostel listing images
- Access: Public read, authenticated write
- Files: `hostel-images/` folder

### 2. `avatars` (Public)
- Used for: User profile pictures
- Access: Public read, authenticated write
- Files: `team-members/`, `profiles/` folders

### 3. `verification` (Private)
- Used for: Agent verification evidence (documents, photos)
- Access: Agents & Admins only

## Setup Steps

### Step 1: Drop Existing Tables (if needed)
The `complete-schema.sql` file automatically drops all existing tables with `CASCADE`, which will delete all data. Make sure you have a backup if needed.

### Step 2: Run Main Schema
1. Go to **Supabase Dashboard → SQL Editor**
2. Copy the contents of `supabase/schemas/complete-schema.sql`
3. Paste and run the query

### Step 3: Run Auxiliary Setup (Optional)
Run `supabase/schemas/auxiliary-setup.sql` to create:
- Helper functions (`update_hostel_verification_progress`, `get_verification_summary`, `assign_agent_to_property`)
- Views (`verified_hostels_view`, `agent_assigned_properties_view`, `verification_queue_view`)
- Indexes for better performance

### Step 4: Create Storage Buckets
In **Supabase Dashboard → Storage**:
1. Create bucket `hostels` → Set to **Public**
2. Create bucket `avatars` → Set to **Public**
3. Create bucket `verification` → Set to **Private**

### Step 5: Add Storage Policies
Run these SQL commands in **SQL Editor** after creating buckets:

```sql
-- Hostels bucket policies
CREATE POLICY "Public can view hostel images" ON storage.objects FOR SELECT
  USING (bucket_id = 'hostels');

CREATE POLICY "Authenticated users can upload hostel images" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'hostels' AND auth.role() = 'authenticated');

-- Avatars bucket policies
CREATE POLICY "Public can view avatars" ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar" ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Verification bucket policies
CREATE POLICY "Agents and admins can upload evidence" ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'verification' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('agent', 'admin')
    )
  );

CREATE POLICY "Agents and admins can view evidence" ON storage.objects FOR SELECT
  USING (
    bucket_id = 'verification' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('agent', 'admin')
    )
  );
```

## Database Structure

### Core Tables
- **profiles** - User accounts (extends auth.users)
- **students** - Student-specific data
- **landlords** - Landlord business data
- **agents** - Agent credentials & region
- **admins** - Admin permissions
- **hostels** - Property listings
- **room_types** - Room configurations per hostel
- **bookings** - Student bookings
- **reviews** - Property reviews
- **wishlists** - User saved properties
- **notifications** - System notifications

### Verification System Tables
- **standard_checklist_items** - Predefined checklist items
- **verification_stages** - Workflow stages per property
- **property_verification_checklists** - Per-property checklist items
- **property_amenities_verification** - Amenity verification records
- **contact_verification_logs** - Phone call logs
- **property_verification_timeline** - Audit trail
- **verification_evidence** - Uploaded evidence files

### Additional Tables
- **company_info** - Single-row config (mission, vision)
- **team_members** - Company team display

## Row Level Security (RLS)

All tables have RLS enabled with policies based on user role:

| Table | Student | Landlord | Agent | Admin |
|-------|---------|----------|-------|-------|
| profiles | own only | own only | own only | all |
| hostels | view verified | own + verified | assigned | all |
| bookings | own | property's | - | - |
| reviews | create | - | - | - |
| wishlists | own | own | own | own |
| verification_* | - | - | assigned | all |

## Troubleshooting

### "Cannot login" after schema reset
This usually happens because:
1. The `profiles` table trigger isn't working
2. User signed up before the schema was created
3. Missing RLS policies

**Fix:** Ensure trigger `on_auth_user_created` exists:
```sql
-- Check trigger exists
SELECT tgname FROM pg_trigger WHERE tgname = 'on_auth_user_created';

-- Recreate trigger if missing
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### "Permission denied" errors
Check RLS policies are correctly applied:
```sql
-- Temporarily disable RLS to test (only for debugging!)
ALTER TABLE public.hostels DISABLE ROW LEVEL SECURITY;
-- Test query
SELECT * FROM public.hostels LIMIT 10;
-- Re-enable
ALTER TABLE public.hostels ENABLE ROW LEVEL SECURITY;
```

### Verification status not updating
The trigger `trigger_update_verification_status_checklist` should auto-update `hostels.verification_status` when checklist items are confirmed. Check it exists:
```sql
SELECT tgname FROM pg_trigger WHERE tgname = 'trigger_update_verification_status_checklist';
```

### Missing `assigned_agent_id` column
The complete schema includes this column. If missing, add it:
```sql
ALTER TABLE public.hostels ADD COLUMN IF NOT EXISTS assigned_agent_id UUID REFERENCES public.profiles(id);
```

## Default Roles

Valid profile roles (enforced by CHECK constraint):
- `student` - Student users
- `landlord` - Property owners
- `agent` - Verification agents
- `admin` - System administrators
- `super_admin` - Reserved for future use (referenced in agent dashboard)

## Verification Status Values

Allowed values in `hostels.verification_status`:
- `pending_submission` - New listing awaiting agent assignment
- `pending_assignment` - Awaiting agent assignment
- `pending_review` - Assigned, agent reviewing
- `amenity_verification` - Checking amenities
- `document_verification` - Checking documents
- `site_inspection` - Physical inspection phase
- `approved` - Fully verified
- `rejected` - Failed verification

## Common Queries

### Get verified hostels with full info
```sql
SELECT * FROM public.verified_hostels_view;
```

### Get agent's assigned properties
```sql
SELECT * FROM public.agent_assigned_properties_view WHERE assigned_agent_id = 'user-uuid-here';
```

### Get verification summary for a property
```sql
SELECT * FROM public.get_verification_summary('property-uuid-here');
```

### Assign agent to property (admin)
```sql
SELECT public.assign_agent_to_property('property-uuid', 'agent-user-uuid');
```

## Resetting the Database

To completely reset and start fresh:

1. **Backup data** (if needed):
```sql
-- Export tables via Supabase Dashboard → Table Editor → Export CSV
```

2. **Drop all tables** and recreate (the script does this automatically):

3. **Re-run schema** from Step 2 above

4. **Recreate storage buckets** manually (they're not dropped with tables)

5. **Re-add RLS policies** for storage (Step 5 above)

## Environment Variables

Ensure your `.env` file has:
```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Support

For issues:
1. Check Supabase Dashboard → SQL Editor for errors
2. Review RLS policies if getting permission errors
3. Verify storage buckets exist
4. Check user profiles have correct `role` field set
