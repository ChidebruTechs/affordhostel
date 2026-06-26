-- Property tables - run after core-tables

-- Hostels table
CREATE TABLE public.hostels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  landlord_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  location TEXT NOT NULL,
  university TEXT NOT NULL,
  amenities TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  room_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  verification_status TEXT DEFAULT 'pending_submission' CHECK (verification_status IN ('pending_submission', 'pending_assignment', 'pending_review', 'amenity_verification', 'document_verification', 'site_inspection', 'approved', 'rejected')),
  assigned_agent_id UUID REFERENCES public.profiles(id),
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_hostels_landlord ON public.hostels(landlord_id);
CREATE INDEX idx_hostels_agent ON public.hostels(assigned_agent_id);
CREATE INDEX idx_hostels_verified ON public.hostels(verified);
CREATE INDEX idx_hostels_verification_status ON public.hostels(verification_status);
CREATE INDEX idx_hostels_university ON public.hostels(university);
CREATE INDEX idx_hostels_price ON public.hostels(price);

-- Room types table
CREATE TABLE public.room_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hostel_id UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  type VARCHAR(100) NOT NULL CHECK (type IN ('Single Room', 'Shared Room', 'Double Room', 'Studio Apartment', 'Bedsitter', 'One Bedroom', 'Two Bedroom', 'Deluxe Room')),
  price DECIMAL(10,2) NOT NULL,
  total INTEGER NOT NULL,
  available INTEGER DEFAULT 0,
  features TEXT[] DEFAULT '{}',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_room_types_hostel ON public.room_types(hostel_id);
CREATE INDEX idx_room_types_price ON public.room_types(price);

SELECT 'Property tables created successfully!' AS status;