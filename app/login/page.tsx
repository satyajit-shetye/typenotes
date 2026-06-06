import type { Metadata } from "next";
import { AuthForm } from "@/app/_components/auth-form";
import { PageIntro } from "@/app/_components/scaffold";

export const metadata: Metadata = {
  title: "Log in",
};

export default function LoginPage() {
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
