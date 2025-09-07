// src/hooks/useMe.ts
import { useEffect, useState } from "react";
import { getMe } from "../services/UserService";

export interface UserMe {
  id: string;
  externalOid: string;
  email: string | null;
  name: string | null;
  isActive: boolean;
}

export function useMe() {
  const [me, setMe] = useState<UserMe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getMe();
        if (mounted) {
          setMe(data);
          setError(null);
        }
      } catch (err: any) {
        if (mounted) setError(err.message ?? "Failed to load user");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return { me, loading, error };
}
