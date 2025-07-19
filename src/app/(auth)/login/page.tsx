import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Left Side - Hero Section */}
            <div className="flex-1 lg:min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden flex items-center justify-center py-12 lg:py-0">
                {/* Animated Background Elements */}
                <div className="absolute inset-0">
                    {/* Floating decorative circles */}
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse"></div>
                    <div className="absolute top-3/4 left-1/3 w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full opacity-30 animate-bounce"></div>
                    <div className="absolute top-1/2 left-3/4 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full opacity-25 animate-pulse"></div>

                    {/* Little white sparkles */}
                    <div className="absolute top-1/5 left-1/2 w-2 h-2 bg-white rounded-full opacity-60"></div>
                    <div className="absolute top-2/3 left-1/5 w-1 h-1 bg-white rounded-full opacity-80"></div>
                    <div className="absolute top-1/3 left-4/5 w-1.5 h-1.5 bg-white rounded-full opacity-70"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 text-center px-6 lg:px-12 max-w-lg">
                    <h1 className="text-3xl lg:text-5xl font-bold text-white mb-6">
                        Welcome back to Contour Learning
                    </h1>
                    <p className="text-lg lg:text-xl text-gray-200 mb-8 leading-relaxed">
                        Continue your learning journey with our comprehensive
                        platform for test preparation and academic excellence.
                    </p>
                    <div className="flex items-center justify-center">
                        <div className="text-sm text-gray-300">
                            ✨ Discover what&apos;s included
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 bg-gray-50 flex items-center justify-center p-4 lg:p-8">
                <div className="w-full max-w-md">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}
