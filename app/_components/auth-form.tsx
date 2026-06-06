"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

type AuthFormProps = {
  mode: "login" | "register";
};

type FormErrors = {
  email?: string;
  password?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AuthForm({ mode }: AuthFormProps) {
  const isRegister = mode === "register";
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState("");

  function clearFieldError(field: keyof FormErrors) {
    setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
    setStatus("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const nextErrors: FormErrors = {};

    if (!email) {
      nextErrors.email = "Enter your email address.";
    } else if (!emailPattern.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Enter your password.";
    } else if (isRegister && password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    setErrors(nextErrors);
    setStatus(
      Object.keys(nextErrors).length === 0
        ? "Your details are valid. Authentication is not connected yet."
        : "",
    );
  }

  const inputClassName =
    "mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted/70 focus:border-acqua-600 focus:ring-4 focus:ring-acqua-100";
  const errorInputClassName =
    "mt-2 w-full rounded-xl border border-red-400 bg-surface px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted/70 focus:border-red-500 focus:ring-4 focus:ring-red-100";

  return (
    <section className="rounded-2xl border border-border bg-surface/90 p-6 shadow-sm sm:p-8">
      <form noValidate onSubmit={handleSubmit}>
        <div>
          <label className="text-sm font-semibold text-acqua-800" htmlFor={`${mode}-email`}>
            Email
          </label>
          <input
            aria-describedby={errors.email ? `${mode}-email-error` : undefined}
            aria-invalid={Boolean(errors.email)}
            autoComplete="email"
            className={errors.email ? errorInputClassName : inputClassName}
            id={`${mode}-email`}
            name="email"
            onChange={() => clearFieldError("email")}
            placeholder="you@example.com"
            required
            type="email"
          />
          {errors.email ? (
            <p className="mt-2 text-sm text-red-700" id={`${mode}-email-error`}>
              {errors.email}
            </p>
          ) : null}
        </div>

        <div className="mt-5">
          <label className="text-sm font-semibold text-acqua-800" htmlFor={`${mode}-password`}>
            Password
          </label>
          <input
            aria-describedby={errors.password ? `${mode}-password-error` : undefined}
            aria-invalid={Boolean(errors.password)}
            autoComplete={isRegister ? "new-password" : "current-password"}
            className={errors.password ? errorInputClassName : inputClassName}
            id={`${mode}-password`}
            minLength={isRegister ? 8 : undefined}
            name="password"
            onChange={() => clearFieldError("password")}
            placeholder={isRegister ? "At least 8 characters" : "Enter your password"}
            required
            type="password"
          />
          {errors.password ? (
            <p className="mt-2 text-sm text-red-700" id={`${mode}-password-error`}>
              {errors.password}
            </p>
          ) : isRegister ? (
            <p className="mt-2 text-sm text-muted">Use at least 8 characters.</p>
          ) : null}
        </div>

        <button
          className="mt-7 w-full rounded-xl bg-acqua-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-acqua-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acqua-800"
          type="submit"
        >
          {isRegister ? "Create account" : "Log in"}
        </button>

        {status ? (
          <p
            className="mt-4 rounded-xl border border-acqua-300 bg-acqua-100 px-4 py-3 text-sm text-acqua-800"
            role="status"
          >
            {status}
          </p>
        ) : null}
      </form>

      <p className="mt-6 border-t border-border pt-6 text-center text-sm text-muted">
        {isRegister ? "Already have an account?" : "New to TinyNotes?"}{" "}
        <Link
          className="font-semibold text-acqua-800 underline-offset-4 hover:underline"
          href={isRegister ? "/login" : "/register"}
        >
          {isRegister ? "Log in" : "Create an account"}
        </Link>
      </p>
    </section>
  );
}
