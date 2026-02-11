import type { UIElement } from '@json-render/core'

/**
 * Creates header elements with title and optional subtitle.
 * Returns a map of elements keyed by the prefix (default: 'header').
 */
export function headerElements(options: {
  title: string;
  subtitle?: string;
  key?: string;
}): Record<string, UIElement> {
  const prefix = options.key ?? 'header'
  const children: string[] = [`${prefix}Title`]

  if (options.subtitle) {
    children.push(`${prefix}Subtitle`)
  }

  const elements: Record<string, UIElement> = {
    [prefix]: {
      type: 'Container',
      props: { padding: 16 },
      children,
    },
    [`${prefix}Title`]: {
      type: 'Heading',
      props: { text: options.title, level: 'h1' },
    },
  }

  if (options.subtitle) {
    elements[`${prefix}Subtitle`] = {
      type: 'Paragraph',
      props: { text: options.subtitle },
    }
  }

  return elements
}

/**
 * Creates header elements with a back button and title.
 * The back button triggers the goBack action.
 */
export function headerWithBackElements(options: {
  title: string;
  key?: string;
}): Record<string, UIElement> {
  const prefix = options.key ?? 'header'

  return {
    [prefix]: {
      type: 'Container',
      props: { padding: 16 },
      children: [`${prefix}BackBtn`, `${prefix}Title`],
    },
    [`${prefix}BackBtn`]: {
      type: 'Button',
      props: {
        label: '← back',
        variant: 'ghost',
        size: 'sm',
      },
      on: { press: { action: 'goBack', params: {} } },
    },
    [`${prefix}Title`]: {
      type: 'Heading',
      props: { text: options.title, level: 'h1' },
    },
  }
}
