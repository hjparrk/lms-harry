"use client";

import { createContext, useContext, useState } from "react";
import {
    CourseContextType,
    CourseProviderProps,
    CourseStructure,
} from "@/types/courses";

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export function CourseProvider({
    children,
    initialCourse,
}: CourseProviderProps) {
    const [course, setCourse] = useState<CourseStructure>(initialCourse);

    const updateLessonCompletion = (lessonId: string, isCompleted: boolean) => {
        setCourse((prevCourse) => ({
            ...prevCourse,
            sections: prevCourse.sections.map((section) => ({
                ...section,
                lessons: section.lessons.map((lesson) =>
                    lesson.id === lessonId
                        ? { ...lesson, is_completed: isCompleted }
                        : lesson
                ),
            })),
        }));
    };

    return (
        <CourseContext.Provider value={{ course, updateLessonCompletion }}>
            {children}
        </CourseContext.Provider>
    );
}

export function useCourse() {
    const context = useContext(CourseContext);
    if (context === undefined) {
        throw new Error("useCourse must be used within a CourseProvider");
    }
    return context;
}
