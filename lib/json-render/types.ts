import type { Spec } from "@json-render/core";
import type { Theme } from "./theme";

export type ScreenType =
  | "auth"
  | "dashboard"
  | "settings"
  | "detail"
  | "playground";

interface ScreenConfig {
  edges: ("top" | "bottom" | "left" | "right")[];
  backgroundColor: string;
}

type ScreenConfigMap = Record<
  ScreenType,
  { edges: ("top" | "bottom" | "left" | "right")[] }
>;

const screenEdges: ScreenConfigMap = {
  auth: { edges: ["top", "bottom"] },
  dashboard: { edges: ["top"] },
  settings: { edges: ["top"] },
  detail: { edges: ["top"] },
  playground: { edges: ["top", "bottom"] },
};

export function getScreenConfig(type: ScreenType, theme: Theme): ScreenConfig {
  const config = screenEdges[type];
  const useSurface =
    type === "auth" || type === "detail" || type === "playground";
  return {
    ...config,
    backgroundColor: useSurface
      ? theme.colors.surface
      : theme.colors.background,
  };
}

export interface SpecScreenProps {
  spec: Spec;
  type: ScreenType;
  extraState?: Record<string, unknown>;
  /** Must be memoized by the caller to avoid re-creating ActionProvider on every render. */
  extraHandlers?: Record<
    string,
    (params: Record<string, unknown>) => Promise<unknown> | unknown
  >;
}
