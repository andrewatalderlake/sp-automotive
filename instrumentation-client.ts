import { initBotId } from "botid/client/core";

// Vercel BotID — invisible bot detection (no captcha). Routes listed here
// receive a per-request challenge token; the same routes verify the token
// server-side via checkBotId() before doing real work.
//
// Keep this list narrow — only POST endpoints that mutate state or send
// transactional traffic. The contact form is the highest-value target on
// the site, so both its API endpoints are protected.
initBotId({
  protect: [
    { path: "/api/contact", method: "POST" },
    { path: "/api/contact/upload", method: "POST" },
    { path: "/api/estimate", method: "POST" },
    { path: "/api/estimate/upload", method: "POST" },
  ],
});
