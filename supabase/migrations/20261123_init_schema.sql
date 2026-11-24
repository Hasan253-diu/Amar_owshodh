-- ==============================================================================
-- MEDITRACK: SUPABASE DATABASE INITIAL SCHEMA & RLS MIGRATION
-- Run this complete script in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/kjtpjrobklxmhzoimqpp/sql
-- ==============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROFILES TABLE
-- Links directly to Supabase auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" 
    ON public.profiles FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );


-- 3. MEDICINES TABLE
-- Matches all fields submitted by MedicineForm: name, notes, start_date, end_date
CREATE TABLE IF NOT EXISTS public.medicines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    notes TEXT,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_medicines_user_id ON public.medicines(user_id);
CREATE INDEX IF NOT EXISTS idx_medicines_is_active ON public.medicines(is_active);

ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;

-- Strict user ownership policies: Users can only see, insert, edit, and delete their own medicines
DROP POLICY IF EXISTS "Users can select own medicines" ON public.medicines;
CREATE POLICY "Users can select own medicines" 
    ON public.medicines FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own medicines" ON public.medicines;
CREATE POLICY "Users can insert own medicines" 
    ON public.medicines FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own medicines" ON public.medicines;
CREATE POLICY "Users can update own medicines" 
    ON public.medicines FOR UPDATE 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own medicines" ON public.medicines;
CREATE POLICY "Users can delete own medicines" 
    ON public.medicines FOR DELETE 
    USING (auth.uid() = user_id);


-- 4. MEDICINE SCHEDULES TABLE
CREATE TABLE IF NOT EXISTS public.medicine_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    medicine_id UUID NOT NULL REFERENCES public.medicines(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reminder_time TIME NOT NULL, -- e.g. 08:00:00
    repeat_days INTEGER[] NOT NULL DEFAULT '{0,1,2,3,4,5,6}', -- 0=Sunday, 1=Monday ... 6=Saturday
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    timezone TEXT NOT NULL DEFAULT 'Asia/Dhaka',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_schedules_medicine_id ON public.medicine_schedules(medicine_id);
CREATE INDEX IF NOT EXISTS idx_schedules_user_id ON public.medicine_schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_schedules_is_active ON public.medicine_schedules(is_active);

ALTER TABLE public.medicine_schedules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can select own schedules" ON public.medicine_schedules;
CREATE POLICY "Users can select own schedules" 
    ON public.medicine_schedules FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own schedules" ON public.medicine_schedules;
CREATE POLICY "Users can insert own schedules" 
    ON public.medicine_schedules FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own schedules" ON public.medicine_schedules;
CREATE POLICY "Users can update own schedules" 
    ON public.medicine_schedules FOR UPDATE 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own schedules" ON public.medicine_schedules;
CREATE POLICY "Users can delete own schedules" 
    ON public.medicine_schedules FOR DELETE 
    USING (auth.uid() = user_id);


-- 5. INTAKE LOGS TABLE
-- Tracks individual scheduled occurrences: pending, taken, or skipped
CREATE TABLE IF NOT EXISTS public.intake_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    schedule_id UUID NOT NULL REFERENCES public.medicine_schedules(id) ON DELETE CASCADE,
    medicine_id UUID NOT NULL REFERENCES public.medicines(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'taken', 'skipped')),
    recorded_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_schedule_occurrence UNIQUE (schedule_id, scheduled_date, scheduled_time)
);

CREATE INDEX IF NOT EXISTS idx_intake_logs_user_date ON public.intake_logs(user_id, scheduled_date);
CREATE INDEX IF NOT EXISTS idx_intake_logs_status ON public.intake_logs(status);

ALTER TABLE public.intake_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can select own intake logs" ON public.intake_logs;
CREATE POLICY "Users can select own intake logs" 
    ON public.intake_logs FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own intake logs" ON public.intake_logs;
CREATE POLICY "Users can insert own intake logs" 
    ON public.intake_logs FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own intake logs" ON public.intake_logs;
CREATE POLICY "Users can update own intake logs" 
    ON public.intake_logs FOR UPDATE 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own intake logs" ON public.intake_logs;
CREATE POLICY "Users can delete own intake logs" 
    ON public.intake_logs FOR DELETE 
    USING (auth.uid() = user_id);


-- 6. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    intake_log_id UUID REFERENCES public.intake_logs(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, is_read);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
CREATE POLICY "Users can view own notifications" 
    ON public.notifications FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications" 
    ON public.notifications FOR UPDATE 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notifications;
CREATE POLICY "Users can delete own notifications" 
    ON public.notifications FOR DELETE 
    USING (auth.uid() = user_id);


-- 7. AUTOMATIC PROFILE CREATION TRIGGER & EXISTING USER BACKFILL
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', ''),
        COALESCE(new.raw_user_meta_data->>'role', 'user')
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill profile records for any users that signed up before the tables were created
INSERT INTO public.profiles (id, email, full_name, role)
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'full_name', ''), 
    COALESCE(raw_user_meta_data->>'role', 'user')
FROM auth.users
ON CONFLICT (id) DO NOTHING;
