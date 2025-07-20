// Component Props interfaces

import { UserCourseWithProgress } from "./courses";

export interface CourseCardProps {
    course: UserCourseWithProgress;
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
