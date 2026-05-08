# Quick Start: Reset & Recreate Database

## Step 1: Backup (if needed)
**Important:** This will DELETE ALL DATA in your database.
If you need to preserve data, export it first from Supabase Dashboard → Table Editor.

## Step 2: Open Supabase SQL Editor
1. Go to your Supabase project dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New query**

## Step 3: Run Complete Schema
Copy and paste the entire contents of this file into the SQL editor:

```
supabase/schemas/complete-schema.sql
```

Then click **Run** (or press Ctrl+Enter).

**Expected output:**
```
Query returned successfully: X rows affected
Schema created successfully!
```

**Wait time:** ~30-60 seconds for all tables, indexes, policies, and triggers.

## Step 4: Create Storage Buckets

In **Supabase Dashboard → Storage**:

1. **Create bucket `hostels`**
   - Click **Create a new bucket**
   - Name: `hostels`
   - Public bucket: **ON** (toggle enabled)
   - Click **Create bucket**

2. **Create bucket `avatars`**
   - Name: `avatars`
   - Public bucket: **ON**
   - Click **Create bucket**

3. **Create bucket `verification`**
   - Name: `verification`
   - Public bucket: **OFF** (private)
   - Click **Create bucket**

## Step 5: Add Storage Policies
In **SQL Editor**, create a new query and run:

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
      WHERE id = auth.uid() AND role IN ('agent', 'admin', 'super_admin')
    )
  );

CREATE POLICY "Agents and admins can view evidence" ON storage.objects FOR SELECT
  USING (
    bucket_id = 'verification' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('agent', 'admin', 'super_admin')
    )
  );
```

## Step 6: Test Login

1. Go to your application: `http://localhost:5173` (or your deployment URL)
2. Try to sign in with existing credentials
3. If sign-in fails, create a new account to test

**Note:** Users who signed up *before* this schema reset will need to sign up again, as their `profiles` record was deleted.

## Step 7: Verify Schema is Working

Run these checks in SQL Editor:

```sql
-- Check profiles table has entries
SELECT COUNT(*) FROM public.profiles;

-- Check hostels table exists with correct columns
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'hostels'
ORDER BY ordinal_position;

-- Check verification tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'verification_stages',
    'property_verification_checklists',
    'property_amenities_verification',
    'contact_verification_logs',
    'property_verification_timeline',
    'verification_evidence',
    'standard_checklist_items'
  )
ORDER BY table_name;
```

## Troubleshooting

### "relation 'profiles' does not exist"
The schema hasn't been applied yet. Return to Step 3.

### "permission denied for relation profiles"
RLS policies are blocking. Try temporarily disabling for testing:
```sql
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
-- (Run your test query)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
```

### User can't sign up
Check the trigger exists:
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```
If missing, run:
```sql
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Missing `assigned_agent_id` column
The column should exist. Verify:
```sql
SELECT column_name FROM information_schema.columns
WHERE table_name = 'hostels' AND column_name = 'assigned_agent_id';
```
If missing, add it:
```sql
ALTER TABLE public.hostels ADD COLUMN assigned_agent_id UUID REFERENCES public.profiles(id);
```

### Verification status not updating
Check trigger exists:
```sql
SELECT * FROM pg_trigger WHERE tgname LIKE 'trigger_update_verification_status%';
```

### Files not uploading to storage
Ensure buckets exist and policies are correctly applied. Check bucket names are exactly `hostels`, `avatars`, `verification`.

## Rollback (if something goes wrong)

If you need to start over:

1. Drop all objects:
```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres, public;
```

2. Then re-run **Step 3** (complete-schema.sql)

## What's Included

### Core Application
- User profiles (`profiles`)
- Role-specific tables: `students`, `landlords`, `agents`, `admins`
- Property listings (`hostels`) with amenities, images, pricing
- Room types (`room_types`)
- Bookings (`bookings`)
- Reviews (`reviews`)
- Wishlists (`wishlists`)
- Notifications (`notifications`)

### Verification System
- Standard checklist templates (`standard_checklist_items`)
- Verification workflow stages (`verification_stages`)
- Per-property checklists (`property_verification_checklists`)
- Amenity verification (`property_amenities_verification`)
- Contact logs (`contact_verification_logs`)
- Audit timeline (`property_verification_timeline`)
- Evidence uploads (`verification_evidence`)

### System Configuration
- Company info (`company_info`)
- Team members (`team_members`)

All with proper:
- Foreign key constraints
- Indexes for performance
- Row Level Security (RLS) policies
- Triggers for auto-updating timestamps
- Auto-calculating verification status

---

**Done!** Your database is now fully set up and ready for the AffordHostel platform.
