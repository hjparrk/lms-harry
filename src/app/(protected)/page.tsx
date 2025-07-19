import { getUser } from "@/lib/users";
import { getUserCourses } from "@/lib/courses";
import CourseCard from "@/components/dashboard/CourseCard";

export default async function Dashboard() {
    const user = await getUser();
    const courses = await getUserCourses(user.id);

    return (
        <>
            {/* Courses Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Your Courses
                </h2>

                {courses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">📚</span>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No courses yet
                        </h3>
                        <p className="text-gray-600 mb-6">
                            You haven&apos;t enrolled in any courses yet.
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}
