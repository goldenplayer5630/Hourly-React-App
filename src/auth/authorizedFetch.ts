// src/auth/authorizedFetch.ts
import { msalInstance } from "./msalInstance";
import { apiConfig } from "./msalConfig";

async function getToken() {
  const account = msalInstance.getActiveAccount() ?? msalInstance.getAllAccounts()[0];
  if (!account) throw new Error("Not authenticated");

  const res = await msalInstance.acquireTokenSilent({
    account,
    scopes: apiConfig.scopes,
  });
  return res.accessToken;
}

export async function authorizedFetch(input: RequestInfo | URL, init?: RequestInit) {
  const token = await getToken();
  const headers = new Headers(init?.headers ?? {});
  headers.set("Authorization", `Bearer ${token}`);
  return fetch(input, { ...init, headers });
}
