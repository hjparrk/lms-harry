import { createClient } from "@/utils/supabase/server";
import { UserCourseWithProgress, EnrollmentWithCourse } from "@/types/courses";

export async function getUserCourses(
    userId: string
): Promise<UserCourseWithProgress[]> {
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
        throw new Error("Failed to fetch user courses");
    }

    if (!enrollments) {
        return [];
    }

    return (enrollments as EnrollmentWithCourse[]).map((enrollment) => {
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
}
