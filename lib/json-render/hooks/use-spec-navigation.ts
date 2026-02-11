import { useRouter, type Href } from "expo-router";
import { useCallback } from "react";

export function useSpecNavigation() {
  const router = useRouter();

  const navigate = useCallback(
    (screen: string, params?: Record<string, unknown>) => {
      // Spec-driven routes are dynamic strings that can't be statically typed,
      // so we cast to Href which is the proper type for router.push.
      if (params) {
        router.push({ pathname: screen, params } as Href);
      } else {
        router.push(screen as Href);
      }
    },
    [router],
  );

  const goBack = useCallback(() => {
    router.back();
  }, [router]);

  return { navigate, goBack };
}
