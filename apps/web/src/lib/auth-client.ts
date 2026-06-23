import type { auth } from "@erp-system/auth";
import { env } from "@erp-system/env/web";
import {
  inferAdditionalFields,
  lastLoginMethodClient,
  magicLinkClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_SERVER_URL,
  plugins: [
    inferAdditionalFields<typeof auth>(),
    lastLoginMethodClient(),
    magicLinkClient(),
  ],
});
