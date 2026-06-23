import { headers } from "next/headers";
import { redirect } from "next/navigation";

import SignInForm from "@/components/sign-in-form";
import { authClient } from "@/lib/auth-client";

/**
 * Renders the sign-in page, routing authenticated users based on their onboarding status.
 *
 * Redirects users to `/dashboard` if onboarding is completed, or to `/onboarding` if
 * authenticated but not onboarded. Otherwise displays the sign-in form.
 */
export default async function Home() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
      throw: true,
    },
  });

  if (session?.user?.onboardingCompleted) {
    redirect("/dashboard");
  }

  if (session?.user) {
    redirect("/onboarding");
  }

  return <SignInForm />;
}
