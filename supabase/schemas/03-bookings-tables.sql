-- Bookings, reviews, wishlist tables - run after property-tables

-- Bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hostel_id UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  room_type UUID NOT NULL REFERENCES public.room_types(id),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  service_fee DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('mpesa', 'paypal', 'card')),
  payment_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bookings_hostel ON public.bookings(hostel_id);
CREATE INDEX idx_bookings_user ON public.bookings(user_id);
CREATE INDEX idx_bookings_student ON public.bookings(student_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_created_at ON public.bookings(created_at);

-- Reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hostel_id UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  helpful INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reviews_hostel ON public.reviews(hostel_id);
CREATE INDEX idx_reviews_user ON public.reviews(user_id);
CREATE INDEX idx_reviews_rating ON public.reviews(rating);

-- Wishlists table
CREATE TABLE public.wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  hostel_id UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, hostel_id)
);

CREATE INDEX idx_wishlists_user ON public.wishlists(user_id);
CREATE INDEX idx_wishlists_hostel ON public.wishlists(hostel_id);

SELECT 'Bookings and reviews tables created successfully!' AS status;