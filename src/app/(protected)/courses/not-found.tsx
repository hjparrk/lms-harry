import Link from "next/link";

export default function CourseNotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-md mx-auto px-6">
                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Lecture Not Found
                </h1>

                {/* Message */}
                <p className="text-gray-600 mb-8 leading-relaxed">
                    The lecture you&apos;re looking for doesn&apos;t exist or
                    may have been removed. Please check the URL or return to
                    your dashboard to find available courses.
                </p>

                {/* Action Buttons */}
                <div className="space-y-4">
                    <Link href="/">
                        <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                            Go to Dashboard
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
