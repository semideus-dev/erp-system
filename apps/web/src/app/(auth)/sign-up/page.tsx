import { headers } from "next/headers";
import { redirect } from "next/navigation";

import SignUpForm from "@/components/sign-up-form";
import { authClient } from "@/lib/auth-client";

/**
 * Displays the sign-up form to unauthenticated users, or redirects authenticated users based on their onboarding status.
 *
 * Users with completed onboarding are redirected to the dashboard. Users without completed onboarding
 * are redirected to the onboarding page.
 */
export default async function SignUpPage() {
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

  return <SignUpForm />;
}
