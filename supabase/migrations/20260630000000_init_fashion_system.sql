-- =====================================================================
-- ELITE FASHION DESIGNER SYSTEM - SUPABASE POSTGRESQL MIGRATION SCRIPT
-- =====================================================================
-- This migration script establishes the production-grade schema,
-- data constraints, triggers, and Row Level Security (RLS) policies.
-- Date: 2026-06-30
-- Architect: Elite Backend Architect & Database Engineer
-- =====================================================================

-- Enable pgcrypto extension for UUID generation if not already active
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------------------
-- 1. BASE TABLES DEFINITIONS
-- ---------------------------------------------------------------------

-- Table: users (Extends Supabase Auth profiles)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY, -- Maps directly to auth.users.id
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL CONSTRAINT check_valid_email CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$'),
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'client' CONSTRAINT check_valid_role CHECK (role IN ('admin', 'client', 'tailor')),
    avatar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table: clients (Profile details, can be associated with a user or independent)
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    email TEXT CONSTRAINT check_valid_client_email CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$'),
    phone TEXT,
    address TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table: measurements (Detailed client measurements groups)
CREATE TABLE IF NOT EXISTS public.measurements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- e.g., 'Bespoke Suit', 'Agbada', 'Bridal Gown'
    data JSONB NOT NULL DEFAULT '{}'::jsonb, -- Highly detailed structured measurement metrics
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table: measurement_details (Granular measurement line items)
CREATE TABLE IF NOT EXISTS public.measurement_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    measurement_id UUID NOT NULL REFERENCES public.measurements(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g., 'chest', 'sleeve_length', 'waist'
    value TEXT NOT NULL, -- e.g., '42.5', '32.0'
    unit TEXT NOT NULL DEFAULT 'inches' CONSTRAINT check_valid_unit CHECK (unit IN ('inches', 'cm', 'meters'))
);

-- Table: categories (Garment categories for catalog management)
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table: collections (Couture Collections)
CREATE TABLE IF NOT EXISTS public.collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    image TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table: gallery_images (Lookbook asset collection)
CREATE TABLE IF NOT EXISTS public.gallery_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    title TEXT,
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table: services (Atelier Tailoring Services)
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CONSTRAINT check_positive_price CHECK (price >= 0),
    duration INT NOT NULL CONSTRAINT check_positive_duration CHECK (duration > 0), -- in minutes
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Table: appointments (Booking Management)
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL DEFAULT 'scheduled' CONSTRAINT check_valid_appointment_status CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table: orders (Atelier Custom Commissions / Orders)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    measurement_id UUID REFERENCES public.measurements(id) ON DELETE SET NULL,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'pending' CONSTRAINT check_valid_order_status CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled', 'shipped')),
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CONSTRAINT check_positive_order_total CHECK (total_amount >= 0),
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table: order_items (Detailed line items for commissions)
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    fabric TEXT,
    quantity INT NOT NULL DEFAULT 1 CONSTRAINT check_min_quantity CHECK (quantity > 0),
    price NUMERIC(10, 2) NOT NULL CONSTRAINT check_positive_item_price CHECK (price >= 0),
    notes TEXT
);

-- Table: payments (Financial accounting records)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL CONSTRAINT check_strictly_positive_payment CHECK (amount > 0),
    method TEXT NOT NULL CONSTRAINT check_valid_payment_method CHECK (method IN ('card', 'bank_transfer', 'cash', 'stripe', 'paystack')),
    status TEXT NOT NULL DEFAULT 'pending' CONSTRAINT check_valid_payment_status CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    transaction_ref TEXT UNIQUE,
    paid_at TIMESTAMP WITH TIME ZONE
);

-- Table: invoices (Financial summaries)
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    invoice_number TEXT UNIQUE NOT NULL,
    amount NUMERIC(10, 2) NOT NULL CONSTRAINT check_positive_invoice_amount CHECK (amount >= 0),
    pdf_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table: testimonials (Client reviews)
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    rating INT NOT NULL CONSTRAINT check_valid_rating CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    is_approved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table: notifications (Real-time in-app alerts)
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table: website_settings (CMS variables and branding coordinates)
CREATE TABLE IF NOT EXISTS public.website_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);


-- ---------------------------------------------------------------------
-- 2. HELPER FUNCTIONS & TRIGGERS
-- ---------------------------------------------------------------------

