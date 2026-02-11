import type { UIElement } from '@json-render/core'
import type { KeyboardTypeOptions } from 'react-native'

interface FormFieldOptions {
  key: string;
  label: string;
  placeholder: string;
  /** Path into spec state. Must use `/` prefix (e.g. `/email`, `/form/name`). */
  statePath: string;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
}

/**
 * Creates a single FormField element.
 */
export function formFieldElement(
  options: FormFieldOptions,
): Record<string, UIElement> {
  return {
    [options.key]: {
      type: 'FormField',
      props: {
        label: options.label,
        placeholder: options.placeholder,
        statePath: options.statePath,
        keyboardType: options.keyboardType ?? 'default',
        secureTextEntry: options.secureTextEntry ?? false,
      },
    },
  }
}

/**
 * Creates a form group: a column of FormField elements with a submit button.
 * The submit button triggers the specified action with optional params.
 */
export function formGroupElements(options: {
  key: string;
  fields: FormFieldOptions[];
  submitLabel: string;
  submitAction: string;
  submitParams?: Record<string, unknown>;
}): Record<string, UIElement> {
  const fieldKeys = options.fields.map((f) => f.key)
  const elements: Record<string, UIElement> = {
    [options.key]: {
      type: 'Column',
      props: { gap: 12, padding: 16 },
      children: [...fieldKeys, `${options.key}Submit`],
    },
    [`${options.key}Submit`]: {
      type: 'Button',
      props: {
        label: options.submitLabel,
        variant: 'primary',
        size: 'lg',
      },
      on: {
        press: {
          action: options.submitAction,
          params: options.submitParams ?? {},
        },
      },
    },
  }

  for (const field of options.fields) {
    Object.assign(elements, formFieldElement(field))
  }

  return elements
}
