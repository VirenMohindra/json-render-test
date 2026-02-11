# Adding Components

Components in this repo are spec-driven: a JSON `Spec` describes the UI, and the `Renderer` turns it into React Native views using a **registry** of component implementations.

There are two categories:

- **Atoms** — single-purpose primitives (Button, TextInput, Badge, Heading, Divider)
- **Molecules** — composed from atoms or with state bindings (FormField, SettingsRow, StatCard)

Both follow the same steps.

## Quick start

```bash
# scaffold a new component interactively
node scripts/generate-component.mjs
```

Or do it manually:

## Step-by-step

### 1. Define the props schema

In `lib/json-render/registry.tsx`, add a Zod schema. This gives you runtime validation in dev and typed props for free.

```ts
const avatarSchema = z.object({
  name: z.string(),
  imageUrl: z.string().optional(),
  size: z.enum(["sm", "md", "lg"]).optional(),
});
```

### 2. Define styles

Use `defineStyles` — it constrains TypeScript's type inference so you never need `as const` on string values like `fontWeight` or `flexDirection`.

```ts
const avatarStyles = defineStyles((theme) => ({
  container: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    backgroundColor: theme.colors.accent,
  },
  initials: {
    fontWeight: "600",
    color: "#ffffff",
  },
}));
```

Use theme tokens (`theme.spacing.*`, `theme.typography.*`, `theme.colors.*`) over hardcoded values. See `lib/json-render/theme/tokens.ts` for available tokens.

### 3. Define the component

Use `defineComponent` — it handles props validation, themed styles, and theme injection automatically. Your render function only needs to return JSX.

```ts
const Avatar = defineComponent({
  name: "Avatar",
  schema: avatarSchema,
  styles: avatarStyles,
  render: function Avatar({ props, styles, theme }) {
    const sizes = { sm: 32, md: 48, lg: 64 };
    const s = sizes[props.size ?? "md"];
    const initials = props.name.slice(0, 2).toUpperCase();

    return (
      <View style={[styles.container, { width: s, height: s }]}>
        <Text
          style={[styles.initials, { fontSize: s * 0.4 }]}
          accessibilityLabel={props.name}
        >
          {initials}
        </Text>
      </View>
    );
  },
});
```

The render function receives:

| Field      | Description                                      |
|------------|--------------------------------------------------|
| `props`    | Validated and typed from your Zod schema          |
| `styles`   | Memoized `StyleSheet` from your style factory     |
| `theme`    | Current theme object (colors, spacing, typography)|
| `emit`     | Event emitter for `on.press`, `on.action`, etc.   |
| `children` | React children (for container components)         |
| `element`  | Raw spec element (for checking `element.on`, etc.)|

The render function **is a React component** — you can call hooks (`useState`, `useStateBinding`, `useMemo`, etc.) inside it. Name it with PascalCase so the hooks linter is happy.

### 4. Register it

Add to the `customRegistry` object at the bottom of `registry.tsx`:

```ts
export const customRegistry: ComponentRegistry = {
  // ... existing components
  Avatar,
};
```

### 5. Use it in a spec

```ts
const mySpec: Spec = {
  root: "screen",
  state: {},
  elements: {
    screen: {
      type: "ScrollContainer",
      children: ["userAvatar"],
    },
    userAvatar: {
      type: "Avatar",
      props: {
        name: "Jane Doe",
        size: "lg",
      },
    },
  },
};
```

## Worked example: UserCard molecule

A molecule that composes Avatar + text, binds to state, and handles a press event.

### Schema + styles

```ts
const userCardSchema = z.object({
  nameStatePath: z.string(),
  subtitle: z.string().optional(),
});

const userCardStyles = defineStyles((theme) => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.md,
  },
  info: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  name: {
    fontSize: theme.typography.bodyLarge,
    fontWeight: "600",
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
}));
```

### Component

```ts
const UserCard = defineComponent({
  name: "UserCard",
  schema: userCardSchema,
  styles: userCardStyles,
  render: function UserCard({ props, styles, emit }) {
    // hooks work — this is a real React component
    const [name] = useStateBinding<string>(props.nameStatePath);

    const content = (
      <View style={styles.container}>
        <View style={styles.info}>
          <Text style={styles.name}>{name ?? "Unknown"}</Text>
          {props.subtitle ? (
            <Text style={styles.subtitle}>{props.subtitle}</Text>
          ) : null}
        </View>
      </View>
    );

    if (emit) {
      return (
        <Pressable onPress={() => emit("press")} accessibilityRole="button">
          {content}
        </Pressable>
      );
    }

    return content;
  },
});
```

### Spec usage

```ts
userCard: {
  type: "UserCard",
  props: {
    nameStatePath: "/currentUser/name",
    subtitle: "Tap to view profile",
  },
  on: {
    press: { action: "navigate", params: { to: "/profile" } },
  },
},
```

## Checklist

- [ ] Zod schema defined for all props
- [ ] Styles use `defineStyles` (no `as const` needed)
- [ ] Component uses `defineComponent`
- [ ] Theme tokens used over hardcoded values
- [ ] State paths use `/` prefix convention (e.g. `/email`, `/form/name`)
- [ ] Accessibility labels on interactive elements
- [ ] Registered in `customRegistry`
- [ ] `npx tsc --noEmit` passes
- [ ] `yarn lint` passes