-- Function to handle auto-updating timestamp on settings update
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_settings_timestamp
    BEFORE UPDATE ON public.website_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();


-- Trigger function to automatically handle new users signed up via Supabase Auth
-- Sets client profile defaults and syncs users table
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
DECLARE
    v_full_name TEXT;
    v_role TEXT;
BEGIN
    v_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email);
    v_role := COALESCE(NEW.raw_user_meta_data->>'role', 'client');

    -- Insert into public.users
    INSERT INTO public.users (id, full_name, email, phone, role, avatar)
    VALUES (
        NEW.id,
        v_full_name,
        NEW.email,
        NEW.phone,
        v_role,
        NEW.raw_user_meta_data->>'avatar'
    )
    ON CONFLICT (id) DO UPDATE
    SET full_name = EXCLUDED.full_name,
        phone = EXCLUDED.phone,
        avatar = EXCLUDED.avatar;

    -- If registered as 'client', auto-generate a parallel record in public.clients
    IF v_role = 'client' THEN
        INSERT INTO public.clients (user_id, full_name, email, phone)
        VALUES (NEW.id, v_full_name, NEW.email, NEW.phone);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ---------------------------------------------------------------------
-- 3. SECURITY & ROW LEVEL SECURITY (RLS) & POLICY MATRIX
-- ---------------------------------------------------------------------

-- Enable Row Level Security (RLS) across all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.measurement_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;


-- Core Role Checking Helper Function for RLS (Bypasses circular locks via SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT AS $$
DECLARE
    v_role TEXT;
BEGIN
    -- Pull directly from user metadata if possible (Supabase claims)
    v_role := (auth.jwt() -> 'user_metadata' ->> 'role');
    
    IF v_role IS NULL AND auth.uid() IS NOT NULL THEN
        SELECT role INTO v_role FROM public.users WHERE id = auth.uid();
    END IF;
    
    RETURN COALESCE(v_role, 'client');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Helper: Check if current request originates from admin or tailor
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN public.current_user_role() IN ('admin', 'tailor');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Helper: Check if client_id maps back to current user's client profile
CREATE OR REPLACE FUNCTION public.is_client_owner(p_client_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_user_id UUID;
BEGIN
    SELECT user_id INTO v_user_id FROM public.clients WHERE id = p_client_id;
    RETURN auth.uid() IS NOT NULL AND v_user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Helper: Check if user owns order
CREATE OR REPLACE FUNCTION public.is_order_owner(p_order_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_client_id UUID;
BEGIN
    SELECT client_id INTO v_client_id FROM public.orders WHERE id = p_order_id;
    RETURN public.is_client_owner(v_client_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ---------------------------------------------------------------------
-- POLICIES: PUBLIC.USERS
-- ---------------------------------------------------------------------
CREATE POLICY "Users: Staff can read/write all accounts" 
    ON public.users 
    FOR ALL 
    TO authenticated 
    USING (public.is_staff())
    WITH CHECK (public.is_staff());

CREATE POLICY "Users: Clients can read own profile" 
    ON public.users 
    FOR SELECT 
    TO authenticated 
    USING (auth.uid() = id);

CREATE POLICY "Users: Clients can update own profile" 
    ON public.users 
    FOR UPDATE 
    TO authenticated 
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);


-- ---------------------------------------------------------------------
-- POLICIES: PUBLIC.CLIENTS
-- ---------------------------------------------------------------------
CREATE POLICY "Clients: Staff can manage all client records" 
    ON public.clients 
    FOR ALL 
    TO authenticated 
    USING (public.is_staff())
    WITH CHECK (public.is_staff());

CREATE POLICY "Clients: Client can read own profile" 
    ON public.clients 
    FOR SELECT 
    TO authenticated 
    USING (user_id = auth.uid());

CREATE POLICY "Clients: Client can update own profile" 
    ON public.clients 
    FOR UPDATE 
    TO authenticated 
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());


-- ---------------------------------------------------------------------
-- POLICIES: PUBLIC.MEASUREMENTS
-- ---------------------------------------------------------------------
CREATE POLICY "Measurements: Staff can manage all" 
    ON public.measurements 
    FOR ALL 
    TO authenticated 
    USING (public.is_staff())
    WITH CHECK (public.is_staff());

CREATE POLICY "Measurements: Clients can read own" 
    ON public.measurements 
    FOR SELECT 
    TO authenticated 
    USING (public.is_client_owner(client_id));


-- ---------------------------------------------------------------------
-- POLICIES: PUBLIC.MEASUREMENT_DETAILS
-- ---------------------------------------------------------------------
CREATE POLICY "Measurement Details: Staff can manage all" 
    ON public.measurement_details 
    FOR ALL 
    TO authenticated 
    USING (public.is_staff())
    WITH CHECK (public.is_staff());

CREATE POLICY "Measurement Details: Clients can read own" 
    ON public.measurement_details 
    FOR SELECT 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.measurements m
            WHERE m.id = measurement_id AND public.is_client_owner(m.client_id)
        )
    );


