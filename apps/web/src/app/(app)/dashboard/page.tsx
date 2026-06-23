import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import Dashboard from "./dashboard";

export default async function DashboardPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
      throw: true,
    },
  });

  if (!session?.user) {
    redirect("/");
  }

  if (!session.user.onboardingCompleted) {
    redirect("/onboarding");
  }

  const displayName = session.user.name || session.user.email;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome {displayName}</p>
      <Dashboard />
    </div>
  );
}
