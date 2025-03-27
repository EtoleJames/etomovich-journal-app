"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

/**
 * ChangePasswordPage allows users to update their password securely.
 */
export default function ChangePasswordPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/sign-in");
    }
  }, [session, status, router]);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to change password.");
      }

      setMessage("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
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
                <h1 className="text-3xl font-bold mb-4">Change Password</h1>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                {message && <p className="text-green-500 mb-2">{message}</p>}
                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                    <label className="block mb-1 font-medium">Current Password</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                    </div>
                    <div>
                    <label className="block mb-1 font-medium">New Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                    </div>
                    <div>
                    <label className="block mb-1 font-medium">Confirm New Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                    </div>
                    <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                    {loading ? "Changing..." : "Change Password"}
                    </button>
                </form>
            </div>
        </div>
    </section>
  );
}
