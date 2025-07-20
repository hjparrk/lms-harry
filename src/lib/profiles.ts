import { Profile } from "@/types/database";
import { createClient } from "@/utils/supabase/server";

export async function getProfile(userId: string): Promise<Profile> {
    const supabase = await createClient();

    const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

    return data as Profile;
}