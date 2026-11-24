-- ==============================================================================
-- MEDITRACK: FIX PERMISSIONS & ROW LEVEL SECURITY (RLS) POLICIES
-- Run this complete script in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/kjtpjrobklxmhzoimqpp/sql
-- ==============================================================================

-- 1. GRANT SCHEMA USAGE
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- 2. GRANT TABLE PRIVILEGES TO authenticated AND service_role
-- (Allows logged-in users to perform CRUD, while RLS restricts them strictly to their own rows)
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO authenticated, service_role;

-- Set default privileges for any future tables/sequences
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO authenticated, service_role;

-- Allow anon to read profiles (if necessary for login/register checks)
GRANT SELECT ON public.profiles TO anon;


-- ==============================================================================
-- 3. PROFILES TABLE: FIX INFINITE RECURSION & RLS
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to prevent conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create clean policies without recursive subqueries on profiles
CREATE POLICY "Users can view own profile" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- Helper security definer function to avoid infinite recursion for admin checks
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE POLICY "Admins can view all profiles" 
    ON public.profiles FOR SELECT 
    USING (public.is_admin());


-- ==============================================================================
-- 4. MEDICINES TABLE: CLEAN RLS POLICIES (auth.uid() = user_id)
-- ==============================================================================
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can select own medicines" ON public.medicines;
DROP POLICY IF EXISTS "Users can insert own medicines" ON public.medicines;
DROP POLICY IF EXISTS "Users can update own medicines" ON public.medicines;
DROP POLICY IF EXISTS "Users can delete own medicines" ON public.medicines;

-- SELECT: Only own medicines
CREATE POLICY "Users can select own medicines" 
    ON public.medicines FOR SELECT 
    TO authenticated
    USING (auth.uid() = user_id);

-- INSERT: Must belong to current logged-in user
CREATE POLICY "Users can insert own medicines" 
    ON public.medicines FOR INSERT 
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- UPDATE: Only own medicines
CREATE POLICY "Users can update own medicines" 
    ON public.medicines FOR UPDATE 
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- DELETE: Only own medicines
CREATE POLICY "Users can delete own medicines" 
    ON public.medicines FOR DELETE 
    TO authenticated
    USING (auth.uid() = user_id);


-- ==============================================================================
-- 5. MEDICINE SCHEDULES TABLE: RLS POLICIES
-- ==============================================================================
ALTER TABLE public.medicine_schedules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can select own schedules" ON public.medicine_schedules;
DROP POLICY IF EXISTS "Users can insert own schedules" ON public.medicine_schedules;
DROP POLICY IF EXISTS "Users can update own schedules" ON public.medicine_schedules;
DROP POLICY IF EXISTS "Users can delete own schedules" ON public.medicine_schedules;

CREATE POLICY "Users can select own schedules" 
    ON public.medicine_schedules FOR SELECT 
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own schedules" 
    ON public.medicine_schedules FOR INSERT 
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own schedules" 
    ON public.medicine_schedules FOR UPDATE 
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own schedules" 
    ON public.medicine_schedules FOR DELETE 
    TO authenticated
    USING (auth.uid() = user_id);


-- ==============================================================================
-- 6. INTAKE LOGS TABLE: RLS POLICIES
-- ==============================================================================
ALTER TABLE public.intake_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can select own intake logs" ON public.intake_logs;
DROP POLICY IF EXISTS "Users can insert own intake logs" ON public.intake_logs;
DROP POLICY IF EXISTS "Users can update own intake logs" ON public.intake_logs;
DROP POLICY IF EXISTS "Users can delete own intake logs" ON public.intake_logs;

CREATE POLICY "Users can select own intake logs" 
    ON public.intake_logs FOR SELECT 
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own intake logs" 
    ON public.intake_logs FOR INSERT 
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own intake logs" 
    ON public.intake_logs FOR UPDATE 
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own intake logs" 
    ON public.intake_logs FOR DELETE 
    TO authenticated
    USING (auth.uid() = user_id);


-- ==============================================================================
-- 7. NOTIFICATIONS TABLE: RLS POLICIES
-- ==============================================================================
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notifications;

CREATE POLICY "Users can view own notifications" 
    ON public.notifications FOR SELECT 
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" 
    ON public.notifications FOR UPDATE 
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications" 
    ON public.notifications FOR DELETE 
    TO authenticated
    USING (auth.uid() = user_id);
