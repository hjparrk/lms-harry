"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { loginSchema } from "@/schemas/auth";

export async function login(formData: FormData) {
    const supabase = await createClient();

    const rawData = {
        email: formData.get("email"),
        password: formData.get("password"),
    };

    const validationResult = loginSchema.safeParse(rawData);

    if (!validationResult.success) {
        return {
            success: false,
            error: "Incorrect email or password.",
        };
    }

    const { error } = await supabase.auth.signInWithPassword(
        validationResult.data
    );

    if (error) {
        return {
            success: false,
            error: "Invalid email or password.",
        };
    }

    redirect("/");
}

export async function logout() {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
        return {
            success: false,
            error: "An error occurred during logout",
        };
    }

    redirect("/login");
}
