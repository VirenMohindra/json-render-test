import type {
  ComponentRegistry,
  ComponentRenderProps,
} from "@json-render/react-native";
import { useStateBinding } from "@json-render/react-native";
import { getByPath } from "@json-render/core";
import { z } from "zod";
import type { MutableRefObject } from "react";
import { useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Switch,
  ActivityIndicator,
  type KeyboardTypeOptions,
} from "react-native";

import { defineStyles, useTheme } from "./theme";
import { defineComponent } from "./define-component";

// ---------- Style factories ----------

const formStyles = defineStyles((theme) => ({
  field: {
    marginBottom: theme.spacing.xs,
  },
  label: {
    fontSize: theme.typography.body,
    fontWeight: "600",
    marginBottom: theme.spacing.xs,
    color: theme.colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: theme.spacing.md,
    fontSize: theme.typography.bodyLarge,
    backgroundColor: theme.colors.surfaceSecondary,
    color: theme.colors.text,
  },
}));

const settingsStyles = defineStyles((theme) => ({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.md,
  },
  left: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  right: {} as Record<string, never>,
  label: {
    fontSize: theme.typography.bodyLarge,
    fontWeight: "500",
    color: theme.colors.text,
  },
  description: {
    fontSize: theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  chevron: {
    fontSize: 22,
    color: theme.colors.textTertiary,
  },
  trailingText: {
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
  },
}));

const statStyles = defineStyles((theme) => ({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.md,
    padding: theme.spacing.md,
    shadowColor: theme.colors.shadow,
    shadowOpacity: theme.isDark ? 0.3 : 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  label: {
    fontSize: theme.typography.caption,
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  value: {
    fontSize: theme.typography.display,
    fontWeight: "700",
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
  },
  trend: {
    fontSize: theme.typography.caption,
    marginTop: theme.spacing.xs,
  },
}));

const sectionStyles = defineStyles((theme) => ({
  header: {
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.caption,
    fontWeight: "600",
    textTransform: "uppercase",
    color: theme.colors.textSecondary,
    letterSpacing: 0.5,
  },
}));

const emptyStyles = defineStyles((theme) => ({
  container: {
    alignItems: "center",
    padding: theme.spacing.xxl,
  },
  title: {
    fontSize: theme.typography.title,
    fontWeight: "600",
    color: theme.colors.text,
  },
  message: {
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: theme.spacing.sm,
  },
  actionLabel: {
    fontSize: theme.typography.body,
    color: theme.colors.accent,
    fontWeight: "600",
    marginTop: theme.spacing.lg,
  },
}));

const headingStyles = defineStyles((theme) => ({
  text: {
    fontWeight: "700",
    color: theme.colors.text,
  },
}));

const paragraphStyles = defineStyles((theme) => ({
  text: {
    color: theme.colors.textSecondary,
  },
}));

const cardStyles = defineStyles((theme) => ({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.md,
  },
  elevated: {
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme.isDark ? 0.3 : 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: theme.typography.title,
    fontWeight: "600",
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
}));

const listItemStyles = defineStyles((theme) => ({
  content: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  leading: {
    fontSize: theme.typography.bodyLarge,
    color: theme.colors.textSecondary,
    marginRight: theme.spacing.md,
    width: theme.spacing.xl,
    textAlign: "center",
  },
  body: {
    flex: 1,
  },
  title: {
    fontSize: theme.typography.bodyLarge,
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  trailing: {
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
  },
  chevron: {
    fontSize: theme.typography.bodyLarge,
    color: theme.colors.textTertiary,
    marginLeft: theme.spacing.sm,
  },
}));

const buttonStyles = defineStyles(() => ({
  container: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    alignSelf: "flex-start",
  },
  label: {
    fontWeight: "600",
  },
}));

const BUTTON_SIZE_MAP = {
  sm: { paddingH: 12, paddingV: 6, fontSize: 13 },
  md: { paddingH: 16, paddingV: 10, fontSize: 15 },
  lg: { paddingH: 24, paddingV: 14, fontSize: 17 },
};

const themedInputStyles = defineStyles((theme) => ({
  label: {
    fontSize: theme.typography.body,
    fontWeight: "500",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    fontSize: theme.typography.bodyLarge,
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
  },
}));

const themedSwitchStyles = defineStyles((theme) => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  label: {
    fontSize: theme.typography.bodyLarge,
    color: theme.colors.text,
  },
}));

const badgeStyles = defineStyles((theme) => ({
  container: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: 9999,
    alignSelf: "flex-start",
  },
  label: {
    fontSize: theme.typography.caption,
    fontWeight: "600",
  },
}));

