import { getCourseStructure } from "@/lib/courses";
import { notFound } from "next/navigation";
import ResponsiveCourseLayout from "@/components/courses/ResponsiveCourseLayout";
import { getUser } from "@/lib/users";
import { CourseLayoutProps } from "@/types/props";

export default async function CourseLayout({
    children,
    params,
}: CourseLayoutProps) {
    const { courseId } = await params;
    const user = await getUser();

    if (!user) {
        notFound();
    }

    const courseResult = await getCourseStructure(courseId, user.id);

    if (!courseResult.success) {
        notFound();
    }

    const course = courseResult.data;

    return (
        <ResponsiveCourseLayout course={course} currentCourseId={courseId}>
            {children}
        </ResponsiveCourseLayout>
    );
}
