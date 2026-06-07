import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/app/_components/auth-form";
import { PageIntro } from "@/app/_components/scaffold";
import { getCurrentSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Log in",
};

export default async function LoginPage() {
  const session = await getCurrentSession();

  if (session) {
    redirect("/notes");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center px-6 py-16">
      <PageIntro
        eyebrow="Welcome back"
        title="Log in to TinyNotes"
        description="Enter your email and password to continue."
      />
      <div className="mt-8">
        <AuthForm mode="login" />
      </div>
    </main>
  );
}
