import type { Spec, UIElement } from '@json-render/core'

interface ScreenSpecOptions {
  /** Elements for the header section */
  header?: Record<string, UIElement>
  /** Key of the root header element */
  headerKey?: string
  /** Elements for the body section */
  body: Record<string, UIElement>
  /** Ordered keys of top-level body children (placed after header, before footer) */
  bodyChildren: string[]
  /** Elements for the footer section */
  footer?: Record<string, UIElement>
  /** Key of the root footer element */
  footerKey?: string
  /** Initial state model */
  state?: Record<string, unknown>
}

/**
 * Creates a screen spec with enforced root → [header?, ...body, footer?] structure.
 * All screens use ScrollContainer as the root element.
 */
export function createScreenSpec(options: ScreenSpecOptions): Spec {
  const { header, body, footer, state, bodyChildren, headerKey, footerKey } =
    options

  const rootChildren: string[] = []
  const elements: Record<string, UIElement> = {}

  if (header && headerKey) {
    rootChildren.push(headerKey)
    Object.assign(elements, header)
  }

  rootChildren.push(...bodyChildren)
  Object.assign(elements, body)

  if (footer && footerKey) {
    rootChildren.push(footerKey)
    Object.assign(elements, footer)
  }

  elements.root = {
    type: 'ScrollContainer',
    props: {},
    children: rootChildren,
  }

  return {
    root: 'root',
    state,
    elements,
  }
}
