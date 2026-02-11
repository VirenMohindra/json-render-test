# json-render-test

Demo app showcasing [`@json-render/react-native`](https://www.npmjs.com/package/@json-render/react-native) — a library for building React Native UIs from JSON specs.

## What it does

The entire UI is driven by declarative JSON specs (`specs/` directory). The app includes:

- **Auth flow** — login/signup screens
- **Dashboard** — stat cards, activity list with navigation
- **Order detail** — dynamic content from route params
- **Playground** — counter, todo list, text input, badges, switches
- **Settings** — dark mode toggle, notification preferences
- **Profile** — user info display

All screens use a shared `SpecScreen` component that wires up state, actions, navigation, and theming from a single spec object.

## Dark mode

Toggle via Settings > Dark Mode. All library components (`Heading`, `Paragraph`, `Card`, `Button`, `ListItem`, `Badge`, `TextInput`, `Switch`, `Divider`) are overridden in a custom registry (`lib/json-render/registry.tsx`) to read colors from the theme context instead of using hardcoded values.

## Getting started

```bash
npm install
npx expo run:ios
```

## Project structure

```
specs/              # JSON-like UI specs (one per screen)
specs/builders/     # helpers for headers, sections, form groups
lib/json-render/    # app integration layer
  registry.tsx      # custom + themed component overrides
  SpecScreen.tsx    # connects specs to state, actions, nav, theme
  theme/            # light/dark tokens, context, useThemedStyles
  state/            # auth context
  hooks/            # navigation, auth state bindings
app/                # expo-router file-based routing
  (auth)/           # login, signup
  (tabs)/           # dashboard, settings, playground
  order/[id].tsx    # dynamic order detail
  profile.tsx       # profile screen
```

## Built with

- [Expo](https://expo.dev) (SDK 54)
- [expo-router](https://docs.expo.dev/router/introduction/) (file-based routing)
- [@json-render/core](https://www.npmjs.com/package/@json-render/core) + [@json-render/react-native](https://www.npmjs.com/package/@json-render/react-native)
- React Native 0.81
