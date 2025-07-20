"use client";

import { useState } from "react";
import CourseSidebar from "./CourseSidebar";
import { Menu, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { ResponsiveCourseLayoutProps } from "@/types/props";
import { CourseProvider } from "@/contexts/CourseContext";

export default function ResponsiveCourseLayout({
    children,
    course,
    currentCourseId,
}: ResponsiveCourseLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <CourseProvider initialCourse={course}>
            <div className="min-h-screen bg-gray-50 flex">
                {/* Mobile Toggle Button */}
                <button
                    onClick={toggleSidebar}
                    className="lg:hidden fixed top-20 right-4 z-50 bg-white rounded-lg shadow-lg p-1 border border-gray-200"
                >
                    {isSidebarOpen ? (
                        <X className="w-6 h-6 text-gray-600" />
                    ) : (
                        <Menu className="w-6 h-6 text-gray-600" />
                    )}
                </button>

                {/* Sidebar */}
                <div
                    className={cn(
                        "bg-white border-r border-gray-200 overflow-y-auto z-40",
                        // Desktop: Fixed sidebar
                        "lg:w-80 lg:fixed lg:left-0 lg:top-16 lg:h-[calc(100vh-4rem)]",
                        // Mobile: Overlay sidebar
                        "fixed top-16 h-[calc(100vh-4rem)] w-80 transition-transform duration-300 ease-in-out",
                        isSidebarOpen
                            ? "translate-x-0"
                            : "-translate-x-full lg:translate-x-0"
                    )}
                >
                    <CourseSidebar
                        currentCourseId={currentCourseId}
                        onLessonClick={closeSidebar}
                    />
                </div>

                {/* Main Content Area */}
                <div className="flex-1 lg:ml-80 pt-16">{children}</div>
            </div>
        </CourseProvider>
    );
}
