import type { UIElement } from '@json-render/core'

/**
 * Creates a section with a SectionHeader followed by child elements.
 * Wraps everything in a Container with padding.
 */
export function sectionElements(options: {
  key: string
  title: string
  children: string[]
}): Record<string, UIElement> {
  return {
    [options.key]: {
      type: 'Container',
      props: { padding: 16 },
      children: [`${options.key}Header`, ...options.children],
    },
    [`${options.key}Header`]: {
      type: 'SectionHeader',
      props: { title: options.title },
    },
  }
}
