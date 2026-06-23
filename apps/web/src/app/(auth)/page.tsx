import { headers } from "next/headers";
import { redirect } from "next/navigation";

import SignInForm from "@/components/sign-in-form";
import { authClient } from "@/lib/auth-client";

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
