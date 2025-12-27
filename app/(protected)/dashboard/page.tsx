"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  function handleSignOut() {
    authClient.signOut();
    router.push("/sign-in");
  }
  return (
    <div>
      Dashboard <Button onClick={handleSignOut}>Sign Out</Button>
    </div>
  );
}
