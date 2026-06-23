import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import Dashboard from "./dashboard";

/**
 * Server-rendered page that validates user authentication and onboarding status, then displays the dashboard.
 *
 * Redirects to the home page for unauthenticated users and to the onboarding page for users whose onboarding is incomplete. Displays a personalized dashboard for authenticated, onboarded users.
 */
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
