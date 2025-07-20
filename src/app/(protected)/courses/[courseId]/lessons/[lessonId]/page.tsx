import { getLessonById, updateLastAccessedLesson } from "@/lib/courses";
import { getUser } from "@/lib/users";
import { LessonPageProps } from "@/types/props";
import { notFound } from "next/navigation";

export default async function LessonPage({ params }: LessonPageProps) {
    const { courseId, lessonId } = await params;
    const { id: userId } = await getUser();

    const result = await getLessonById(lessonId);
    if (!result.success) {
        notFound();
    }

    // Update last accessed lesson
    await updateLastAccessedLesson(userId, courseId, lessonId);

    const lesson = result.data;
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
        </div>
    );
}