// ---------- Props schemas ----------

const formFieldSchema = z.object({
  statePath: z.string(),
  label: z.string().optional(),
  placeholder: z.string().optional(),
  keyboardType: z.string().optional(),
  secureTextEntry: z.boolean().optional(),
});

const settingsRowSchema = z.object({
  label: z.string(),
  trailingType: z.enum(["chevron", "switch", "badge", "text"]),
  description: z.string().optional(),
  statePath: z.string().optional(),
  trailingText: z.string().optional(),
});

const statCardSchema = z.object({
  label: z.string(),
  value: z.string(),
  trend: z.enum(["up", "down", "neutral"]).optional(),
  trendValue: z.string().optional(),
  color: z.string().optional(),
});

const sectionHeaderSchema = z.object({
  title: z.string(),
  action: z.string().optional(),
  actionLabel: z.string().optional(),
});

const emptyStateSchema = z.object({
  title: z.string(),
  message: z.string().optional(),
  actionLabel: z.string().optional(),
});

const headingSchema = z.object({
  text: z.coerce.string(),
  level: z.enum(["h1", "h2", "h3", "h4"]).optional(),
  color: z.string().optional(),
  align: z.enum(["left", "center", "right"]).optional(),
});

const paragraphSchema = z.object({
  text: z.string(),
  fontSize: z.number().optional(),
  numberOfLines: z.number().optional(),
  color: z.string().optional(),
  align: z.enum(["left", "center", "right"]).optional(),
});

const dividerSchema = z.object({
  direction: z.enum(["vertical", "horizontal"]).optional(),
  thickness: z.number().optional(),
  color: z.string().optional(),
  margin: z.number().optional(),
});

const cardSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  padding: z.number().optional(),
  backgroundColor: z.string().optional(),
  borderRadius: z.number().optional(),
  elevated: z.boolean().optional(),
});

const listItemSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  leading: z.string().optional(),
  trailing: z.string().optional(),
  showChevron: z.boolean().optional(),
});

const buttonSchema = z.object({
  label: z.string(),
  variant: z
    .enum(["primary", "secondary", "danger", "outline", "ghost"])
    .optional(),
  size: z.enum(["sm", "md", "lg"]).optional(),
  disabled: z.boolean().optional(),
  loading: z.boolean().optional(),
});

const textInputSchema = z.object({
  label: z.string().optional(),
  placeholder: z.string().optional(),
  statePath: z.string().optional(),
  flex: z.number().optional(),
  secureTextEntry: z.boolean().optional(),
  keyboardType: z.string().optional(),
  multiline: z.boolean().optional(),
  numberOfLines: z.number().optional(),
});

const switchSchema = z.object({
  value: z.boolean().optional(),
  statePath: z.string().optional(),
  label: z.string().optional(),
  disabled: z.boolean().optional(),
});

const badgeSchema = z.object({
  label: z.string(),
  variant: z
    .enum(["default", "info", "success", "warning", "error"])
    .optional(),
});

// ---------- App-specific components ----------

