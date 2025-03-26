"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

/**
 * DashboardPage is a protected route that displays user session info and
 * provides a logout button.
 */
export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // If session is loading, show a loading indicator.
  if (status === "loading") {
    return <p className="p-4">Loading...</p>;
  }

  // If no session is found, redirect to sign-in.
  if (!session) {
    router.push("/sign-in");
    return null;
  }

  // Handle user logout.
  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/sign-in");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <p>Welcome, {session.user?.name || session.user?.email}!</p>
            <button
                onClick={handleLogout}
                className="mt-4 px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
                Logout
            </button>
        </div>
    </div>
  );
}
