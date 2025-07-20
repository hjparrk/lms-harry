// Component Props interfaces

import { UserCourseWithProgress } from "./courses";

export interface CourseCardProps {
    course: UserCourseWithProgress;
}

export interface HeaderProps {
    fullName: string;
}

export interface LecturePageProps {
    params: Promise<{
        courseId: string;
        lectureId: string;
    }>;
}
