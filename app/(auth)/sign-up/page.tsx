"use client";
import { cn } from "@/lib/utils";
import { heading } from "@/components/providers/font-provider";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useEffect } from "react";
import Link from "next/link";
import AppHeader from "@/components/app-header";
import SignUpForm from "@/modules/auth/client/sign-up-form";

export default function SignUpPage() {
  const router = useRouter();
  useEffect(() => {
    authClient.getSession().then((session) => {
      if (session.data != null) router.push("/dashboard");
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
            Create Account
          </h1>
          <span className="tracking-wide text-muted-foreground font-thin text-sm md:text-base">
            Enter the information to create your account.
          </span>
        </div>
        <SignUpForm />
      </div>
      <div className="flex items-center justify-center gap-2">
        <span>Already have an account?</span>
        <Link
          href="/sign-in"
          className="text-primary underline underline-offset-4 hover:underline-offset-8 duration-200 transition-all"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
