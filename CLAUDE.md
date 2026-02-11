# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npx expo run:ios          # build and run on iOS simulator
npx tsc --noEmit          # type check
yarn lint                 # eslint (uses expo lint)
npx expo start            # start metro dev server (don't run this — user runs it)
```

No test framework is configured.

## Architecture

This is a **spec-driven React Native app** using `@json-render/react-native`. Every screen's UI is defined as a JSON `Spec` object — the library's `Renderer` turns specs into React Native components at runtime.

### Data flow

```
Spec (specs/*.ts)
  → SpecScreen (lib/json-render/SpecScreen.tsx)
    → StateProvider + ActionProvider + Renderer
      → customRegistry components (lib/json-render/registry.tsx)
        → themed via useTheme() / useThemedStyles()
```

### Key concepts

**Specs** (`specs/`): Each screen has a `Spec` with `root`, `state`, and `elements`. Elements reference each other by string keys. Builders (`specs/builders/`) generate common patterns (headers, sections, form groups). `createScreenSpec()` enforces a `ScrollContainer → [header?, ...body, footer?]` structure.

**SpecScreen** (`lib/json-render/SpecScreen.tsx`): The single integration point between specs and React Native. It wires up:
- `StateProvider` — manages spec state, fires `onStateChange` (used to sync `/darkMode` to the theme context)
- `ActionProvider` — merges standard actions (navigate, goBack) with custom handlers (login, logout, increment, decrement)
- `Renderer` — renders spec elements using the custom registry

**Custom registry** (`lib/json-render/registry.tsx`): Contains two categories of components:
1. **App-specific** — `FormField`, `SettingsRow`, `StatCard`, `SectionHeader`, `EmptyState`
2. **Themed library overrides** — `Heading`, `Paragraph`, `Divider`, `Card`, `ListItem`, `Button`, `TextInput`, `Switch`, `Badge`. These override the library's built-in versions to read colors from the theme context instead of hardcoded hex values.

All components follow the pattern: module-scope style factory → `useThemedStyles(factory)` for memoized `StyleSheet.create`.

**Theme** (`lib/json-render/theme/`): `AppThemeProvider` holds dark/light state. `tokens.ts` defines the `Theme` type and both `lightTheme`/`darkTheme` objects. Components access via `useTheme()` and `useThemedStyles()`.

**Auth** (`lib/json-render/state/auth-context.tsx`): Simple in-memory auth. `TabLayout` redirects to `/(auth)/login` when not signed in. Spec actions `login`/`signup`/`logout` are handled by custom action handlers in the registry.

### Routing

Expo Router file-based routing. Provider hierarchy in root layout: `AuthProvider → AppThemeProvider → NavigationThemeBridge → Stack`.

- `app/(auth)/` — login, signup (shown when not authenticated)
- `app/(tabs)/` — dashboard (index), settings, playground (shown when authenticated)
- `app/order/[id].tsx` — order detail (pushed from dashboard)
- `app/profile.tsx` — profile (pushed from settings)

### Adding a new screen

1. Create spec in `specs/` using `createScreenSpec()` and builders
2. Create route file in `app/` that renders `<SpecScreen spec={mySpec} type="..." />`
3. If new component types are needed, add to `customRegistry` in `registry.tsx`
4. If new actions are needed, add to `createCustomActionHandlers` in `registry.tsx`

## Path alias

`@/*` maps to project root (configured in `tsconfig.json`). Use `@/lib/...`, `@/specs/...`, etc.