const FormField = defineComponent({
  name: "FormField",
  schema: formFieldSchema,
  styles: formStyles,
  render: function FormField({ props, styles, theme }) {
    const [value, setValue] = useStateBinding<string>(props.statePath);
    return (
      <View style={styles.field}>
        {props.label ? <Text style={styles.label}>{props.label}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder={props.placeholder}
          placeholderTextColor={theme.colors.textTertiary}
          value={value ?? ""}
          onChangeText={setValue}
          keyboardType={
            (props.keyboardType as KeyboardTypeOptions) ?? "default"
          }
          secureTextEntry={props.secureTextEntry ?? false}
          autoCapitalize="none"
          accessibilityLabel={props.label ?? props.placeholder}
        />
      </View>
    );
  },
});

function SettingsSwitchTrailing({
  statePath,
  label,
}: {
  statePath: string;
  label: string;
}) {
  const [value, setValue] = useStateBinding<boolean>(statePath);
  return (
    <Switch
      value={value ?? false}
      onValueChange={setValue}
      accessibilityLabel={label}
    />
  );
}

const SettingsRow = defineComponent({
  name: "SettingsRow",
  schema: settingsRowSchema,
  styles: settingsStyles,
  render: function SettingsRow({ props, styles, emit }) {
    const content = (
      <View style={styles.row}>
        <View style={styles.left}>
          <Text style={styles.label}>{props.label}</Text>
          {props.description ? (
            <Text style={styles.description}>{props.description}</Text>
          ) : null}
        </View>
        <View style={styles.right}>
          {props.trailingType === "switch" && props.statePath ? (
            <SettingsSwitchTrailing
              statePath={props.statePath}
              label={props.label}
            />
          ) : null}
          {props.trailingType === "chevron" ? (
            <Text
              style={styles.chevron}
              importantForAccessibility="no"
              accessibilityElementsHidden
            >
              {"›"}
            </Text>
          ) : null}
          {props.trailingType === "text" && props.trailingText ? (
            <Text style={styles.trailingText}>{props.trailingText}</Text>
          ) : null}
        </View>
      </View>
    );

    if (props.trailingType === "chevron" && emit) {
      return (
        <Pressable
          onPress={() => emit("press")}
          accessibilityRole="button"
          accessibilityLabel={props.label}
        >
          {content}
        </Pressable>
      );
    }

    return content;
  },
});

const StatCard = defineComponent({
  name: "StatCard",
  schema: statCardSchema,
  styles: statStyles,
  render: function StatCard({ props, styles, theme }) {
    const trendColor =
      props.trend === "up"
        ? theme.colors.success
        : props.trend === "down"
          ? theme.colors.error
          : theme.colors.textSecondary;
    const trendArrow =
      props.trend === "up" ? "↑" : props.trend === "down" ? "↓" : "";

    return (
      <View style={[styles.card, { flex: 1 }]}>
        <Text style={styles.label}>{props.label}</Text>
        <Text
          style={[styles.value, props.color ? { color: props.color } : null]}
        >
          {props.value}
        </Text>
        {props.trendValue ? (
          <Text style={[styles.trend, { color: trendColor }]}>
            {trendArrow} {props.trendValue}
          </Text>
        ) : null}
      </View>
    );
  },
});

const SectionHeader = defineComponent({
  name: "SectionHeader",
  schema: sectionHeaderSchema,
  styles: sectionStyles,
  render: function SectionHeader({ props, styles }) {
    return (
      <View style={styles.header}>
        <Text style={styles.title}>{props.title}</Text>
      </View>
    );
  },
});

const EmptyState = defineComponent({
  name: "EmptyState",
  schema: emptyStateSchema,
  styles: emptyStyles,
  render: function EmptyState({ props, styles, emit }) {
    if (__DEV__ && props.actionLabel && !emit) {
      console.warn(
        "EmptyState: actionLabel provided but no event handler bound",
      );
    }

    return (
      <View style={styles.container}>
        <Text style={styles.title}>{props.title}</Text>
        {props.message ? (
          <Text style={styles.message}>{props.message}</Text>
        ) : null}
        {props.actionLabel && emit ? (
          <Pressable onPress={() => emit("action")} accessibilityRole="button">
            <Text style={styles.actionLabel}>{props.actionLabel}</Text>
          </Pressable>
        ) : null}
      </View>
    );
  },
});

// ---------- Themed library component overrides ----------

const ThemedHeading = defineComponent({
  name: "Heading",
  schema: headingSchema,
  styles: headingStyles,
  render: function Heading({ props, styles }) {
    const sizes = { h1: 32, h2: 24, h3: 20, h4: 16 };
    return (
      <Text
        style={[
          styles.text,
          {
            fontSize: sizes[props.level ?? "h2"],
            textAlign: props.align ?? "left",
          },
          props.color ? { color: props.color } : null,
        ]}
      >
        {props.text}
      </Text>
    );
  },
});

const ThemedParagraph = defineComponent({
  name: "Paragraph",
  schema: paragraphSchema,
  styles: paragraphStyles,
  render: function Paragraph({ props, styles, theme }) {
    const fontSize = props.fontSize ?? theme.typography.bodyLarge;
    return (
      <Text
        numberOfLines={props.numberOfLines}
        style={[
          styles.text,
          {
            fontSize,
            lineHeight: fontSize * 1.5,
            textAlign: props.align ?? "left",
          },
          props.color ? { color: props.color } : null,
        ]}
      >
        {props.text}
      </Text>
    );
  },
});

const ThemedDivider = defineComponent({
  name: "Divider",
  schema: dividerSchema,
  render: function Divider({ props, theme }) {
    const isVertical = props.direction === "vertical";
    const thickness = props.thickness ?? 1;
    const margin = props.margin ?? 8;

    return (
      <View
        style={{
          width: isVertical ? thickness : "100%",
          height: isVertical ? "100%" : thickness,
          backgroundColor: props.color ?? theme.colors.border,
          marginVertical: isVertical ? 0 : margin,
          marginHorizontal: isVertical ? margin : 0,
        }}
      />
    );
  },
});

const ThemedCard = defineComponent({
  name: "Card",
  schema: cardSchema,
  styles: cardStyles,
  render: function Card({ props, styles, children }) {
    const elevated = props.elevated !== false;
    return (
      <View
        style={[
          styles.container,
          { padding: props.padding ?? 16 },
          props.borderRadius != null
            ? { borderRadius: props.borderRadius }
            : null,
          props.backgroundColor
            ? { backgroundColor: props.backgroundColor }
            : null,
          elevated ? styles.elevated : null,
        ]}
      >
        {props.title ? (
          <Text
            style={[
              styles.title,
              { marginBottom: props.subtitle ? 2 : 12 },
            ]}
          >
            {props.title}
          </Text>
        ) : null}
        {props.subtitle ? (
          <Text style={styles.subtitle}>{props.subtitle}</Text>
        ) : null}
        {children}
      </View>
    );
  },
});

const ThemedListItem = defineComponent({
  name: "ListItem",
  schema: listItemSchema,
  styles: listItemStyles,
  render: function ListItem({ props, styles, theme, emit, element }) {
    const hasPress = !!element.on?.press;

    const content = (
      <View style={styles.content}>
        {props.leading ? (
          <Text style={styles.leading}>{props.leading}</Text>
        ) : null}
        <View style={styles.body}>
          <Text style={styles.title}>{props.title}</Text>
          {props.subtitle ? (
            <Text style={styles.subtitle}>{props.subtitle}</Text>
          ) : null}
        </View>
        {props.trailing ? (
          <Text style={styles.trailing}>{props.trailing}</Text>
        ) : null}
        {props.showChevron ? (
          <Text
            style={styles.chevron}
            importantForAccessibility="no"
            accessibilityElementsHidden
          >
            {">"}
          </Text>
        ) : null}
      </View>
    );

    if (hasPress && emit) {
      return (
        <Pressable
          onPress={() => emit("press")}
          accessibilityRole="button"
          accessibilityLabel={props.title}
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
            backgroundColor: pressed
              ? theme.colors.surfaceSecondary
              : "transparent",
          })}
        >
          {content}
        </Pressable>
      );
    }

    return content;
  },
});

