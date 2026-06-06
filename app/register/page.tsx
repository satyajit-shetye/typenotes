import type { Metadata } from "next";
import { PageIntro, PlaceholderPanel } from "@/app/_components/scaffold";

export const metadata: Metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center px-6 py-16">
      <PageIntro
        eyebrow="Create an account"
        title="Start your TinyNotes space"
        description="Registration controls will be added in a later implementation phase."
      />
      <div className="mt-8">
        <PlaceholderPanel
          label="Registration form placeholder"
          description="Future name, email, password, validation, and submit controls."
          tall
        />
      </div>
    </main>
  );
}
