// src/auth/msalConfig.ts
import type { Configuration, LogLevel } from "@azure/msal-browser";

export const azureAd = {
  tenantId: process.env.REACT_APP_AZURE_TENANT_ID ?? "common",
  clientId: process.env.REACT_APP_AZURE_CLIENT_ID ?? "", // SPA (frontend) app registration
  authority:
    process.env.REACT_APP_AZURE_AUTHORITY ??
    `https://login.microsoftonline.com/${process.env.REACT_APP_AZURE_TENANT_ID ?? "common"}`,
  redirectUri: window.location.origin,
  cache: { cacheLocation: "localStorage" as const, storeAuthStateInCookie: false },
};

// ---- API config (build scope from API CLIENT ID ONLY) ----
const API_CLIENT_ID = process.env.REACT_APP_API_CLIENT_ID ?? ""; // GUID of API app
const API_BASE_URL  = process.env.REACT_APP_API_BASE_URL ?? "https://localhost:5000";
const API_SCOPE     = `api://${API_CLIENT_ID}/access_as_user`;

function mask(s?: string | null) {
  return s ? `${s.slice(0, 4)}…${s.slice(-6)}` : "(empty)";
}

// ---- sanity checks (only what you actually provide) ----
function assert(cond: any, msg: string): asserts cond { if (!cond) throw new Error(msg); }
assert(azureAd.clientId.length > 0, "MSAL: REACT_APP_AZURE_CLIENT_ID (SPA) is missing/empty.");
assert(/^https:\/\/login\.microsoftonline\.com\/[^/]+$/.test(azureAd.authority),
  `MSAL: authority must look like https://login.microsoftonline.com/<tenant>. Got: ${azureAd.authority}`);
assert(API_CLIENT_ID.length > 0, "MSAL: REACT_APP_API_CLIENT_ID (API) is missing/empty.");

// Final API config
export const apiConfig = {
  baseUrl: API_BASE_URL,
  scopes: [API_SCOPE],
};

// Helpful diagnostics (non-secret)
console.log("[MSAL] SPA clientId:", mask(azureAd.clientId));
console.log("[MSAL] Authority:", azureAd.authority);
console.log("[MSAL] API baseUrl:", API_BASE_URL);
console.log("[MSAL] API scope:", API_SCOPE);

// Standard MSAL config for the SPA
export const msalConfig: Configuration = {
  auth: {
    clientId: azureAd.clientId,
    authority: azureAd.authority,
    redirectUri: azureAd.redirectUri,
  },
  cache: azureAd.cache,
  system: {
    loggerOptions: {
      logLevel: (console as any).MSAL_LOG_LEVEL ?? (1 as LogLevel),
      loggerCallback: (_lvl, message) => console.log("[MSAL]", message),
    },
  },
};

// Request these + apiConfig.scopes in your loginRedirect
export const oidcBasicScopes = ["openid", "profile", "email"];
