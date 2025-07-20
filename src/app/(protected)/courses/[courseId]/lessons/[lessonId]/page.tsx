import {
    getLessonById,
    updateLastAccessedLesson,
    getLessonCompletionStatus,
} from "@/lib/courses";
import { getUser } from "@/lib/users";
import { LessonPageProps } from "@/types/props";
import { notFound } from "next/navigation";
import LessonCompletionButton from "@/components/courses/LessonCompletionButton";

export default async function LessonPage({ params }: LessonPageProps) {
    const { courseId, lessonId } = await params;
    const user = await getUser();

    const result = await getLessonById(lessonId);
    if (!result.success) {
        notFound();
    }

    await updateLastAccessedLesson(user.id, courseId, lessonId);

    const lesson = result.data;

    // Get lesson completion status
    const completionResult = await getLessonCompletionStatus(user.id, lessonId);
    const isCompleted = completionResult.success
        ? completionResult.data
        : false;

    return (
        <div className="min-h-screen bg-gray-50 p-6 text-gray-900">
            <h1 className="text-3xl font-bold mb-6">{lesson.title}</h1>
            <div className="mb-8">
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Voluptatem facere pariatur cumque, accusantium rerum
                    adipisci architecto velit odio tenetur recusandae
                    dignissimos qui veritatis aperiam illum dicta molestias!
                    Quaerat, mollitia doloribus? Lorem ipsum dolor sit amet
                    consectetur adipisicing elit. Voluptatem facere pariatur
                    cumque, accusantium rerum adipisci architecto velit odio
                    tenetur recusandae dignissimos qui veritatis aperiam illum
                    dicta molestias! Quaerat, mollitia doloribus? Lorem ipsum
                    dolor sit amet consectetur adipisicing elit. Voluptatem
                    facere pariatur cumque, accusantium rerum adipisci
                    architecto velit odio tenetur recusandae dignissimos qui
                    veritatis aperiam illum dicta molestias! Quaerat, mollitia
                    doloribus?Lorem ipsum dolor sit amet consectetur adipisicing
                    elit. Voluptatem facere pariatur cumque, accusantium rerum
                    adipisci architecto velit odio tenetur recusandae
                    dignissimos qui veritatis aperiam illum dicta molestias!
                    Quaerat, mollitia doloribus?Lorem ipsum dolor sit amet
                    consectetur adipisicing elit. Voluptatem facere pariatur
                    cumque, accusantium rerum adipisci architecto velit odio
                    tenetur recusandae dignissimos qui veritatis aperiam illum
                    dicta molestias! Quaerat, mollitia doloribus?
                </p>
            </div>

            {/* Lesson Completion Button */}
            <div className="flex justify-center mt-8 pt-8 border-t border-gray-200">
                <LessonCompletionButton
                    lessonId={lessonId}
                    courseId={courseId}
                    initialIsCompleted={isCompleted}
                />
            </div>
        </div>
    );
}
