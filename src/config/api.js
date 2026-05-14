/** Backend origin. Override with VITE_API_URL in frontend/.env (no trailing slash). */
const raw = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
export const API_BASE = String(raw).replace(/\/$/, "");
