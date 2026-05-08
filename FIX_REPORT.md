# Fix Report: Database Schema Issues

## Issue 1: Missing Database Tables
**Error:** `ERROR: 42P01: relation "public.hostels" does not exist`

**Root Cause:** The frontend application code references multiple database tables that were never created in the Supabase database.

**Resolution:** Created `supabase/schemas/000-core-tables.sql` with all required tables:
- `hostels` - Main property listing table
- `room_types` - Room types for each hostel
- `wishlists` - User wishlist items
- `bookings` - Booking/reservation records
- `reviews` - User reviews
- `notifications` - User notifications
- `company_info` - Company information
- `verification_history` - Verification audit trail

**Status:** ✅ Tables defined and ready for deployment

---

## Issue 2: CHECK Constraint Violation
**Error:** `ERROR: 23514: new row for relation "standard_checklist_items" violates check constraint "standard_checklist_items_confirmation_method_check"`

**Root Cause:** The seed data in `standard_checklist_items` table uses values:
- `'photo_verification'` (used for "Photo Verification" item)
- `'physical_check'` (used for all amenity items)

These values were not included in the CHECK constraint that only allowed:
- `'phone_call'`, `'document'`, `'photo'`, `'inspection'`, `'walkthrough'`

**Resolution:** Updated CHECK constraints in two files:

### File 1: `supabase/schemas/verification_schema.sql`
**Line 18:** Updated from:
```sql
CHECK (confirmation_method IN ('phone_call', 'document', 'photo', 'inspection', 'walkthrough'))
```
To:
```sql
CHECK (confirmation_method IN ('phone_call', 'document', 'photo', 'inspection', 'walkthrough', 'photo_verification', 'physical_check'))
```

### File 2: `supabase/schemas/001-verification-system.sql`
**Line 16:** Updated from:
```sql
CHECK (confirmation_method IN ('phone_call', 'document', 'photo', 'inspection', 'walkthrough'))
```
To:
```sql
CHECK (confirmation_method IN ('phone_call', 'document', 'photo', 'inspection', 'walkthrough', 'photo_verification', 'physical_check'))
```

**Status:** ✅ Constraints updated to match seed data

---

## Files Modified
1. ✅ `supabase/schemas/000-core-tables.sql` - Created (NEW)
2. ✅ `supabase/schemas/verification_schema.sql` - CHECK constraint fixed
3. ✅ `supabase/schemas/001-verification-system.sql` - CHECK constraint fixed
4. ✅ `DEPLOYMENT_NOTES.md` - Created (NEW)

---

## Deployment Instructions

### Step 1: Create Core Tables
Run the following SQL in Supabase SQL Editor:
```
File: supabase/schemas/000-core-tables.sql
Location: https://supabase.com/dashboard/project/_/sql
```

### Step 2: Run Verification Schema
Run the verification system schema (requires core tables first):
```sql
-- Execute in order:
File: supabase/schemas/000-core-tables.sql  (REQUIRED FIRST)
File: supabase/schemas/001-verification-system.sql  (OPTIONAL)
```

### Important Note
**Execution Order Matters:**
- `000-core-tables.sql` MUST be run BEFORE `001-verification-system.sql`
- The verification schema contains a foreign key reference: `public.verification_stages.property_id REFERENCES public.hostels(id)`
- Table must exist before foreign keys can reference it

---

## Verification

### Check 1: Tables Created
```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
```

Expected new tables:
- hostels
- room_types
- wishlists
- bookings
- reviews
- notifications
- company_info
- verification_history

### Check 2: Constraints Correct
```sql
-- List of allowed values in CHECK constraint
-- Should include: 'phone_call', 'document', 'photo', 'inspection', 'walkthrough', 'photo_verification', 'physical_check'

SELECT conname, consrc 
FROM pg_constraint 
WHERE conname LIKE '%confirmation_method%';
```

---

## Frontend Code References
All frontend components now have the correct tables:

- `src/pages/HostelsPage.tsx` - Queries `hostels` table ✓
- `src/pages/AddEditHostelPage.tsx` - CRUD on `hostels` + `room_types` ✓
- `src/context/AppContext.tsx` - Manages `wishlists`, `bookings`, `reviews`, `notifications` ✓
- All wishlist components - Use `wishlists` table with proper FK constraints ✓

---

## Summary
Two critical database issues were identified and fixed:

1. **Missing tables** → Created comprehensive schema with all required tables
2. **CHECK constraint mismatch** → Updated to allow values used in seed data

Both issues prevent the application from functioning and are now resolved.
