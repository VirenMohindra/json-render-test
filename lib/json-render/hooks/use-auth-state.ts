import { useMemo } from "react";
import type { AuthState } from "@json-render/core";
import { useAuth } from "../state/auth-context";

export function useAuthState(): AuthState {
  const { isSignedIn, user } = useAuth();
  return useMemo(
    () => ({
      isSignedIn,
      user: user ? { ...user } : undefined,
    }),
    [isSignedIn, user],
  );
}
