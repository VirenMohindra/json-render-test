import React from "react";
import type { ComponentRenderProps } from "@json-render/react-native";
import type { z } from "zod";

import { useTheme, useThemedStyles } from "./theme";
import type { Theme, NamedStyles } from "./theme";

// ---------------------------------------------------------------------------
// parseProps — validates element.props against a Zod schema, warns in dev
// ---------------------------------------------------------------------------

export function parseProps<T>(
  schema: z.ZodType<T>,
  props: Record<string, unknown>,
  componentName: string,
): T | null {
  const result = schema.safeParse(props);
  if (result.success) return result.data;
  if (__DEV__) {
    console.warn(`[${componentName}] invalid props:`, result.error.issues);
  }
  return null;
}

// ---------------------------------------------------------------------------
// defineComponent — reduces per-component boilerplate to schema + styles + JSX
// ---------------------------------------------------------------------------

type EmptyStyles = Record<string, never>;
const EMPTY_FACTORY = (() => ({})) as (theme: Theme) => EmptyStyles;

export interface ComponentCtx<P, S = EmptyStyles> {
  props: P;
  styles: S;
  theme: Theme;
  emit: ComponentRenderProps["emit"];
  children: ComponentRenderProps["children"];
  element: ComponentRenderProps["element"];
}

/**
 * Defines a spec-driven component with automatic props validation, themed
 * styles, and theme access.
 *
 * The `render` value must be a **named function** (PascalCase) so the
 * React hooks linter recognises it as a component:
 *
 * ```ts
 * const MyWidget = defineComponent({
 *   name: "MyWidget",
 *   schema: myWidgetSchema,
 *   styles: defineStyles((theme) => ({ ... })),
 *   render: function MyWidget({ props, styles, theme }) {
 *     return <View style={styles.container}>...</View>;
 *   },
 * });
 * ```
 */
export function defineComponent<
  P,
  S extends NamedStyles<S> = EmptyStyles,
>(options: {
  name: string;
  schema: z.ZodType<P>;
  styles?: (theme: Theme) => S;
  render: React.ComponentType<ComponentCtx<P, S>>;
}): React.FC<ComponentRenderProps> {
  const { name, schema, render: Render } = options;
  const factory = (options.styles ?? EMPTY_FACTORY) as (theme: Theme) => S;

  function Component({ element, emit, children }: ComponentRenderProps) {
    const parsed = parseProps(
      schema,
      element.props as Record<string, unknown>,
      name,
    );
    const styles = useThemedStyles(factory);
    const { theme } = useTheme();
    if (!parsed) return null;
    return (
      <Render
        props={parsed}
        styles={styles}
        theme={theme}
        emit={emit}
        children={children}
        element={element}
      />
    );
  }

  Component.displayName = name;
  return Component;
}
