import { getFirstLessonId } from "@/lib/courses";
import { CourseCardProps } from "@/types/props";
import Link from "next/link";
import { cn } from "@/utils/cn";

export default async function CourseCard({ course }: CourseCardProps) {
    const {
        id: courseId,
        title,
        description,
        progress,
        completed_lessons: completedLessons,
        total_lessons: totalLessons,
        last_accessed_lesson_id: lastAccessedLessonId,
        last_accessed_lesson_title: lastAccessedLessonTitle,
    } = course;

    let lessonId = lastAccessedLessonId;

    if (!lessonId) {
        const firstLessonResult = await getFirstLessonId(courseId);
        if (firstLessonResult.success) {
            lessonId = firstLessonResult.data;
        }
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300 group">
            {/* Course Title & Status */}
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors flex-1 pr-4">
                    {title}
                </h3>
                <div
                    className={cn(
                        "px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap",
                        progress === 100 && "bg-green-100 text-green-800",
                        progress > 0 &&
                            progress < 100 &&
                            "bg-blue-100 text-blue-800",
                        progress === 0 && "bg-gray-100 text-gray-600"
                    )}
                >
                    {progress === 100
                        ? "Completed"
                        : progress > 0
                        ? "In Progress"
                        : "Not Started"}
                </div>
            </div>

            {/* Course Description */}
            {description && (
                <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                    {description}
                </p>
            )}

            {/* Progress Section */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-medium text-gray-900">
                        {completedLessons}/{totalLessons} lessons
                    </span>
                </div>

                {/* Linear Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                        className={cn(
                            "h-3 rounded-full transition-all duration-500",
                            progress === 100 &&
                                "bg-gradient-to-r from-green-500 to-green-600",
                            progress > 0 &&
                                progress < 100 &&
                                "bg-gradient-to-r from-blue-500 to-purple-500",
                            progress === 0 && "bg-gray-300"
                        )}
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="text-right mt-1">
                    <span
                        className={cn(
                            "text-xs font-medium",
                            progress === 100
                                ? "text-green-600"
                                : "text-blue-600"
                        )}
                    >
                        {Math.round(progress)}% complete
                    </span>
                </div>
            </div>

            {/* Last Accessed Lesson */}
            <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                {lastAccessedLessonId ? (
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                                Last Lesson
                            </span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                            {lastAccessedLessonTitle}
                        </p>
                    </div>
                ) : (
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                                Ready to start
                            </span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                            Begin your first lesson
                        </p>
                    </div>
                )}
            </div>

            {/* Continue Button */}
            {lessonId ? (
                <Link href={`/courses/${courseId}/lessons/${lessonId}`}>
                    <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group-hover:scale-[1.02]">
                        Continue Learning
                    </button>
                </Link>
            ) : (
                <button
                    disabled
                    className="w-full bg-gray-400 text-white py-3 px-6 rounded-xl text-sm font-semibold cursor-not-allowed"
                >
                    No Lessons Available
                </button>
            )}
        </div>
    );
}
