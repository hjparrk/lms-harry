import { createClient } from "@/utils/supabase/server";
import { UserCourseWithProgress, EnrollmentWithCourse, LessonData } from "@/types/courses";
import { Result } from "@/types/common";

export async function getUserCourses(
    userId: string
): Promise<Result<UserCourseWithProgress[]>> {
    const supabase = await createClient();

    const { data: enrollments, error } = await supabase
        .from("enrollments")
        .select(
            `
            *,
            courses:course_id (
                id,
                title,
                description,
                total_lessons,
                is_active,
                created_at,
                updated_at
            ),
            lessons:last_accessed_lesson_id (
                id,
                title
            )
        `
        )
        .eq("student_id", userId)
        .order("enrolled_at", { ascending: false });

    if (error) {
        return { success: false, error: "Failed to fetch user courses" };
    }

    if (!enrollments) {
        return { success: true, data: [] };
    }

    const courses = (enrollments as EnrollmentWithCourse[]).map((enrollment) => {
        const course = enrollment.courses;
        const completedLessons = enrollment.completed_lessons || 0;
        const totalLessons = course.total_lessons || 0;

        const progress =
            totalLessons > 0
                ? Math.round((completedLessons / totalLessons) * 100 * 100) /
                  100
                : 0;

        return {
            id: course.id,
            title: course.title,
            description: course.description,
            total_lessons: totalLessons,
            completed_lessons: completedLessons,
            progress,
            enrolled_at: enrollment.enrolled_at,
            last_accessed_lesson_id: enrollment.last_accessed_lesson_id,
            last_accessed_lesson_title: enrollment.lessons?.title || null,
            is_active: course.is_active,
        };
    });

    return { success: true, data: courses };
}

export async function getFirstLessonId(courseId: string): Promise<Result<string>> {
    const supabase = await createClient();

    const { data: firstSection, error: sectionError } = await supabase
        .from("sections")
        .select("id")
        .eq("course_id", courseId)
        .order("order_index", { ascending: true })
        .limit(1)
        .single();

    if (sectionError || !firstSection) {
        return { success: false, error: "No sections found in course" };
    }

    const { data: firstLesson, error: lessonError } = await supabase
        .from("lessons")
        .select("id")
        .eq("section_id", firstSection.id)
        .order("order_index", { ascending: true })
        .limit(1)
        .single();

    if (lessonError || !firstLesson) {
        return { success: false, error: "No lessons found in course" };
    }

    return { success: true, data: firstLesson.id };
}

export async function getLessonById(lessonId: string): Promise<Result<LessonData>> {
    const supabase = await createClient();

    const { data: lesson, error } = await supabase
        .from("lessons")
        .select("id, title, content, content_type")
        .eq("id", lessonId)
        .single();

    if (error) {
        return { success: false, error: "Failed to fetch lesson" };
    }

    return { success: true, data: lesson };
}
