import React, { Component, useCallback, useMemo, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ActionProvider,
  createStandardActionHandlers,
  Renderer,
  StateProvider,
  useStateStore,
  ValidationProvider,
  VisibilityProvider,
} from "@json-render/react-native";
import type { Spec } from "@json-render/core";

import { useSpecNavigation } from "./hooks/use-spec-navigation";
import { useAuthState } from "./hooks/use-auth-state";
import { useAuth } from "./state/auth-context";
import { useTheme } from "./theme";
import { customRegistry, createCustomActionHandlers } from "./registry";
import { getScreenConfig, type SpecScreenProps } from "./types";

export function SpecScreen({
  spec,
  type,
  extraState,
  extraHandlers,
}: SpecScreenProps) {
  const { theme, setDark } = useTheme();
  const config = getScreenConfig(type, theme);
  const authState = useAuthState();

  const initialState = useMemo(
    () => ({ ...spec.state, ...extraState }),
    [spec.state, extraState],
  );

  const onStateChange = useCallback(
    (path: string, value: unknown) => {
      if (path === "/darkMode") {
        setDark(value as boolean);
      }
    },
    [setDark],
  );

  return (
    <SafeAreaView
      edges={config.edges}
      style={[styles.container, { backgroundColor: config.backgroundColor }]}
    >
      <StateProvider
        initialState={initialState}
        authState={authState}
        onStateChange={onStateChange}
      >
        <SpecErrorBoundary>
          <SpecRenderer spec={spec} extraHandlers={extraHandlers} />
        </SpecErrorBoundary>
      </StateProvider>
    </SafeAreaView>
  );
}

function SpecRenderer({
  spec,
  extraHandlers,
}: {
  spec: Spec;
  extraHandlers?: SpecScreenProps["extraHandlers"];
}) {
  const store = useStateStore();
  const storeRef = useRef(store);
  storeRef.current = store;

  const { navigate, goBack } = useSpecNavigation();
  const { signIn, signOut } = useAuth();

  const extraRef = useRef(extraHandlers);
  if (extraHandlers !== extraRef.current) {
    const prev = extraRef.current;
    const keys = extraHandlers ? Object.keys(extraHandlers) : [];
    const prevKeys = prev ? Object.keys(prev) : [];
    if (
      keys.length !== prevKeys.length ||
      keys.some((k) => extraHandlers![k] !== prev![k])
    ) {
      extraRef.current = extraHandlers;
    }
  }
  const stableExtra = extraRef.current;

  const handlers = useMemo(
    () => ({
      ...createStandardActionHandlers({ navigate, goBack }),
      ...createCustomActionHandlers({ signIn, signOut, storeRef }),
      ...stableExtra,
    }),
    [navigate, goBack, signIn, signOut, stableExtra],
  );

  return (
    <VisibilityProvider>
      <ActionProvider handlers={handlers} navigate={navigate}>
        <ValidationProvider>
          <Renderer spec={spec} registry={customRegistry} />
        </ValidationProvider>
      </ActionProvider>
    </VisibilityProvider>
  );
}

class SpecErrorBoundary extends Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorMessage}>{this.state.error.message}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
});
