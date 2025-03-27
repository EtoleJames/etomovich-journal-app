"use client";

// Home page component
import Hero from "@/components/Hero";
import { Metadata } from "next";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Loader from "@/components/Loader";
import Head from "next/head";


export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // If session is loading, show a loading indicator.
  if (status === "loading") {
    return <Loader/>;  
  }

  // If no session is found, redirect to sign-in.
  if (session) {
    router.push("/dashboard");
    return null;
  }

  return (
    <>
      {/* Metadata */}
      <Head>
        <title>Etomovich Journals</title>
        <meta name="description" content="Etomovich Journals an easy way to document your life." />
      </Head>
      <Hero />
    </>
  );
}
