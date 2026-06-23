import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import OnboardingForm from "./onboarding-form";

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
