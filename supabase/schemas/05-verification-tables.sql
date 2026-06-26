-- Verification system tables - run after system-tables

-- Standard checklist items
CREATE TABLE public.standard_checklist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category VARCHAR(100) NOT NULL CHECK (category IN ('amenities', 'documents', 'legal', 'safety', 'contact_verification', 'property_condition')),
  item_name VARCHAR(255) NOT NULL,
  description TEXT,
  is_required BOOLEAN DEFAULT TRUE,
  confirmation_method VARCHAR(100) CHECK (confirmation_method IN ('phone_call', 'document', 'photo', 'inspection', 'walkthrough', 'photo_verification', 'physical_check')),
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_standard_checklist_category ON public.standard_checklist_items(category);
CREATE INDEX idx_standard_checklist_active ON public.standard_checklist_items(is_active);
CREATE INDEX idx_standard_checklist_order ON public.standard_checklist_items(order_index);

-- Verification stages
CREATE TABLE public.verification_stages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  stage_name VARCHAR(100) NOT NULL CHECK (stage_name IN (
    'document_submission',
    'amenity_verification',
    'contact_confirmation',
    'site_inspection',
    'amenity_checklist',
    'legal_verification',
    'final_approval'
  )),
  stage_order INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'skipped')),
  assigned_agent_id UUID REFERENCES public.profiles(id),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_verification_stages_property ON public.verification_stages(property_id);
CREATE INDEX idx_verification_stages_agent ON public.verification_stages(assigned_agent_id);
CREATE INDEX idx_verification_stages_status ON public.verification_stages(status);

-- Property verification checklists
CREATE TABLE public.property_verification_checklists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES public.profiles(id),
  checklist_item VARCHAR(255) NOT NULL,
  category VARCHAR(100) CHECK (category IN ('amenities', 'documents', 'legal', 'safety', 'contact_verification', 'property_condition')),
  is_confirmed BOOLEAN DEFAULT FALSE,
  confirmation_method VARCHAR(50) CHECK (confirmation_method IN ('phone_call', 'document_upload', 'physical_inspection', 'photo_verification', 'walkthrough')),
  notes TEXT,
  confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_checklist_property ON public.property_verification_checklists(property_id);
CREATE INDEX idx_checklist_agent ON public.property_verification_checklists(agent_id);
CREATE INDEX idx_checklist_confirmed ON public.property_verification_checklists(is_confirmed);

-- Property amenities verification
CREATE TABLE public.property_amenities_verification (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  amenity_name VARCHAR(100) NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_method VARCHAR(100) CHECK (verification_method IN ('phone_call', 'photo', 'physical_check', 'document', 'walkthrough')),
  verified_by UUID REFERENCES public.profiles(id),
  verified_at TIMESTAMPTZ,
  evidence_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_amenities_property ON public.property_amenities_verification(property_id);
CREATE INDEX idx_amenities_verified ON public.property_amenities_verification(is_verified);

-- Contact verification logs
CREATE TABLE public.contact_verification_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES public.profiles(id),
  contact_type VARCHAR(50) CHECK (contact_type IN ('landlord', 'tenant', 'neighbor', 'university_office', 'student', 'other')),
  contact_name VARCHAR(255),
  phone_number VARCHAR(20),
  call_date TIMESTAMPTZ DEFAULT NOW(),
  call_duration INTEGER,
  confirmed BOOLEAN DEFAULT FALSE,
  verification_details TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contact_logs_property ON public.contact_verification_logs(property_id);
CREATE INDEX idx_contact_logs_agent ON public.contact_verification_logs(agent_id);

-- Verification timeline
CREATE TABLE public.property_verification_timeline (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES public.profiles(id),
  action_type VARCHAR(100) NOT NULL CHECK (action_type IN (
    'checklist_item_completed',
    'phone_call_made',
    'amenity_verified',
    'stage_completed',
    'stage_started',
    'verification_approved',
    'verification_rejected',
    'document_uploaded',
    'photo_added',
    'verification_deferred',
    'verification_escalated'
  )),
  action_description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_timeline_property ON public.property_verification_timeline(property_id);
CREATE INDEX idx_timeline_agent ON public.property_verification_timeline(agent_id);
CREATE INDEX idx_timeline_created ON public.property_verification_timeline(created_at DESC);

-- Verification evidence
CREATE TABLE public.verification_evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES public.profiles(id),
  evidence_type VARCHAR(50) CHECK (evidence_type IN ('photo', 'document', 'video', 'audio')),
  file_url TEXT NOT NULL,
  file_name VARCHAR(255),
  file_size INTEGER,
  category VARCHAR(100),
  description TEXT,
  checklist_item_id UUID REFERENCES public.property_verification_checklists(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_evidence_property ON public.verification_evidence(property_id);
CREATE INDEX idx_evidence_agent ON public.verification_evidence(agent_id);

SELECT 'Verification tables created successfully!' AS status;