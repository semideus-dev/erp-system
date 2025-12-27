import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

import { findIp } from "@arcjet/ip";
import arcjet, {
  BotOptions,
  detectBot,
  EmailOptions,
  protectSignup,
  shield,
  slidingWindow,
  SlidingWindowRateLimitOptions,
} from "@arcjet/next";

import env from "@/lib/env";

if (!env.arcjetApiKey) {
  throw new Error("ARCJET_API_KEY not found");
}

const aj = arcjet({
  key: env.arcjetApiKey,
  characteristics: ["userIdOrIp"],
  rules: [shield({ mode: "LIVE" })],
});

const botProtection = {
  mode: "LIVE",
  allow: [],
} satisfies BotOptions;
const emailProtection = {
  mode: "LIVE",
  block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
} satisfies EmailOptions;
const strictRateLimit = {
  mode: "LIVE",
  max: 10,
  interval: "10m",
} satisfies SlidingWindowRateLimitOptions<[]>;
const laxRateLimit = {
  mode: "LIVE",
  max: 60,
  interval: "1m",
} satisfies SlidingWindowRateLimitOptions<[]>;

const authHandlers = toNextJsHandler(auth);
export const { GET } = authHandlers;

async function checkProtection(req: Request) {
  const body = (await req.json()) as unknown;
  const session = await auth.api.getSession({ headers: req.headers });
  const userIdOrIp = (session?.user.id ?? findIp(req)) || "127.0.0.1";

  if (req.url.endsWith("/sign-up")) {
    if (
      body &&
      typeof body === "object" &&
      "email" in body &&
      typeof body.email === "string"
    ) {
      return aj
        .withRule(
          protectSignup({
            email: emailProtection,
            bots: botProtection,
            rateLimit: strictRateLimit,
          }),
        )
        .protect(req, { email: body.email, userIdOrIp });
    } else {
      return aj
        .withRule(detectBot(botProtection))
        .withRule(slidingWindow(strictRateLimit))
        .protect(req, { userIdOrIp });
    }
  }

  return aj
    .withRule(detectBot(botProtection))
    .withRule(slidingWindow(laxRateLimit))
    .protect(req, { userIdOrIp });
}

export async function POST(req: Request) {
  const cloneReq = req.clone()
  const decision = await checkProtection(req);

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return new Response("Rate limit exceeded", { status: 429 });
    } else if (decision.reason.isEmail()) {
      let message: string;

      if (decision.reason.emailTypes.includes("INVALID")) {
        message = "Please provide a valid email address.";
      } else if (decision.reason.emailTypes.includes("DISPOSABLE")) {
        message = "Disposable email addresses are not allowed.";
      } else if (decision.reason.emailTypes.includes("NO_MX_RECORDS")) {
        message = "Email domain is not supported.";
      } else {
        message = "Email address is invalid.";
      }
      return Response.json({ message }, { status: 400 });
    } else {
      return new Response(null, { status: 403 });
    }
  }
  return authHandlers.POST(cloneReq);
}