-- ---------------------------------------------------------------------
-- POLICIES: PUBLIC.CATEGORIES
-- ---------------------------------------------------------------------
CREATE POLICY "Categories: Anyone can view categories" 
    ON public.categories 
    FOR SELECT 
    TO anon, authenticated 
    USING (true);

CREATE POLICY "Categories: Admins can modify categories" 
    ON public.categories 
    FOR ALL 
    TO authenticated 
    USING (public.current_user_role() = 'admin')
    WITH CHECK (public.current_user_role() = 'admin');


-- ---------------------------------------------------------------------
-- POLICIES: PUBLIC.COLLECTIONS
-- ---------------------------------------------------------------------
CREATE POLICY "Collections: Anyone can view collections" 
    ON public.collections 
    FOR SELECT 
    TO anon, authenticated 
    USING (true);

CREATE POLICY "Collections: Admins/Tailors can modify collections" 
    ON public.collections 
    FOR ALL 
    TO authenticated 
    USING (public.is_staff())
    WITH CHECK (public.is_staff());


-- ---------------------------------------------------------------------
-- POLICIES: PUBLIC.GALLERY_IMAGES
-- ---------------------------------------------------------------------
CREATE POLICY "Gallery Images: Anyone can view" 
    ON public.gallery_images 
    FOR SELECT 
    TO anon, authenticated 
    USING (true);

CREATE POLICY "Gallery Images: Admins can modify" 
    ON public.gallery_images 
    FOR ALL 
    TO authenticated 
    USING (public.is_staff())
    WITH CHECK (public.is_staff());


-- ---------------------------------------------------------------------
-- POLICIES: PUBLIC.SERVICES
-- ---------------------------------------------------------------------
CREATE POLICY "Services: Anyone can view active services" 
    ON public.services 
    FOR SELECT 
    TO anon, authenticated 
    USING (is_active = true OR public.is_staff());

CREATE POLICY "Services: Admins can modify" 
    ON public.services 
    FOR ALL 
    TO authenticated 
    USING (public.current_user_role() = 'admin')
    WITH CHECK (public.current_user_role() = 'admin');


-- ---------------------------------------------------------------------
-- POLICIES: PUBLIC.APPOINTMENTS
-- ---------------------------------------------------------------------
CREATE POLICY "Appointments: Staff can manage all bookings" 
    ON public.appointments 
    FOR ALL 
    TO authenticated 
    USING (public.is_staff())
    WITH CHECK (public.is_staff());

CREATE POLICY "Appointments: Clients can view own bookings" 
    ON public.appointments 
    FOR SELECT 
    TO authenticated 
    USING (public.is_client_owner(client_id));

CREATE POLICY "Appointments: Clients can request bookings" 
    ON public.appointments 
    FOR INSERT 
    TO authenticated 
    WITH CHECK (public.is_client_owner(client_id));

CREATE POLICY "Appointments: Clients can cancel own bookings" 
    ON public.appointments 
    FOR UPDATE 
    TO authenticated 
    USING (public.is_client_owner(client_id) AND status = 'scheduled')
    WITH CHECK (public.is_client_owner(client_id) AND status = 'cancelled');


-- ---------------------------------------------------------------------
-- POLICIES: PUBLIC.ORDERS
-- ---------------------------------------------------------------------
CREATE POLICY "Orders: Staff can manage all orders" 
    ON public.orders 
    FOR ALL 
    TO authenticated 
    USING (public.is_staff())
    WITH CHECK (public.is_staff());

CREATE POLICY "Orders: Clients can view own orders" 
    ON public.orders 
    FOR SELECT 
    TO authenticated 
    USING (public.is_client_owner(client_id));


