import { expo } from "@better-auth/expo";
import { createDb } from "@erp-system/db";
import {
  account,
  session,
  user,
  verification,
} from "@erp-system/db/schema/auth";
import { env } from "@erp-system/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError } from "better-auth/api";
import { lastLoginMethod, magicLink } from "better-auth/plugins";
import { Resend } from "resend";

const resend = new Resend(env.RESEND_API_KEY);

export function createAuth() {
  const db = createDb();

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",

      schema: {
        account,
        session,
        user,
        verification,
      },
    }),
    trustedOrigins: [
      env.APP_URL,
      env.CORS_ORIGIN,
      "erp-system://",
      ...(env.NODE_ENV === "development"
        ? [
            "exp://",
            "exp://**",
            "exp://192.168.*.*:*/**",
            "http://localhost:8081",
          ]
        : []),
    ],
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        prompt: "select_account",
      },
    },
    emailVerification: {
      sendOnSignUp: true,
      sendOnSignIn: true,
      autoSignInAfterVerification: true,
      sendVerificationEmail: ({ user: verificationUser, url }) =>
        resend.emails
          .send({
            from: env.EMAIL_FROM,
            to: verificationUser.email,
            subject: "Verify your email address",
            text: `Click the link to verify your email address: ${url}`,
          })
          .then(() => undefined),
    },
    emailAndPassword: {
      enabled: true,
      disableSignUp: true,
      requireEmailVerification: true,
    },
    user: {
      additionalFields: {
        phoneNumber: {
          type: "string",
          required: false,
        },
        age: {
          type: "number",
          required: false,
          input: false,
        },
        gender: {
          type: "string",
          required: false,
          input: false,
        },
        onboardingCompleted: {
          type: "boolean",
          required: false,
          defaultValue: false,
          input: false,
        },
        lastLoginMethod: {
          type: "string",
          required: false,
          input: false,
        },
      },
    },
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    advanced: {
      defaultCookieAttributes: {
        sameSite: "none",
        secure: true,
        httpOnly: true,
      },
    },
    plugins: [
      expo(),
      lastLoginMethod({
        storeInDatabase: true,
        schema: {
          user: {
            lastLoginMethod: "last_login_method",
          },
        },
      }),
      magicLink({
        sendMagicLink: async ({ email, url }, ctx) => {
          const existingUser = ctx
            ? await ctx.context.internalAdapter
                .findUserByEmail(email)
                .then((result) => result?.user)
            : null;

          if (existingUser) {
            throw new APIError("BAD_REQUEST", {
              message: "An account already exists. Sign in with your password.",
            });
          }

          await resend.emails.send({
            from: env.EMAIL_FROM,
            to: email,
            subject: "Sign up for ERP System",
            text: `Click the link to continue creating your account: ${url}`,
          });
        },
      }),
    ],
  });
}

export const auth = createAuth();
