import type { Metadata } from "next";
import { PageIntro, PlaceholderPanel } from "@/app/_components/scaffold";

export const metadata: Metadata = {
  title: "Log in",
};

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center px-6 py-16">
      <PageIntro
        eyebrow="Welcome back"
        title="Log in to TinyNotes"
        description="Authentication controls will be added in a later implementation phase."
      />
      <div className="mt-8">
        <PlaceholderPanel
          label="Login form placeholder"
          description="Future email, password, validation, and submit controls."
          tall
        />
      </div>
    </main>
  );
}
