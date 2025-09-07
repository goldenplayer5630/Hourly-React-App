// src/auth/RequireAuth.tsx
import React from "react";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";
import { oidcBasicScopes } from "./msalConfig";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuthed = useIsAuthenticated();
  const { inProgress, instance } = useMsal();

  // Prevent multiple loginRedirect calls across re-renders
  const kickedOff = React.useRef(false);

  React.useEffect(() => {
    // Only start login when MSAL is idle
    if (inProgress !== InteractionStatus.None) return;

    if (!isAuthed && !kickedOff.current) {
      kickedOff.current = true;
      instance.loginRedirect({
        // For now, only basic OIDC scopes (API scopes can be added later)
        scopes: oidcBasicScopes,
      });
    }
  }, [isAuthed, inProgress, instance]);

  // While unauthenticated or while MSAL is busy, render nothing (or a spinner)
  if (!isAuthed) return null;

  return <>{children}</>;
}
