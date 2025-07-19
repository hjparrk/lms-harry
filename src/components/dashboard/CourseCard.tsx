import { CourseCardProps } from "@/types/props";

export default function CourseCard({ course }: CourseCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            {/* Course Title */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {course.title}
            </h3>

            {/* Course Description */}
            {course.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description}
                </p>
            )}

            {/* Progress Section */}
            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-medium text-gray-900">
                        {course.completed_lessons}/{course.total_lessons}{" "}
                        lessons
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                    />
                </div>

                <div className="text-right mt-1">
                    <span className="text-xs text-blue-600 font-medium">
                        {course.progress}% complete
                    </span>
                </div>
            </div>

            {/* Last Accessed Lesson */}
            <div className="mb-4">
                {course.last_accessed_lesson_id ? (
                    <div>
                        <span className="text-xs text-gray-500">
                            Last accessed:
                        </span>
                        <p className="text-sm font-medium text-gray-800 mt-1">
                            {course.last_accessed_lesson_title}
                        </p>
                    </div>
                ) : (
                    <div>
                        <span className="text-xs text-gray-500">
                            Ready to start
                        </span>
                        <p className="text-sm font-medium text-gray-800 mt-1">
                            Begin your first lesson
                        </p>
                    </div>
                )}
            </div>

            {/* Continue Button */}
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                Continue Learning
            </button>
        </div>
    );
}
