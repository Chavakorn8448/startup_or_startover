import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-f02ad0d4/health", (c) => {
  return c.json({ status: "ok" });
});

// Sign up endpoint
app.post("/make-server-f02ad0d4/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data, error } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      user_metadata: { name: name || '' },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Error creating user during signup: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ user: data.user });
  } catch (error) {
    console.log(`Unexpected error during signup: ${error}`);
    return c.json({ error: "An unexpected error occurred during signup" }, 500);
  }
});

app.post("/make-server-f02ad0d4/lecture/signed-url", async (c) => {
  try {
    const authHeader = c.req.header("Authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

    if (!token) return c.json({ error: "Missing token" }, 401);

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Validate the user
    const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token);
    if (userErr || !userData?.user) return c.json({ error: "Invalid token" }, 401);

    // Admin check (match your existing logic)
    // Example: allowlist from env "ADMIN_EMAILS" = "a@x.com,b@y.com"
    const adminEmails = (Deno.env.get("ADMIN_EMAILS") || "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    const email = (userData.user.email || "").toLowerCase();
    const isAdmin = adminEmails.includes(email);

    // Non-admins are allowed to WATCH, admins can watch too (so we don't block playback)
    // If you want "only paid users can watch", that’s a separate rule.

    const body = await c.req.json();
    const path = body?.path as string;
    if (!path) return c.json({ error: "Missing path" }, 400);

    const { data, error } = await supabaseAdmin.storage
      .from("lecture-videos")
      .createSignedUrl(path, 60); // 60 seconds

    if (error) return c.json({ error: error.message }, 400);

    return c.json({ signedUrl: data.signedUrl });
  } catch (e) {
    return c.json({ error: "Unexpected error" }, 500);
  }
});

Deno.serve(app.fetch);