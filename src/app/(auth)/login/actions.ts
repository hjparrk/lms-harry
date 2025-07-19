"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { loginSchema } from "@/types/auth";
import { z } from "zod";

export async function login(formData: FormData) {
    const supabase = await createClient();

    const rawData = {
        email: formData.get("email"),
        password: formData.get("password"),
    };

    const validationResult = loginSchema.safeParse(rawData);

    if (!validationResult.success) {
        const errors = z.treeifyError(validationResult.error);
        throw new Error(`Validation failed: ${JSON.stringify(errors)}`);
    }

    const { error } = await supabase.auth.signInWithPassword(
        validationResult.data
    );

    if (error) {
        redirect("/error");
    }

    revalidatePath("/", "layout");
    redirect("/");
}

export async function logout() {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
        throw new Error("An error occurred during logout");
    }

    revalidatePath("/", "layout");
    redirect("/");
}
