# Database Deployment Guide

## Problem
The application is failing with error: `ERROR: 42P01: relation "public.hostels" does not exist`

## Root Cause
The frontend code references several database tables that don't exist in the Supabase database:
- `hostels` - main property listing table
- `room_types` - room types for each hostel  
- `wishlists` - user wishlist items
- `bookings` - booking records
- `reviews` - review records
- `notifications` - user notifications
- `verification_history` - verification report history

## Solution
The file `supabase/schemas/000-core-tables.sql` contains all the necessary table definitions and has been created in the repository.

## Deployment Steps

### Option 1: Using Supabase Dashboard
1. Log in to Supabase dashboard: https://supabase.com/dashboard/project/_/sql
2. Go to SQL Editor
3. Copy the contents of `supabase/schemas/000-core-tables.sql`
4. Paste and run the SQL

### Option 2: Using Supabase CLI
```bash
# Install Supabase CLI if not already installed
# Then run the SQL file
supabase db remote reset
supabase db push  # if using local migration framework
```

Or directly:
```bash
supabase db remote apply --file supabase/schemas/000-core-tables.sql
```

### Option 3: Using psql
```bash
psql "<your-supabase-connection-string>" -f supabase/schemas/000-core-tables.sql
```

## Verification
After running the SQL, verify the tables exist:
```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
```

Expected tables:
- profiles (already exists)
- students (already exists)
- landlords (already exists)
- agents (already exists)
- hostels (NEW)
- room_types (NEW)
- wishlists (NEW)
- bookings (NEW)
- reviews (NEW)
- notifications (NEW)
- company_info (NEW)
- verification_history (NEW)
- standard_checklist_items (from verification schema)
- verification_stages (from verification schema)
- property_verification_checklists (from verification schema)
- property_amenities_verification (from verification schema)
- contact_verification_logs (from verification schema)
- property_verification_timeline (from verification schema)
- verification_evidence (from verification schema)

## Important Notes
1. Run `000-core-tables.sql` BEFORE `001-verification-system.sql`
   - The verification system schema references `public.hostels` table
   - Tables must exist before foreign key relationships can be created

2. Order of execution:
   - final-schema.sql (already run - auth tables)
   - 000-core-tables.sql (NEW - main app tables)
   - 001-verification-system.sql (already exists - verification features)

3. The `hostels` table includes:
   - All fields referenced in the frontend code
   - Proper foreign key to auth.users via landlord_id
   - Verification status tracking
   - Full-text search indexes on key fields

4. Row Level Security (RLS) is enabled with appropriate policies
   - Students can view all hostels
   - Landlords can manage their own hostels
   - Agents can be assigned to verify hostels
   - Admins have full access

## Frontend References Fixed
All frontend pages now have the correct tables:
- HostelsPage.tsx - queries `hostels` table 
- AddEditHostelPage.tsx - CRUD on `hostels` and `room_types`
- AppContext.tsx - manages `wishlists`, `bookings`, `reviews`, `notifications`
- All wishlist functionality - uses `wishlists` table
- All booking functionality - uses `bookings` table

## Migration Timeline
Since this is a new deployment, no data migration is needed.
For future schema updates, use numbered migration files (002-*, 003-*, etc.)
