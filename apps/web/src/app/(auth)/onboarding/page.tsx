import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import OnboardingForm from "./onboarding-form";

/**
 * Renders the onboarding page for authenticated users who haven't completed onboarding.
 *
 * Redirects unauthenticated users to the home page and users who have already completed onboarding to the dashboard.
 *
 * @returns The onboarding form component.
 */
export default async function OnboardingPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
      throw: true,
    },
  });

  if (!session?.user) {
    redirect("/");
  }

  if (session.user.onboardingCompleted) {
    redirect("/dashboard");
  }

  return <OnboardingForm user={session.user} />;
}
