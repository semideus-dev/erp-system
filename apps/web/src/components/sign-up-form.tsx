"use client";

import { env } from "@erp-system/env/web";
import { Button, buttonVariants } from "@erp-system/ui/components/button";
import { Input } from "@erp-system/ui/components/input";
import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { SiGoogle } from "react-icons/si";

import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";

import Loader from "./loader";

/**
 * Renders an account creation form with Google OAuth and email magic-link authentication.
 */
export default function SignUpForm() {
  const { isPending } = authClient.useSession();
  const lastMethod = authClient.getLastUsedLoginMethod();

  const signInWithGoogle = async () => {
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: `${env.NEXT_PUBLIC_APP_URL}/onboarding`,
    });

    if (error) {
      toast.error(error.message || "Unable to continue with Google");
    }
  };

  const form = useForm({
    defaultValues: {
      email: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.magicLink(
        {
          name: value.email,
          email: value.email,
          callbackURL: `${env.NEXT_PUBLIC_APP_URL}/onboarding`,
          newUserCallbackURL: `${env.NEXT_PUBLIC_APP_URL}/onboarding`,
        },
        {
          onSuccess: () => {
            toast.success("Magic link sent. Check your inbox.");
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        }
      );
    },
    validators: {
      onSubmit: z.object({
        email: z.email("Invalid email address"),
      }),
    },
  });

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="mx-auto mt-10 w-full max-w-md p-6">
      <div className="my-6 flex w-full flex-col items-center gap-2">
        <h1 className="text-center font-bold text-3xl">Create Account</h1>
        <p className="text-center font-medium text-muted-foreground text-sm leading-snug">
          Stay connected with everything happening on campus.{" "}
        </p>
      </div>

      <Button
        className="w-full"
        onClick={signInWithGoogle}
        type="button"
        variant="outline"
      >
        <SiGoogle className="mr-2" />
        Continue with Google
        {lastMethod === "google" ? (
          <span className="ml-2 text-muted-foreground text-xs">Last used</span>
        ) : null}
      </Button>

      <div className="my-6 flex items-center gap-3 text-muted-foreground text-xs">
        <div className="h-px flex-1 bg-border" />
        Or
        <div className="h-px flex-1 bg-border" />
      </div>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div>
          <form.Field name="email">
            {(field) => (
              <div className="space-y-2">
                <Input
                  autoComplete="email"
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Email Address"
                  type="email"
                  value={field.state.value}
                />
                {field.state.meta.errors.map((error) => (
                  <p className="text-red-500" key={error?.message}>
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <form.Subscribe
          selector={(state) => ({
            canSubmit: state.canSubmit,
            isSubmitting: state.isSubmitting,
          })}
        >
          {({ canSubmit, isSubmitting }) => (
            <Button
              className="w-full"
              disabled={!canSubmit || isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Sending..." : "Verify Email"}
              {lastMethod === "email" ? (
                <span className="ml-2 text-primary-foreground/75 text-xs">
                  Last used
                </span>
              ) : null}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <div className="mt-4 text-center">
        <Link
          className={buttonVariants({
            variant: "link",
            className: "text-indigo-600 hover:text-indigo-800",
          })}
          href="/"
        >
          Already have an account? Sign In
        </Link>
      </div>
    </div>
  );
}
