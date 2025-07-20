import { getLessonById } from "@/lib/courses";
import { LecturePageProps } from "@/types/props";
import { notFound } from "next/navigation";

export default async function LecturePage({ params }: LecturePageProps) {
    const { lectureId } = await params;

    const result = await getLessonById(lectureId);
    if (!result.success) {
        notFound();
    }

    const lesson = result.data;
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
        </div>
    );
}
