"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/utils/cn";
import { useCourse } from "@/contexts/CourseContext";
import { toggleLessonCompletion } from "@/actions/courses";
import { LessonCompletionButtonProps } from "@/types/props";

export default function LessonCompletionButton({
    lessonId,
    courseId,
    initialIsCompleted,
}: LessonCompletionButtonProps) {
    const [isCompleted, setIsCompleted] = useState(initialIsCompleted);
    const [isPending, startTransition] = useTransition();
    const { updateLessonCompletion } = useCourse();

    const handleToggle = () => {
        startTransition(async () => {
            const result = await toggleLessonCompletion(lessonId, courseId);
            if (result.success) {
                const newStatus = result.data;
                setIsCompleted(newStatus);
                // Update context to sync with sidebar
                updateLessonCompletion(lessonId, newStatus);
            } else {
                console.error(
                    "Failed to toggle lesson completion:",
                    result.error
                );
            }
        });
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isPending}
            className={cn(
                "flex items-center gap-3 px-6 py-3 rounded-lg border transition-all duration-200",
                "hover:scale-105 active:scale-95",
                isPending && "opacity-50 cursor-not-allowed",
                isCompleted
                    ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                    : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
            )}
        >
            {isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
                <Circle className="w-5 h-5 text-gray-400" />
            )}
            <span className="font-medium">
                {isPending
                    ? "Updating ..."
                    : isCompleted
                    ? "Completed"
                    : "Mark as Completed"}
            </span>
        </button>
    );
}
