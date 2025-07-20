-- LMS Database Setup for Supabase

-- ========================================
-- 1. ENUM CREATION
-- ========================================

-- Create user roles enum
CREATE TYPE user_role AS ENUM ('student', 'instructor', 'admin');

-- ========================================
-- 2. TABLE CREATION
-- ========================================

-- User profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  role user_role DEFAULT 'student' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses table
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    total_lessons INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course sections table
CREATE TABLE sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lessons table
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

-- Student enrollments table
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_accessed_lesson_id UUID REFERENCES lessons(id),
    completed_lessons INTEGER DEFAULT 0,
    UNIQUE(student_id, course_id)
);

-- Lesson completion tracking table
CREATE TABLE lesson_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT true,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, lesson_id)
);

-- ========================================
-- 3. FUNCTIONS AND TRIGGERS
-- ========================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ========================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to view and update their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Enable RLS on courses and allow students to view enrolled courses only
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can view enrolled courses" ON courses
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM enrollments 
            WHERE enrollments.course_id = courses.id 
            AND enrollments.student_id = auth.uid()
        )
    );

-- Enable RLS on enrollments and allow students to view own enrollments only
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can view own enrollments" ON enrollments
    FOR SELECT 
    USING (student_id = auth.uid());

-- Allow students to update their own enrollment progress (last_accessed_lesson_id, completed_lessons)
CREATE POLICY "Students can update their own enrollments" ON enrollments
    FOR UPDATE 
    USING (student_id = auth.uid())
    WITH CHECK (student_id = auth.uid());

-- Enable RLS on sections and allow students to view sections of enrolled courses only
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can view sections of enrolled courses" ON sections
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM enrollments 
            WHERE enrollments.course_id = sections.course_id 
            AND enrollments.student_id = auth.uid()
        )
    );

-- Enable RLS on lessons and allow students to view lessons of enrolled courses only
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can view lessons of enrolled courses" ON lessons
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM enrollments e 
            JOIN sections s ON e.course_id = s.course_id 
            WHERE s.id = lessons.section_id 
            AND e.student_id = auth.uid()
        )
    );

-- Enable RLS on lesson_completions and allow students to manage own completions only
ALTER TABLE lesson_completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can view own lesson completions" ON lesson_completions
    FOR SELECT 
    USING (student_id = auth.uid());
CREATE POLICY "Students can insert own lesson completions" ON lesson_completions
    FOR INSERT 
    WITH CHECK (student_id = auth.uid());
CREATE POLICY "Students can update own lesson completions" ON lesson_completions
    FOR UPDATE 
    USING (student_id = auth.uid())
    WITH CHECK (student_id = auth.uid());

