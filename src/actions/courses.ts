"use server";

import { createClient } from "@/utils/supabase/server";
import { getLessonCompletionStatus } from "@/lib/courses";
import { Result } from "@/types/common";
import { getUser } from "@/lib/users";

export async function toggleLessonCompletion(
    lessonId: string,
    courseId: string
): Promise<Result<boolean>> {
    const user = await getUser();
    if (!user) {
        return { success: false, error: "User not authenticated" };
    }

    const supabase = await createClient();

    // First check if the lesson is already completed
    const statusResult = await getLessonCompletionStatus(user.id, lessonId);
    if (!statusResult.success) {
        return statusResult;
    }

    const isCompleted = statusResult.data;
    const newStatus = !isCompleted;

    // Use upsert to handle both insert and update
    const { error } = await supabase
        .from("lesson_completions")
        .upsert({
            student_id: user.id,
            lesson_id: lessonId,
            is_completed: newStatus,
            updated_at: new Date().toISOString(),
        }, {
            onConflict: "student_id,lesson_id",
        });

    if (error) {
        return {
            success: false,
            error: `Failed to ${
                newStatus ? "mark" : "unmark"
            } lesson as completed: ${error.message}`,
        };
    }

    // Update completed_lessons counter in enrollments
    const { data: enrollment, error: getError } = await supabase
        .from("enrollments")
        .select("completed_lessons")
        .eq("student_id", user.id)
        .eq("course_id", courseId)
        .single();

    if (getError || !enrollment) {
        return { success: true, data: newStatus };
    }

    const currentCount = enrollment.completed_lessons || 0;
    const newCount = Math.max(0, currentCount + (newStatus ? 1 : -1));

    const { error: enrollmentError } = await supabase
        .from("enrollments")
        .update({ completed_lessons: newCount })
        .eq("student_id", user.id)
        .eq("course_id", courseId);

    if (enrollmentError) {
        return {
            success: false,
            error: "Failed to update course progress counter",
        };
    }

    return { success: true, data: newStatus };
}