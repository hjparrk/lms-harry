// Course-related interfaces and types

export interface UserCourseWithProgress {
    id: string;
    title: string;
    description: string | null;
    total_lessons: number;
    completed_lessons: number;
    progress: number;
    enrolled_at: string | null;
    last_accessed_lesson_id: string | null;
    last_accessed_lesson_title?: string | null;
    is_active: boolean | null;
}

export interface CourseData {
    id: string;
    title: string;
    description: string | null;
    total_lessons: number | null;
    is_active: boolean | null;
    created_at: string | null;
    updated_at: string | null;
}

export interface LessonData {
    id: string;
    title: string;
    content: string | null;
    content_type: string | null;
}

export interface EnrollmentWithCourse {
    id: string;
    enrolled_at: string | null;
    last_accessed_lesson_id: string | null;
    completed_lessons: number | null;
    student_id: string;
    course_id: string;
    courses: CourseData;
    lessons?: LessonData | null;
}
