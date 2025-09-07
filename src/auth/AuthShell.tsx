// src/auth/AuthShell.tsx
import React from "react";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance, initMsal } from "./msalInstance";

export function AuthRoot({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      await initMsal();                // initialize + handleRedirect + setActiveAccount
      if (!cancelled) setReady(true);
    })();
    return () => { cancelled = true; };
  }, []);

  if (!ready) return <div className="p-6 text-gray-500">Starting authentication…</div>;

  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
}
