-- ========================================
-- SAMPLE DATA GENERATION
-- ========================================
-- This file contains sample data for testing and development purposes
-- 
-- PREREQUISITES:
-- 1. First run supabase-setup.sql to create the database schema
-- 2. Create a user in Supabase Dashboard (Authentication > Users > Add user)
-- 3. Replace 'YOUR_USER_ID_HERE' with your actual user ID from auth.users table
-- 4. Then run this file in Supabase SQL Editor

-- Insert course data
INSERT INTO "public"."courses" (
    "id", 
    "title", 
    "description", 
    "is_active", 
    "total_lessons", 
    "created_at", 
    "updated_at"
) VALUES 
(
    '53f5f783-1780-4a21-b5fc-b47386d8d50e', 
    'Chemistry I', 
    null, 
    'true', 
    '1', 
    '2025-07-20 16:14:17.71619+00', 
    '2025-07-20 16:14:17.71619+00'
),
(
    'a098809e-00e1-469e-81b3-c945c681fede', 
    'Maths I', 
    null, 
    'true', 
    '3', 
    '2025-07-19 16:03:17.692075+00', 
    '2025-07-19 16:03:17.692075+00'
);

-- Insert sections data
INSERT INTO "public"."sections" (
    "id", 
    "course_id", 
    "title", 
    "order_index", 
    "created_at"
) VALUES 
(
    '57e34db3-f624-4f60-bb94-3bbd53d76896', 
    '53f5f783-1780-4a21-b5fc-b47386d8d50e', 
    'Induction', 
    '1', 
    '2025-07-20 16:15:38.451355+00'
), 
(
    '881cc628-8efb-4eca-9166-1cc107fabb2a', 
    'a098809e-00e1-469e-81b3-c945c681fede', 
    'Introduction to Calculus', 
    '1', 
    '2025-07-19 16:03:55.946622+00'
), 
(
    'fe8e5fdc-f682-48d7-bebe-35b1db9222b2', 
    'a098809e-00e1-469e-81b3-c945c681fede', 
    'End of Course', 
    '200', 
    '2025-07-20 12:09:35.506944+00'
);

-- Insert lessons data
INSERT INTO "public"."lessons" (
    "id", 
    "section_id", 
    "title", 
    "content", 
    "content_type", 
    "order_index", 
    "created_at", 
    "updated_at"
) VALUES 
(
    '32146ac5-1bc1-4b12-8c50-30c8e1422f9e', 
    '57e34db3-f624-4f60-bb94-3bbd53d76896', 
    'Chem', 
    null, 
    'text', 
    '1', 
    '2025-07-20 16:16:03.392561+00', 
    '2025-07-20 16:16:03.392561+00'
),
(
    '87acc5bb-cd82-4b0a-9771-c62c28db7c95', 
    '881cc628-8efb-4eca-9166-1cc107fabb2a', 
    'Introduction I', 
    null, 
    'text', 
    '1', 
    '2025-07-19 16:04:18.089259+00', 
    '2025-07-19 16:04:18.089259+00'
),
(
    '1f91e300-86f4-4658-89d7-bc3bc73ae321', 
    '881cc628-8efb-4eca-9166-1cc107fabb2a', 
    'Introduction II', 
    null, 
    'text', 
    '100', 
    '2025-07-19 16:04:40.486426+00', 
    '2025-07-19 16:04:40.486426+00'
),
(
    '41cfddbf-86eb-4d88-b535-a71b815e017f', 
    'fe8e5fdc-f682-48d7-bebe-35b1db9222b2', 
    'Math', 
    null, 
    'text', 
    '1', 
    '2025-07-20 12:12:33.26442+00', 
    '2025-07-20 12:12:33.26442+00'
);

-- Insert enrollments data
-- NOTE: Replace 'YOUR_USER_ID_HERE' with your actual user ID from auth.users
INSERT INTO "public"."enrollments" (
    "id", 
    "student_id", 
    "course_id", 
    "enrolled_at", 
    "last_accessed_lesson_id", 
    "completed_lessons"
) VALUES 
(
    '86b27015-228b-49eb-8adf-5fbbd5b330a0', 
    'YOUR_USER_ID_HERE', 
    '53f5f783-1780-4a21-b5fc-b47386d8d50e', 
    '2025-07-20 16:15:01.767312+00', 
    null, 
    '0'
),
(
    'f295d1ac-ec3e-4367-87e2-f4bd621995e5', 
    'YOUR_USER_ID_HERE', 
    'a098809e-00e1-469e-81b3-c945c681fede', 
    '2025-07-19 16:05:18.981922+00', 
    null, 
    '0'
);