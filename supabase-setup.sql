-- =====================================================
-- LMS Database Complete Setup Guide for Supabase
-- =====================================================
-- This file contains ALL setup steps required to configure Supabase for the LMS project.
-- New developers should follow these steps in order to set up their environment.
-- =====================================================

-- PREREQUISITE SETUP STEPS
-- =====================================================
-- 1. Create a new Supabase project at https://supabase.com
-- 2. Copy the following environment variables to your .env.local file:
--    NEXT_PUBLIC_SUPABASE_URL=your_project_url
--    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
-- 3. Enable authentication in Supabase dashboard (Settings > Authentication)
-- 4. Configure authentication providers if needed (email/password is enabled by default)

-- DATABASE SCHEMA SETUP
-- =====================================================
-- Execute the following SQL commands in order in the Supabase SQL Editor
-- (Dashboard > SQL Editor > New Query)
-- NOTE: Supabase automatically creates auth.users table for authentication

-- Step 1: Create ENUM type for user roles (RBAC)
-- =====================================================
CREATE TYPE user_role AS ENUM ('student', 'instructor', 'admin');

-- Step 2: Create profiles table (with role column from start)
-- =====================================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  role user_role DEFAULT 'student' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Enable Row Level Security on profiles
-- =====================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS policies for profiles table
-- =====================================================
-- Create policy for users to read their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Create policy for users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Step 5: Create function to handle profile creation
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 6: Create trigger to automatically create profile on user signup
-- =====================================================
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Step 7: Create courses table
-- =====================================================
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    created_by UUID REFERENCES profiles(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 8: Create sections table (course organization)
-- =====================================================
CREATE TABLE sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 9: Create lessons table (sequential content)
-- =====================================================
CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    content_type TEXT DEFAULT 'text',
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 10: Create enrollments table (student-course relationship)
-- =====================================================
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_accessed_lesson_id UUID REFERENCES lessons(id),
    UNIQUE(student_id, course_id)
);

-- Step 11: Create lesson_completions table (completion tracking)
-- =====================================================
CREATE TABLE lesson_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, lesson_id)
);

-- =====================================================
-- SETUP VERIFICATION
-- =====================================================
-- After running all the above SQL commands, verify your setup:
-- 1. Check that all tables exist: profiles, courses, sections, lessons, enrollments, lesson_completions
-- 2. Verify the user_role enum was created
-- 3. Test user registration and profile creation
-- 4. Optionally insert sample data for testing

-- SAMPLE DATA FOR TESTING (Optional)
-- =====================================================
-- Uncomment and run these if you want sample data for development:

-- INSERT INTO courses (title, description) VALUES 
-- ('Mathematics 101', 'Introduction to basic mathematics concepts'),
-- ('English Literature', 'Study of classic and modern literature');

-- INSERT INTO sections (course_id, title, order_index) VALUES
-- ((SELECT id FROM courses WHERE title = 'Mathematics 101'), 'Basic Arithmetic', 1),
-- ((SELECT id FROM courses WHERE title = 'Mathematics 101'), 'Algebra Fundamentals', 2);

-- INSERT INTO lessons (section_id, title, content, order_index) VALUES
-- ((SELECT id FROM sections WHERE title = 'Basic Arithmetic'), 'Addition and Subtraction', 'Learn basic addition and subtraction operations.', 1),
-- ((SELECT id FROM sections WHERE title = 'Basic Arithmetic'), 'Multiplication and Division', 'Learn basic multiplication and division operations.', 2);

-- =====================================================
-- FINAL SCHEMA SUMMARY
-- =====================================================
-- Complete database structure:
-- 1. auth.users (Supabase managed authentication)
-- 2. profiles (user profiles with RBAC roles)
-- 3. courses (course information)
-- 4. sections (course organization with sequential ordering)
-- 5. lessons (individual lessons with sequential ordering)
-- 6. enrollments (student-course relationships with last accessed lesson)
-- 7. lesson_completions (completion tracking, order-independent)
--
-- RBAC Roles:
-- - student: Can view courses, complete lessons, track progress
-- - instructor: Can create/manage courses and view student progress  
-- - admin: Full system access and user management
--
-- Key Features:
-- - Sequential lesson ordering with integer order_index
-- - Flexible completion tracking (can complete lessons out of order)
-- - Last accessed lesson tracking for "Continue Learning" feature
-- - Cascade deletion for proper data integrity
-- - RBAC support for future instructor/admin features
-- =====================================================

-- NEXT STEPS FOR DEVELOPMENT
-- =====================================================
-- 1. Run npm run dev to start the development server
-- 2. Test user registration and login functionality
-- 3. Implement dashboard with course cards (Core Task 2)
-- 4. Implement lesson completion system (Core Task 3)
-- 5. Add RLS policies for security (future enhancement)
-- 6. Add performance indexes (future enhancement)
-- =====================================================