-- ---------------------------------------------------------------------
-- POLICIES: PUBLIC.ORDER_ITEMS
-- ---------------------------------------------------------------------
CREATE POLICY "Order Items: Staff can manage all line items" 
    ON public.order_items 
    FOR ALL 
    TO authenticated 
    USING (public.is_staff())
    WITH CHECK (public.is_staff());

CREATE POLICY "Order Items: Clients can view own" 
    ON public.order_items 
    FOR SELECT 
    TO authenticated 
    USING (public.is_order_owner(order_id));


-- ---------------------------------------------------------------------
-- POLICIES: PUBLIC.PAYMENTS
-- ---------------------------------------------------------------------
CREATE POLICY "Payments: Staff can manage all ledger records" 
    ON public.payments 
    FOR ALL 
    TO authenticated 
    USING (public.is_staff())
    WITH CHECK (public.is_staff());

CREATE POLICY "Payments: Clients can view own payment receipts" 
    ON public.payments 
    FOR SELECT 
    TO authenticated 
    USING (public.is_order_owner(order_id));


-- ---------------------------------------------------------------------
-- POLICIES: PUBLIC.INVOICES
-- ---------------------------------------------------------------------
CREATE POLICY "Invoices: Staff can manage all invoices" 
    ON public.invoices 
    FOR ALL 
    TO authenticated 
    USING (public.is_staff())
    WITH CHECK (public.is_staff());

CREATE POLICY "Invoices: Clients can view own invoices" 
    ON public.invoices 
    FOR SELECT 
    TO authenticated 
    USING (public.is_order_owner(order_id));


-- ---------------------------------------------------------------------
-- POLICIES: PUBLIC.TESTIMONIALS
-- ---------------------------------------------------------------------
CREATE POLICY "Testimonials: Anyone can view approved testimonials" 
    ON public.testimonials 
    FOR SELECT 
    TO anon, authenticated 
    USING (is_approved = true OR public.is_staff() OR public.is_client_owner(client_id));

CREATE POLICY "Testimonials: Clients can submit testimonials" 
    ON public.testimonials 
    FOR INSERT 
    TO authenticated 
    WITH CHECK (public.is_client_owner(client_id) AND is_approved = false);

CREATE POLICY "Testimonials: Staff can approve or delete" 
    ON public.testimonials 
    FOR ALL 
    TO authenticated 
    USING (public.is_staff())
    WITH CHECK (public.is_staff());


-- ---------------------------------------------------------------------
-- POLICIES: PUBLIC.NOTIFICATIONS
-- ---------------------------------------------------------------------
CREATE POLICY "Notifications: Users can read own notifications" 
    ON public.notifications 
    FOR SELECT 
    TO authenticated 
    USING (user_id = auth.uid());

CREATE POLICY "Notifications: Users can update own notifications" 
    ON public.notifications 
    FOR UPDATE 
    TO authenticated 
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Notifications: Staff can trigger notifications" 
    ON public.notifications 
    FOR INSERT 
    TO authenticated 
    WITH CHECK (public.is_staff());


-- ---------------------------------------------------------------------
-- POLICIES: PUBLIC.WEBSITE_SETTINGS
-- ---------------------------------------------------------------------
CREATE POLICY "Settings: Anyone can view frontend setting keys" 
    ON public.website_settings 
    FOR SELECT 
    TO anon, authenticated 
    USING (true);

CREATE POLICY "Settings: Admins have read/write setting capabilities" 
    ON public.website_settings 
    FOR ALL 
    TO authenticated 
    USING (public.current_user_role() = 'admin')
    WITH CHECK (public.current_user_role() = 'admin');

-- =====================================================================
-- SEED DATA INITIALIZERS
-- =====================================================================
INSERT INTO public.website_settings (key, value)
VALUES 
    ('brand_name', 'Agbada Luxe'),
    ('primary_color', '#D4AF37'),
    ('currency', 'USD'),
    ('atelier_address', '12 Savile Row, London / 45 Victoria Island, Lagos')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.categories (name, slug, description)
VALUES 
    ('Traditional African Couture', 'traditional', 'Bespoke hand-woven historical African garments'),
    ('European Sartorial Suits', 'suits', 'Perfect drape unstructured wool and linen lounge suits')
ON CONFLICT (slug) DO NOTHING;
