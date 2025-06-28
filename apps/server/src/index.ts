import "dotenv/config";
import { auth } from "./lib/auth";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

const app = new Hono();

app.use(logger());
app.use("/*", cors({
  origin: process.env.CORS_ORIGIN || "",
  allowMethods: ["GET", "POST", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));


// Auth routes ต้องอยู่ก่อน wildcard route
app.on(["POST", "GET"], "/api/auth/**", async (c) => {
  try {
    return await auth.handler(c.req.raw);
  } catch (error) {
    console.error('🚨 Auth handler error:', error);
    const message = (error instanceof Error) ? error.message : String(error);
    return c.json({ error: 'Authentication error', details: message }, 500);
  }
});


export default app;

// Start server on port from .env or fallback to 4235
if (import.meta.main) {
  const port = process.env.PORT ? Number(process.env.PORT) : 4235;
  Bun.serve({
    fetch: app.fetch,
    port,
  });
  console.log(`Server running on http://localhost:${port}`);
}
