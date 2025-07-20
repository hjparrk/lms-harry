import { getUser } from "@/lib/users";
import { getUserCourses } from "@/lib/courses";
import CourseCard from "@/components/dashboard/CourseCard";

export default async function DashboardPage() {
    const user = await getUser();
    const coursesResult = await getUserCourses(user.id);

    if (!coursesResult.success) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Unable to load courses
                    </h1>
                    <p className="text-gray-600">
                        Please refresh the page to try again.
                    </p>
                </div>
            </div>
        );
    }

    const courses = coursesResult.data;

    // Calculate stats
    const totalCourses = courses.length;
    const completedCourses = courses.filter(
        (course) => course.progress === 100
    ).length;
    const inProgressCourses = courses.filter(
        (course) => course.progress > 0 && course.progress < 100
    ).length;

    return (
        <>
            {/* Dashboard Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
                    <div className="mb-6 md:mb-8">
                        <h1 className="text-xl md:text-2xl font-bold mb-2">
                            My Learning Stats 🤩
                        </h1>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/20">
                            <div className="text-xl md:text-2xl font-bold">
                                {totalCourses}
                            </div>
                            <div className="text-blue-100 text-sm">
                                Total Courses
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/20">
                            <div className="text-xl md:text-2xl font-bold">
                                {inProgressCourses}
                            </div>
                            <div className="text-blue-100 text-sm">
                                In Progress
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/20">
                            <div className="text-xl md:text-2xl font-bold">
                                {completedCourses}
                            </div>
                            <div className="text-blue-100 text-sm">
                                Completed
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Courses Section */}
            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">
                        Enrolled Courses
                    </h2>

                    {courses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {courses.map((course) => (
                                <CourseCard key={course.id} course={course} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                                <span className="text-5xl">📚</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                You haven&apos;t enrolled in any courses yet
                            </h3>
                            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                Contact Help Desk 📞 +01 2345 6789
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
