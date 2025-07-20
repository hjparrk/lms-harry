// Component Props interfaces

import { CourseStructure, UserCourseWithProgress } from "./courses";

export interface CourseCardProps {
    course: UserCourseWithProgress;
}

export interface CourseSidebarProps {
    currentCourseId: string;
    onLessonClick?: () => void;
}

export interface HeaderProps {
    fullName: string;
}

export interface LessonPageProps {
    params: Promise<{
        courseId: string;
        lessonId: string;
    }>;
}

export interface LessonCompletionButtonProps {
    lessonId: string;
    courseId: string;
    initialIsCompleted: boolean;
}

export interface CourseLayoutProps {
    children: React.ReactNode;
    params: Promise<{ courseId: string }>;
}

export interface ResponsiveCourseLayoutProps {
    children: React.ReactNode;
    course: CourseStructure;
    currentCourseId: string;
}
