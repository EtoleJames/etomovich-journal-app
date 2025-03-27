"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/**
 * SettingsPage allows the user to view and update their profile information.
 * The email field is read-only, and the name can be updated.
 * A link to change the password is also provided.
 */
export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Local state for profile fields and messages.
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Enforce session: redirect to sign-in if not authenticated.
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/sign-in");
    } else {
      setName(session.user.name || "");
    }
  }, [session, status, router]);

  // Handle profile update form submission.
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: session?.user.id, name }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile.");
      }
      setMessage("Profile updated successfully.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
        <div className="container">
            <div className="p-4 max-w-md mx-auto">
                <h1 className="text-3xl font-bold mb-4">Settings & Profile</h1>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                {message && <p className="text-green-500 mb-2">{message}</p>}
                <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                    <label className="block mb-1 font-medium">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                    </div>
                    <div>
                    <label className="block mb-1 font-medium">Email</label>
                    <input
                        type="email"
                        value={session?.user.email || ""}
                        className="w-full border px-3 py-2 rounded"
                        disabled
                    />
                    </div>
                    <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                    {loading ? "Updating..." : "Update Profile"}
                    </button>
                </form>
                <div className="mt-4">
                    <Link href="/change-password" className="text-blue-500 hover:underline">
                        Change Password
                    </Link>
                </div>
            </div>
        </div>
    </section>
  );
}
