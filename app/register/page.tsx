import type { Metadata } from "next";
import { AuthForm } from "@/app/_components/auth-form";
import { PageIntro } from "@/app/_components/scaffold";

export const metadata: Metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center px-6 py-16">
      <PageIntro
        eyebrow="Create an account"
        title="Start your TinyNotes space"
        description="Choose an email and password for your account."
      />
      <div className="mt-8">
        <AuthForm mode="register" />
      </div>
    </main>
  );
}
