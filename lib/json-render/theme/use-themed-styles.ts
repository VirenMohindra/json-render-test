import { useMemo } from 'react'
import { StyleSheet } from 'react-native'
import type { ImageStyle, TextStyle, ViewStyle } from 'react-native'
import { useTheme } from './theme-context'
import type { Theme } from './tokens'

export type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle }

/**
 * Constrains a style factory so TypeScript narrows string literals
 * (e.g. `fontWeight: "600"`) without needing `as const` on every value.
 */
export function defineStyles<T extends NamedStyles<T>>(
  factory: (theme: Theme) => T,
): (theme: Theme) => T {
  return factory
}

export function useThemedStyles<T extends NamedStyles<T>>(
  factory: (theme: Theme) => T,
): T {
  const { theme } = useTheme()
  return useMemo(() => StyleSheet.create(factory(theme)), [factory, theme])
}
