"use client";

import Loader from "@/components/Loader";
import { useSession } from "next-auth/react";
import Head from "next/head";
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
    return <Loader/>;
  }

  // If no session is found, redirect to sign-in.
  if (!session) {
    router.push("/sign-in");
    return null;
  }


  return (
    <>
      {/* Metadata */}
      <Head>
        <title>Dashboard - Etomovich Journals</title>
        <meta name="description" content="Etomovich Journals Dashboard" />
      </Head>
      <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
        <div className="container">
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <p>Welcome, {session.user?.name || session.user?.email}!</p>
          </div>
        </div>
      </section>
    </>

  );
}