const ThemedButton = defineComponent({
  name: "Button",
  schema: buttonSchema,
  styles: buttonStyles,
  render: function Button({ props, styles, theme, emit }) {
    const variant = props.variant ?? "primary";
    const size = props.size ?? "md";

    const variantMap = useMemo(
      () => ({
        primary: {
          bg: theme.colors.accent,
          text: "#ffffff",
          border: undefined as string | undefined,
        },
        secondary: {
          bg: theme.colors.textSecondary,
          text: "#ffffff",
          border: undefined as string | undefined,
        },
        danger: {
          bg: theme.colors.error,
          text: "#ffffff",
          border: undefined as string | undefined,
        },
        outline: {
          bg: "transparent",
          text: theme.colors.accent,
          border: theme.colors.accent,
        },
        ghost: {
          bg: "transparent",
          text: theme.colors.text,
          border: undefined as string | undefined,
        },
      }),
      [theme],
    );

    const v = variantMap[variant];
    const s = BUTTON_SIZE_MAP[size];

    return (
      <Pressable
        disabled={props.disabled || props.loading}
        onPress={() => emit?.("press")}
        accessibilityRole="button"
        accessibilityLabel={props.label}
        accessibilityState={{ disabled: !!(props.disabled || props.loading) }}
        style={({ pressed }) => [
          styles.container,
          {
            backgroundColor: v.bg,
            paddingHorizontal: s.paddingH,
            paddingVertical: s.paddingV,
            opacity: props.disabled ? 0.5 : pressed ? 0.8 : 1,
            borderWidth: v.border ? 1 : 0,
            borderColor: v.border,
          },
        ]}
      >
        {props.loading ? (
          <ActivityIndicator
            size="small"
            color={v.text}
            style={{ marginRight: 8 }}
          />
        ) : null}
        <Text style={[styles.label, { color: v.text, fontSize: s.fontSize }]}>
          {props.label}
        </Text>
      </Pressable>
    );
  },
});

