"use client";

import { cn } from "@/lib/utils";
import { heading } from "@/components/providers/font-provider";
import Link from "next/link";
import SignInForm from "@/modules/auth/client/sign-in-form";
import AppHeader from "@/components/app-header";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();
  useEffect(() => {
    authClient.getSession().then((session) => {
      if (session.data != null) return router.push("/dashboard");
    });
  }, [router]);
  return (
    <div className="flex flex-col items-center justify-between w-full h-full py-4">
      <AppHeader />
      <div className="flex flex-col items-center justify-center gap-8 w-full">
        <div className="flex flex-col items-center text-center gap-2">
          <h1
            className={cn(
              heading.className,
              "text-4xl md:text-5xl tracking-tight font-medium capitalize",
            )}
          >
            Welcome Back
          </h1>
          <span className="tracking-wide text-muted-foreground font-thin text-sm md:text-base">
            Enter your credentials to access your account.
          </span>
        </div>
        <SignInForm />
      </div>
      <div className="flex items-center justify-center gap-2">
        <span>Don&apos;t have an account?</span>
        <Link
          href="/sign-up"
          className="text-primary underline underline-offset-4 hover:underline-offset-8 duration-200 transition-all"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
