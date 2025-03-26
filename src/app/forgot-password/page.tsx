"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    // In a real app, you'd call an API endpoint to handle password reset email.
    // For now, we simulate a success message.
    setMessage("If an account with that email exists, a reset link has been sent.");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <h1 className="text-2xl font-bold mb-6">Forgot Password</h1>
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                type="submit"
                className="w-full py-2 px-4 rounded-md bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
            >
                Reset Password
            </button>
        </form>
        {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
}
