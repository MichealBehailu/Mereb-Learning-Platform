import { auth } from "../../../../lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import {
  type ArcjetDecision,
  type BotOptions,
  type EmailOptions,
  type ProtectSignupOptions,
  type SlidingWindowRateLimitOptions,
  detectBot,
  protectSignup,
  shield,
  slidingWindow,
} from "@arcjet/next";
import arcjet from "@/lib/arcjet";
import ip from "@arcjet/ip";
import { NextRequest, NextResponse } from "next/server";

//* EMAIL OPTION
const emailOptions = {
  mode: "LIVE",
  deny: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
} satisfies EmailOptions;

//* BOT OPTION
const botOptions = {
  mode: "LIVE",
  allow: [],
} satisfies BotOptions;

//* RESTRICTIVE RATE LIMIT SETTINGS
const restrictiveRateLimitSettings = {
  mode: "LIVE",
  max: 5,
  interval: "2m",
} satisfies SlidingWindowRateLimitOptions<["userId"]>;

//* SIGN UP OPTIONS
const signupOptions = {
  email: emailOptions,
  bots: botOptions,
  rateLimit: restrictiveRateLimitSettings,
} satisfies ProtectSignupOptions<["userId"]>;

//* ROUTES THAT NEED PROTECTION (only POST-based sensitive actions)
const PROTECTED_POST_ROUTES = [
  "/api/auth/sign-up",
  "/api/auth/sign-in",
  "/api/auth/forget-password",
  "/api/auth/reset-password",
];

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_POST_ROUTES.some((route) => pathname.startsWith(route));
}

//* PROTECT FUNCTION
async function protect(req: NextRequest): Promise<ArcjetDecision | null> {
  const pathname = req.nextUrl.pathname;

  // Only protect sensitive POST routes, skip everything else
  if (!isProtectedRoute(pathname)) {
    return null;
  }

  const session = await auth.api.getSession({
    headers: req.headers,
  });

  let userId: string;
  if (session?.user.id) {
    userId = session.user.id;
  } else {
    userId = ip(req) || "127.0.0.1";
  }

  if (pathname.startsWith("/api/auth/sign-up")) {
    const body = await req.clone().json();

    if (typeof body.email === "string") {
      return arcjet
        .withRule(protectSignup(signupOptions))
        .protect(req, { email: body.email, fingerprint: userId });
    } else {
      return arcjet
        .withRule(detectBot(botOptions))
        .withRule(slidingWindow(restrictiveRateLimitSettings))
        .protect(req, { fingerprint: userId });
    }
  } else {
    return arcjet
      .withRule(detectBot(botOptions))
      .withRule(slidingWindow(restrictiveRateLimitSettings))
      .protect(req, { fingerprint: userId });
  }
}

//* GET BETTER AUTH HANDLERS
const authHandlers = toNextJsHandler(auth.handler);

//* GET HANDLER - No Arcjet protection needed for GET routes
export const { GET } = authHandlers;

//* WRAPPED POST HANDLER
export async function POST(req: NextRequest) {
  const decision = await protect(req);
  console.log("Arcjet Decision:", decision);

  if (decision?.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return new Response(null, { status: 429 });
    } else if (decision.reason.isEmail()) {
      let message: string;

      if (decision.reason.emailTypes.includes("INVALID")) {
        message = "Email address format is invalid. Check if there's a typo";
      } else if (decision.reason.emailTypes.includes("DISPOSABLE")) {
        message = "We do not allow disposable email addresses.";
      } else if (decision.reason.emailTypes.includes("NO_MX_RECORDS")) {
        message =
          "Your email domain does not have an MX record. Check if there's a typo";
      } else {
        message = "Invalid email.";
      }

      return Response.json({ message }, { status: 400 });
    } else {
      return Response.json(null, { status: 403 });
    }
  }

  return authHandlers.POST(req);
}