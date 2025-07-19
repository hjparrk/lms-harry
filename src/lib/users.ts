import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { User } from "@supabase/supabase-js";

export async function getUser(): Promise<User> {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    const { user } = data;
    if (error || !user) {
        redirect("/login");
    }

    return user;
}
