"use client";

import { cn } from "@/utils/cn";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle2, Circle, BookOpen } from "lucide-react";
import { useCourse } from "@/contexts/CourseContext";
import { CourseSidebarProps } from "@/types/props";

export default function CourseSidebar({
    currentCourseId,
    onLessonClick,
}: CourseSidebarProps) {
    const { course } = useCourse();
    const params = useParams();
    const currentLessonId = params.lessonId as string;

    return (
        <div className="h-full flex flex-col">
            {/* Course Header */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex-1">
                    <h1 className="text-lg font-bold text-gray-900 line-clamp-2">
                        {course.title}
                    </h1>
                </div>
            </div>

            {/* Curriculum Navigation */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                    {course.sections.map((section) => (
                        <div key={section.id} className="space-y-3">
                            {/* Section Header */}
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-gray-500" />
                                <h3 className="font-semibold text-gray-900 text-sm">
                                    {section.title}
                                </h3>
                            </div>

                            {/* Section Lessons */}
                            <div className="space-y-1 ml-6">
                                {section.lessons.map((lesson) => {
                                    const isCurrentLesson =
                                        lesson.id === currentLessonId;
                                    const isCompleted = lesson.is_completed;

                                    return (
                                        <Link
                                            key={lesson.id}
                                            href={`/courses/${currentCourseId}/lessons/${lesson.id}`}
                                            onClick={onLessonClick}
                                            className={cn(
                                                "flex items-center gap-3 p-3 rounded-lg",
                                                isCurrentLesson
                                                    ? "bg-blue-50 border border-blue-200 text-blue-900"
                                                    : "hover:bg-gray-50 text-gray-700"
                                            )}
                                        >
                                            {/* Completion Status Icon */}
                                            {isCompleted ? (
                                                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                                            ) : (
                                                <Circle
                                                    className={cn(
                                                        "w-5 h-5 flex-shrink-0",
                                                        isCurrentLesson
                                                            ? "text-blue-600"
                                                            : "text-gray-400"
                                                    )}
                                                />
                                            )}

                                            {/* Lesson Title */}
                                            <span
                                                className={cn(
                                                    "text-sm flex-1 line-clamp-2",
                                                    isCurrentLesson
                                                        ? "font-medium text-blue-900"
                                                        : isCompleted
                                                        ? "font-medium text-gray-900"
                                                        : "text-gray-600"
                                                )}
                                            >
                                                {lesson.title}
                                            </span>

                                            {/* Current Lesson Indicator */}
                                            {isCurrentLesson && (
                                                <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
