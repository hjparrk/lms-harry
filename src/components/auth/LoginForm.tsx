"use client";

import { login } from "@/actions/auth";
import Link from "next/link";
import { useState, useTransition } from "react";
import { cn } from "@/utils/cn";

export default function LoginForm() {
    const [error, setError] = useState<string>("");
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            setError("");

            const result = await login(formData);

            if (result && !result.success) {
                setError(result.error);
            }
        });
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 lg:p-8 shadow-sm">
            <h2 className="text-2xl font-semibold mb-8 text-center uppercase">
                <span className="text-gray-900">Contour</span>
                <span className="text-blue-500">TestPrep</span>
            </h2>

            <form action={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Email<span className="text-red-500">*</span>
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        disabled={isPending}
                        className={cn(
                            "w-full px-3 py-2 rounded-md shadow-sm placeholder-gray-400 text-gray-900 border focus:outline-none focus:ring-2  transition-colors",
                            error
                                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
                            isPending && "bg-gray-100 cursor-not-allowed"
                        )}
                        placeholder="Email"
                    />
                </div>

                {/* Password Field */}
                <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Password
                        <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        disabled={isPending}
                        className={cn(
                            "w-full px-3 py-2 rounded-md shadow-sm placeholder-gray-400 text-gray-900 border focus:outline-none focus:ring-2 transition-colors",
                            error
                                ? "border-red-300 focus:border-red-500 focus:ring-red-500 "
                                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500 ",
                            isPending && "bg-gray-100 cursor-not-allowed"
                        )}
                        placeholder="Password"
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <div
                        className={cn(
                            "flex items-center justify-between p-3 text-sm rounded-md",
                            "text-red-600 bg-red-50 border border-red-200"
                        )}
                    >
                        <span>{error}</span>
                        <button
                            type="button"
                            onClick={() => setError("")}
                            className="text-red-400 hover:text-red-600 transition-colors"
                        >
                            X
                        </button>
                    </div>
                )}

                {/* Log In Button */}
                <button
                    type="submit"
                    disabled={isPending}
                    className={cn(
                        "w-full text-white font-medium py-3 px-4 rounded-md transition duration-200 flex items-center justify-center",
                        isPending
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gray-800 hover:bg-gray-900"
                    )}
                >
                    {isPending ? "Logging in..." : "Log in"}
                    {!isPending && <span className="ml-2">→</span>}
                </button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center text-xs text-gray-500">
                By signing in, you agree to the{" "}
                <Link href="/terms" className="text-blue-600 hover:underline">
                    Terms of Service
                </Link>
                . For more information about our privacy practices,{" "}
                <Link href="/privacy" className="text-blue-600 hover:underline">
                    see our Privacy Statement
                </Link>
            </div>
        </div>
    );
}
