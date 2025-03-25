// Home page component
import Hero from "@/components/Hero";
import { Metadata } from "next";

// Export metadata using Next.js Metadata API for SEO and page settings
export const metadata: Metadata = {
  title: "Etomovich Journal App",
  description: "A fullstack personal journaling application built with Next.js",
};


export default function HomePage() {
  return (
    <>
      <Hero/>
    </>
  );
}
