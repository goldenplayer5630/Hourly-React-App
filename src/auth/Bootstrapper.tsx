// src/auth/Bootstrapper.tsx
import React from "react";
import { useIsAuthenticated } from "@azure/msal-react";
import { bootstrapMe } from "../services/UserService";

export default function Bootstrapper() {
  const authed = useIsAuthenticated();
  const ran = React.useRef(false);

  React.useEffect(() => {
    if (!authed || ran.current) return;
    ran.current = true;
    bootstrapMe().catch((e) => {
      console.error("Bootstrap failed:", e);
      ran.current = false; // optional: allow retry on next mount
    });
  }, [authed]);

  return null;
}
