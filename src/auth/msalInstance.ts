// src/auth/msalInstance.ts
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./msalConfig";

export const msalInstance = new PublicClientApplication(msalConfig);

/** Call once before rendering anything that touches MSAL APIs */
export async function initMsal() {
  // Idempotent: safe to call multiple times
  await msalInstance.initialize();
  await msalInstance.handleRedirectPromise().catch(() => {});
  const active = msalInstance.getActiveAccount();
  if (!active) {
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) msalInstance.setActiveAccount(accounts[0]);
  }
}
