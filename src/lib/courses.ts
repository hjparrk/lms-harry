import { createClient } from "@/utils/supabase/server";
import {
    UserCourseWithProgress,
    EnrollmentWithCourse,
    LessonData,
    CourseStructure,
} from "@/types/courses";
import { Result } from "@/types/common";

export async function getCourses(
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

    const courses = (enrollments as EnrollmentWithCourse[]).map(
        (enrollment) => {
            const course = enrollment.courses;
            const completedLessons = enrollment.completed_lessons || 0;
            const totalLessons = course.total_lessons || 0;

            const progress =
                totalLessons > 0
                    ? Math.round(
                          (completedLessons / totalLessons) * 100 * 100
                      ) / 100
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
        }
    );

    return { success: true, data: courses };
}

export async function getFirstLessonId(
    courseId: string
): Promise<Result<string>> {
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

export async function getLessonById(
    lessonId: string
): Promise<Result<LessonData>> {
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

export async function updateLastAccessedLesson(
    userId: string,
    courseId: string,
    lessonId: string
): Promise<Result<void>> {
    const supabase = await createClient();

    const { error } = await supabase
        .from("enrollments")
        .update({ last_accessed_lesson_id: lessonId })
        .eq("student_id", userId)
        .eq("course_id", courseId);

    if (error) {
        return {
            success: false,
            error: "Failed to update last accessed lesson",
        };
    }

    return { success: true, data: undefined };
}

export async function getCourseStructure(
    courseId: string,
    userId: string
): Promise<Result<CourseStructure>> {
    const supabase = await createClient();

    // First, get course basic info
    const { data: enrollment, error: enrollmentError } = await supabase
        .from("enrollments")
        .select(
            `
            courses!inner (
                id,
                title,
                description
            )
        `
        )
        .eq("course_id", courseId)
        .eq("student_id", userId)
        .single();

    if (enrollmentError || !enrollment) {
        return { success: false, error: "Course not found or not enrolled" };
    }

    // Ensure to have one course per
    const course = Array.isArray(enrollment.courses)
        ? enrollment.courses[0]
        : enrollment.courses;

    // Get sections with lessons and completion status
    const { data: sections, error: sectionsError } = await supabase
        .from("sections")
        .select(
            `
            id,
            title,
            order_index,
            lessons (
                id,
                title,
                order_index
            )
        `
        )
        .eq("course_id", courseId)
        .order("order_index", { ascending: true });

    if (sectionsError) {
        return { success: false, error: "Failed to fetch course structure" };
    }

    // Get completed lessons for this user
    const { data: completions, error: completionsError } = await supabase
        .from("lesson_completions")
        .select("lesson_id, is_completed")
        .eq("student_id", userId)
        .eq("is_completed", true);

    if (completionsError) {
        return { success: false, error: "Failed to fetch completion data" };
    }

    const completedLessonIds = new Set(
        completions?.map((c) => c.lesson_id) || []
    );

    // Transform the data structure
    const structuredSections = (sections || []).map((section) => ({
        id: section.id,
        title: section.title,
        order_index: section.order_index,
        lessons: (section.lessons || [])
            .sort((a, b) => a.order_index - b.order_index)
            .map((lesson) => ({
                id: lesson.id,
                title: lesson.title,
                order_index: lesson.order_index,
                is_completed: completedLessonIds.has(lesson.id),
            })),
    }));

    return {
        success: true,
        data: {
            id: course.id,
            title: course.title,
            description: course.description,
            sections: structuredSections,
        },
    };
}

export async function getLessonCompletionStatus(
    userId: string,
    lessonId: string
): Promise<Result<boolean>> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("lesson_completions")
        .select("is_completed")
        .eq("student_id", userId)
        .eq("lesson_id", lessonId)
        .single();

    // Error code PGRST116 == "No rows found"
    if (error && error.code !== "PGRST116") {
        return {
            success: false,
            error: "Failed to fetch lesson completion status",
        };
    }

    // If no record exists, lesson is not completed
    if (!data) {
        return { success: true, data: false };
    }

    return { success: true, data: data.is_completed };
}