const ThemedTextInput = defineComponent({
  name: "TextInput",
  schema: textInputSchema,
  styles: themedInputStyles,
  render: function ThemedTextInput({ props, styles, theme }) {
    const [value, setValue] = useStateBinding<string>(props.statePath ?? "");
    return (
      <View style={props.flex != null ? { flex: props.flex } : undefined}>
        {props.label ? <Text style={styles.label}>{props.label}</Text> : null}
        <TextInput
          placeholder={props.placeholder}
          placeholderTextColor={theme.colors.textTertiary}
          value={value ?? ""}
          onChangeText={props.statePath ? setValue : undefined}
          secureTextEntry={props.secureTextEntry ?? false}
          keyboardType={
            (props.keyboardType as KeyboardTypeOptions) ?? "default"
          }
          accessibilityLabel={props.label ?? props.placeholder}
          multiline={props.multiline ?? false}
          numberOfLines={props.numberOfLines}
          style={[
            styles.input,
            props.multiline
              ? {
                  minHeight: (props.numberOfLines ?? 3) * 20,
                  textAlignVertical: "top",
                }
              : null,
          ]}
        />
      </View>
    );
  },
});

const ThemedSwitch = defineComponent({
  name: "Switch",
  schema: switchSchema,
  styles: themedSwitchStyles,
  render: function ThemedSwitch({ props, styles }) {
    const [value, setValue] = useStateBinding<boolean>(props.statePath ?? "");
    return (
      <View style={styles.container}>
        <Switch
          value={value ?? props.value ?? false}
          onValueChange={props.statePath ? setValue : undefined}
          disabled={props.disabled ?? false}
          accessibilityLabel={props.label}
        />
        {props.label ? <Text style={styles.label}>{props.label}</Text> : null}
      </View>
    );
  },
});

const ThemedBadge = defineComponent({
  name: "Badge",
  schema: badgeSchema,
  styles: badgeStyles,
  render: function Badge({ props, styles, theme }) {
    const variant = props.variant ?? "default";
    const variantMap = useMemo(
      () => ({
        default: {
          bg: theme.colors.surfaceSecondary,
          text: theme.colors.textSecondary,
        },
        info: { bg: theme.colors.accent, text: "#ffffff" },
        success: { bg: theme.colors.success, text: "#ffffff" },
        warning: { bg: theme.colors.warning, text: "#1a1a1a" },
        error: { bg: theme.colors.error, text: "#ffffff" },
      }),
      [theme],
    );

    const v = variantMap[variant];

    return (
      <View style={[styles.container, { backgroundColor: v.bg }]}>
        <Text style={[styles.label, { color: v.text }]}>{props.label}</Text>
      </View>
    );
  },
});

// ---------- Registry export ----------

export const customRegistry: ComponentRegistry = {
  FormField,
  SettingsRow,
  StatCard,
  SectionHeader,
  EmptyState,
  Heading: ThemedHeading,
  Paragraph: ThemedParagraph,
  Divider: ThemedDivider,
  Card: ThemedCard,
  ListItem: ThemedListItem,
  Button: ThemedButton,
  TextInput: ThemedTextInput,
  Switch: ThemedSwitch,
  Badge: ThemedBadge,
};

// ---------- Custom action handlers ----------

export interface ActionHandlerOptions {
  signIn: (user: { name: string; email: string }) => void;
  signOut: () => void;
  storeRef: MutableRefObject<{
    state: Record<string, unknown>;
    set: (path: string, value: unknown) => void;
  }>;
}

const loginSchema = z.object({ email: z.string().min(1) });
const signupSchema = z.object({
  name: z.string().optional().default(""),
  email: z.string().min(1),
});
const counterSchema = z.object({
  path: z.string().min(1),
  step: z.number().optional().default(1),
});

export function createCustomActionHandlers(options: ActionHandlerOptions) {
  return {
    login: async (params: Record<string, unknown>) => {
      const result = loginSchema.safeParse(params);
      if (!result.success) return;
      const { email } = result.data;
      options.signIn({ name: email.split("@")[0], email });
    },
    signup: async (params: Record<string, unknown>) => {
      const result = signupSchema.safeParse(params);
      if (!result.success) return;
      const { name, email } = result.data;
      options.signIn({ name: name || email.split("@")[0], email });
    },
    logout: async () => {
      options.signOut();
    },
    increment: (params: Record<string, unknown>) => {
      const result = counterSchema.safeParse(params);
      if (!result.success) return;
      const { state, set } = options.storeRef.current;
      const { path, step } = result.data;
      const current = (getByPath(state, path) as number) ?? 0;
      set(path, current + step);
    },
    decrement: (params: Record<string, unknown>) => {
      const result = counterSchema.safeParse(params);
      if (!result.success) return;
      const { state, set } = options.storeRef.current;
      const { path, step } = result.data;
      const current = (getByPath(state, path) as number) ?? 0;
      set(path, current - step);
    },
  };
}
