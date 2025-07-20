import { getUser } from "@/lib/users";
import { getProfile } from "@/lib/profiles";
import Header from "@/components/layout/Header";

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getUser();
    const profile = await getProfile(user.id);
    const fullName = profile.full_name || "John Doe";

    return (
        <div className="min-h-screen bg-gray-50">
            <Header fullName={fullName} />
            {children}
        </div>
    );
}
