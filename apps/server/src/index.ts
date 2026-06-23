import { cors } from "@elysiajs/cors";
import { auth } from "@erp-system/auth";
import { createDb } from "@erp-system/db";
import { account, user } from "@erp-system/db/schema/auth";
import { env } from "@erp-system/env/server";
import { and, eq, ne } from "drizzle-orm";
import { Elysia } from "elysia";
import { z } from "zod";

const db = createDb();

const onboardingSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  phoneNumber: z.string().trim().min(1),
  age: z.number().int().min(16, "Must be at least 16"),
  gender: z.enum(["male", "female", "other"]),
  image: z.url(),
  password: z.string().min(8).optional(),
});

/**
 * Determines if the user must set a password during onboarding.
 *
 * @param userId - The ID of the user
 * @returns An object with `requiresPassword: true` if the user lacks both a Google account and an existing credential password, `false` otherwise.
 */
async function getOnboardingRequirements(userId: string) {
  const accounts = await db
    .select({ providerId: account.providerId, password: account.password })
    .from(account)
    .where(eq(account.userId, userId));

  const hasGoogleAccount = accounts.some(
    (userAccount) => userAccount.providerId === "google"
  );
  const hasPasswordAccount = accounts.some(
    (userAccount) =>
      userAccount.providerId === "credential" && !!userAccount.password
  );

  return {
    requiresPassword: !(hasGoogleAccount || hasPasswordAccount),
  };
}

new Elysia()
  .use(
    cors({
      origin: env.CORS_ORIGIN,
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    })
  )
  .get("/api/onboarding", async ({ request, status }) => {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return status(401, { error: "Unauthorized" });
    }

    return getOnboardingRequirements(session.user.id);
  })
  .post("/api/onboarding", async ({ request, status }) => {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return status(401, { error: "Unauthorized" });
    }

    const parsed = onboardingSchema.safeParse(await request.json());

    if (!parsed.success) {
      return status(400, { error: "Invalid onboarding details" });
    }

    const requirements = await getOnboardingRequirements(session.user.id);

    if (requirements.requiresPassword && !parsed.data.password) {
      return status(400, { error: "Password is required" });
    }

    const fullName = `${parsed.data.firstName} ${parsed.data.lastName}`.trim();

    const [existingPhoneUser] = await db
      .select({ id: user.id })
      .from(user)
      .where(
        and(
          eq(user.phoneNumber, parsed.data.phoneNumber),
          ne(user.id, session.user.id)
        )
      )
      .limit(1);

    if (existingPhoneUser) {
      return status(409, {
        error: "This phone number is already connected to another account.",
      });
    }

    if (requirements.requiresPassword) {
      await auth.api.setPassword({
        body: {
          newPassword: parsed.data.password as string,
        },
        headers: request.headers,
      });
    }

    await db
      .update(user)
      .set({
        phoneNumber: parsed.data.phoneNumber,
        age: parsed.data.age,
        gender: parsed.data.gender,
        image: parsed.data.image,
        name: fullName,
        onboardingCompleted: true,
      })
      .where(eq(user.id, session.user.id));

    return { ok: true };
  })
  .all("/api/auth/*", (context) => {
    const { request, status } = context;
    if (["POST", "GET"].includes(request.method)) {
      return auth.handler(request);
    }
    return status(405);
  })
  .get("/", () => "OK")
  .listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
  });
